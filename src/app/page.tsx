"use client";
import Footer from "@/components/footer";
import Editor from "@/modules/editor";
import Features from "@/modules/features";
import Hero from "@/modules/hero";
import MagicStudio from "@/modules/hero/MagicStudio";
import Pricing from "@/modules/pricing";
import TargetCompaniesRibbon from "@/modules/hero/TargetCompaniesRibbon";
import { useSession } from "next-auth/react";
import React from "react";

const Page = () => {
  const { data: session } = useSession();

  // If user is logged in, show only the Magic Studio dashboard
  if (session?.user) {
    return (
      <div>
        <Editor />
        <Footer />
      </div>
    );
  }

  // If not logged in, show the full landing page
  return (
    <div>
      <Hero />
      <TargetCompaniesRibbon />
      <MagicStudio />
      <Features />
      <Pricing />
      <Editor />
      <Footer />
    </div>
  );
};

export default Page;
