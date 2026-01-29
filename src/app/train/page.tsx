"use client";

import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import LearningPath from "../../../Learn_English/components/LearningPath";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import Link from "next/link";
import { Crown, Star, Zap, ChevronRight, Sparkles } from "lucide-react";
import { motion } from "framer-motion";

interface PlanInfo {
  plan: string;
  planName: string;
  price: number;
  isUnlimited: boolean;
}

const TrainPage = () => {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [planInfo, setPlanInfo] = useState<PlanInfo | null>(null);

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
      }
    };

    if (session?.user) {
      fetchPlanInfo();
    }
  }, [session]);

  const getCTAInfo = () => {
    if (!planInfo) return null;

    const currentPlan = planInfo.plan;

    if (currentPlan === 'Free') {
      return {
        text: "Upgrade Plan",
        href: "/billing",
        icon: Star,
        description: "Unlock unlimited training sessions"
      };
    }

    if (currentPlan === 'Pro') {
      return {
        text: "Upgrade to Standard",
        href: "/billing",
        icon: Crown,
        description: "Get unlimited access for ₹150/month"
      };
    }

    if (currentPlan === 'Standard') {
      return {
        text: "Manage Subscription",
        href: "/billing",
        icon: Crown,
        description: "You're on the highest plan!"
      };
    }

    return null;
  };

  if (status === "loading") {
    return <div>Loading...</div>;
  }

  if (!session?.user) {
    return null;
  }

  const ctaInfo = getCTAInfo();

  return (
    <div className="max-w-[1600px] mx-auto px-4 md:px-8 lg:px-12 py-8 md:py-12 space-y-16">
      {/* Main Content: Training Modules */}
      <div className="relative">
        <div className="absolute -top-24 -left-24 w-96 h-96 bg-purple-600/10 rounded-full blur-[120px] pointer-events-none opacity-50" />
        <div className="relative">
          <LearningPath />
        </div>
      </div>

      {/* Footer-style: Upgrade CTA */}
      {ctaInfo && (
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="relative"
        >
          <div className="relative p-[1px] rounded-[3rem] bg-gradient-to-r from-white/10 via-purple-500/10 to-transparent overflow-hidden shadow-2xl">
            <div className="absolute inset-0 bg-gradient-to-r from-purple-600/10 via-blue-600/10 to-transparent blur-3xl" />
            
            <Card className="relative border-0 bg-slate-900/40 backdrop-blur-3xl rounded-[3rem] overflow-hidden">
              <CardContent className="p-8 md:p-12">
                <div className="flex flex-col lg:flex-row items-center justify-between gap-10">
                  <div className="flex flex-col md:flex-row items-center gap-8 text-center md:text-left flex-1">
                    <div className="w-24 h-24 rounded-3xl bg-gradient-to-br from-purple-500 to-blue-600 flex items-center justify-center shadow-2xl shadow-purple-500/30 shrink-0">
                      <ctaInfo.icon size={48} className="text-white" />
                    </div>
                    
                    <div className="space-y-4">
                      <div>
                        <div className="flex items-center justify-center md:justify-start gap-2 mb-2">
                          <span className="text-[10px] font-black uppercase tracking-[0.3em] text-purple-400">Premium Exclusive</span>
                          <Sparkles size={14} className="text-purple-400" />
                        </div>
                        <h3 className="text-3xl md:text-5xl font-black text-white tracking-tighter leading-none">{ctaInfo.text}</h3>
                      </div>
                      <p className="text-slate-400 text-lg font-medium max-w-xl leading-relaxed">{ctaInfo.description}</p>
                      
                      <div className="flex flex-wrap items-center justify-center md:justify-start gap-6 pt-2">
                        <div className="flex items-center gap-3 text-sm text-slate-500 font-bold tracking-tight">
                          <div className="w-6 h-6 rounded-full bg-emerald-500/10 flex items-center justify-center">
                            <Zap size={12} className="text-emerald-500" />
                          </div>
                          <span>Unlimited AI Training</span>
                        </div>
                        <div className="flex items-center gap-3 text-sm text-slate-500 font-bold tracking-tight">
                          <div className="w-6 h-6 rounded-full bg-emerald-500/10 flex items-center justify-center">
                            <Zap size={12} className="text-emerald-500" />
                          </div>
                          <span>Advanced Analytics</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="shrink-0 w-full lg:w-auto">
                    <Button asChild size="lg" className="w-full lg:w-72 h-20 rounded-[1.5rem] bg-white text-black hover:bg-slate-200 transition-all hover:scale-[1.02] active:scale-95 group shadow-2xl shadow-white/10">
                      <Link href={ctaInfo.href} className="flex items-center justify-center gap-3">
                        <span className="font-black uppercase tracking-widest text-sm">{ctaInfo.text}</span>
                        <ChevronRight size={22} className="group-hover:translate-x-1 transition-transform" />
                      </Link>
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </motion.div>
      )}
    </div>
  );
};

export default TrainPage;