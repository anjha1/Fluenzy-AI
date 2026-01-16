"use client";
import Footer from "@/components/footer";
import Features from "@/modules/features";
import Hero from "@/modules/hero";
import Pricing from "@/modules/pricing";
import AIPrecisionSection from "@/modules/hero/AIPrecisionSection";
import TargetCompaniesRibbon from "@/modules/hero/TargetCompaniesRibbon";
import TrainingShowcase from "@/modules/hero/TrainingShowcase";
import { useSession } from "next-auth/react";
import React from "react";

const Page = () => {
  const { data: session } = useSession();

  // If user is logged in, redirect to training
  if (session?.user) {
    window.location.href = "/train";
    return null;
  }

  // If not logged in, show the full landing page
  return (
    <div>
      <Hero />
      <TargetCompaniesRibbon />
      <TrainingShowcase />
      <AIPrecisionSection />
      <Features />
      <Pricing />
      <Footer />
    </div>
  );
};

export default Page;
