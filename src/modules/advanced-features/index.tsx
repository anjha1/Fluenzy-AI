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
      gradient: "from-purple-500 to-blue-500"
    },
    {
      icon: FileText,
      title: "Intelligent Content Analysis",
      description: "NLP-powered analysis of resumes, job descriptions, and performance data for hyper-personalized training.",
      gradient: "from-blue-500 to-cyan-500"
    },
    {
      icon: Target,
      title: "Behavioral Pattern Recognition",
      description: "Computer vision and audio processing identify micro-expressions, speech patterns, and confidence indicators.",
      gradient: "from-green-500 to-emerald-500"
    },
    {
      icon: TrendingUp,
      title: "Predictive Performance Analytics",
      description: "Machine learning models forecast improvement trajectories and identify skill gaps before they impact results.",
      gradient: "from-orange-500 to-red-500"
    },
    {
      icon: Users,
      title: "Multi-Agent Simulation",
      description: "Distributed AI agents create realistic multi-participant scenarios with dynamic response generation.",
      gradient: "from-pink-500 to-purple-500"
    },
    {
      icon: Award,
      title: "Benchmarking Intelligence",
      description: "Proprietary algorithms compare performance against anonymized data from successful FAANG candidates.",
      gradient: "from-cyan-500 to-blue-500"
    }
  ];

  return (
    <section className="py-24 relative overflow-hidden bg-gradient-to-b from-slate-900/50 to-slate-800">
      {/* Background effects */}
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-purple-500/8 rounded-full blur-3xl" />
      <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-blue-500/8 rounded-full blur-3xl" />

      {/* Section divider */}
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-purple-500/30 to-transparent"></div>

      <div className="container mx-auto px-4 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl lg:text-6xl font-bold mb-6">
            <span className="bg-gradient-to-r from-purple-400 via-blue-400 to-cyan-400 !bg-clip-text text-transparent">
              Enterprise AI
            </span>
            <br />
            <span className="text-white">Technology</span>
          </h2>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto">
            Powered by proprietary machine learning models trained on millions of successful interviews. Our AI doesn't just simulate—it learns, adapts, and optimizes your preparation for maximum impact.
          </p>
        </motion.div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <motion.div
              key={feature.title}
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, delay: index * 0.1 }}
              whileHover={{ scale: 1.05, y: -5 }}
              className="group"
            >
              <div className="h-full glass rounded-3xl p-8 border border-card-border/50 hover:border-purple-500/60 transition-all duration-500 shadow-2xl hover:shadow-purple-500/30 relative overflow-hidden">
                {/* Glow effect */}
                <div className="absolute inset-0 bg-gradient-to-br from-purple-500/5 to-blue-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-3xl" />

                <div className="relative z-10">
                  <div className="relative mb-6">
                    <div
                      className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${feature.gradient} p-4 group-hover:scale-110 transition-all duration-500 shadow-lg`}
                    >
                      <feature.icon className="w-full h-full text-white" />
                    </div>
                    <div className={`absolute inset-0 w-16 h-16 rounded-2xl bg-gradient-to-br ${feature.gradient} blur-xl group-hover:blur-2xl transition-all duration-500 opacity-30`} />
                  </div>

                  <h3 className="text-xl font-bold mb-4 text-white group-hover:text-purple-200 transition-colors duration-300">
                    {feature.title}
                  </h3>

                  <p className="text-gray-300 leading-relaxed group-hover:text-gray-200 transition-colors duration-300">
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
          transition={{ duration: 0.8, delay: 0.8 }}
          className="text-center mt-16"
        >
          <div className="inline-flex items-center space-x-2 bg-gradient-to-r from-purple-900/50 to-blue-900/50 rounded-full px-8 py-4 border border-purple-500/30 backdrop-blur-sm">
            <Award className="h-6 w-6 text-purple-400" />
            <span className="font-medium text-purple-200">Proprietary ML Models • Neural Networks • Predictive Analytics • Computer Vision</span>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default AdvancedFeatures;