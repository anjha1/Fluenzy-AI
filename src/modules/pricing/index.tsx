"use client";
import { Check, Crown, Star, Zap } from "lucide-react";
import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { usePathname } from "next/navigation";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";

interface PlanData {
  name: string;
  price: number;
  currency: string;
  status: string;
  updatedAt: string;
}

const planFeatures = {
  Free: {
    description: "Start your interview preparation journey",
    features: [
      "3 interview sessions per month",
      "Basic AI feedback",
      "English conversation practice",
      "Community support",
    ],
    limitations: ["Limited sessions"],
    cta: "Start Free",
    popular: false,
    icon: Star,
    period: "forever",
    image: "/images/StandardandProPlan.jpg",
    mesh: "radial-gradient(at 0% 0%, #1e293b 0px, transparent 50%), radial-gradient(at 100% 100%, #334155 0px, transparent 50%)",
    accent: "bg-slate-500",
    border: "border-slate-500/30",
  },
  Standard: {
    description: "Unlimited training for serious candidates",
    features: [
      "Unlimited interview sessions",
      "Advanced AI feedback & analytics",
      "All training modules unlocked",
      "Priority support",
      "Progress tracking dashboard",
      "Company-specific preparation",
      "Group discussion practice",
    ],
    cta: "Go Standard",
    popular: true,
    icon: Crown,
    period: "per month",
    image: "/images/StandardandProPlan.jpg",
    mesh: "radial-gradient(at 0% 0%, #4c1d95 0px, transparent 50%), radial-gradient(at 100% 100%, #8b5cf6 0px, transparent 50%)",
    accent: "bg-purple-500",
    border: "border-purple-500/30",
  },
  Pro: {
    description: "Enterprise-grade training for peak performance",
    features: [
      "Unlimited interview sessions",
      "Real-time posture & tone analysis",
      "Personalized growth roadmap",
      "Dedicated success manager",
      "Unlimited group discussions",
      "Custom company tracks",
      "Expert human review (1/mo)",
    ],
    cta: "Go Pro",
    popular: false,
    icon: Zap,
    period: "per month",
    image: "/images/StandardandProPlan.jpg",
    mesh: "radial-gradient(at 0% 0%, #1e3a8a 0px, transparent 50%), radial-gradient(at 100% 100%, #0ea5e9 0px, transparent 50%)",
    accent: "bg-blue-500",
    border: "border-blue-500/30",
  },
};

const Pricing = () => {
  const pathname = usePathname();
  const router = useRouter();
  const { data: session } = useSession();
  const [plans, setPlans] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [billingCycle, setBillingCycle] = useState<'monthly' | 'annual'>('monthly');
  const [couponCode, setCouponCode] = useState('');
  const [couponData, setCouponData] = useState<any>(null);
  const [couponError, setCouponError] = useState('');
  const [applyingCoupon, setApplyingCoupon] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState<string>('');
  const [animatedPrice, setAnimatedPrice] = useState<{ [key: string]: number }>({});
  const [priceBreakdown, setPriceBreakdown] = useState<{ [key: string]: any }>({});

  useEffect(() => {
    const fetchPlans = async () => {
      try {
        const response = await fetch('/api/admin/plan-pricing');
        if (response.ok) {
          const pricingData = await response.json();
          
          if (Object.keys(pricingData).length === 0) {
            throw new Error("Empty pricing data");
          }

          const plansArray = Object.entries(pricingData).map(([planName, data]: [string, any]) => {
            // Find matched feature data case-insensitively
            const matchedFeatureKey = Object.keys(planFeatures).find(
              key => key.toLowerCase() === planName.toLowerCase()
            ) as keyof typeof planFeatures;
            
            const featureData = planFeatures[matchedFeatureKey] || planFeatures.Free;

            return {
              name: planName.charAt(0).toUpperCase() + planName.slice(1),
              price: data.price,
              currency: data.currency,
              ...featureData,
            };
          });

          setPlans(plansArray);
        } else {
          throw new Error("Failed to fetch");
        }
      } catch (error) {
        console.error('Error fetching plans:', error);
        setPlans([
          { name: "Free", price: 0, currency: "INR", ...planFeatures.Free },
          { name: "Standard", price: 299, currency: "INR", ...planFeatures.Standard },
          { name: "Pro", price: 999, currency: "INR", ...planFeatures.Pro },
        ]);
      } finally {
        setLoading(false);
      }
    };

    fetchPlans();
  }, []);

  useEffect(() => {
    if (plans.length > 0) {
      const initialPrices: { [key: string]: number } = {};
      plans.forEach(plan => {
        initialPrices[plan.name] = billingCycle === 'annual' && plan.name !== 'Free'
          ? Math.round(plan.price * 12 * 0.8)
          : plan.price;
      });
      setAnimatedPrice(initialPrices);
    }
  }, [plans, billingCycle]);

  const handleButtonClick = (planName: string) => {
    if (pathname === "/pricing") {
      if (planName !== "Free") {
        router.push("/billing");
      } else {
        router.push("/");
      }
    } else {
      const element = document.getElementById("editor");
      if (element) {
        element.scrollIntoView({ behavior: "smooth" });
      }
    }
  };

  const applyCoupon = async () => {
    if (!couponCode.trim() || !selectedPlan) return;

    setApplyingCoupon(true);
    setCouponError('');
    setCouponData(null);

    try {
      const response = await fetch('/api/coupons/apply', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          couponCode: couponCode.trim(),
          targetPlan: selectedPlan,
          billingCycle,
        }),
      });

      const data = await response.json();

      if (response.ok) {
        setCouponData(data);
        setPriceBreakdown({
          ...priceBreakdown,
          [selectedPlan]: {
            originalPrice: data.pricing.originalAmount,
            discountAmount: data.pricing.discountAmount,
            finalAmount: data.pricing.finalAmount,
            discountType: data.coupon.discountType,
            discountValue: data.coupon.discountValue,
          }
        });
        setAnimatedPrice({
          ...animatedPrice,
          [selectedPlan]: data.pricing.finalAmount
        });
      } else {
        setCouponError(data.error);
      }
    } catch (error) {
      setCouponError('Failed to apply coupon. Please try again.');
    } finally {
      setApplyingCoupon(false);
    }
  };

  return (
    <section id="pricing" className="py-24 relative overflow-hidden bg-[#0a0a0f] bg-module-overlay">
      {/* Background effects */}
      <div className="absolute top-0 right-1/4 w-[600px] h-[600px] bg-purple-600/5 rounded-full blur-[150px]" />
      <div className="absolute bottom-0 left-1/4 w-[600px] h-[600px] bg-blue-600/5 rounded-full blur-[150px]" />

      <div className="max-w-[1440px] mx-auto px-6 md:px-12 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="text-center mb-16"
        >
          <div className="inline-flex items-center space-x-2 bg-white/5 rounded-full px-6 py-3 mb-6 border border-white/10 backdrop-blur-md">
            <Zap className="h-5 w-5 text-purple-400" />
            <span className="font-bold text-sm tracking-widest uppercase text-white/80">Premium Access</span>
          </div>

          <h2 className="text-5xl lg:text-7xl font-black mb-6 tracking-tighter">
            <span className="text-white">Start Your </span>
            <span className="bg-gradient-to-r from-purple-400 via-blue-400 to-cyan-400 !bg-clip-text text-transparent">
              Success Story
            </span>
          </h2>

          <div className="flex items-center justify-center mb-8">
            <div className="bg-white/5 backdrop-blur-xl rounded-2xl p-2 border border-white/10 flex items-center shadow-2xl">
              <button
                onClick={() => setBillingCycle('monthly')}
                className={`px-8 py-3 rounded-xl text-sm font-black tracking-widest uppercase transition-all duration-500 ${
                  billingCycle === 'monthly'
                    ? 'bg-white text-slate-900 shadow-[0_0_20px_rgba(255,255,255,0.3)]'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                Monthly
              </button>
              <button
                onClick={() => setBillingCycle('annual')}
                className={`px-8 py-3 rounded-xl text-sm font-black tracking-widest uppercase transition-all duration-500 flex items-center ${
                  billingCycle === 'annual'
                    ? 'bg-white text-slate-900 shadow-[0_0_20px_rgba(255,255,255,0.3)]'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                Annual
                <span className="ml-2 bg-emerald-500/20 text-emerald-400 text-[10px] px-2 py-1 rounded-lg border border-emerald-500/20">
                  Save 20%
                </span>
              </button>
            </div>
          </div>

          <p className="text-lg text-slate-400 max-w-2xl mx-auto font-medium">
            Start your journey with our free plan. Upgrade to unlock unlimited AI-powered training sessions.
          </p>
        </motion.div>

        <div className="grid lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {loading ? (
            <div className="col-span-3 text-center py-12 text-slate-500 font-bold uppercase tracking-widest">Initialising Engine...</div>
          ) : (
            plans?.map((plan: any, index: number) => (
              <motion.div
                key={plan.name}
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.8, delay: index * 0.2 }}
                whileHover={{ y: -10 }}
                className={`relative group ${plan.popular ? "lg:-mt-8" : ""}`}
              >
                {plan.popular && (
                  <div className="absolute -top-5 left-1/2 transform -translate-x-1/2 z-20">
                    <div className="bg-gradient-to-r from-purple-500 to-blue-500 px-6 py-2 rounded-full text-[10px] font-black uppercase tracking-widest text-white shadow-2xl border border-white/20">
                      Most Popular
                    </div>
                  </div>
                )}

                <div 
                  className={`h-full relative overflow-hidden rounded-[40px] p-8 border transition-all duration-500 ${
                    plan.popular ? "border-purple-500/50 shadow-[0_0_50px_rgba(168,85,247,0.15)]" : "border-white/10"
                  }`}
                  style={{ background: `linear-gradient(135deg, rgba(15, 15, 25, 0.98), rgba(5, 5, 10, 0.99)), ${plan.mesh}` }}
                >
                  {/* User provided background image with alpha */}
                  <div 
                    className="absolute inset-0 opacity-10 group-hover:opacity-30 transition-opacity duration-500 pointer-events-none"
                    style={{ 
                      backgroundImage: `url(${plan.image})`,
                      backgroundSize: 'cover',
                      backgroundPosition: 'center'
                    }}
                  />

                  {/* Texture Overlay */}
                  <div className="absolute inset-0 opacity-[0.03] mix-blend-overlay pointer-events-none bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')]" />

                  <div className="text-center mb-10 relative z-10">
                    <div className={`inline-flex items-center justify-center w-16 h-16 rounded-2xl mb-6 ${plan.accent || 'bg-slate-500'} shadow-2xl group-hover:scale-110 group-hover:rotate-6 transition-all duration-500`}>
                      {plan.icon ? <plan.icon className="w-8 h-8 text-white" /> : <Star className="w-8 h-8 text-white" />}
                    </div>

                    <h3 className="text-3xl font-black text-white mb-2 tracking-tight">
                      {plan.name}
                    </h3>
                    <p className="text-slate-400 font-medium text-sm">
                      {plan.description}
                    </p>

                    <div className="mt-8 flex items-end justify-center">
                      <motion.span
                        key={animatedPrice[plan.name]}
                        className="text-6xl font-black text-white tracking-tighter"
                      >
                        ₹{animatedPrice[plan.name] || plan.price}
                      </motion.span>
                      <span className="text-slate-500 font-bold mb-2 ml-2 tracking-widest uppercase text-xs">
                        /{billingCycle === 'annual' ? 'year' : plan.period}
                      </span>
                    </div>

                    {billingCycle === 'annual' && plan.name !== 'Free' && (
                      <div className="text-[10px] font-black text-emerald-400 mt-2 uppercase tracking-widest">
                        Save ₹{plan.price * 12 - Math.round(plan.price * 12 * 0.8)} ANNUALLY
                      </div>
                    )}
                  </div>

                  <div className="space-y-4 mb-10 relative z-10">
                    {plan?.features?.map((feature: string, idx: number) => (
                      <div key={idx} className="flex items-center space-x-3 group/item">
                        <div className={`flex-shrink-0 w-5 h-5 rounded-full ${plan.accent.replace('bg-', 'bg-')}/20 flex items-center justify-center border border-white/5`}>
                          <Check className={`w-3 h-3 ${plan.accent.replace('bg-', 'text-')}`} />
                        </div>
                        <span className="text-slate-300 font-medium text-sm group-hover/item:text-white transition-colors">{feature}</span>
                      </div>
                    ))}
                  </div>

                  {plan.price > 0 && (
                    <div className="mb-8 relative z-10">
                      <div className="flex bg-white/5 rounded-2xl p-1 border border-white/5 group-focus-within:border-purple-500/50 transition-all">
                        <input
                          type="text"
                          placeholder="Coupon"
                          value={selectedPlan === plan.name ? couponCode : ''}
                          onChange={(e) => {
                            setCouponCode(e.target.value);
                            setSelectedPlan(plan.name);
                          }}
                          className="w-full px-4 bg-transparent text-white placeholder-slate-600 focus:outline-none text-sm font-bold uppercase tracking-widest"
                        />
                        <button
                          onClick={applyCoupon}
                          disabled={applyingCoupon || !couponCode.trim() || selectedPlan !== plan.name}
                          className="bg-white/10 hover:bg-white/20 text-white rounded-xl px-4 py-2 text-[10px] font-black uppercase tracking-widest transition-all disabled:opacity-30"
                        >
                          {applyingCoupon ? '...' : 'Apply'}
                        </button>
                      </div>
                    </div>
                  )}

                  <Button
                    className={`w-full py-8 rounded-[24px] text-sm font-black uppercase tracking-[0.2em] transition-all duration-500 relative z-10 ${
                      plan.popular
                        ? "bg-white text-slate-900 hover:scale-[1.02] shadow-[0_20px_40px_rgba(255,255,255,0.1)]"
                        : "bg-white/5 text-white hover:bg-white/10 border border-white/10"
                    }`}
                    onClick={() => handleButtonClick(plan.name)}
                  >
                    {plan.cta}
                  </Button>
                </div>
              </motion.div>
            ))
          )}
        </div>
      </div>
    </section>
  );
};

export default Pricing;
