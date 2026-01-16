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
    gradient: "from-indigo-500 to-indigo-600",
    delay: 0.1,
  },
  {
    icon: MessageSquare,
    title: "Daily Conversation",
    description:
      "Practice real-life office scenarios, small talk, and collaborative professional communication.",
    gradient: "from-sky-500 to-sky-600",
    delay: 0.2,
  },
  {
    icon: UserPlus,
    title: "HR Interview Coach",
    description:
      "Ace behavioral questions and soft skills assessment with seasoned HR simulation.",
    gradient: "from-pink-500 to-pink-600",
    delay: 0.3,
  },
  {
    icon: Code,
    title: "Technical Mastery",
    description:
      "Deep-dive into role-based technical conceptual rounds and logic assessments.",
    gradient: "from-emerald-500 to-emerald-600",
    delay: 0.4,
  },
  {
    icon: Building2,
    title: "Company Tracks",
    description:
      "Prepare for FAANG, Startups, or MNCs with specific curated company HR rounds.",
    gradient: "from-amber-500 to-amber-600",
    delay: 0.5,
  },
  {
    icon: Users,
    title: "GD Agent",
    description:
      "Practice real Group Discussions with AI participants. Choose teams, roles, and get evaluated.",
    gradient: "from-purple-500 to-purple-600",
    delay: 0.6,
  },
  {
    icon: Scissors,
    title: "AI Background Removal",
    description:
      "1-click clean photos with precision AI. Remove any background instantly and get professional results.",
    gradient: "from-primary to-primary-glow",
    delay: 0.7,
  },
  {
    icon: Expand,
    title: "AI Generative Fill",
    description:
      "Expand your canvas and auto-fill edges seamlessly. Create perfect aspect ratios effortlessly.",
    gradient: "from-secondary to-secondary-glow",
    delay: 0.8,
  },
  {
    icon: Zap,
    title: "AI Upscale & Enhance",
    description:
      "Boost resolution up to 4x while fixing details. Transform low-res into stunning high-quality images.",
    gradient: "from-primary to-secondary",
    delay: 0.9,
  },
  {
    icon: Crop,
    title: "Smart Crop & Face Focus",
    description:
      "Perfect thumbnails automatically. AI detects faces and important content for optimal cropping.",
    gradient: "from-secondary to-primary",
    delay: 1.0,
  },
  {
    icon: Type,
    title: "Watermark & Text Overlay",
    description:
      "Brand your content professionally. Add custom watermarks and text with perfect positioning.",
    gradient: "from-primary-glow to-secondary-glow",
    delay: 1.1,
  },
];

const Features = () => {
  return (
    <section id="features" className="py-24 relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-muted/20 to-transparent" />

      <div className="container mx-auto px-4 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl lg:text-6xl font-bold mb-6">
            <span className="text-foreground">Magical </span>
            <span className="bg-gradient-primary !bg-clip-text text-transparent">
              Features
            </span>
          </h2>

          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Transform your photos and master your career with cutting-edge AI technology.
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
      whileHover={{ scale: 1.02, y: -5 }}
      className="group"
    >
      <div className="h-full glass rounded-2xl p-8 border border-card-border hover:border-primary/30 transition-all duration-300 shadow-glow-subtle hover:shadow-glow-primary">
        <div className="relative mb-6">
          <div
            className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${gradient} p-4 group-hover:animate-glow-pulse`}
          >
            <Icon className="w-full h-full text-background" />
          </div>
          <div className="absolute inset-0 w-16 h-16 rounded-2xl bg-gradient-to-br from-primary/20 to-secondary/20 blur-xl group-hover:blur-2xl transition-all duration-300" />
        </div>

        <h3 className="text-2xl font-bold mb-4 text-foreground group-hover:text-primary transition-colors">
          {title}
        </h3>

        <p className="text-muted-foreground leading-relaxed">{description}</p>

        <div className="mt-6 pt-6 border-t border-card-border">
          <div className="flex items-center space-x-2 text-sm text-primary">
            <div className="w-2 h-2 bg-primary rounded-full animate-pulse" />
            <span className="font-medium">Pixora AI Powered</span>
          </div>
        </div>
      </div>
    </motion.div>
  );
}

export default Features;
