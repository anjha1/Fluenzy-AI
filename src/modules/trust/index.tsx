"use client";
import React from "react";
import { motion } from "framer-motion";
import Card3D from "@/components/ui/Card3D";

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

const TrustSection = () => {
  return (
    <section className="relative overflow-hidden bg-slate-950 py-20 md:py-24">
      <div className="absolute left-1/2 top-1/2 h-2/3 w-full -translate-x-1/2 -translate-y-1/2 bg-purple-500/5 blur-[120px]" />

      <div className="container relative z-10 mx-auto px-4 md:px-8 xl:px-16">
        <motion.div
          initial={{ opacity: 0, y: 18 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.55 }}
          className="mb-10 text-center md:mb-12"
        >
          <h3 className="mb-4 text-xs font-bold uppercase tracking-[0.3em] text-slate-400 sm:text-sm">
            Trusted by FAANG & Top Tech Companies
          </h3>
          <p className="mx-auto max-w-2xl text-base text-slate-400 md:text-lg">
            Candidates from these companies use Fluenzy AI to master their communication and technical depth.
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="mobile-logo-rail"
        >
          <div className="mobile-logo-track mobile-logo-track-ltr">
            {[...companies, ...companies].map((company, index) => (
              <div key={`${company.name}-${index}`} className="group relative mx-2 shrink-0">
                <Card3D depth={25} glowColor="rgba(168, 85, 247, 0.3)">
                  <div className="flex h-24 w-44 md:h-28 md:w-52 items-center justify-center rounded-2xl border border-white/10 bg-slate-900/60 px-4 backdrop-blur-md transition-all duration-300 group-hover:border-purple-500/40 group-hover:bg-slate-900/90 shadow-xl">
                    <img
                      src={company.logo}
                      alt={company.name}
                      loading="lazy"
                      className={`h-10 md:h-12 w-auto object-contain transition-transform duration-300 group-hover:scale-110 ${
                        company.name === "Apple" || company.name === "Amazon" ? "invert brightness-200" : "brightness-125"
                      }`}
                    />
                  </div>
                </Card3D>
                <span className="mt-3 block text-center text-[11px] font-bold uppercase tracking-[0.22em] text-slate-500">
                  {company.name}
                </span>
              </div>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default TrustSection;
