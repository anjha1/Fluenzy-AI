"use client";
import React from "react";
import { motion } from "framer-motion";
import { Brain, Target, TrendingUp, FileText, Users, Award } from "lucide-react";

const AdvancedFeatures = () => {
  const features = [
    {
      icon: Brain,
      title: "Neural Learning Engine",
      description: "Advanced machine learning algorithms that adapt to your learning style and progress in real-time.",
      image: "/images/NeuralLearningEngine.jpg",
      mesh: "radial-gradient(at 0% 0%, #4c1d95 0px, transparent 50%), radial-gradient(at 100% 100%, #1e40af 0px, transparent 50%)",
      accent: "bg-purple-600",
      border: "border-purple-500/30"
    },
    {
      icon: FileText,
      title: "Intelligent Content Analysis",
      description: "NLP-powered analysis of resumes, job descriptions, and performance data for hyper-personalized training.",
      image: "/images/IntelligentContentAnalysis.jpg",
      mesh: "radial-gradient(at 0% 0%, #1e3a8a 0px, transparent 50%), radial-gradient(at 100% 100%, #0891b2 0px, transparent 50%)",
      accent: "bg-blue-600",
      border: "border-blue-500/30"
    },
    {
      icon: Target,
      title: "Behavioral Recognition",
      description: "Computer vision and audio processing identify micro-expressions, speech patterns, and confidence indicators.",
      image: "/images/BehavioralPatternRecognition.jpg",
      mesh: "radial-gradient(at 0% 0%, #064e3b 0px, transparent 50%), radial-gradient(at 100% 100%, #059669 0px, transparent 50%)",
      accent: "bg-emerald-600",
      border: "border-emerald-500/30"
    },
    {
      icon: TrendingUp,
      title: "Predictive Analytics",
      description: "Machine learning models forecast improvement trajectories and identify skill gaps before they impact results.",
      image: "/images/PredictivePerformanceAnalytics.jpg",
      mesh: "radial-gradient(at 0% 0%, #7c2d12 0px, transparent 50%), radial-gradient(at 100% 100%, #dc2626 0px, transparent 50%)",
      accent: "bg-orange-600",
      border: "border-orange-500/30"
    },
    {
      icon: Users,
      title: "Multi-Agent Simulation",
      description: "Distributed AI agents create realistic multi-participant scenarios with dynamic response generation.",
      image: "/images/multi-agent.jpg",
      mesh: "radial-gradient(at 0% 0%, #831843 0px, transparent 50%), radial-gradient(at 100% 100%, #7c3aed 0px, transparent 50%)",
      accent: "bg-pink-600",
      border: "border-pink-500/30"
    },
    {
      icon: Award,
      title: "Benchmarking Intelligence",
      description: "Proprietary algorithms compare performance against anonymized data from successful FAANG candidates.",
      image: "/images/banchmarking.jpg",
      mesh: "radial-gradient(at 0% 0%, #164e63 0px, transparent 50%), radial-gradient(at 100% 100%, #2563eb 0px, transparent 50%)",
      accent: "bg-cyan-600",
      border: "border-cyan-500/30"
    }
  ];

  return (
    <section className="py-24 relative overflow-hidden bg-[#050508] bg-module-overlay">
      {/* Background effects */}
      <div className="absolute top-0 right-1/4 w-[600px] h-[600px] bg-purple-600/5 rounded-full blur-[150px]" />
      <div className="absolute bottom-0 left-1/4 w-[600px] h-[600px] bg-blue-600/5 rounded-full blur-[150px]" />

      <div className="max-w-[1440px] mx-auto px-6 md:px-12 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="text-center mb-20"
        >
          <h2 className="text-5xl lg:text-7xl font-black mb-6 tracking-tighter">
            <span className="text-white">Enterprise AI </span>
            <span className="bg-gradient-to-r from-purple-400 via-blue-400 to-cyan-400 !bg-clip-text text-transparent">
              Technology
            </span>
          </h2>
          <p className="text-lg text-slate-400 max-w-2xl mx-auto font-medium leading-relaxed">
            Our proprietary machine learning models are trained on millions of data points to deliver hyper-realistic interview simulations and precision analytics.
          </p>
        </motion.div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <motion.div
              key={feature.title}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, delay: index * 0.1 }}
              whileHover={{ y: -8 }}
              className="group"
            >
              <div 
                className={`h-full relative overflow-hidden rounded-[40px] p-8 border ${feature.border} transition-all duration-500 hover:shadow-2xl`}
                style={{ background: `linear-gradient(135deg, rgba(15, 15, 25, 0.95), rgba(5, 5, 10, 0.98)), ${feature.mesh}` }}
              >
                {/* User provided background image with alpha */}
                <div 
                  className="absolute inset-0 opacity-10 group-hover:opacity-30 transition-opacity duration-500 pointer-events-none"
                  style={{ 
                    backgroundImage: `url(${feature.image})`,
                    backgroundSize: 'cover',
                    backgroundPosition: 'center'
                  }}
                />

                {/* Texture Overlay */}
                <div className="absolute inset-0 opacity-[0.02] mix-blend-overlay pointer-events-none bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')]" />

                <div className="relative z-10">
                  <div className="relative mb-8">
                    <div
                      className={`w-14 h-14 rounded-2xl ${feature.accent} flex items-center justify-center group-hover:scale-110 group-hover:rotate-6 transition-all duration-500 shadow-xl`}
                    >
                      <feature.icon className="w-7 h-7 text-white" />
                    </div>
                  </div>

                  <h3 className="text-2xl font-black mb-4 text-white tracking-tight group-hover:text-purple-100 transition-colors duration-300">
                    {feature.title}
                  </h3>

                  <p className="text-slate-400 font-medium leading-relaxed group-hover:text-slate-200 transition-colors duration-300">
                    {feature.description}
                  </p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="text-center mt-20"
        >
          <div className="inline-flex items-center space-x-3 bg-white/[0.03] rounded-full px-8 py-4 border border-white/10 backdrop-blur-xl">
             <div className="w-2 h-2 rounded-full bg-purple-500 animate-pulse" />
             <span className="font-bold text-sm text-slate-400 tracking-wide uppercase">Proprietary Neural Networks • Computer Vision • Predictive Analytics</span>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default AdvancedFeatures;