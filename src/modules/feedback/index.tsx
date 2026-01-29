"use client";
import React from "react";
import { motion } from "framer-motion";
import { CheckCircle, Clock, Zap } from "lucide-react";

const feedbackMetrics = [
  {
    icon: CheckCircle,
    value: "95%",
    title: "Accuracy Rate",
    description: "Industry-leading precision in automated evaluation",
    image: "/images/download (2).jpg",
    mesh: "radial-gradient(at 0% 0%, #064e3b 0px, transparent 50%), radial-gradient(at 100% 100%, #10b981 0px, transparent 50%)",
    accent: "bg-emerald-500",
    border: "border-emerald-500/30",
    delay: 0.4,
  },
  {
    icon: Clock,
    value: "24/7",
    title: "Always Available",
    description: "Practice anytime, anywhere with our persistent AI agents",
    image: "/images/download (2).jpg",
    mesh: "radial-gradient(at 0% 0%, #1e3a8a 0px, transparent 50%), radial-gradient(at 100% 100%, #3b82f6 0px, transparent 50%)",
    accent: "bg-blue-500",
    border: "border-blue-500/30",
    delay: 0.6,
  },
  {
    icon: Zap,
    value: "∞",
    title: "Unlimited Sessions",
    description: "Prepare without limits on our premium training tracks",
    image: "/images/download (2).jpg",
    mesh: "radial-gradient(at 0% 0%, #4c1d95 0px, transparent 50%), radial-gradient(at 100% 100%, #8b5cf6 0px, transparent 50%)",
    accent: "bg-purple-500",
    border: "border-purple-500/30",
    delay: 0.8,
  },
  {
    icon: Zap,
    value: "< 200ms",
    title: "Instant Feedback",
    description: "Zero latency real-time voice and content analysis",
    image: "/images/IntelligentContentAnalysis.jpg",
    mesh: "radial-gradient(at 0% 0%, #78350f 0px, transparent 50%), radial-gradient(at 100% 100%, #d97706 0px, transparent 50%)",
    accent: "bg-amber-500",
    border: "border-amber-500/30",
    delay: 1.0,
  },
  {
    icon: CheckCircle,
    value: "50+",
    title: "Behavioral Metrics",
    description: "In-depth analysis of tone, pace, and confidence",
    image: "/images/BehavioralPatternRecognition.jpg",
    mesh: "radial-gradient(at 0% 0%, #831843 0px, transparent 50%), radial-gradient(at 100% 100%, #ec4899 0px, transparent 50%)",
    accent: "bg-pink-500",
    border: "border-pink-500/30",
    delay: 1.2,
  },
  {
    icon: Clock,
    value: "Top 1%",
    title: "Global Benchmarks",
    description: "Compare your performance with top FAANG candidates",
    image: "/images/banchmarking.jpg",
    mesh: "radial-gradient(at 0% 0%, #164e63 0px, transparent 50%), radial-gradient(at 100% 100%, #06b6d4 0px, transparent 50%)",
    accent: "bg-cyan-500",
    border: "border-cyan-500/30",
    delay: 1.4,
  },
];

const FeedbackSection = () => {
  return (
    <section className="py-24 relative overflow-hidden bg-[#07070a] bg-module-overlay">
      {/* Background effects */}
      <div className="absolute top-0 left-1/4 w-[500px] h-[500px] bg-purple-600/5 rounded-full blur-[120px]" />
      <div className="absolute bottom-0 right-1/4 w-[500px] h-[500px] bg-blue-600/5 rounded-full blur-[120px]" />

      <div className="max-w-[1440px] mx-auto px-6 md:px-12 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="text-center mb-20"
        >
          <h2 className="text-4xl lg:text-6xl font-black mb-6 tracking-tighter">
            <span className="text-white">Real-Time AI </span>
            <span className="bg-gradient-to-r from-purple-400 via-blue-400 to-cyan-400 !bg-clip-text text-transparent">
              Intelligence
            </span>
          </h2>
          <p className="text-lg text-slate-400 max-w-2xl mx-auto font-medium leading-relaxed">
            Get instant scoring, detailed benchmarks, and actionable insights to transform your interview performance.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {feedbackMetrics.map((metric, index) => (
            <motion.div
              key={metric.title}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, delay: metric.delay }}
              whileHover={{ y: -8 }}
              className="group"
            >
              <div 
                className={`h-full relative overflow-hidden rounded-[32px] p-8 border ${metric.border} transition-all duration-500 hover:shadow-2xl`}
                style={{ background: `linear-gradient(135deg, rgba(15, 15, 25, 0.95), rgba(5, 5, 10, 0.98)), ${metric.mesh}` }}
              >
                {/* User provided background image with alpha */}
                <div 
                  className="absolute inset-0 opacity-10 group-hover:opacity-30 transition-opacity duration-500 pointer-events-none"
                  style={{ 
                    backgroundImage: `url(${metric.image})`,
                    backgroundSize: 'cover',
                    backgroundPosition: 'center'
                  }}
                />

                {/* Texture Overlay */}
                <div className="absolute inset-0 opacity-[0.02] mix-blend-overlay pointer-events-none bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')]" />

                <div className="relative z-10 text-center">
                  <div className={`w-14 h-14 mx-auto rounded-2xl ${metric.accent} flex items-center justify-center mb-6 shadow-xl group-hover:scale-110 group-hover:rotate-6 transition-all duration-500`}>
                    <metric.icon className="w-7 h-7 text-white" />
                  </div>
                  
                  <div className="text-4xl font-black text-white mb-2 tracking-tighter group-hover:scale-110 transition-transform duration-500">
                    {metric.value}
                  </div>
                  <div className={`text-sm font-black uppercase tracking-widest mb-4 transition-colors duration-300 ${metric.accent.replace('bg-', 'text-')}`}>
                    {metric.title}
                  </div>
                  <p className="text-slate-400 font-medium text-sm leading-relaxed group-hover:text-slate-200 transition-colors">
                    {metric.description}
                  </p>
                </div>

                {/* Subtle border glow */}
                <div className="absolute inset-0 border border-white/5 rounded-[32px] pointer-events-none" />
              </div>
            </motion.div>
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 1.0 }}
          className="mt-20 text-center"
        >
          <div className="inline-flex items-center space-x-3 bg-white/[0.03] rounded-full px-8 py-4 border border-white/10 backdrop-blur-xl">
            <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            <span className="font-bold text-sm text-slate-300 tracking-wide uppercase">Powered by High-Performance Neural Engines</span>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default FeedbackSection;