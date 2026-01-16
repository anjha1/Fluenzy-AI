"use client";
import { Crop, Expand, Scissors, Type, Zap, BookOpen, MessageSquare, UserPlus, Code, Building2, Users } from "lucide-react";
import React from "react";
import { motion } from "framer-motion";

const features = [
  {
    icon: BookOpen,
    title: "English Learning",
    description:
      "Master fluency with personalized daily conversations and real-time grammar feedback.",
    gradient: "from-blue-500 to-cyan-500",
    delay: 0.1,
  },
  {
    icon: MessageSquare,
    title: "Daily Conversation",
    description:
      "Practice real-life office scenarios, small talk, and collaborative professional communication.",
    gradient: "from-purple-500 to-pink-500",
    delay: 0.2,
  },
  {
    icon: UserPlus,
    title: "HR Interview Coach",
    description:
      "Ace behavioral questions and soft skills assessment with seasoned HR simulation.",
    gradient: "from-orange-500 to-red-500",
    delay: 0.3,
  },
  {
    icon: Code,
    title: "Technical Mastery",
    description:
      "Deep-dive into role-based technical conceptual rounds and logic assessments.",
    gradient: "from-green-500 to-emerald-500",
    delay: 0.4,
  },
  {
    icon: Building2,
    title: "Company Tracks",
    description:
      "Prepare for FAANG, Startups, or MNCs with specific curated company HR rounds.",
    gradient: "from-cyan-500 to-blue-500",
    delay: 0.5,
  },
  {
    icon: Users,
    title: "GD Agent",
    description:
      "Practice real Group Discussions with AI participants. Choose teams, roles, and get evaluated.",
    gradient: "from-pink-500 to-purple-500",
    delay: 0.6,
  },
];

const Features = () => {
  return (
    <section id="features" className="py-24 relative overflow-hidden bg-gradient-to-b from-slate-800 to-slate-900">
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
          <h2 className="text-4xl lg:text-6xl font-bold mb-6">
            <span className="text-white">Advanced AI </span>
            <span className="bg-gradient-to-r from-purple-400 via-blue-400 to-cyan-400 !bg-clip-text text-transparent">
              Training Features
            </span>
          </h2>

          <p className="text-xl text-gray-300 max-w-3xl mx-auto">
            Experience the most comprehensive AI-powered interview preparation platform with real-time feedback and adaptive learning.
          </p>
        </motion.div>

        <div className="grid lg:grid-cols-3 gap-8">
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
      initial={{ opacity: 0, y: 50 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.8, delay }}
      whileHover={{ scale: 1.05, y: -8 }}
      className="group"
    >
      <div className={`h-full bg-gradient-to-br ${feature.bgColor || "from-slate-800/50 to-slate-700/30"} rounded-2xl p-8 border ${feature.borderColor || "border-slate-600/30"} backdrop-blur-sm hover:border-purple-500/50 transition-all duration-300 shadow-2xl hover:shadow-purple-500/20`}>
        <div className="relative mb-6">
          <div
            className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${gradient} p-4 group-hover:scale-110 transition-transform duration-300 shadow-lg`}
          >
            <Icon className="w-full h-full text-white" />
          </div>
          <div className={`absolute inset-0 w-16 h-16 rounded-2xl bg-gradient-to-br ${gradient} blur-xl group-hover:blur-2xl transition-all duration-300 opacity-30`} />
        </div>

        <h3 className="text-2xl font-bold mb-4 text-white group-hover:text-purple-200 transition-colors">
          {title}
        </h3>

        <p className="text-gray-300 leading-relaxed">{description}</p>

        <div className="mt-6 pt-6 border-t border-slate-600/50">
          <div className="flex items-center space-x-2 text-sm text-purple-400">
            <div className="w-2 h-2 bg-purple-400 rounded-full animate-pulse" />
            <span className="font-medium">AI-Powered Training</span>
          </div>
        </div>
      </div>
    </motion.div>
  );
}

export default Features;
