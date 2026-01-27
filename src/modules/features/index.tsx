"use client";
import { Crop, Expand, Scissors, Type, Zap, BookOpen, MessageSquare, UserPlus, Code, Building2, Users } from "lucide-react";
import React from "react";
import { motion } from "framer-motion";

const features = [
  {
    icon: BookOpen,
    title: "English Learning",
    description:
      "Enhance your professional communication with AI-driven conversations, instant grammar feedback, and targeted fluency exercises that prepare you for global workplaces.",
    gradient: "from-blue-500 to-cyan-500",
    delay: 0.1,
  },
  {
    icon: MessageSquare,
    title: "Daily Conversation",
    description:
      "Build confidence in everyday workplace interactions through realistic role-playing scenarios, networking simulations, and team collaboration practice with AI mentors.",
    gradient: "from-purple-500 to-pink-500",
    delay: 0.2,
  },
  {
    icon: UserPlus,
    title: "HR Interview Coach",
    description:
      "Ace your HR interviews with comprehensive preparation covering behavioral questions, situational judgment, and personality assessments guided by AI experts.",
    gradient: "from-orange-500 to-red-500",
    delay: 0.3,
  },
  {
    icon: Code,
    title: "Technical Mastery",
    description:
      "Sharpen your technical skills with adaptive coding challenges, system design simulations, and algorithmic problem-solving powered by intelligent AI tutors.",
    gradient: "from-green-500 to-emerald-500",
    delay: 0.4,
  },
  {
    icon: Building2,
    title: "Company Tracks",
    description:
      "Get insider preparation for top companies with customized interview questions, case studies, and cultural insights tailored to your target employers.",
    gradient: "from-cyan-500 to-blue-500",
    delay: 0.5,
  },
  {
    icon: Users,
    title: "GD Agent",
    description:
      "Excel in group discussions with AI-moderated practice sessions, leadership role-playing, and constructive feedback on your communication and collaboration skills.",
    gradient: "from-pink-500 to-purple-500",
    delay: 0.6,
  },
];

const Features = () => {
  return (
    <section id="features" className="py-12 relative overflow-hidden bg-gradient-to-b from-slate-800 to-slate-900">
      {/* Background effects */}
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-purple-500/5 rounded-full blur-3xl" />
      <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-blue-500/5 rounded-full blur-3xl" />

      <div className="container mx-auto px-4 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
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
      whileHover={{ scale: 1.05, y: -8, boxShadow: "0 25px 50px -12px rgba(147, 51, 234, 0.4)" }}
      className="group cursor-pointer"
    >
      <div className="h-full glass rounded-2xl p-8 border border-card-border/50 hover:border-purple-500/60 transition-all duration-300 shadow-xl hover:shadow-purple-500/25 relative overflow-hidden">
        {/* Subtle glow effect */}
        <div className="absolute inset-0 bg-gradient-to-br from-purple-500/5 to-blue-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-2xl" />

        <div className="relative z-10">
          <div className="relative mb-6">
            <div
              className={`w-16 h-16 rounded-xl bg-gradient-to-br ${gradient} p-4 group-hover:scale-110 group-hover:rotate-6 transition-all duration-300 shadow-lg`}
            >
              <Icon className="w-full h-full text-white" />
            </div>
          </div>

          <h3 className="text-xl font-bold mb-3 text-white group-hover:text-purple-100 transition-colors duration-300">
            {title}
          </h3>

          <p className="text-base text-gray-300 leading-relaxed group-hover:text-gray-100 transition-colors duration-300 max-w-xs">
            {description}
          </p>
        </div>
      </div>
    </motion.div>
  );
}

export default Features;
