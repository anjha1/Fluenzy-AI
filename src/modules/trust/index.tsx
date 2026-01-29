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

const TrustSection = () => {
  return (
    <div className="py-10 bg-slate-950 border-y border-slate-800 overflow-hidden relative">
      <div className="text-center mb-6">
        <p className="inline-block bg-gradient-to-r from-purple-400 via-blue-400 to-cyan-400 !bg-clip-text text-transparent text-sm uppercase tracking-widest font-black">
          Trusted by FAANG & Top Tech Companies
        </p>
      </div>

      {/* Gradient Overlay for Fade Effect */}
      <div className="absolute top-0 left-0 w-20 h-full bg-gradient-to-r from-slate-950 to-transparent z-10"></div>
      <div className="absolute top-0 right-0 w-20 h-full bg-gradient-to-l from-slate-950 to-transparent z-10"></div>

      {/* Marquee Container */}
      <div className="flex w-full overflow-hidden">
        <motion.div
          className="flex gap-16 items-center whitespace-nowrap"
          animate={{ x: ["0%", "-50%"] }}
          transition={{
            repeat: Infinity,
            ease: "linear",
            duration: 20, // Adjust speed here
          }}
        >
          {/* Double the list to create seamless loop */}
          {[...companies, ...companies].map((company, index) => (
            <div key={index} className="flex items-center justify-center min-w-[120px]">
              <img
                src={company.logo}
                alt={company.name}
                className={`h-8 w-auto opacity-50 grayscale hover:grayscale-0 hover:opacity-100 transition-all duration-300 cursor-pointer ${
                  company.name === "Apple" ? "invert brightness-200" : ""
                } ${
                  company.name === "Amazon" ? "invert brightness-200 hover:invert-0 hover:brightness-100" : ""
                }`}
              />
            </div>
          ))}
        </motion.div>
      </div>
    </div>
  );
};

export default TrustSection;