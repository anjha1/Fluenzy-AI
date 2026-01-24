"use client";
import { Check, Crown, Star, Zap } from "lucide-react";
import React from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { usePathname } from "next/navigation";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";

const plans = [
  {
    name: "Free",
    price: "₹0",
    period: "forever",
    description: "Start your interview preparation journey",
    features: [
      "5 interview sessions per month",
      "Basic AI feedback",
      "English conversation practice",
      "Community support",
    ],
    limitations: ["Limited sessions"],
    cta: "Start Free",
    popular: false,
    icon: Star,
  },
  {
    name: "Pro",
    price: "₹150",
    period: "per month",
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
    cta: "Go Pro",
    popular: true,
    icon: Crown,
  },
];

const Pricing = () => {
  const pathname = usePathname();
  const router = useRouter();
  const { data: session } = useSession();

  const handleButtonClick = (planName: string) => {
    if (pathname === "/pricing") {
      // On pricing page
      if (planName === "Pro") {
        router.push("/billing");
      } else {
        // Start Free - redirect to home or sign in
        if (session?.user) {
          router.push("/");
        } else {
          // Sign in logic, but since it's client, maybe just redirect to home
          router.push("/");
        }
      }
    } else {
      // On home page - scroll to editor
      const element = document.getElementById("editor");
      if (element) {
        element.scrollIntoView({ behavior: "smooth" });
      }
    }
  };

  return (
    <section id="pricing" className="py-24 relative overflow-hidden bg-gradient-to-b from-slate-900 to-slate-800">
      {/* Background effects */}
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-purple-500/5 rounded-full blur-3xl" />
      <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-blue-500/5 rounded-full blur-3xl" />

      <div className="container mx-auto px-4 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="text-center mb-16"
        >
          <div className="inline-flex items-center space-x-2 bg-gradient-to-r from-purple-900/50 to-blue-900/50 rounded-full px-6 py-3 mb-6 border border-purple-500/30 backdrop-blur-sm">
            <Zap className="h-5 w-5 text-purple-400" />
            <span className="font-medium text-purple-200">Flexible Pricing</span>
          </div>

          <h2 className="text-4xl lg:text-6xl font-bold mb-6">
            <span className="text-white">Start Training </span>
            <span className="bg-gradient-to-r from-purple-400 via-blue-400 to-cyan-400 !bg-clip-text text-transparent">
              Free Today
            </span>
          </h2>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto">
            Begin with our free plan and upgrade when you're ready to unlock unlimited AI-powered interview preparation.
          </p>
        </motion.div>

        <div className="grid lg:grid-cols-2 gap-8 max-w-4xl mx-auto">
          {plans?.map((plan, index) => (
            <motion.div
              key={plan.name}
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, delay: index * 0.2 }}
              whileHover={{ scale: 1.02, y: -5 }}
              className={`relative group ${plan.popular ? "lg:-mt-8" : ""}`}
            >
              {plan.popular && (
                <div className="absolute -top-4 left-1/2 transform -translate-x-1/2 z-10">
                  <div className="bg-gradient-primary px-6 py-2 rounded-full text-sm font-bold text-background">
                    Most Popular
                  </div>
                </div>
              )}

              <div
                className={`h-full bg-gradient-to-br rounded-2xl p-8 border transition-all duration-300 ${
                  plan.popular
                    ? "from-purple-900/30 to-blue-900/30 border-purple-500/50 shadow-2xl shadow-purple-500/20"
                    : "from-slate-800/50 to-slate-700/30 border-slate-600/30 hover:border-purple-500/50 shadow-2xl hover:shadow-purple-500/20"
                } backdrop-blur-sm`}
              >
                <div className="text-center mb-8">
                  <div className={`inline-flex items-center justify-center w-16 h-16 rounded-2xl mb-4 bg-gradient-to-br ${plan.popular ? "from-purple-500 to-blue-500" : "from-slate-600 to-slate-500"} group-hover:scale-110 transition-transform duration-300 shadow-lg`}>
                    <plan.icon className="w-8 h-8 text-white" />
                  </div>

                  <h3 className="text-2xl font-bold mb-2 text-white">
                    {plan.name}
                  </h3>
                  <p className="text-gray-300 mb-4">
                    {plan.description}
                  </p>

                  <div className="mb-6">
                    <span className="text-5xl font-bold text-white">
                      {plan.price}
                    </span>
                    <span className="text-gray-400 ml-2">
                      /{plan.period}
                    </span>
                  </div>
                </div>

                <div className="space-y-4 mb-8">
                  {plan?.features?.map((feature, idx) => (
                    <div key={`feature-${plan.name}-${idx}`} className={"flex items-center space-x-3"}>
                      <div className="flex-shrink-0 w-5 h-5 rounded-full bg-purple-500/20 flex items-center justify-center">
                        <Check className="w-3 h-3 text-purple-400" />
                      </div>
                      <span className="text-gray-200">{feature}</span>
                    </div>
                  ))}

                  {plan?.limitations?.map((limitation, idx) => (
                    <div
                      key={`limitation-${plan.name}-${idx}`}
                      className="flex items-center space-x-3"
                    >
                      <div className="flex-shrink-0 w-5 h-5 rounded-full bg-slate-600 flex items-center justify-center">
                        <div className="w-3 h-0.5 bg-gray-400" />
                      </div>
                      <span className="text-gray-400">
                        {limitation}
                      </span>
                    </div>
                  ))}
                </div>

                <Button
                  className={`w-full font-semibold ${plan.popular ? "bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white" : "bg-slate-700 hover:bg-slate-600 text-gray-200 border border-slate-600"}`}
                  onClick={() => handleButtonClick(plan.name)}
                >
                  {plan.cta}
                </Button>
              </div>
            </motion.div>
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.4 }}
          className="text-center mt-12"
        >
          <p className="text-gray-300">
            Start training free today. Upgrade when you're ready to unlock unlimited AI-powered interview preparation.
          </p>
        </motion.div>
      </div>
    </section>
  );
};

export default Pricing;
