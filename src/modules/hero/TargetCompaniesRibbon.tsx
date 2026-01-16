"use client";
import React from "react";
import { motion } from "framer-motion";

const companies = [
  { name: "Google", logo: "🟦" }, // Using emojis for simplicity, can replace with actual logos
  { name: "Amazon", logo: "🟨" },
  { name: "Microsoft", logo: "🟩" },
  { name: "Meta", logo: "🔵" },
  { name: "Netflix", logo: "🔴" },
  { name: "Apple", logo: "⚫" },
];

const TargetCompaniesRibbon = () => {
  return (
    <section className="py-16 bg-gradient-to-r from-slate-900 via-purple-900/20 to-slate-900 border-y border-slate-700/50">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="text-center mb-8"
        >
          <h3 className="text-xl font-semibold text-white mb-2">
            Trusted By FAANG & Top Tech Companies
          </h3>
          <p className="text-sm text-gray-300">
            Join thousands preparing for interviews at the world's leading technology companies
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="flex flex-wrap justify-center items-center gap-8 md:gap-12"
        >
          {companies.map((company, index) => (
            <motion.div
              key={company.name}
              initial={{ opacity: 0, scale: 0.8 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="flex flex-col items-center space-y-2 group"
            >
              <div className="text-5xl group-hover:scale-110 transition-transform duration-300 filter drop-shadow-lg">
                {company.logo}
              </div>
              <span className="text-sm font-medium text-gray-300 group-hover:text-white transition-colors">
                {company.name}
              </span>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
};

export default TargetCompaniesRibbon;