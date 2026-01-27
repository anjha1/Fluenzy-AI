import type { Metadata } from "next";
import Features from "@/modules/features";
import Footer from "@/components/footer";
import HeaderOffset from "@/components/HeaderOffset";

export const metadata: Metadata = {
  title: "FluenzyAI Features: AI Interview & English Training",
  description: "Explore FluenzyAI's comprehensive features for AI-powered interview preparation and English fluency. Master HR interviews, technical questions, group discussions, and spoken English with advanced AI coaching.",
  keywords: "AI interview practice, mock interview AI, group discussion AI, English speaking practice with AI, HR interview preparation, technical interview practice",
  openGraph: {
    title: "FluenzyAI Features: AI Interview & English Training",
    description: "Explore FluenzyAI's comprehensive features for AI-powered interview preparation and English fluency.",
    url: "https://www.fluenzyai.app/features",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "FluenzyAI Features: AI Interview & English Training",
    description: "Explore FluenzyAI's comprehensive features for AI-powered interview preparation and English fluency.",
  },
};

export default function FeaturesPage() {
  return (
    <div className="min-h-screen">
      <HeaderOffset />
      <section className="py-16 bg-gradient-to-b from-slate-900 to-slate-800">
        <div className="container mx-auto px-4">
          <h1 className="text-3xl lg:text-5xl font-bold text-center mb-6">
            <span className="text-white">FluenzyAI </span>
            <span className="bg-gradient-to-r from-purple-400 via-blue-400 to-cyan-400 !bg-clip-text text-transparent">
              Features
            </span>
          </h1>
          <p className="text-lg text-slate-300 text-center max-w-2xl mx-auto">
            Discover powerful AI-driven tools designed to accelerate your career growth through intelligent interview preparation and English fluency training.
          </p>
        </div>
      </section>
      <div className="mb-16">
        <Features />
      </div>
      <Footer />
    </div>
  );
}