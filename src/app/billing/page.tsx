"use client";

import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import Link from "next/link";
import { Crown, Star, Zap, Clock, MessageSquare, ShieldCheck, ArrowRight, History } from "lucide-react";
import React from "react";
import { motion, AnimatePresence } from "framer-motion";

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
  const [couponCode, setCouponCode] = useState<{ [key: string]: string }>({});
  const [appliedCoupon, setAppliedCoupon] = useState<{ [key: string]: any }>({});
  const [couponError, setCouponError] = useState<{ [key: string]: string }>({});
  const [couponLoading, setCouponLoading] = useState<{ [key: string]: boolean }>({});
  const [finalAmount, setFinalAmount] = useState<{ [key: string]: number | null }>({});
  const [couponApplied, setCouponApplied] = useState<{ [key: string]: boolean }>({});
  const [couponSuccessMessage, setCouponSuccessMessage] = useState<{ [key: string]: string }>({});
  const [billingCycle, setBillingCycle] = useState<'monthly' | 'annual'>('monthly');
  const [animatedPrice, setAnimatedPrice] = useState<{ [key: string]: number }>({});
  const [priceBreakdown, setPriceBreakdown] = useState<{ [key: string]: any }>({});

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
          fetch("/api/plan-pricing")
        ]);

        if (planResponse.ok) {
          const contentType = planResponse.headers.get("content-type");
          if (contentType && contentType.includes("application/json")) {
            const planData = await planResponse.json();
            setPlanInfo(planData);
          } else {
            console.error("Plan response is not JSON:", await planResponse.text());
          }
        } else {
          console.error("Plan response not ok:", planResponse.status, await planResponse.text());
        }

        if (pricingResponse.ok) {
          const contentType = pricingResponse.headers.get("content-type");
          if (contentType && contentType.includes("application/json")) {
            const pricingData = await pricingResponse.json();
            setPlans(pricingData);
          } else {
            console.error("Pricing response is not JSON:", await pricingResponse.text());
          }
        } else {
          console.error("Pricing response not ok:", pricingResponse.status, await pricingResponse.text());
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

  // Initialize animated prices
  useEffect(() => {
    if (Object.keys(plans).length > 0) {
      const initialPrices: { [key: string]: number } = {};
      Object.keys(plans).forEach(planName => {
        const plan = plans[planName];
        initialPrices[planName] = billingCycle === 'annual' && planName !== 'Free'
          ? Math.round(plan.price * 12 * 0.8)
          : plan.price;
      });
      setAnimatedPrice(initialPrices);
    }
  }, [plans, billingCycle]);

  const applyCoupon = async (targetPlan: string) => {
    const trimmedCode = couponCode[targetPlan]?.trim();
    if (!trimmedCode) {
      setCouponError({ ...couponError, [targetPlan]: "Please enter a coupon code" });
      return;
    }

    setCouponLoading({ ...couponLoading, [targetPlan]: true });
    setCouponError({ ...couponError, [targetPlan]: "" });

    try {
      const response = await fetch('/api/coupons/apply', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ couponCode: trimmedCode, targetPlan, billingCycle }),
      });

      if (response.ok) {
        const data = await response.json();
        setAppliedCoupon({ ...appliedCoupon, [targetPlan]: data.coupon });
        setFinalAmount({ ...finalAmount, [targetPlan]: data.pricing.finalAmount });
        setCouponError({ ...couponError, [targetPlan]: "" });
        setCouponCode({ ...couponCode, [targetPlan]: "" }); // Clear input after successful application
        setCouponApplied({ ...couponApplied, [targetPlan]: true });
        setCouponSuccessMessage({ ...couponSuccessMessage, [targetPlan]: `Coupon "${data.coupon.code}" applied successfully!` });

        // Update price breakdown for the selected plan
        setPriceBreakdown({
          ...priceBreakdown,
          [targetPlan]: {
            originalPrice: data.pricing.originalAmount,
            discountAmount: data.pricing.discountAmount,
            finalAmount: data.pricing.finalAmount,
            discountType: data.coupon.discountType,
            discountValue: data.coupon.discountValue,
          }
        });

        // Animate price change
        setAnimatedPrice({
          ...animatedPrice,
          [targetPlan]: data.pricing.finalAmount
        });
      } else {
        const errorData = await response.json();
        setCouponError({ ...couponError, [targetPlan]: errorData.error || "Failed to apply coupon" });
        setAppliedCoupon({ ...appliedCoupon, [targetPlan]: null });
        setFinalAmount({ ...finalAmount, [targetPlan]: null });
        setCouponApplied({ ...couponApplied, [targetPlan]: false });
      }
    } catch (error) {
      console.error('Coupon apply error:', error);
      setCouponError({ ...couponError, [targetPlan]: "Failed to apply coupon. Please try again." });
      setAppliedCoupon({ ...appliedCoupon, [targetPlan]: null });
      setFinalAmount({ ...finalAmount, [targetPlan]: null });
    } finally {
      setCouponLoading({ ...couponLoading, [targetPlan]: false });
    }
  };

  const removeCoupon = (targetPlan: string) => {
    setAppliedCoupon({ ...appliedCoupon, [targetPlan]: null });
    setFinalAmount({ ...finalAmount, [targetPlan]: null });
    setCouponCode({ ...couponCode, [targetPlan]: "" });
    setCouponError({ ...couponError, [targetPlan]: "" });
    setCouponApplied({ ...couponApplied, [targetPlan]: false });
    setCouponSuccessMessage({ ...couponSuccessMessage, [targetPlan]: "" });
    setPriceBreakdown({ ...priceBreakdown, [targetPlan]: undefined });
    // Reset animated price for this plan
    const plan = plans[targetPlan];
    const resetPrice = billingCycle === 'annual' && targetPlan !== 'Free'
      ? Math.round(plan.price * 12 * 0.8)
      : plan.price;
    setAnimatedPrice({ ...animatedPrice, [targetPlan]: resetPrice });
  };

  const handleUpgrade = async (targetPlan: string) => {
    try {
      const planPrice = plans[targetPlan]?.price ?? 0;
      const basePrice = billingCycle === 'annual' && targetPlan !== 'Free'
        ? Math.round(planPrice * 12 * 0.8)
        : planPrice;
      const breakdown = priceBreakdown[targetPlan];
      const originalAmount = breakdown?.originalPrice ?? basePrice;
      const discountAmount = breakdown?.discountAmount ?? 0;
      const finalAmountValue = breakdown?.finalAmount ?? basePrice;
      const appliedCouponCode = appliedCoupon?.[targetPlan]?.code || undefined;

      const response = await fetch('/api/create-razorpay-order', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          targetPlan,
          couponCode: appliedCouponCode,
          originalAmount,
          discountAmount,
          finalAmount: finalAmountValue,
          billingCycle,
        }),
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
                  couponCode: appliedCouponCode || null,
                  originalAmount,
                  discountAmount,
                  finalAmount: finalAmountValue,
                  billingCycle,
                }),
              });

              if (verifyRes.ok) {
                const verifyData = await verifyRes.json().catch(() => ({}));
                if (verifyData?.receiptUrl) {
                  window.open(verifyData.receiptUrl, "_blank");
                }
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
    <div className="min-h-screen bg-slate-950 text-slate-200 relative overflow-hidden">
      {/* Background radial glows */}
      <div className="absolute top-0 left-1/4 w-[500px] h-[500px] bg-purple-600/10 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-0 right-1/4 w-[600px] h-[600px] bg-blue-600/5 rounded-full blur-[120px] pointer-events-none" />

      <div className="relative z-10 max-w-5xl mx-auto px-6 pt-32 pb-24 space-y-12">
        {/* Header Section */}
        <div className="space-y-4">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-purple-500/10 border border-purple-500/20"
          >
            <Crown size={12} className="text-purple-400" />
            <span className="text-[9px] font-black uppercase tracking-[0.2em] text-purple-400">Account Hub</span>
          </motion.div>
          
          <div className="space-y-2">
            <motion.h1 
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.1 }}
              className="text-5xl md:text-7xl font-black text-white tracking-tighter leading-none"
            >
              Subscription<span className="text-purple-500">.</span>
            </motion.h1>
            <motion.p 
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 }}
              className="text-slate-400 text-sm md:text-base font-medium max-w-xl leading-relaxed"
            >
              Manage your professional growth access and usage limits.
            </motion.p>
          </div>
        </div>

        {/* Billing Toggle */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="flex justify-center"
        >
          <div className="bg-slate-900/50 backdrop-blur-2xl rounded-2xl p-1.5 border border-white/5 shadow-2xl relative flex">
            <motion.div
              layoutId="toggle-active"
              className="absolute inset-y-1.5 rounded-xl bg-purple-600 shadow-[0_0_20px_rgba(147,51,234,0.3)]"
              style={{
                width: billingCycle === 'monthly' ? '90px' : '150px',
                left: billingCycle === 'monthly' ? '6px' : '102px'
              }}
              transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
            />
            <button
              onClick={() => setBillingCycle('monthly')}
              className={`relative z-10 w-[90px] py-2.5 text-xs font-black uppercase tracking-widest transition-colors ${
                billingCycle === 'monthly' ? 'text-white' : 'text-slate-500 hover:text-slate-300'
              }`}
            >
              Monthly
            </button>
            <button
              onClick={() => setBillingCycle('annual')}
              className={`relative z-10 w-[150px] py-2.5 text-xs font-black uppercase tracking-widest transition-colors flex items-center justify-center gap-2 ${
                billingCycle === 'annual' ? 'text-white' : 'text-slate-500 hover:text-slate-300'
              }`}
            >
              Annual
              <span className={`text-[9px] px-1.5 py-0.5 rounded-md ${billingCycle === 'annual' ? 'bg-white/20' : 'bg-green-500/10 text-green-400'}`}>-20%</span>
            </button>
          </div>
        </motion.div>

        {/* Current Plan Card */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.4 }}
          className="relative group h-full"
        >
          <div className="absolute inset-0 bg-gradient-to-br from-green-500/20 to-purple-600/20 blur-[60px] opacity-20 group-hover:opacity-40 transition-opacity rounded-[3rem]" />
          <div className="relative bg-slate-900/40 backdrop-blur-3xl border border-white/10 p-10 rounded-[3rem] shadow-2xl overflow-hidden">
            {/* Background Texture */}
            <div className="absolute top-0 right-0 w-1/2 h-full opacity-5 pointer-events-none select-none">
              <Zap size={400} className="text-white transform translate-x-1/2 -rotate-12" />
            </div>

            <div className="relative z-10 grid md:grid-cols-2 gap-12 items-center">
              <div className="space-y-8">
                <div className="flex items-center gap-4">
                  <div className="w-16 h-16 rounded-[1.5rem] bg-gradient-to-br from-green-500 to-emerald-600 flex items-center justify-center text-white shadow-2xl shadow-green-500/20">
                    {React.createElement(getPlanIcon(planInfo.plan), { size: 32 })}
                  </div>
                  <div>
                    <div className="flex items-center gap-3 mb-1">
                      <h3 className="text-3xl font-black text-white tracking-tighter">{planInfo.planName}</h3>
                      <Badge className="bg-green-500/20 text-green-400 border-green-500/30 uppercase tracking-widest text-[10px] py-1 px-3">Active</Badge>
                    </div>
                    <p className="text-slate-400 font-bold uppercase tracking-[0.2em] text-[10px]">Your current commitment</p>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-8 pt-8 border-t border-white/5">
                  <div className="space-y-1">
                    <p className="text-slate-500 font-black uppercase tracking-widest text-[9px]">Renewal Cycle</p>
                    <p className="text-xl font-black text-white">{billingCycle === 'annual' ? 'Annual' : 'Monthly'}</p>
                  </div>
                  <div className="space-y-1">
                    <p className="text-slate-500 font-black uppercase tracking-widest text-[9px]">Next Billing</p>
                    <p className="text-xl font-black text-white">
                      {planInfo.renewalDate ? new Date(planInfo.renewalDate).toLocaleDateString(undefined, { day: 'numeric', month: 'short', year: 'numeric' }) : 'Lifetime'}
                    </p>
                  </div>
                </div>
              </div>

              <div className="bg-slate-950/40 rounded-[2.5rem] p-8 border border-white/5 flex flex-col items-center text-center space-y-6">
                <div className="relative w-32 h-32">
                  <svg className="w-32 h-32 transform -rotate-90" viewBox="0 0 36 36">
                    <circle cx="18" cy="18" r="16" fill="transparent" stroke="rgba(255,255,255,0.05)" strokeWidth="3" />
                    <motion.circle 
                      cx="18" cy="18" r="16" fill="transparent" 
                      stroke="#10b981" 
                      strokeWidth="3"
                      strokeDasharray="100"
                      strokeDashoffset={100 - (planInfo.isUnlimited ? 0 : (planInfo.currentUsage / planInfo.monthlyLimit! * 100))}
                      strokeLinecap="round"
                      initial={{ strokeDashoffset: 100 }}
                      animate={{ strokeDashoffset: 100 - (planInfo.isUnlimited ? 0 : (planInfo.currentUsage / planInfo.monthlyLimit! * 100)) }}
                      transition={{ duration: 1.5, delay: 0.5 }}
                    />
                  </svg>
                  <div className="absolute inset-0 flex flex-col items-center justify-center">
                    <span className="text-3xl font-black text-white leading-none">{planInfo.currentUsage} <span className="text-slate-500 text-sm">/ {planInfo.isUnlimited ? '∞' : planInfo.monthlyLimit}</span></span>
                  </div>
                </div>
                <div className="space-y-1">
                  <h4 className="text-white font-black uppercase tracking-widest text-xs">Usage Performance</h4>
                  <p className="text-slate-500 text-[10px] font-bold">You have {planInfo.isUnlimited ? 'unlimited' : `${(planInfo.monthlyLimit! - planInfo.currentUsage)} sessions`} remaining this period.</p>
                </div>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Upgrade Options Section */}
        {upgradeOptions.length > 0 && (
          <div className="space-y-8">
            <div className="flex items-center gap-3">
               <div className="w-1 h-6 bg-gradient-to-b from-purple-500 to-blue-500 rounded-full" />
               <h3 className="text-xl font-black text-white tracking-tight uppercase tracking-[0.1em]">Available Elevations</h3>
            </div>

            <div className="grid gap-6">
              {upgradeOptions.map((planName, index) => {
                const planData = plans[planName];
                const Icon = getPlanIcon(planName);
                const isPro = planName === 'Pro';
                
                return (
                  <motion.div
                    key={planName}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.5 + (index * 0.1) }}
                    className="group relative"
                  >
                    <div className="absolute inset-0 bg-gradient-to-r from-purple-600/10 to-blue-600/10 opacity-0 group-hover:opacity-100 transition-all rounded-[2rem] -z-10 blur-xl" />
                    <div className="bg-slate-900/40 backdrop-blur-2xl border border-white/5 p-8 rounded-[2rem] shadow-xl hover:border-purple-500/30 transition-all flex flex-col md:flex-row items-center justify-between gap-8">
                      <div className="flex items-center gap-6">
                        <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${isPro ? 'from-purple-500 to-indigo-600' : 'from-blue-500 to-cyan-600'} flex items-center justify-center text-white shadow-2xl group-hover:scale-110 transition-transform`}>
                          <Icon size={24} />
                        </div>
                        <div>
                          <h4 className="text-xl font-black text-white tracking-tight mb-1">{planName} Efficiency</h4>
                          <p className="text-slate-500 font-bold uppercase tracking-[0.2em] text-[10px]">
                            {planName === 'Standard' ? 'Unlimited sessions with detailed audits' : 'Extended limits for growing professionals'}
                          </p>
                        </div>
                      </div>

                      <div className="flex flex-col md:flex-row items-center gap-8">
                        <div className="text-center md:text-right">
                          <p className="text-slate-500 font-black uppercase tracking-widest text-[9px] mb-1">Investment</p>
                          <div className="flex items-baseline gap-2">
                             <span className="text-3xl font-black text-white">₹{animatedPrice[planName] || (billingCycle === 'annual' ? Math.round(planData.price * 12 * 0.8) : planData.price)}</span>
                             <span className="text-slate-500 font-bold text-xs">/{billingCycle === 'annual' ? 'yr' : 'mo'}</span>
                          </div>
                        </div>

                        <Button
                          onClick={() => handleUpgrade(planName)}
                          className="bg-white text-black hover:bg-slate-200 px-8 py-6 rounded-2xl font-black uppercase text-[10px] tracking-widest shadow-2xl transition-all active:scale-95 border-none"
                        >
                          Upgrade Now
                        </Button>
                      </div>
                    </div>

                    {/* Simple Coupon Entry Refinement */}
                    <div className="mt-4 ml-8 mr-8 flex items-center justify-between">
                       <p className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-600">Have a growth voucher?</p>
                       {!appliedCoupon[planName] ? (
                         <div className="flex items-center gap-2">
                            <input
                              type="text"
                              value={couponCode[planName] || ''}
                              onChange={(e) => setCouponCode({ ...couponCode, [planName]: e.target.value.toUpperCase() })}
                              placeholder="CODE"
                              className="bg-transparent border-b border-white/10 text-[10px] font-black text-purple-400 placeholder-slate-700 focus:outline-none focus:border-purple-500 w-20 text-center uppercase tracking-widest"
                            />
                            <button 
                              onClick={() => applyCoupon(planName)}
                              className="text-[10px] font-black uppercase tracking-[0.2em] text-purple-500 hover:text-purple-400 transition-colors"
                            >
                              Apply
                            </button>
                         </div>
                       ) : (
                         <div className="flex items-center gap-3">
                            <span className="text-[10px] font-black uppercase tracking-[0.2em] text-green-500">Voucher Active: {appliedCoupon[planName].code}</span>
                            <button onClick={() => removeCoupon(planName)} className="text-[10px] font-black text-slate-500 hover:text-white underline underline-offset-4">Reset</button>
                         </div>
                       )}
                    </div>
                  </motion.div>
                );
              })}
            </div>
          </div>
        )}

        {/* Highest Plan Empty State */}
        {!upgradeOptions.length && (
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-slate-900/40 backdrop-blur-3xl border border-white/5 p-12 rounded-[3rem] text-center space-y-6"
          >
            <div className="w-20 h-20 rounded-full bg-amber-500/10 flex items-center justify-center mx-auto text-amber-500 ring-4 ring-amber-500/5 shadow-2xl shadow-amber-500/10">
              <Crown size={40} />
            </div>
            <div>
              <h3 className="text-2xl font-black text-white tracking-tight uppercase tracking-widest mb-2">Elite Status</h3>
              <p className="text-slate-400 font-medium max-w-sm mx-auto">You're currently enjoying our most powerful training capabilities. No further upgrades required.</p>
            </div>
          </motion.div>
        )}

        {/* Footer Navigation */}
        <div className="flex items-center justify-center pt-12 border-t border-white/5">
           <Link href="/train" className="group flex items-center gap-3 text-slate-500 hover:text-white transition-all text-sm font-black uppercase tracking-[0.2em]">
              <ArrowRight size={14} className="rotate-180 group-hover:-translate-x-2 transition-transform" />
              Return to Module Center
           </Link>
        </div>
      </div>
    </div>
  );
}