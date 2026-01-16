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
    <section className="py-12 bg-muted/30">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="text-center mb-8"
        >
          <h3 className="text-lg font-semibold text-muted-foreground mb-2">
            Trusted By Leading Companies
          </h3>
          <p className="text-sm text-muted-foreground">
            Prepare for interviews at top-tier organizations worldwide
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
              <div className="text-4xl group-hover:scale-110 transition-transform duration-300">
                {company.logo}
              </div>
              <span className="text-sm font-medium text-muted-foreground group-hover:text-foreground transition-colors">
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