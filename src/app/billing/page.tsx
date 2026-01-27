"use client";

import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import Link from "next/link";
import { Crown, Star, Zap } from "lucide-react";
import React from "react";

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

interface PlanData {
  name: string;
  price: number;
  currency: string;
  monthlyLimit: number | null;
  isUnlimited: boolean;
}

export default function BillingPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [planInfo, setPlanInfo] = useState<PlanInfo | null>(null);
  const [plans, setPlans] = useState<Record<string, PlanData>>({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/");
    }
  }, [status, router]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [planResponse, pricingResponse] = await Promise.all([
          fetch("/api/user-plan"),
          fetch("/api/admin/plan-pricing")
        ]);

        if (planResponse.ok) {
          const planData = await planResponse.json();
          setPlanInfo(planData);
        }

        if (pricingResponse.ok) {
          const pricingData = await pricingResponse.json();
          setPlans(pricingData);
        }
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setLoading(false);
      }
    };

    if (session?.user) {
      fetchData();
    }
  }, [session]);

  const handleUpgrade = async (targetPlan: string) => {
    try {
      const couponCode = prompt('Enter coupon code (optional):', '') || '';

      const response = await fetch('/api/create-razorpay-order', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ targetPlan, couponCode }),
      });

      if (response.ok) {
        const data = await response.json();
        if (data.success) {
          // Free upgrade success
          alert(data.message || `Successfully upgraded to ${targetPlan}!`);
          window.location.reload();
        } else if (data.orderId) {
          // Initialize Razorpay checkout
          const options = {
            key: data.key,
            amount: data.amount,
            currency: data.currency,
            order_id: data.orderId,
            name: "Fluenzy AI",
            description: `${targetPlan} Plan Upgrade`,
            handler: async function (response: any) {
              // Verify payment on backend
              const verifyRes = await fetch("/api/verify-razorpay-payment", {
                method: "POST",
                headers: {
                  "Content-Type": "application/json",
                },
                body: JSON.stringify({
                  razorpay_payment_id: response.razorpay_payment_id,
                  razorpay_order_id: response.razorpay_order_id,
                  razorpay_signature: response.razorpay_signature,
                  order_id: data.orderId,
                  plan: targetPlan,
                }),
              });

              if (verifyRes.ok) {
                alert(`Payment successful! You have been upgraded to ${targetPlan}.`);
                window.location.reload();
              } else {
                alert("Payment verification failed. Please contact support.");
              }
            },
            prefill: {
              email: "", // Will be filled from session
              contact: "",
            },
            theme: {
              color: "#7c3aed",
            },
          };

          const rzp = new (window as any).Razorpay(options);
          rzp.open();
        } else {
          alert("Unexpected response");
        }
      } else {
        const errorData = await response.json().catch(() => ({}));
        console.error('Failed to create order:', errorData);
        alert(errorData.error || "Failed to create order");
      }
    } catch (error) {
      console.error('Upgrade error:', error);
      alert("An error occurred. Please try again.");
    }
  };

  const getUpgradeOptions = () => {
    if (!planInfo) return [];

    const currentPlan = planInfo.plan;

    if (currentPlan === 'Standard') {
      return []; // No upgrades available
    }

    if (currentPlan === 'Free') {
      return ['Standard', 'Pro'];
    }

    if (currentPlan === 'Pro') {
      return ['Standard'];
    }

    return [];
  };

  const getPlanIcon = (planName: string) => {
    switch (planName) {
      case 'Free': return Star;
      case 'Standard': return Crown;
      case 'Pro': return Zap;
      default: return Star;
    }
  };

  if (status === "loading" || loading) {
    return <div className="container mx-auto px-4 py-8">Loading...</div>;
  }

  if (!session?.user || !planInfo) {
    return null;
  }

  const upgradeOptions = getUpgradeOptions();

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-4xl mx-auto space-y-6">
        <h1 className="text-3xl font-bold">Manage Subscription</h1>

        {/* Current Plan */}
        <Card className="border-green-500/50 bg-green-500/5">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-full bg-green-500/20 flex items-center justify-center">
                {React.createElement(getPlanIcon(planInfo.plan), { size: 16, className: "text-green-400" })}
              </div>
              Current Plan - {planInfo.planName}
              <Badge className="bg-green-500/20 text-green-400 border-green-500/30">Active</Badge>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-muted-foreground">Monthly Price</p>
                <p className="text-2xl font-bold">
                  {planInfo.price > 0 ? `₹${planInfo.price}` : 'Free'}
                </p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Monthly Limit</p>
                <p className="text-2xl font-bold">
                  {planInfo.isUnlimited ? 'Unlimited' : planInfo.monthlyLimit}
                </p>
              </div>
            </div>

            <div>
              <p className="text-sm text-muted-foreground">Current Usage</p>
              <p className="text-lg font-semibold">
                {planInfo.currentUsage} / {planInfo.isUnlimited ? 'Unlimited' : planInfo.monthlyLimit}
              </p>
            </div>

            {planInfo.renewalDate && (
              <div>
                <p className="text-sm text-muted-foreground">Next Billing Date</p>
                <p className="text-lg font-semibold">
                  {new Date(planInfo.renewalDate).toLocaleDateString()}
                </p>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Upgrade Options */}
        {upgradeOptions.length > 0 ? (
          <div className="space-y-4">
            <h2 className="text-xl font-semibold">Available Upgrades</h2>
            <div className="grid gap-4">
              {upgradeOptions.map((planName) => {
                const planData = plans[planName];
                const Icon = getPlanIcon(planName);
                return (
                  <Card key={planName} className="border-purple-500/30 bg-purple-500/5">
                    <CardContent className="p-6">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-4">
                          <div className="w-12 h-12 rounded-full bg-purple-500/20 flex items-center justify-center">
                            <Icon size={24} className="text-purple-400" />
                          </div>
                          <div>
                            <h3 className="text-lg font-semibold">{planName}</h3>
                            <p className="text-sm text-muted-foreground">
                              ₹{planData?.price || 0}/month • {
                                planName === 'Standard' ? 'Unlimited' :
                                planName === 'Pro' ? '100' : '3'
                              } sessions
                            </p>
                          </div>
                        </div>
                        <Button
                          onClick={() => handleUpgrade(planName)}
                          className="bg-purple-600 hover:bg-purple-700"
                        >
                          Upgrade to {planName}
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          </div>
        ) : (
          <Card className="border-amber-500/30 bg-amber-500/5">
            <CardContent className="p-6 text-center">
              <Crown className="w-12 h-12 text-amber-400 mx-auto mb-4" />
              <h3 className="text-lg font-semibold mb-2">You're on the Highest Plan!</h3>
              <p className="text-muted-foreground">
                You have access to unlimited training sessions. No further upgrades available.
              </p>
            </CardContent>
          </Card>
        )}

        {/* Back to App */}
        <div className="flex justify-center">
          <Button variant="outline" asChild>
            <Link href="/">Back to App</Link>
          </Button>
        </div>
      </div>
    </div>
  );
}