import type { Metadata } from "next";
import Pricing from "@/modules/pricing";
import Footer from "@/components/footer";

export const metadata: Metadata = {
  title: "Pricing - FluenzyAI: AI Interview Coach & English Practice",
  description: "Select the ideal FluenzyAI plan for AI-driven interview preparation and English fluency training. Flexible pricing for HR interviews, technical mock tests, group discussions, and career advancement.",
  keywords: "AI interview coach, interview preparation platform, spoken English for jobs, career growth using AI",
  openGraph: {
    title: "Pricing - FluenzyAI: AI Interview Coach & English Practice",
    description: "Select the ideal FluenzyAI plan for AI-driven interview preparation and English fluency training.",
    url: "https://www.fluenzyai.app/pricing",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Pricing - FluenzyAI: AI Interview Coach & English Practice",
    description: "Select the ideal FluenzyAI plan for AI-driven interview preparation and English fluency training.",
  },
};

export default function PricingPage() {
  return (
    <div className="min-h-screen">
      <section className="pt-32 pb-12 bg-gradient-to-b from-slate-900 to-slate-800">
        <div className="container mx-auto px-4">
          <h1 className="text-4xl lg:text-6xl font-bold text-center mb-4">
            <span className="text-white">FluenzyAI </span>
            <span className="bg-gradient-to-r from-purple-400 via-blue-400 to-cyan-400 !bg-clip-text text-transparent">
              Pricing Plans
            </span>
          </h1>
          <p className="text-xl text-slate-300 text-center max-w-3xl mx-auto leading-relaxed">
            Select the ideal plan to unlock unlimited AI-powered interview preparation and English fluency training. Start free and upgrade as you progress toward career success.
          </p>
        </div>
      </section>
      <Pricing />
      <Footer />
    </div>
  );
}