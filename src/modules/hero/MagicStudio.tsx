"use client";
import React from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Scissors, Expand, Type, Zap, Crop } from "lucide-react";
import BeforeAfterSlider from "./BeforeAfterSlider";

const tools = [
  {
    name: "Remove Background",
    icon: Scissors,
    description: "AI-powered background removal",
  },
  {
    name: "Change Background",
    icon: Expand,
    description: "Replace backgrounds instantly",
  },
  {
    name: "AI Edit",
    icon: Type,
    description: "Edit with text prompts",
  },
  {
    name: "Generative Fill",
    icon: Zap,
    description: "Fill empty areas with AI",
  },
  {
    name: "Smart Crop",
    icon: Crop,
    description: "Intelligent cropping",
  },
];

const MagicStudio = () => {
  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <section id="magic-studio" className="py-24 relative overflow-hidden">
      {/* Background effects */}
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-primary/10 rounded-full blur-3xl" />
      <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-secondary/10 rounded-full blur-3xl" />

      <div className="container mx-auto px-4 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="text-center mb-16"
        >
          <div className="inline-flex items-center space-x-2 bg-gradient-glass rounded-full px-6 py-3 mb-6 glass border border-card-border">
            <Zap className="h-5 w-5 text-primary" />
            <span className="font-medium">Magic Studio</span>
          </div>

          <h2 className="text-4xl lg:text-6xl font-bold mb-6">
            <span className="text-foreground">The Magic Studio: </span>
            <span className="bg-gradient-primary !bg-clip-text text-transparent">
              Professional AI Editing
            </span>
            <br />
            <span className="text-foreground">at Your Fingertips</span>
          </h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Transform your photos with cutting-edge AI tools. Remove backgrounds, enhance quality, and create stunning visuals in seconds.
          </p>
        </motion.div>

        <div className="grid lg:grid-cols-2 gap-12 items-center mb-16">
          {/* Before/After Slider */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
          >
            <BeforeAfterSlider />
          </motion.div>

          {/* Tools Grid */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="grid grid-cols-2 gap-4"
          >
            {tools.map((tool, index) => (
              <motion.div
                key={tool.name}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="glass rounded-xl p-6 border border-card-border hover:border-primary/30 transition-colors group"
              >
                <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-primary/20 to-secondary/20 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                  <tool.icon className="w-6 h-6 text-primary" />
                </div>
                <h3 className="font-semibold text-foreground mb-2">{tool.name}</h3>
                <p className="text-sm text-muted-foreground">{tool.description}</p>
              </motion.div>
            ))}
          </motion.div>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.4 }}
          className="text-center"
        >
          <Button
            variant="hero"
            size="lg"
            onClick={() => scrollToSection("editor")}
            className="group"
          >
            <Zap className="h-5 w-5 mr-2 group-hover:animate-pulse" />
            Try Magic Studio Now
          </Button>
        </motion.div>
      </div>
    </section>
  );
};

export default MagicStudio;