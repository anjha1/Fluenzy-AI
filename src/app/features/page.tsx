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
      <section className="pt-12 pb-8 bg-gradient-to-b from-slate-900 to-slate-800">
        <div className="container mx-auto px-4">
          <h1 className="text-4xl lg:text-6xl font-bold text-center mb-4">
            <span className="text-white">FluenzyAI </span>
            <span className="bg-gradient-to-r from-purple-400 via-blue-400 to-cyan-400 !bg-clip-text text-transparent">
              Features
            </span>
          </h1>
          <p className="text-xl text-slate-300 text-center max-w-4xl mx-auto leading-relaxed mb-8">
            Unlock the power of AI to accelerate your career with FluenzyAI’s intelligent training ecosystem. From interview mastery to English fluency, our advanced AI-powered modules are designed for real-world success. Each module offers specialized, personalized training paths that adapt to your learning style, delivering focused, intensive practice to help you progress faster and build lasting confidence.
          </p>
        </div>
      </section>
      <div className="relative">
        <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-slate-700 to-transparent"></div>
        <Features />
      </div>
      <Footer />
    </div>
  );
}