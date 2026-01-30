import type { Metadata } from "next";
import Features from "@/modules/features";
import Footer from "@/components/footer";
import HeaderOffset from "@/components/HeaderOffset";

export const metadata: Metadata = {
  title: "FluenzyAI Features: AI Interview & English Training",
  description: "Explore FluenzyAI's comprehensive features for AI-powered interview preparation and English fluency. Master HR interviews, technical questions, group discussions, and spoken English with advanced AI coaching.",
  keywords: "AI interview practice, mock interview AI, group discussion AI, English speaking practice with AI, HR interview preparation, technical interview practice",
  alternates: {
    canonical: "https://www.fluenzyai.app/features",
  },
  openGraph: {
    title: "FluenzyAI Features: AI Interview & English Training",
    description: "Explore FluenzyAI's comprehensive features for AI-powered interview preparation and English fluency.",
    url: "https://www.fluenzyai.app/features",
    type: "website",
    images: [
      {
        url: "https://www.fluenzyai.app/og-image.jpg",
        width: 1200,
        height: 630,
        alt: "FluenzyAI Features",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "FluenzyAI Features: AI Interview & English Training",
    description: "Explore FluenzyAI's comprehensive features for AI-powered interview preparation and English fluency.",
    images: ["https://www.fluenzyai.app/og-image.jpg"],
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
      <section className="bg-slate-950 text-slate-200">
        <div className="container mx-auto px-4 py-12 space-y-8">
          <nav aria-label="Breadcrumb" className="text-sm text-slate-400">
            <ol className="flex flex-wrap gap-2">
              <li>
                <a href="/" className="hover:text-slate-200">Home</a>
              </li>
              <li aria-hidden="true">/</li>
              <li className="text-slate-300">Features</li>
            </ol>
          </nav>
          <div className="space-y-4">
            <h2 className="text-2xl md:text-3xl font-semibold text-white">An AI Interview Coach built for real-world practice</h2>
            <p className="text-base leading-relaxed text-slate-300">
              FluenzyAI combines an AI Interview Preparation Platform with structured English speaking practice so candidates can
              improve both content and delivery. Each feature module supports a specific interview stage, from HR interview preparation
              and behavioral storytelling to technical interview training for coding, system design, and role-specific knowledge.
              This layered approach makes FluenzyAI useful for entry-level roles and advanced FAANG interview practice alike because
              you can focus on the exact skill set each hiring round evaluates.
            </p>
            <p className="text-base leading-relaxed text-slate-300">
              The mock interviews with AI simulate realistic conversation flow so you can practice concise answers, stronger structure,
              and calm pacing. The English speaking practice with AI emphasizes pronunciation, grammar clarity, and vocabulary choice,
              while the HR interview preparation modules help you refine leadership stories, conflict resolution responses, and career
              motivation narratives. For technical interview training, the AI Interview Coach blends problem-solving prompts with
              follow-up questions that mirror actual onsite interviews.
            </p>
            <p className="text-base leading-relaxed text-slate-300">
              Features are designed for crawlability and discoverability, with clear descriptions and internal navigation. You can move
              between feature details, pricing, and training without friction. This structure ensures that important pages remain
              indexable and meaningful for Google, while users get a quick overview of the core capabilities. Explore the pricing page
              to match a plan to your preparation intensity or jump back to the home page for a complete platform overview.
            </p>
            <div className="flex flex-wrap gap-3 text-sm">
              <a href="/pricing" className="rounded-full border border-slate-700 px-4 py-2 text-slate-200 hover:border-slate-400">
                Compare Plans
              </a>
              <a href="/" className="rounded-full border border-slate-700 px-4 py-2 text-slate-200 hover:border-slate-400">
                Back to Home
              </a>
              <a href="/train" className="rounded-full border border-slate-700 px-4 py-2 text-slate-200 hover:border-slate-400">
                Start Training
              </a>
            </div>
          </div>

          <div className="space-y-4">
            <h2 className="text-2xl font-semibold text-white">Feature FAQs</h2>
            <div className="space-y-4">
              <div>
                <h3 className="text-lg font-semibold text-slate-100">What makes FluenzyAI different from other interview platforms?</h3>
                <p className="text-sm text-slate-300">
                  FluenzyAI blends mock interviews with AI, English speaking practice, and HR interview preparation into one workflow,
                  so you can improve both content and delivery instead of practicing in silos.
                </p>
              </div>
              <div>
                <h3 className="text-lg font-semibold text-slate-100">Does FluenzyAI support technical interview training?</h3>
                <p className="text-sm text-slate-300">
                  Yes. The technical module covers coding prompts, system design thinking, and follow-up questions that mirror
                  FAANG interview practice formats.
                </p>
              </div>
              <div>
                <h3 className="text-lg font-semibold text-slate-100">Can I use the platform for HR interview preparation?</h3>
                <p className="text-sm text-slate-300">
                  The HR interview preparation tracks focus on storytelling, situational judgment, and communication clarity with
                  targeted feedback and improvement tips.
                </p>
              </div>
              <div>
                <h3 className="text-lg font-semibold text-slate-100">How do the modules improve English fluency?</h3>
                <p className="text-sm text-slate-300">
                  You receive grammar feedback, vocabulary suggestions, and pacing insights through English speaking practice with AI
                  that mirrors real interview scenarios.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "FAQPage",
            "mainEntity": [
              {
                "@type": "Question",
                "name": "What makes FluenzyAI different from other interview platforms?",
                "acceptedAnswer": {
                  "@type": "Answer",
                  "text": "FluenzyAI blends mock interviews with AI, English speaking practice, and HR interview preparation into one workflow, so you can improve both content and delivery instead of practicing in silos."
                }
              },
              {
                "@type": "Question",
                "name": "Does FluenzyAI support technical interview training?",
                "acceptedAnswer": {
                  "@type": "Answer",
                  "text": "Yes. The technical module covers coding prompts, system design thinking, and follow-up questions that mirror FAANG interview practice formats."
                }
              },
              {
                "@type": "Question",
                "name": "Can I use the platform for HR interview preparation?",
                "acceptedAnswer": {
                  "@type": "Answer",
                  "text": "The HR interview preparation tracks focus on storytelling, situational judgment, and communication clarity with targeted feedback and improvement tips."
                }
              },
              {
                "@type": "Question",
                "name": "How do the modules improve English fluency?",
                "acceptedAnswer": {
                  "@type": "Answer",
                  "text": "You receive grammar feedback, vocabulary suggestions, and pacing insights through English speaking practice with AI that mirrors real interview scenarios."
                }
              }
            ]
          })
        }}
      />
      <Footer />
    </div>
  );
}