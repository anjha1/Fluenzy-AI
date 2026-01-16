"use client";
import React from "react";
import { motion } from "framer-motion";
import { Code, Users, MessageSquare, Briefcase, Zap } from "lucide-react";

const trainingPaths = [
  {
    title: "English Learning",
    description: "Master business English, idioms, and professional communication",
    icon: MessageSquare,
    color: "from-blue-500 to-cyan-500",
    bgColor: "from-blue-900/20 to-cyan-900/20",
    borderColor: "border-blue-500/30",
  },
  {
    title: "Daily Conversation",
    description: "Practice real-world scenarios with AI conversation partner",
    icon: Users,
    color: "from-purple-500 to-pink-500",
    bgColor: "from-purple-900/20 to-pink-900/20",
    borderColor: "border-purple-500/30",
  },
  {
    title: "HR Interview Coach",
    description: "Behavioral questions, STAR method, leadership principles",
    icon: Briefcase,
    color: "from-orange-500 to-red-500",
    bgColor: "from-orange-900/20 to-red-900/20",
    borderColor: "border-orange-500/30",
  },
  {
    title: "Technical Mastery",
    description: "Algorithms, system design, coding challenges",
    icon: Code,
    color: "from-green-500 to-emerald-500",
    bgColor: "from-green-900/20 to-emerald-900/20",
    borderColor: "border-green-500/30",
  },
  {
    title: "Company Tracks",
    description: "Google, Amazon, Microsoft specific preparation",
    icon: Zap,
    color: "from-cyan-500 to-blue-500",
    bgColor: "from-cyan-900/20 to-blue-900/20",
    borderColor: "border-cyan-500/30",
  },
  {
    title: "GD Agent",
    description: "Group discussion simulations with multiple AI roles",
    icon: Users,
    color: "from-pink-500 to-purple-500",
    bgColor: "from-pink-900/20 to-purple-900/20",
    borderColor: "border-pink-500/30",
  },
];

const TrainingShowcase = () => {
  return (
    <section className="py-24 relative overflow-hidden bg-gradient-to-b from-slate-900 to-slate-800">
      {/* Background effects */}
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl" />
      <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl" />

      <div className="container mx-auto px-4 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="text-center mb-16"
        >
          <div className="inline-flex items-center space-x-2 bg-gradient-to-r from-purple-900/50 to-blue-900/50 rounded-full px-6 py-3 mb-6 border border-purple-500/30 backdrop-blur-sm">
            <MessageSquare className="h-5 w-5 text-purple-400" />
            <span className="font-medium text-purple-200">AI Training Modules</span>
          </div>

          <h2 className="text-4xl lg:text-6xl font-bold mb-6">
            <span className="bg-gradient-to-r from-purple-400 via-blue-400 to-cyan-400 !bg-clip-text text-transparent">
              Train Now
            </span>
          </h2>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto">
            Choose your training path and start mastering interviews with AI-powered coaching tailored for FAANG success.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {trainingPaths.map((type, index) => (
            <motion.div
              key={type.title}
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              className={`bg-gradient-to-br ${type.bgColor} rounded-2xl p-6 border ${type.borderColor} backdrop-blur-sm hover:scale-105 transition-all duration-300 group`}
            >
              <div className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${type.color} flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300 shadow-lg`}>
                <type.icon className="w-8 h-8 text-white" />
              </div>

              <h3 className="text-xl font-bold text-white mb-3">{type.title}</h3>
              <p className="text-gray-300 text-sm leading-relaxed">{type.description}</p>

              <div className="mt-4 flex items-center space-x-2">
                <div className="w-2 h-2 bg-gradient-to-r from-purple-400 to-blue-400 rounded-full animate-pulse" />
                <span className="text-xs text-purple-200">AI-Powered</span>
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
          <div className="bg-gradient-to-r from-slate-800/50 to-slate-700/50 rounded-2xl p-8 border border-slate-600/30 backdrop-blur-sm max-w-4xl mx-auto">
            <h3 className="text-2xl font-bold text-white mb-4">Real-Time AI Feedback</h3>
            <p className="text-gray-300 mb-6">
              Every response is analyzed instantly with detailed scoring, improvement suggestions, and comparative benchmarks against successful candidates.
            </p>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-center">
              <div>
                <div className="text-3xl font-bold text-purple-400 mb-2">95%</div>
                <div className="text-sm text-gray-400">Accuracy Rate</div>
              </div>
              <div>
                <div className="text-3xl font-bold text-blue-400 mb-2">24/7</div>
                <div className="text-sm text-gray-400">Available</div>
              </div>
              <div>
                <div className="text-3xl font-bold text-cyan-400 mb-2">∞</div>
                <div className="text-sm text-gray-400">Practice Sessions</div>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default TrainingShowcase;