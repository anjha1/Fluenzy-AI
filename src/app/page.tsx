"use client";
import AdvancedFeatures from "@/modules/advanced-features";
import Footer from "@/components/footer";
import Features from "@/modules/features";
import FeedbackSection from "@/modules/feedback";
import Hero from "@/modules/hero";
import Pricing from "@/modules/pricing";
import TrustSection from "@/modules/trust";
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
      <TrustSection />
      <TargetCompaniesRibbon />
      <TrainingShowcase />
      <Features />
      <FeedbackSection />
      <AdvancedFeatures />
      <Pricing />
      <Footer />
    </div>
  );
};

export default Page;
