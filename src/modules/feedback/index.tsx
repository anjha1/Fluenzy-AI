"use client";
import React from "react";
import { motion } from "framer-motion";
import { CheckCircle, Clock, Zap } from "lucide-react";

const FeedbackSection = () => {
  return (
    <section className="py-16 relative overflow-hidden">
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
          <h2 className="text-2xl lg:text-4xl font-bold mb-4">
            <span className="text-white">Real-Time AI </span>
            <span className="bg-gradient-to-r from-purple-400 via-blue-400 to-cyan-400 !bg-clip-text text-transparent">
              Feedback & Analytics
            </span>
          </h2>
          <p className="text-base text-gray-300 max-w-2xl mx-auto">
            Get instant scoring, detailed benchmarks, and actionable insights to improve your interview performance.
          </p>
        </motion.div>

        <div className="max-w-4xl mx-auto">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="glass rounded-2xl p-8 border border-card-border/50 shadow-xl relative overflow-hidden"
          >
            {/* Background glow */}
            <div className="absolute inset-0 bg-gradient-to-br from-purple-500/5 to-blue-500/5 rounded-3xl" />

            <div className="relative z-10 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {/* Accuracy Rate */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.8, delay: 0.4 }}
                whileHover={{ scale: 1.05, y: -5 }}
                className="group"
              >
                <div className="glass rounded-xl p-6 border border-card-border/50 hover:border-green-500/60 transition-all duration-300 shadow-lg hover:shadow-green-500/20 relative overflow-hidden">
                  <div className="absolute inset-0 bg-gradient-to-br from-green-500/5 to-emerald-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-xl" />
                  <div className="relative z-10 text-center">
                    <div className="relative mb-4">
                      <div className="w-12 h-12 mx-auto rounded-lg bg-gradient-to-br from-green-500 to-emerald-500 p-3 shadow-md">
                        <CheckCircle className="w-full h-full text-white" />
                      </div>
                    </div>
                    <div className="text-2xl font-bold text-white mb-2">95%</div>
                    <div className="text-sm font-semibold text-green-400 mb-2">Accuracy Rate</div>
                    <div className="text-xs text-gray-300">Industry-leading precision in evaluation</div>
                  </div>
                </div>
              </motion.div>

              {/* 24/7 Availability */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.8, delay: 0.6 }}
                whileHover={{ scale: 1.05, y: -5 }}
                className="group"
              >
                <div className="glass rounded-xl p-6 border border-card-border/50 hover:border-blue-500/60 transition-all duration-300 shadow-lg hover:shadow-blue-500/20 relative overflow-hidden">
                  <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 to-cyan-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-xl" />
                  <div className="relative z-10 text-center">
                    <div className="relative mb-4">
                      <div className="w-12 h-12 mx-auto rounded-lg bg-gradient-to-br from-blue-500 to-cyan-500 p-3 shadow-md">
                        <Clock className="w-full h-full text-white" />
                      </div>
                    </div>
                    <div className="text-2xl font-bold text-white mb-2">24/7</div>
                    <div className="text-sm font-semibold text-blue-400 mb-2">Always Available</div>
                    <div className="text-xs text-gray-300">Practice anytime with AI</div>
                  </div>
                </div>
              </motion.div>

              {/* Unlimited Sessions */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.8, delay: 0.8 }}
                whileHover={{ scale: 1.05, y: -5 }}
                className="group"
              >
                <div className="glass rounded-xl p-6 border border-card-border/50 hover:border-purple-500/60 transition-all duration-300 shadow-lg hover:shadow-purple-500/20 relative overflow-hidden">
                  <div className="absolute inset-0 bg-gradient-to-br from-purple-500/5 to-pink-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-xl" />
                  <div className="relative z-10 text-center">
                    <div className="relative mb-4">
                      <div className="w-12 h-12 mx-auto rounded-lg bg-gradient-to-br from-purple-500 to-pink-500 p-3 shadow-md">
                        <Zap className="w-full h-full text-white" />
                      </div>
                    </div>
                    <div className="text-2xl font-bold text-white mb-2">∞</div>
                    <div className="text-sm font-semibold text-purple-400 mb-2">Unlimited Sessions</div>
                    <div className="text-xs text-gray-300">Practice without limits</div>
                  </div>
                </div>
              </motion.div>

              {/* Instant Feedback */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.8, delay: 1.0 }}
                whileHover={{ scale: 1.05, y: -5 }}
                className="group"
              >
                <div className="glass rounded-xl p-6 border border-card-border/50 hover:border-amber-500/60 transition-all duration-300 shadow-lg hover:shadow-amber-500/20 relative overflow-hidden">
                  <div className="absolute inset-0 bg-gradient-to-br from-amber-500/5 to-orange-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-xl" />
                  <div className="relative z-10 text-center">
                    <div className="relative mb-4">
                      <div className="w-12 h-12 mx-auto rounded-lg bg-gradient-to-br from-amber-500 to-orange-500 p-3 shadow-md">
                        <Zap className="w-full h-full text-white" />
                      </div>
                    </div>
                    <div className="text-2xl font-bold text-white mb-2">{"< 200ms"}</div>
                    <div className="text-sm font-semibold text-amber-400 mb-2">Instant Feedback</div>
                    <div className="text-xs text-gray-300">Zero latency real-time voice analysis</div>
                  </div>
                </div>
              </motion.div>

              {/* Behavioral Metrics */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.8, delay: 1.2 }}
                whileHover={{ scale: 1.05, y: -5 }}
                className="group"
              >
                <div className="glass rounded-xl p-6 border border-card-border/50 hover:border-pink-500/60 transition-all duration-300 shadow-lg hover:shadow-pink-500/20 relative overflow-hidden">
                  <div className="absolute inset-0 bg-gradient-to-br from-pink-500/5 to-rose-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-xl" />
                  <div className="relative z-10 text-center">
                    <div className="relative mb-4">
                      <div className="w-12 h-12 mx-auto rounded-lg bg-gradient-to-br from-pink-500 to-rose-500 p-3 shadow-md">
                        <CheckCircle className="w-full h-full text-white" />
                      </div>
                    </div>
                    <div className="text-2xl font-bold text-white mb-2">50+</div>
                    <div className="text-sm font-semibold text-pink-400 mb-2">Behavioral Metrics</div>
                    <div className="text-xs text-gray-300">Analyzes tone, pace, confidence, and filler words</div>
                  </div>
                </div>
              </motion.div>

              {/* Global Benchmarking */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.8, delay: 1.4 }}
                whileHover={{ scale: 1.05, y: -5 }}
                className="group"
              >
                <div className="glass rounded-xl p-6 border border-card-border/50 hover:border-cyan-500/60 transition-all duration-300 shadow-lg hover:shadow-cyan-500/20 relative overflow-hidden">
                  <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/5 to-sky-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-xl" />
                  <div className="relative z-10 text-center">
                    <div className="relative mb-4">
                      <div className="w-12 h-12 mx-auto rounded-lg bg-gradient-to-br from-cyan-500 to-sky-500 p-3 shadow-md">
                        <Clock className="w-full h-full text-white" />
                      </div>
                    </div>
                    <div className="text-2xl font-bold text-white mb-2">Top 1%</div>
                    <div className="text-sm font-semibold text-cyan-400 mb-2">Global Benchmarking</div>
                    <div className="text-xs text-gray-300">Compare your score with FAANG candidates</div>
                  </div>
                </div>
              </motion.div>
            </div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, delay: 1.0 }}
              className="mt-12 text-center"
            >
              <div className="inline-flex items-center space-x-2 bg-gradient-to-r from-purple-900/50 to-blue-900/50 rounded-full px-6 py-3 border border-purple-500/30 backdrop-blur-sm">
                <Zap className="h-5 w-5 text-purple-400" />
                <span className="font-medium text-purple-200">Instant scoring • Detailed benchmarks • Actionable insights</span>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default FeedbackSection;