"use client";
import { Crop, Expand, Scissors, Type, Zap, BookOpen, MessageSquare, UserPlus, Code, Building2, Users } from "lucide-react";
import React from "react";
import { motion } from "framer-motion";

const features = [
  {
    icon: BookOpen,
    title: "English Learning",
    description: "Enhance your professional communication with AI-driven conversations, instant grammar feedback, and targeted fluency exercises.",
    image: "/images/EnglishLearning.jpg",
    mesh: "radial-gradient(at 0% 0%, #1e3a8a 0px, transparent 50%), radial-gradient(at 100% 100%, #0891b2 0px, transparent 50%)",
    accent: "bg-cyan-500",
    border: "border-cyan-500/30",
    delay: 0.1,
  },
  {
    icon: MessageSquare,
    title: "Daily Conversation",
    description: "Build confidence in everyday workplace interactions through realistic role-playing scenarios and networking simulations.",
    image: "/images/DailyConversation.jpg",
    mesh: "radial-gradient(at 0% 0%, #4c1d95 0px, transparent 50%), radial-gradient(at 100% 100%, #9d174d 0px, transparent 50%)",
    accent: "bg-pink-500",
    border: "border-pink-500/30",
    delay: 0.2,
  },
  {
    icon: UserPlus,
    title: "HR Interview Coach",
    description: "Ace your HR interviews with comprehensive preparation covering behavioral questions and situational judgment.",
    image: "/images/HRInterviewCoach.jpg",
    mesh: "radial-gradient(at 0% 0%, #7c2d12 0px, transparent 50%), radial-gradient(at 100% 100%, #991b1b 0px, transparent 50%)",
    accent: "bg-orange-600",
    border: "border-orange-500/30",
    delay: 0.3,
  },
  {
    icon: Code,
    title: "Technical Mastery",
    description: "Sharpen your technical skills with adaptive coding challenges and system design simulations powered by AI tutors.",
    image: "/images/TechnicalMastery.jpg",
    mesh: "radial-gradient(at 0% 0%, #064e3b 0px, transparent 50%), radial-gradient(at 100% 100%, #065f46 0px, transparent 50%)",
    accent: "bg-emerald-600",
    border: "border-emerald-500/30",
    delay: 0.4,
  },
  {
    icon: Building2,
    title: "Company Tracks",
    description: "Get insider preparation for top companies with customized interview questions and cultural insights.",
    image: "/images/CompanyTracks.jpg",
    mesh: "radial-gradient(at 0% 0%, #164e63 0px, transparent 50%), radial-gradient(at 100% 100%, #1e40af 0px, transparent 50%)",
    accent: "bg-blue-600",
    border: "border-blue-500/30",
    delay: 0.5,
  },
  {
    icon: Users,
    title: "GD Agent",
    description: "Excel in group discussions with AI-moderated practice sessions and leadership role-playing simulations.",
    image: "/images/GDAgent.jpg",
    mesh: "radial-gradient(at 0% 0%, #831843 0px, transparent 50%), radial-gradient(at 100% 100%, #5b21b6 0px, transparent 50%)",
    accent: "bg-purple-600",
    border: "border-purple-500/30",
    delay: 0.6,
  },
];

const Features = () => {
  return (
    <section id="features" className="py-24 relative overflow-hidden bg-[#050508]">
      {/* Background effects */}
      <div className="absolute top-0 right-1/4 w-[600px] h-[600px] bg-blue-600/5 rounded-full blur-[150px]" />
      <div className="absolute bottom-0 left-1/4 w-[600px] h-[600px] bg-purple-600/5 rounded-full blur-[150px]" />

      <div className="max-w-[1440px] mx-auto px-6 md:px-12 relative z-10">
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
  const { icon: Icon, title, description, image, mesh, accent, border, delay } = feature;

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.6, delay }}
      whileHover={{ y: -8 }}
      className="group cursor-pointer"
    >
      <div 
        className={`h-full relative overflow-hidden rounded-[32px] p-8 border ${border} transition-all duration-500 hover:shadow-2xl`}
        style={{ background: `linear-gradient(135deg, rgba(15, 15, 25, 0.95), rgba(5, 5, 10, 0.98)), ${mesh}` }}
      >
        {/* User provided background image with alpha */}
        <div 
          className="absolute inset-0 opacity-10 group-hover:opacity-30 transition-opacity duration-500 pointer-events-none"
          style={{ 
            backgroundImage: `url(${image})`,
            backgroundSize: 'cover',
            backgroundPosition: 'center'
          }}
        />

        {/* Subtle pattern overlay */}
        <div className="absolute inset-0 opacity-[0.02] mix-blend-overlay pointer-events-none bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')]" />

        <div className="relative z-10">
          <div className="relative mb-8">
            <div
              className={`w-14 h-14 rounded-2xl ${accent} flex items-center justify-center group-hover:scale-110 group-hover:rotate-6 transition-all duration-500 shadow-xl`}
            >
              <Icon className="w-7 h-7 text-white" />
            </div>
          </div>

          <h3 className="text-2xl font-black mb-4 text-white tracking-tight group-hover:text-purple-100 transition-colors duration-300">
            {title}
          </h3>

          <p className="text-slate-400 font-medium leading-relaxed group-hover:text-slate-200 transition-colors duration-300">
            {description}
          </p>
        </div>

        {/* Bottom indicator */}
        <div className="absolute bottom-0 left-0 h-1 w-0 bg-gradient-to-r from-transparent via-white/20 to-transparent group-hover:w-full transition-all duration-700" />
      </div>
    </motion.div>
  );
}

export default Features;
