"use client";
import React from "react";
import { motion } from "framer-motion";
import { Mic, MessageSquare, TrendingUp, Award, Target } from "lucide-react";

const CareerDashboard = () => {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 w-full max-w-6xl">
      {/* Left Side - AI Interviewer */}
      <motion.div
        initial={{ opacity: 0, x: -50 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.8, delay: 0.3 }}
        className="glass rounded-2xl p-6 border border-card-border backdrop-blur-glass"
      >
        <div className="flex items-center space-x-3 mb-4">
          <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center">
            <MessageSquare className="w-5 h-5 text-primary" />
          </div>
          <div>
            <h3 className="font-semibold text-foreground">AI Interviewer</h3>
            <p className="text-sm text-muted-foreground">Google-Style Technical Interview</p>
          </div>
        </div>

        <div className="space-y-4">
          <div className="bg-muted/50 rounded-lg p-4">
            <p className="text-sm text-muted-foreground mb-2">Question:</p>
            <p className="text-foreground">"Explain the time complexity of quicksort and discuss its worst-case scenario."</p>
          </div>

          <div className="flex items-center space-x-2">
            <div className="w-3 h-3 bg-red-500 rounded-full animate-pulse" />
            <span className="text-sm text-muted-foreground">Recording your response...</span>
          </div>

          <div className="flex space-x-2">
            <button className="flex-1 bg-primary text-background rounded-lg py-2 px-4 text-sm font-medium hover:bg-primary/90 transition-colors">
              <Mic className="w-4 h-4 inline mr-2" />
              Speak Answer
            </button>
            <button className="bg-muted text-foreground rounded-lg py-2 px-4 text-sm font-medium hover:bg-muted/80 transition-colors">
              Type Response
            </button>
          </div>
        </div>
      </motion.div>

      {/* Right Side - Performance Metrics */}
      <motion.div
        initial={{ opacity: 0, x: 50 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.8, delay: 0.5 }}
        className="glass rounded-2xl p-6 border border-card-border backdrop-blur-glass"
      >
        <div className="flex items-center space-x-3 mb-6">
          <div className="w-10 h-10 rounded-full bg-secondary/20 flex items-center justify-center">
            <TrendingUp className="w-5 h-5 text-secondary" />
          </div>
          <div>
            <h3 className="font-semibold text-foreground">Performance Dashboard</h3>
            <p className="text-sm text-muted-foreground">Your Career Progress</p>
          </div>
        </div>

        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Target className="w-4 h-4 text-primary" />
              <span className="text-sm text-foreground">Interview Score</span>
            </div>
            <span className="text-lg font-bold text-primary">87%</span>
          </div>

          <div className="w-full bg-muted rounded-full h-2">
            <div className="bg-primary h-2 rounded-full" style={{ width: "87%" }} />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-secondary">24</div>
              <div className="text-xs text-muted-foreground">Sessions Completed</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-accent">12</div>
              <div className="text-xs text-muted-foreground">Skills Mastered</div>
            </div>
          </div>

          <div className="flex items-center space-x-2">
            <Award className="w-4 h-4 text-yellow-500" />
            <span className="text-sm text-foreground">Next Milestone: Senior Developer</span>
          </div>

          <div className="bg-gradient-to-r from-primary/10 to-secondary/10 rounded-lg p-3">
            <p className="text-xs text-muted-foreground">Career Track Progress</p>
            <div className="flex items-center space-x-2 mt-1">
              <div className="flex-1 bg-muted rounded-full h-1">
                <div className="bg-gradient-to-r from-primary to-secondary h-1 rounded-full" style={{ width: "65%" }} />
              </div>
              <span className="text-xs font-medium text-foreground">65%</span>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default CareerDashboard;