import type { Metadata } from "next";
import Features from "@/modules/features";
import Footer from "@/components/footer";

export const metadata: Metadata = {
  title: "Features - FluenzyAI: AI Interview Coach & English Practice",
  description: "Discover FluenzyAI's advanced features: AI-powered HR interviews, technical mock interviews, group discussion practice, and English fluency training for career success.",
  keywords: "AI interview practice, mock interview AI, group discussion AI, English speaking practice with AI, HR interview preparation, technical interview practice",
  openGraph: {
    title: "Features - FluenzyAI: AI Interview Coach & English Practice",
    description: "Discover FluenzyAI's advanced features for interview and English training.",
    url: "https://www.fluenzyai.app/features",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Features - FluenzyAI: AI Interview Coach & English Practice",
    description: "Discover FluenzyAI's advanced features for interview and English training.",
  },
};

export default function FeaturesPage() {
  return (
    <div className="min-h-screen">
      <section className="py-16 bg-gradient-to-b from-slate-900 to-slate-800">
        <div className="container mx-auto px-4">
          <h1 className="text-3xl lg:text-5xl font-bold text-center mb-8">
            <span className="text-white">FluenzyAI </span>
            <span className="bg-gradient-to-r from-purple-400 via-blue-400 to-cyan-400 !bg-clip-text text-transparent">
              Features
            </span>
          </h1>
        </div>
      </section>
      <Features />
      <Footer />
    </div>
  );
}