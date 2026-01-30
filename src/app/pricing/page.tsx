import type { Metadata } from "next";
import Pricing from "@/modules/pricing";
import Footer from "@/components/footer";

export const metadata: Metadata = {
  title: "Pricing - FluenzyAI: AI Interview Coach & English Practice",
  description: "Select the ideal FluenzyAI plan for AI-driven interview preparation and English fluency training. Flexible pricing for HR interviews, technical mock tests, group discussions, and career advancement.",
  keywords: "AI interview coach, interview preparation platform, spoken English for jobs, career growth using AI",
  alternates: {
    canonical: "https://www.fluenzyai.app/pricing",
  },
  openGraph: {
    title: "Pricing - FluenzyAI: AI Interview Coach & English Practice",
    description: "Select the ideal FluenzyAI plan for AI-driven interview preparation and English fluency training.",
    url: "https://www.fluenzyai.app/pricing",
    type: "website",
    images: [
      {
        url: "https://www.fluenzyai.app/og-image.jpg",
        width: 1200,
        height: 630,
        alt: "FluenzyAI Pricing",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Pricing - FluenzyAI: AI Interview Coach & English Practice",
    description: "Select the ideal FluenzyAI plan for AI-driven interview preparation and English fluency training.",
    images: ["https://www.fluenzyai.app/og-image.jpg"],
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
      <section className="bg-slate-950 text-slate-200">
        <div className="container mx-auto px-4 py-12 space-y-8">
          <nav aria-label="Breadcrumb" className="text-sm text-slate-400">
            <ol className="flex flex-wrap gap-2">
              <li>
                <a href="/" className="hover:text-slate-200">Home</a>
              </li>
              <li aria-hidden="true">/</li>
              <li className="text-slate-300">Pricing</li>
            </ol>
          </nav>
          <div className="space-y-4">
            <h2 className="text-2xl md:text-3xl font-semibold text-white">Pricing built for continuous interview practice</h2>
            <p className="text-base leading-relaxed text-slate-300">
              FluenzyAI offers flexible pricing so you can match your preparation intensity to your goals. Whether you are starting
              with mock interviews with AI or preparing for a high-stakes transition, each plan includes core AI Interview Coach
              capabilities. You get guided HR interview preparation, targeted technical interview training, and English speaking
              practice with AI that mirrors real interview scenarios. This makes FluenzyAI a practical AI interview preparation
              platform for candidates who want consistent progress rather than sporadic practice.
            </p>
            <p className="text-base leading-relaxed text-slate-300">
              The Free plan helps you explore the experience, while Standard and Pro plans unlock more advanced analytics, additional
              training sessions, and deeper feedback loops. If you are focused on FAANG interview practice, the higher tiers provide
              the repetition and insights required to refine problem-solving and communication at scale. Each plan is structured to
              support daily practice and measurable improvement across HR interview preparation, technical interview training, and
              mock interviews with AI.
            </p>
            <p className="text-base leading-relaxed text-slate-300">
              Choose a plan that aligns with your schedule and hiring timeline. You can upgrade as your goals evolve, and you will
              keep your training history so progress is never lost. For a full overview of features and module coverage, visit the
              features page or return to the home page for a complete platform summary.
            </p>
            <div className="flex flex-wrap gap-3 text-sm">
              <a href="/features" className="rounded-full border border-slate-700 px-4 py-2 text-slate-200 hover:border-slate-400">
                View Features
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
            <h2 className="text-2xl font-semibold text-white">Pricing FAQs</h2>
            <div className="space-y-4">
              <div>
                <h3 className="text-lg font-semibold text-slate-100">Which plan is best for FAANG interview practice?</h3>
                <p className="text-sm text-slate-300">
                  Standard and Pro plans are ideal for FAANG interview practice because they provide more sessions, deeper analytics,
                  and advanced mock interviews with AI.
                </p>
              </div>
              <div>
                <h3 className="text-lg font-semibold text-slate-100">Do all plans include English speaking practice with AI?</h3>
                <p className="text-sm text-slate-300">
                  Yes. Every plan includes English speaking practice with AI, grammar feedback, and communication improvement tools.
                </p>
              </div>
              <div>
                <h3 className="text-lg font-semibold text-slate-100">Can I upgrade my plan later?</h3>
                <p className="text-sm text-slate-300">
                  You can upgrade at any time without losing your practice history, analytics, or completed training sessions.
                </p>
              </div>
              <div>
                <h3 className="text-lg font-semibold text-slate-100">Is there a free option to test the platform?</h3>
                <p className="text-sm text-slate-300">
                  The Free plan lets you explore the AI Interview Coach, sample mock interviews with AI, and begin HR interview preparation.
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
            "@type": "Product",
            "name": "FluenzyAI Plans",
            "description": "Pricing plans for FluenzyAI AI Interview Coach and English practice platform.",
            "brand": { "@type": "Organization", "name": "FluenzyAI" },
            "offers": [
              {
                "@type": "Offer",
                "name": "Free",
                "price": "0",
                "priceCurrency": "INR",
                "availability": "https://schema.org/InStock",
                "url": "https://www.fluenzyai.app/pricing"
              },
              {
                "@type": "Offer",
                "name": "Standard",
                "price": "150",
                "priceCurrency": "INR",
                "availability": "https://schema.org/InStock",
                "url": "https://www.fluenzyai.app/pricing"
              },
              {
                "@type": "Offer",
                "name": "Pro",
                "price": "20",
                "priceCurrency": "INR",
                "availability": "https://schema.org/InStock",
                "url": "https://www.fluenzyai.app/pricing"
              }
            ]
          })
        }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "FAQPage",
            "mainEntity": [
              {
                "@type": "Question",
                "name": "Which plan is best for FAANG interview practice?",
                "acceptedAnswer": {
                  "@type": "Answer",
                  "text": "Standard and Pro plans are ideal for FAANG interview practice because they provide more sessions, deeper analytics, and advanced mock interviews with AI."
                }
              },
              {
                "@type": "Question",
                "name": "Do all plans include English speaking practice with AI?",
                "acceptedAnswer": {
                  "@type": "Answer",
                  "text": "Yes. Every plan includes English speaking practice with AI, grammar feedback, and communication improvement tools."
                }
              },
              {
                "@type": "Question",
                "name": "Can I upgrade my plan later?",
                "acceptedAnswer": {
                  "@type": "Answer",
                  "text": "You can upgrade at any time without losing your practice history, analytics, or completed training sessions."
                }
              },
              {
                "@type": "Question",
                "name": "Is there a free option to test the platform?",
                "acceptedAnswer": {
                  "@type": "Answer",
                  "text": "The Free plan lets you explore the AI Interview Coach, sample mock interviews with AI, and begin HR interview preparation."
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