"use client";
import React from "react";
import { motion } from "framer-motion";
import { Heart, Sparkles, BookOpen, MessageSquare, UserPlus, Code, Building2, Users } from "lucide-react";

const Footer = () => {
  return (
    <footer className="py-16 border-t border-card-border relative overflow-hidden bg-gradient-to-b from-background to-muted/5">
      {/* Background Effect */}
      <div className="absolute inset-0 bg-gradient-to-t from-muted/10 to-transparent" />

      <div className="container mx-auto px-4 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="text-center mb-12"
        >
          {/* Logo */}
          <div className="flex items-center justify-center space-x-2 mb-4">
            <div className="relative">
              <Sparkles className="h-10 w-10 text-primary animate-glow-pulse" />
              <div className="absolute inset-0 h-10 w-10 text-secondary animate-glow-pulse opacity-50" />
            </div>
            <div>
              <h2 className="text-3xl font-bold bg-gradient-primary !bg-clip-text text-transparent">
                Pixora AI — Training Module
              </h2>
              <p className="text-sm text-muted-foreground">Powered by AI Magic</p>
            </div>
          </div>

          {/* Main Description */}
          <p className="text-muted-foreground mb-12 max-w-4xl mx-auto leading-relaxed">
            Experience a next-generation AI-powered training ecosystem built exclusively for interview preparation, communication mastery, and group discussion simulations. Pixora AI Training Module delivers realistic practice environments, personalized scenarios, and actionable feedback to help learners perform with confidence in real-world interviews.
          </p>
        </motion.div>

        {/* Training Capabilities */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="mb-12"
        >
          <h3 className="text-2xl font-bold text-center mb-8 text-foreground">Training Capabilities</h3>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              { icon: BookOpen, title: "English Learning", desc: "Personalized speaking practice with real-time grammar and fluency feedback." },
              { icon: MessageSquare, title: "Daily Conversation", desc: "Practice professional office communication, teamwork, and small talk scenarios." },
              { icon: UserPlus, title: "HR Interview Coach", desc: "AI-simulated HR interviews focused on behavioral and situational questions." },
              { icon: Code, title: "Technical Mastery", desc: "Role-based technical rounds covering concepts, logic, and project discussions." },
              { icon: Building2, title: "Company Tracks", desc: "Company-specific interview preparation for FAANG, startups, and MNCs." },
              { icon: Users, title: "GD Agent", desc: "AI-powered group discussions with role-based evaluation and performance scoring." }
            ].map((item, index) => (
              <div key={index} className="text-center p-4 rounded-lg bg-card/50 border border-card-border hover:border-primary/50 transition-colors">
                <item.icon className="h-8 w-8 mx-auto mb-3 text-primary" />
                <h4 className="font-semibold mb-2 text-foreground">{item.title}</h4>
                <p className="text-sm text-muted-foreground">{item.desc}</p>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Why Pixora AI Training */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.4 }}
          className="mb-12"
        >
          <h3 className="text-2xl font-bold text-center mb-8 text-foreground">Why Pixora AI Training?</h3>
          <div className="flex flex-wrap justify-center gap-4 text-sm text-muted-foreground">
            <span className="px-3 py-1 bg-primary/10 rounded-full">Adaptive AI simulations</span>
            <span className="px-3 py-1 bg-primary/10 rounded-full">Resume-driven personalization</span>
            <span className="px-3 py-1 bg-primary/10 rounded-full">Realistic interview pressure</span>
            <span className="px-3 py-1 bg-primary/10 rounded-full">Structured performance reports</span>
            <span className="px-3 py-1 bg-primary/10 rounded-full">Industry-ready preparation</span>
          </div>
        </motion.div>

        {/* Advanced AI Training Features */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.6 }}
          className="text-center mb-12"
        >
          <h3 className="text-2xl font-bold mb-4 text-foreground">Advanced AI Training Features</h3>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Designed for students, job seekers, and professionals preparing for real interview success.
          </p>
        </motion.div>

        {/* Made with love */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.8 }}
          className="text-center mb-8"
        >
          <div className="flex items-center justify-center space-x-2 text-muted-foreground">
            <span>Made with</span>
            <Heart className="h-5 w-5 text-red-500 animate-pulse" />
            <span>for learners</span>
          </div>
        </motion.div>

        {/* Copyright */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 1.0 }}
          className="pt-8 border-t border-card-border text-center"
        >
          <p className="text-sm text-muted-foreground">
            © 2025 Pixora AI. All rights reserved.
          </p>
        </motion.div>
      </div>
    </footer>
  );
};

export default Footer;
