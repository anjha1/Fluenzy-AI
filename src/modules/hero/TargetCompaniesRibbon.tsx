"use client";
import React from "react";
import { motion } from "framer-motion";

const companies = [
  { name: "Google", logo: "/companeyicon/Google-Logo.wine.svg" },
  { name: "Amazon", logo: "/companeyicon/Amazon_(company)-Logo.wine.svg" },
  { name: "Microsoft", logo: "/companeyicon/Microsoft-Logo.wine.svg" },
  { name: "Meta", logo: "/companeyicon/Meta_Platforms-Logo.wine.svg" },
  { name: "Flipkart", logo: "/companeyicon/Flipkart-Logo.wine.svg" },
  { name: "TCS", logo: "/companeyicon/1280px-Tata_Consultancy_Services_old_logo.svg.webp" },
  { name: "Apple", logo: "/companeyicon/Apple_Inc.-Logo.wine.svg" },
  { name: "Capgemini", logo: "/companeyicon/Capgemini-Logo.wine.svg" },
  { name: "Infosys", logo: "/companeyicon/Infosys_Consulting-Logo.wine.svg" },
  { name: "Nvidia", logo: "/companeyicon/Nvidia-Logo.wine.svg" },
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
              <img
                src={company.logo}
                alt={company.name}
                className="h-8 w-auto transition-all duration-300 group-hover:scale-110"
              />
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