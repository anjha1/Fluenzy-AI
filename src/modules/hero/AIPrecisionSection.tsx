"use client";
import React from "react";
import { motion } from "framer-motion";
import { Zap, Target, Brain } from "lucide-react";
import BeforeAfterSlider from "./BeforeAfterSlider";

const AIPrecisionSection = () => {
  return (
    <section className="py-24 relative overflow-hidden bg-gradient-to-b from-slate-800 to-slate-900">
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
          <div className="inline-flex items-center space-x-2 bg-gradient-to-r from-purple-900/50 to-blue-900/50 rounded-full px-6 py-3 mb-6 border border-purple-500/30 backdrop-blur-sm">
            <Brain className="h-5 w-5 text-purple-400" />
            <span className="font-medium text-purple-200">AI Precision in Action</span>
          </div>

          <h2 className="text-4xl lg:text-6xl font-bold mb-6">
            <span className="text-white">See AI Intelligence </span>
            <span className="bg-gradient-to-r from-purple-400 via-blue-400 to-cyan-400 !bg-clip-text text-transparent">
              Transform Reality
            </span>
          </h2>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto mb-12">
            Experience the same AI precision that powers our interview training - analyzing details, providing real-time feedback, and achieving flawless results.
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

          {/* AI Precision Points */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="space-y-8"
          >
            <div className="flex items-start space-x-4">
              <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-purple-500 to-blue-500 flex items-center justify-center flex-shrink-0">
                <Target className="w-6 h-6 text-white" />
              </div>
              <div>
                <h3 className="text-xl font-bold text-white mb-2">Real-Time Analysis</h3>
                <p className="text-gray-300">Just like our interview AI analyzes your responses instantly, our image AI processes visual data with precision and speed.</p>
              </div>
            </div>

            <div className="flex items-start space-x-4">
              <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-blue-500 to-cyan-500 flex items-center justify-center flex-shrink-0">
                <Zap className="w-6 h-6 text-white" />
              </div>
              <div>
                <h3 className="text-xl font-bold text-white mb-2">Intelligent Adaptation</h3>
                <p className="text-gray-300">Our AI adapts to complex scenarios, whether it's understanding interview context or recognizing intricate visual patterns.</p>
              </div>
            </div>

            <div className="flex items-start space-x-4">
              <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-cyan-500 to-purple-500 flex items-center justify-center flex-shrink-0">
                <Brain className="w-6 h-6 text-white" />
              </div>
              <div>
                <h3 className="text-xl font-bold text-white mb-2">Contextual Understanding</h3>
                <p className="text-gray-300">Deep learning models that understand context - from behavioral cues in interviews to semantic meaning in visual content.</p>
              </div>
            </div>
          </motion.div>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.4 }}
          className="text-center"
        >
          <div className="bg-gradient-to-r from-slate-800/50 to-slate-700/50 rounded-2xl p-8 border border-slate-600/30 backdrop-blur-sm max-w-4xl mx-auto">
            <h3 className="text-2xl font-bold text-white mb-4">The Same AI Power</h3>
            <p className="text-gray-300 mb-6">
              The advanced AI that delivers 95%+ accuracy in interview analysis brings the same level of intelligence to visual processing and creative tasks.
            </p>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-center">
              <div>
                <div className="text-3xl font-bold text-purple-400 mb-2">99.5%</div>
                <div className="text-sm text-gray-400">Processing Accuracy</div>
              </div>
              <div>
                <div className="text-3xl font-bold text-blue-400 mb-2">2s</div>
                <div className="text-sm text-gray-400">Response Time</div>
              </div>
              <div>
                <div className="text-3xl font-bold text-cyan-400 mb-2">∞</div>
                <div className="text-sm text-gray-400">Creative Possibilities</div>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default AIPrecisionSection;