"use client";
import React from "react";
import { motion } from "framer-motion";
import { Code, Users, MessageSquare, Briefcase, Zap, Sparkles, ArrowRight } from "lucide-react";

const trainingPaths = [
  {
    title: "English Learning",
    description: "Master business English, idioms, and professional communication",
    icon: MessageSquare,
    image: "/images/EnglishLearning.jpg",
    mesh: "radial-gradient(at 0% 0%, #1e3a8a 0px, transparent 50%), radial-gradient(at 100% 100%, #0891b2 0px, transparent 50%)",
    accent: "bg-cyan-500",
    shadow: "shadow-cyan-500/20",
    border: "border-cyan-500/30",
  },
  {
    title: "Daily Conversation",
    description: "Practice real-world scenarios with AI conversation partner",
    icon: Users,
    image: "/images/DailyConversation.jpg",
    mesh: "radial-gradient(at 0% 0%, #4c1d95 0px, transparent 50%), radial-gradient(at 100% 100%, #9d174d 0px, transparent 50%)",
    accent: "bg-pink-500",
    shadow: "shadow-pink-500/20",
    border: "border-pink-500/30",
  },
  {
    title: "HR Interview Coach",
    description: "Behavioral questions, STAR method, leadership principles",
    icon: Briefcase,
    image: "/images/HRInterviewCoach.jpg",
    mesh: "radial-gradient(at 0% 0%, #7c2d12 0px, transparent 50%), radial-gradient(at 100% 100%, #991b1b 0px, transparent 50%)",
    accent: "bg-orange-600",
    shadow: "shadow-orange-500/20",
    border: "border-orange-500/30",
  },
  {
    title: "Technical Mastery",
    description: "Algorithms, system design, coding challenges",
    icon: Code,
    image: "/images/TechnicalMastery.jpg",
    mesh: "radial-gradient(at 0% 0%, #064e3b 0px, transparent 50%), radial-gradient(at 100% 100%, #065f46 0px, transparent 50%)",
    accent: "bg-emerald-600",
    shadow: "shadow-emerald-500/20",
    border: "border-emerald-500/30",
  },
  {
    title: "Company Tracks",
    description: "Google, Amazon, Microsoft specific preparation",
    icon: Zap,
    image: "/images/CompanyTracks.jpg",
    mesh: "radial-gradient(at 0% 0%, #164e63 0px, transparent 50%), radial-gradient(at 100% 100%, #1e40af 0px, transparent 50%)",
    accent: "bg-blue-600",
    shadow: "shadow-blue-500/20",
    border: "border-blue-500/30",
  },
  {
    title: "GD Agent",
    description: "Group discussion simulations with multiple AI roles",
    icon: Users,
    image: "/images/GDAgent.jpg",
    mesh: "radial-gradient(at 0% 0%, #831843 0px, transparent 50%), radial-gradient(at 100% 100%, #5b21b6 0px, transparent 50%)",
    accent: "bg-purple-600",
    shadow: "shadow-purple-500/20",
    border: "border-purple-500/30",
  },
];

const TrainingShowcase = () => {
  return (
    <section className="py-24 relative overflow-hidden bg-[#0a0a0f]">
      {/* Background effects */}
      <div className="absolute top-0 left-1/4 w-[500px] h-[500px] bg-purple-600/10 rounded-full blur-[120px] mix-blend-screen animate-pulse" />
      <div className="absolute bottom-0 right-1/4 w-[500px] h-[500px] bg-blue-600/10 rounded-full blur-[120px] mix-blend-screen animate-pulse" />

      <div className="max-w-[1440px] mx-auto px-6 md:px-12 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="text-center mb-16"
        >
          <div className="inline-flex items-center space-x-2 bg-white/5 rounded-full px-6 py-3 mb-6 border border-white/10 backdrop-blur-md">
            <Sparkles className="h-5 w-5 text-purple-400" />
            <span className="font-bold text-sm tracking-widest uppercase text-white/80">AI Training Modules</span>
          </div>

          <h2 className="text-5xl lg:text-7xl font-black mb-6 tracking-tighter">
            <span className="text-white">Immersive </span>
            <span className="bg-gradient-to-r from-purple-400 via-blue-400 to-cyan-400 !bg-clip-text text-transparent">
              Preparation
            </span>
          </h2>
          <p className="text-lg text-slate-400 max-w-2xl mx-auto font-medium">
            Choose your training track and experience the future of interview preparation with our specialized AI agents.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {trainingPaths.map((type, index) => (
            <motion.div
              key={type.title}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              whileHover={{ y: -10 }}
              className="group"
            >
              <div 
                className={`relative h-full overflow-hidden rounded-[32px] p-8 border ${type.border} transition-all duration-500 ${type.shadow} hover:shadow-2xl`}
                style={{ background: `linear-gradient(135deg, rgba(15, 15, 25, 0.9), rgba(10, 10, 15, 0.95)), ${type.mesh}` }}
              >
                {/* User provided background image with alpha */}
                <div 
                  className="absolute inset-0 opacity-10 group-hover:opacity-30 transition-opacity duration-500 pointer-events-none"
                  style={{ 
                    backgroundImage: `url(${type.image})`,
                    backgroundSize: 'cover',
                    backgroundPosition: 'center'
                  }}
                />

                {/* Texture Overlay */}
                <div className="absolute inset-0 opacity-[0.03] mix-blend-overlay pointer-events-none bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')]" />
                
                <div className={`relative z-10 w-14 h-14 rounded-2xl ${type.accent} flex items-center justify-center mb-8 shadow-xl group-hover:scale-110 group-hover:rotate-6 transition-all duration-500`}>
                  <type.icon className="w-7 h-7 text-white" />
                </div>

                <div className="relative z-10">
                  <h3 className="text-2xl font-black text-white mb-4 tracking-tight group-hover:text-transparent group-hover:bg-clip-text group-hover:bg-gradient-to-r group-hover:from-white group-hover:to-white/70 transition-all">
                    {type.title}
                  </h3>
                  <p className="text-slate-400 font-medium leading-relaxed mb-8 group-hover:text-slate-300 transition-colors">
                    {type.description}
                  </p>
                </div>

                <div className="relative z-10 flex items-center justify-between mt-auto">
                  <div className="flex items-center space-x-2">
                    <div className={`w-2 h-2 rounded-full ${type.accent} animate-pulse`} />
                    <span className="text-[10px] font-black uppercase tracking-[0.2em] text-white/40">AI-Powered</span>
                  </div>
                  <div className="opacity-0 group-hover:opacity-100 transition-opacity translate-x-4 group-hover:translate-x-0 transition-transform">
                    <ArrowRight className="w-5 h-5 text-white/50" />
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.4 }}
          className="text-center mt-20"
        >
          <div className="bg-white/[0.02] border border-white/5 rounded-[40px] p-12 backdrop-blur-2xl relative overflow-hidden">
            <div className="absolute top-0 right-0 w-64 h-64 bg-purple-500/10 rounded-full blur-[100px]" />
            <div className="absolute bottom-0 left-0 w-64 h-64 bg-blue-500/10 rounded-full blur-[100px]" />
            
            <h3 className="text-3xl font-black text-white mb-6 tracking-tight">Real-Time Performance Analytics</h3>
            <p className="text-slate-400 mb-10 max-w-2xl mx-auto font-medium leading-relaxed">
              Every session provides instant, actionable feedback. We analyze your tone, pace, content quality, and confidence level using state-of-the-art neural engines.
            </p>
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
              {[
                { label: "Accuracy", value: "98%", color: "text-emerald-400" },
                { label: "Latency", value: "<250ms", color: "text-blue-400" },
                { label: "Metrics", value: "50+", color: "text-purple-400" },
                { label: "Data Points", value: "1M+", color: "text-cyan-400" }
              ].map((stat, i) => (
                <div key={i} className="text-center">
                  <div className={`text-4xl font-black mb-2 tracking-tighter ${stat.color}`}>{stat.value}</div>
                  <div className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-500">{stat.label}</div>
                </div>
              ))}
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default TrainingShowcase;