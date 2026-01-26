"use client";

import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import Link from "next/link";

interface PlanInfo {
  plan: string;
  planName: string;
  price: number;
  currency: string;
  monthlyLimit: number | null;
  isUnlimited: boolean;
  currentUsage: number;
  remainingUses: string | number;
  renewalDate: Date | null;
  subscription: any;
}

export default function ProfilePage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [planInfo, setPlanInfo] = useState<PlanInfo | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/");
    }
  }, [status, router]);

  useEffect(() => {
    const fetchPlanInfo = async () => {
      try {
        const response = await fetch("/api/user-plan");
        if (response.ok) {
          const data = await response.json();
          setPlanInfo(data);
        }
      } catch (error) {
        console.error("Error fetching plan info:", error);
      } finally {
        setLoading(false);
      }
    };

    if (session?.user) {
      fetchPlanInfo();
    }
  }, [session]);

  if (status === "loading" || loading) {
    return <div className="container mx-auto px-4 py-8">Loading...</div>;
  }

  if (!session?.user) {
    return null;
  }

  if (!planInfo) {
    return <div className="container mx-auto px-4 py-8">Loading plan information...</div>;
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-2xl mx-auto space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>Profile</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center space-x-4">
              {session.user.image && (
                <img
                  src={session.user.image}
                  alt={session.user.name || "User"}
                  className="w-16 h-16 rounded-full"
                />
              )}
              <div>
                <h2 className="text-2xl font-bold">{session.user.name}</h2>
                <p className="text-muted-foreground">{session.user.email}</p>
              </div>
            </div>

            <div className="flex items-center space-x-2">
              <span className="font-medium">Current Plan:</span>
              <Badge variant={planInfo.plan === "Pro" ? "default" : "secondary"}>
                {planInfo.planName}
              </Badge>
              <span className="text-sm text-muted-foreground">
                {planInfo.price > 0 ? `₹${planInfo.price}/month` : 'Free'}
              </span>
            </div>

            <div className="flex items-center space-x-2">
              <span className="font-medium">Monthly Usage Limit:</span>
              <span>{planInfo.isUnlimited ? 'Unlimited' : planInfo.monthlyLimit}</span>
            </div>

            <div className="flex items-center space-x-2">
              <span className="font-medium">Current Usage:</span>
              <span>
                {planInfo.currentUsage} / {planInfo.isUnlimited ? 'Unlimited' : planInfo.monthlyLimit}
              </span>
            </div>

            {planInfo.renewalDate && (
              <div className="flex items-center space-x-2">
                <span className="font-medium">Renews:</span>
                <span>{new Date(planInfo.renewalDate).toLocaleDateString()}</span>
              </div>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Subscription</CardTitle>
          </CardHeader>
          <CardContent>
            {planInfo.subscription ? (
              <div className="space-y-2">
                <p><strong>Status:</strong> {planInfo.subscription.status}</p>
                {planInfo.subscription.currentPeriodEnd && (
                  <p><strong>Current Period End:</strong> {new Date(planInfo.subscription.currentPeriodEnd).toLocaleDateString()}</p>
                )}
              </div>
            ) : (
              <p>No active subscription</p>
            )}
          </CardContent>
        </Card>

        <div className="flex space-x-4">
          {planInfo.plan === 'Free' ? (
            <Button asChild>
              <Link href="/pricing">Upgrade Plan</Link>
            </Button>
          ) : (
            <Button asChild>
              <Link href="/billing">Manage Billing</Link>
            </Button>
          )}
          <Button variant="outline" asChild>
            <Link href="/">Back to App</Link>
          </Button>
        </div>
      </div>
    </div>
  );
}