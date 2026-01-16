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
        className="bg-gradient-to-br from-slate-800/50 to-purple-900/30 rounded-2xl p-6 border border-purple-500/20 backdrop-blur-sm shadow-2xl"
      >
        <div className="flex items-center space-x-3 mb-4">
          <div className="w-10 h-10 rounded-full bg-purple-500/20 flex items-center justify-center">
            <MessageSquare className="w-5 h-5 text-purple-400" />
          </div>
          <div>
            <h3 className="font-semibold text-white">AI Interviewer</h3>
            <p className="text-sm text-purple-200">Google-Style Technical Interview</p>
          </div>
        </div>

        <div className="space-y-4">
          <div className="bg-slate-700/50 rounded-lg p-4 border border-slate-600/50">
            <p className="text-sm text-purple-200 mb-2">Question:</p>
            <p className="text-white">"Explain the time complexity of quicksort and discuss optimization techniques."</p>
          </div>

          <div className="flex items-center space-x-2">
            <div className="w-3 h-3 bg-red-400 rounded-full animate-pulse" />
            <span className="text-sm text-gray-300">AI analyzing response...</span>
          </div>

          <div className="flex space-x-2">
            <button className="flex-1 bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-lg py-2 px-4 text-sm font-medium hover:from-purple-700 hover:to-blue-700 transition-all duration-300">
              <Mic className="w-4 h-4 inline mr-2" />
              Speak Answer
            </button>
            <button className="bg-slate-700/50 text-gray-200 rounded-lg py-2 px-4 text-sm font-medium hover:bg-slate-600/50 transition-colors border border-slate-600/50">
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
        className="bg-gradient-to-br from-slate-800/50 to-blue-900/30 rounded-2xl p-6 border border-blue-500/20 backdrop-blur-sm shadow-2xl"
      >
        <div className="flex items-center space-x-3 mb-6">
          <div className="w-10 h-10 rounded-full bg-blue-500/20 flex items-center justify-center">
            <TrendingUp className="w-5 h-5 text-blue-400" />
          </div>
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
            <span className="text-lg font-bold text-purple-400">92%</span>
          </div>

          <div className="w-full bg-slate-700 rounded-full h-2">
            <div className="bg-gradient-to-r from-purple-500 to-blue-500 h-2 rounded-full" style={{ width: "92%" }} />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-400">47</div>
              <div className="text-xs text-gray-400">Sessions Completed</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-cyan-400">18</div>
              <div className="text-xs text-gray-400">Skills Mastered</div>
            </div>
          </div>

          <div className="flex items-center space-x-2">
            <Award className="w-4 h-4 text-yellow-400" />
            <span className="text-sm text-gray-200">Next: FAANG Senior Engineer</span>
          </div>

          <div className="bg-gradient-to-r from-purple-900/30 to-blue-900/30 rounded-lg p-3 border border-slate-600/50">
            <p className="text-xs text-gray-400">Career Readiness Progress</p>
            <div className="flex items-center space-x-2 mt-1">
              <div className="flex-1 bg-slate-700 rounded-full h-1">
                <div className="bg-gradient-to-r from-purple-500 to-blue-500 h-1 rounded-full" style={{ width: "78%" }} />
              </div>
              <span className="text-xs font-medium text-gray-200">78%</span>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default CareerDashboard;