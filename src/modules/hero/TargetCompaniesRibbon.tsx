"use client";
import React from "react";
import { motion } from "framer-motion";

const companies = [
  { name: "Google", logo: "https://upload.wikimedia.org/wikipedia/commons/2/2f/Google_2015_logo.svg" },
  { name: "Amazon", logo: "https://upload.wikimedia.org/wikipedia/commons/a/a9/Amazon_logo.svg" },
  { name: "Microsoft", logo: "https://upload.wikimedia.org/wikipedia/commons/9/96/Microsoft_logo_%282012%29.svg" },
  { name: "Meta", logo: "https://upload.wikimedia.org/wikipedia/commons/7/7b/Meta_Platforms_Inc._logo.svg" },
  { name: "Netflix", logo: "https://upload.wikimedia.org/wikipedia/commons/0/08/Netflix_2015_logo.svg" },
  { name: "Apple", logo: "https://upload.wikimedia.org/wikipedia/commons/f/fa/Apple_logo_black.svg" },
];

const TargetCompaniesRibbon = () => {
  return (
    <section className="py-16 bg-gradient-to-r from-slate-900 via-purple-900/20 to-slate-900 border-y border-slate-700/50">
      <div className="max-w-[1440px] mx-auto px-6 md:px-12">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="text-center mb-10"
        >
          <h3 className="text-2xl md:text-3xl font-black mb-3">
            <span className="bg-gradient-to-r from-purple-400 via-blue-400 to-cyan-400 !bg-clip-text text-transparent">
              Trusted By FAANG & Top Tech Companies
            </span>
          </h3>
          <p className="text-base text-gray-300 font-medium max-w-2xl mx-auto">
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
              className="flex flex-col items-center space-y-3 group"
            >
              <div className="h-10 flex items-center justify-center">
                <img
                  src={company.logo}
                  alt={company.name}
                  className={`h-8 w-auto transition-all duration-300 group-hover:scale-110 ${
                    company.name === "Apple" ? "invert brightness-200" : ""
                  } ${
                    company.name === "Amazon" ? "brightness-0 invert group-hover:brightness-100 group-hover:invert-0" : ""
                  }`}
                />
              </div>
              <span className="text-xs font-bold text-gray-400 uppercase tracking-widest group-hover:text-white transition-colors">
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