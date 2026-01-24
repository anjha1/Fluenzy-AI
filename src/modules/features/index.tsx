"use client";
import { Crop, Expand, Scissors, Type, Zap, BookOpen, MessageSquare, UserPlus, Code, Building2, Users } from "lucide-react";
import React from "react";
import { motion } from "framer-motion";

const features = [
  {
    icon: BookOpen,
    title: "English Learning",
    description:
      "Practice professional English with AI conversations, grammar correction, and fluency building exercises.",
    gradient: "from-blue-500 to-cyan-500",
    delay: 0.1,
  },
  {
    icon: MessageSquare,
    title: "Daily Conversation",
    description:
      "Master workplace communication through realistic office scenarios, networking talks, and team interactions.",
    gradient: "from-purple-500 to-pink-500",
    delay: 0.2,
  },
  {
    icon: UserPlus,
    title: "HR Interview Coach",
    description:
      "Prepare for HR rounds with behavioral questions, situational scenarios, and personality assessments.",
    gradient: "from-orange-500 to-red-500",
    delay: 0.3,
  },
  {
    icon: Code,
    title: "Technical Mastery",
    description:
      "Build technical expertise through coding challenges, system design, and algorithmic problem-solving.",
    gradient: "from-green-500 to-emerald-500",
    delay: 0.4,
  },
  {
    icon: Building2,
    title: "Company Tracks",
    description:
      "Train for specific companies with tailored interview questions, case studies, and company culture prep.",
    gradient: "from-cyan-500 to-blue-500",
    delay: 0.5,
  },
  {
    icon: Users,
    title: "GD Agent",
    description:
      "Hone group discussion skills with AI-moderated sessions, leadership scenarios, and peer evaluations.",
    gradient: "from-pink-500 to-purple-500",
    delay: 0.6,
  },
];

const Features = () => {
  return (
    <section id="features" className="py-16 relative overflow-hidden bg-gradient-to-b from-slate-800 to-slate-900">
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
          <h2 className="text-2xl lg:text-4xl font-bold mb-4">
            <span className="text-white">Choose Your </span>
            <span className="bg-gradient-to-r from-purple-400 via-blue-400 to-cyan-400 !bg-clip-text text-transparent">
              Training Path
            </span>
          </h2>

          <p className="text-base text-gray-300 max-w-2xl mx-auto">
            Select the skills you want to master. Each module is designed for focused, intensive practice with AI-powered guidance.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {features.map((feature, index) => (
            <FeatureCard key={feature.title} feature={feature} index={index} />
          ))}
        </div>
      </div>
    </section>
  );
};

function FeatureCard({ feature, index }: { feature: any; index: number }) {
  const { icon: Icon, title, description, gradient, delay } = feature;

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.6, delay }}
      whileHover={{ scale: 1.02, y: -2 }}
      className="group cursor-pointer"
    >
      <div className="h-full glass rounded-xl p-5 border border-card-border/50 hover:border-purple-500/60 transition-all duration-300 shadow-lg hover:shadow-purple-500/20 relative overflow-hidden">
        {/* Subtle glow effect */}
        <div className="absolute inset-0 bg-gradient-to-br from-purple-500/3 to-blue-500/3 opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-xl" />

        <div className="relative z-10">
          <div className="relative mb-4">
            <div
              className={`w-12 h-12 rounded-lg bg-gradient-to-br ${gradient} p-3 group-hover:scale-105 transition-all duration-300 shadow-md`}
            >
              <Icon className="w-full h-full text-white" />
            </div>
          </div>

          <h3 className="text-lg font-semibold mb-2 text-white group-hover:text-purple-200 transition-colors duration-300">
            {title}
          </h3>

          <p className="text-sm text-gray-300 leading-relaxed group-hover:text-gray-200 transition-colors duration-300">
            {description}
          </p>
        </div>
      </div>
    </motion.div>
  );
}

export default Features;
