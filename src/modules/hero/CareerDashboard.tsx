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
        whileInView={{ opacity: 1, x: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.8, delay: 0.3 }}
        whileHover={{ y: -5 }}
        className="bg-gradient-to-br from-slate-800/50 to-purple-900/30 rounded-2xl p-6 border border-purple-500/20 backdrop-blur-sm shadow-2xl transition-smooth"
      >
        <div className="flex items-center space-x-3 mb-4">
          <motion.div 
            animate={{ rotate: 360 }}
            transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
            className="w-10 h-10 rounded-full bg-purple-500/20 flex items-center justify-center"
          >
            <MessageSquare className="w-5 h-5 text-purple-400" />
          </motion.div>
          <div>
            <h3 className="font-semibold text-white">AI Interviewer</h3>
            <p className="text-sm text-purple-200">Google-Style Technical Interview</p>
          </div>
        </div>

        <div className="space-y-4">
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.6 }}
            className="bg-slate-700/50 rounded-lg p-4 border border-slate-600/50"
          >
            <p className="text-sm text-purple-200 mb-2">Question:</p>
            <p className="text-white italic">"Explain the time complexity of quicksort and discuss optimization techniques."</p>
          </motion.div>

          <div className="flex items-center space-x-2">
            <motion.div 
              animate={{ 
                scale: [1, 1.2, 1],
                opacity: [0.5, 1, 0.5]
              }}
              transition={{ 
                duration: 2,
                repeat: Infinity,
                ease: "easeInOut"
              }}
              className="w-3 h-3 bg-red-400 rounded-full" 
            />
            <span className="text-sm text-gray-300">AI analyzing response...</span>
          </div>

          <div className="flex space-x-2">
            <motion.button 
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="flex-1 bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-lg py-2 px-4 text-sm font-medium hover:from-purple-700 hover:to-blue-700 transition-all duration-300 shadow-lg shadow-purple-500/20"
            >
              <Mic className="w-4 h-4 inline mr-2" />
              Speak Answer
            </motion.button>
            <motion.button 
              whileHover={{ scale: 1.05, backgroundColor: "rgba(71, 85, 105, 0.8)" }}
              whileTap={{ scale: 0.95 }}
              className="bg-slate-700/50 text-gray-200 rounded-lg py-2 px-4 text-sm font-medium transition-colors border border-slate-600/50"
            >
              Type Response
            </motion.button>
          </div>
        </div>
      </motion.div>

      {/* Right Side - Performance Metrics */}
      <motion.div
        initial={{ opacity: 0, x: 50 }}
        whileInView={{ opacity: 1, x: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.8, delay: 0.5 }}
        whileHover={{ y: -5 }}
        className="bg-gradient-to-br from-slate-800/50 to-blue-900/30 rounded-2xl p-6 border border-blue-500/20 backdrop-blur-sm shadow-2xl transition-smooth"
      >
        <div className="flex items-center space-x-3 mb-6">
          <motion.div 
            animate={{ 
              y: [0, -4, 0],
            }}
            transition={{ 
              duration: 4,
              repeat: Infinity,
              ease: "easeInOut"
            }}
            className="w-10 h-10 rounded-full bg-blue-500/20 flex items-center justify-center"
          >
            <TrendingUp className="w-5 h-5 text-blue-400" />
          </motion.div>
          <div>
            <h3 className="font-semibold text-white">Performance Analytics</h3>
            <p className="text-sm text-blue-200">Real-time Feedback Dashboard</p>
          </div>
        </div>

        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Target className="w-4 h-4 text-purple-400" />
              <span className="text-sm text-gray-200">Interview Score</span>
            </div>
            <motion.span 
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: 1, duration: 0.5 }}
              className="text-lg font-bold text-purple-400"
            >
              92%
            </motion.span>
          </div>

          <div className="w-full bg-slate-700/50 rounded-full h-2 overflow-hidden">
            <motion.div 
              initial={{ width: 0 }}
              whileInView={{ width: "92%" }}
              viewport={{ once: true }}
              transition={{ duration: 1.5, delay: 0.8, ease: "easeOut" }}
              className="bg-gradient-to-r from-purple-500 via-blue-500 to-cyan-500 h-2 rounded-full shadow-glow-primary" 
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <motion.div 
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: 1.2 }}
              className="text-center p-2 rounded-xl bg-slate-800/40 border border-slate-700/50"
            >
              <div className="text-2xl font-bold text-blue-400">47</div>
              <div className="text-[10px] uppercase tracking-wider text-gray-400">Sessions</div>
            </motion.div>
            <motion.div 
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: 1.3 }}
              className="text-center p-2 rounded-xl bg-slate-800/40 border border-slate-700/50"
            >
              <div className="text-2xl font-bold text-cyan-400">18</div>
              <div className="text-[10px] uppercase tracking-wider text-gray-400">Skills</div>
            </motion.div>
          </div>

          <motion.div 
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ delay: 1.5 }}
            className="flex items-center space-x-2"
          >
            <Award className="w-4 h-4 text-yellow-400" />
            <span className="text-sm text-gray-200">Next: FAANG Senior Engineer</span>
          </motion.div>

          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            transition={{ delay: 1.6 }}
            className="bg-gradient-to-r from-purple-900/30 to-blue-900/30 rounded-xl p-3 border border-slate-600/50"
          >
            <p className="text-xs text-gray-400">Career Readiness Progress</p>
            <div className="flex items-center space-x-2 mt-1">
              <div className="flex-1 bg-slate-700 rounded-full h-1 overflow-hidden">
                <motion.div 
                  initial={{ width: 0 }}
                  whileInView={{ width: "78%" }}
                  viewport={{ once: true }}
                  transition={{ duration: 1.5, delay: 1.8, ease: "easeOut" }}
                  className="bg-gradient-to-r from-purple-500 to-blue-500 h-1 rounded-full" 
                />
              </div>
              <span className="text-xs font-medium text-gray-200">78%</span>
            </div>
          </motion.div>
        </div>
      </motion.div>
    </div>
  );
};

export default CareerDashboard;