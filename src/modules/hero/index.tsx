"use client";
import React from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Play, Sparkles, ArrowRight } from "lucide-react";
import CareerDashboard from "./CareerDashboard";
import Link from "next/link";

const Hero = () => {
  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <section
      id="hero"
      className="relative min-h-screen flex items-center justify-center overflow-hidden pt-20 bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900"
    >
      {/* Background Gradient */}
      <div className="absolute inset-0 bg-gradient-to-br from-slate-900/80 via-purple-900/60 to-slate-900/80" />

      {/* Floating orbs */}
      <div className="absolute top-20 left-10 w-64 h-64 bg-purple-500/20 rounded-full blur-3xl animate-float" />
      <div
        className="absolute bottom-20 right-10 w-96 h-96 bg-blue-500/20 rounded-full blur-3xl animate-float"
        style={{ animationDelay: "-1s" }}
      />
      <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-cyan-500/10 rounded-full blur-3xl animate-pulse" />

      <div className="container mx-auto px-4 grid lg:grid-cols-2 gap-12 items-center relative z-10">
        {/* Left Content */}
        <motion.div
          initial={{ opacity: 0, x: -50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8 }}
          className="text-center lg:text-left"
        >
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="inline-flex items-center space-x-2 bg-gradient-to-r from-purple-900/50 to-blue-900/50 rounded-full px-6 py-3 mb-6 border border-purple-500/30 backdrop-blur-sm"
          >
            <Sparkles className="h-5 w-5 text-purple-400" />
            <span className="text-sm font-medium text-purple-200">AI-Powered Interview Training</span>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="text-3xl lg:text-5xl font-bold leading-tight mb-3"
          >
            <span className="text-white">Train Smarter.</span>
            <br />
            <span className="bg-gradient-to-r from-purple-400 via-blue-400 to-cyan-400 !bg-clip-text text-transparent">
              Crack FAANG Interviews
            </span>
            <br />
            <span className="text-white">with AI.</span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="text-base text-gray-300 mb-4 max-w-xl"
          >
            AI Interviewer • HR + Technical + GD Training • Real-time analytics
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="flex flex-col sm:flex-row gap-3 justify-center lg:justify-start"
          >
            <Button
              size="sm"
              asChild
              className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white font-semibold px-4 py-2 rounded-md shadow-md hover:shadow-purple-500/30 transition-all duration-300 glow-effect"
            >
              <Link href="/train">
                <Play className="h-3 w-3 mr-2" />
                Train Now
              </Link>
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => scrollToSection("features")}
              className="border-purple-500/60 text-purple-200 hover:bg-purple-500/10 hover:border-purple-400 px-4 py-2 rounded-md backdrop-blur-sm transition-all duration-300"
            >
              Explore Features
              <ArrowRight className="h-3 w-3 ml-2" />
            </Button>
          </motion.div>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.6 }}
            className="mt-8 flex items-center justify-center lg:justify-start space-x-6 text-sm text-gray-400"
          >
            <div className="flex items-center space-x-2">
              <div className="w-2 h-2 bg-purple-400 rounded-full animate-pulse" />
              <span>AI Interviewer & GD Agent</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-2 h-2 bg-blue-400 rounded-full animate-pulse" />
              <span>Real-time Performance Analytics</span>
            </div>
          </motion.div>
        </motion.div>

        {/* Right Content - Career Dashboard */}
        <motion.div
          initial={{ opacity: 0, x: 50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="flex justify-center"
        >
          <CareerDashboard />
        </motion.div>
      </div>
    </section>
  );
};

export default Hero;
