import type { Metadata } from "next";
import LandingPage from "@/components/LandingPage";

export const metadata: Metadata = {
  title: "FluenzyAI: AI Interview Coach & English Practice",
  description: "Enhance your interview skills and English fluency with FluenzyAI's AI-powered platform. Practice HR interviews, technical questions, and group discussions for career success.",
  keywords: "AI interview practice, AI interview coach, English speaking practice with AI, mock interview AI, group discussion AI",
  alternates: {
    canonical: "https://www.fluenzyai.app/",
  },
  openGraph: {
    title: "FluenzyAI: AI Interview Coach & English Practice",
    description: "Enhance your interview skills and English fluency with FluenzyAI's AI-powered platform.",
    url: "https://www.fluenzyai.app",
    type: "website",
    images: [
      {
        url: "https://www.fluenzyai.app/og-image.jpg",
        width: 1200,
        height: 630,
        alt: "FluenzyAI - AI Interview Preparation Platform",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "FluenzyAI: AI Interview Coach & English Practice",
    description: "Enhance your interview skills and English fluency with FluenzyAI's AI-powered platform.",
    images: ["https://www.fluenzyai.app/og-image.jpg"],
  },
};

export default function Page() {
  return (
    <>
      <LandingPage />
      <section className="bg-slate-950 text-slate-200">
        <div className="container mx-auto px-4 py-12 space-y-8">
          <nav aria-label="Breadcrumb" className="text-sm text-slate-400">
            <ol className="flex flex-wrap gap-2">
              <li>
                <a href="/" className="hover:text-slate-200">Home</a>
              </li>
              <li aria-hidden="true">/</li>
              <li className="text-slate-300">AI Interview Preparation Platform</li>
            </ol>
          </nav>

          <div className="space-y-4">
            <h2 className="text-2xl md:text-3xl font-semibold text-white">
              FluenzyAI is an AI Interview Preparation Platform built for real hiring outcomes
            </h2>
            <p className="text-base leading-relaxed text-slate-300">
              FluenzyAI is a modern AI Interview Coach for candidates who want structured, measurable growth in interviews.
              The platform combines mock interviews with AI, targeted HR interview preparation, and technical interview training
              in a single workflow. Instead of generic practice, FluenzyAI adapts each session to your role, experience level,
              and target companies so you can move from practice to performance. Whether you are aiming for FAANG interview practice
              or preparing for your next startup role, the system provides realistic prompts, immediate feedback, and a measurable
              improvement path.
            </p>
            <p className="text-base leading-relaxed text-slate-300">
              Each session blends spoken English evaluation with interview scoring to improve clarity, confidence, and structure.
              You can train for behavioral rounds, technical screenings, and group discussion style conversations while the AI
              Interview Coach highlights strengths, flags gaps, and recommends follow-up drills. For learners who want English
              speaking practice with AI, the platform provides guided speech practice, vocabulary refinement, and grammar insights
              that map directly to professional interview scenarios. This approach makes FluenzyAI a practical technical interview
              training solution rather than a surface-level quiz tool.
            </p>
            <p className="text-base leading-relaxed text-slate-300">
              The experience is designed to be crawlable and discoverable with clear navigation, contextual internal links, and
              focused content. You can explore the full set of modules on the features page, compare plan options on the pricing
              page, or jump directly into training. If you are building momentum toward a job change, the internal skill tracking
              and report insights help you connect daily practice with real hiring milestones.
            </p>
            <div className="flex flex-wrap gap-3 text-sm">
              <a href="/features" className="rounded-full border border-slate-700 px-4 py-2 text-slate-200 hover:border-slate-400">
                Explore Features
              </a>
              <a href="/pricing" className="rounded-full border border-slate-700 px-4 py-2 text-slate-200 hover:border-slate-400">
                View Pricing
              </a>
              <a href="/train" className="rounded-full border border-slate-700 px-4 py-2 text-slate-200 hover:border-slate-400">
                Start Training
              </a>
            </div>
          </div>

          <div className="space-y-4">
            <h2 className="text-2xl font-semibold text-white">Frequently asked questions</h2>
            <div className="space-y-4">
              <div>
                <h3 className="text-lg font-semibold text-slate-100">How does FluenzyAI improve interview readiness?</h3>
                <p className="text-sm text-slate-300">
                  FluenzyAI pairs mock interviews with AI with targeted feedback on structure, clarity, and confidence so you can
                  focus practice on the skills that move interview performance the fastest.
                </p>
              </div>
              <div>
                <h3 className="text-lg font-semibold text-slate-100">Is FluenzyAI suitable for FAANG interview practice?</h3>
                <p className="text-sm text-slate-300">
                  Yes. The platform includes technical interview training, company-specific question sets, and readiness insights
                  to support FAANG interview practice goals.
                </p>
              </div>
              <div>
                <h3 className="text-lg font-semibold text-slate-100">Does it cover HR interview preparation?</h3>
                <p className="text-sm text-slate-300">
                  The HR interview preparation modules focus on behavioral storytelling, leadership prompts, and situational
                  scenarios with coaching feedback.
                </p>
              </div>
              <div>
                <h3 className="text-lg font-semibold text-slate-100">Can I practice English speaking with AI?</h3>
                <p className="text-sm text-slate-300">
                  FluenzyAI provides English speaking practice with AI through guided conversations, grammar correction, and
                  vocabulary coaching tailored to interview contexts.
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
                "name": "How does FluenzyAI improve interview readiness?",
                "acceptedAnswer": {
                  "@type": "Answer",
                  "text": "FluenzyAI pairs mock interviews with AI with targeted feedback on structure, clarity, and confidence so you can focus practice on the skills that move interview performance the fastest."
                }
              },
              {
                "@type": "Question",
                "name": "Is FluenzyAI suitable for FAANG interview practice?",
                "acceptedAnswer": {
                  "@type": "Answer",
                  "text": "Yes. The platform includes technical interview training, company-specific question sets, and readiness insights to support FAANG interview practice goals."
                }
              },
              {
                "@type": "Question",
                "name": "Does it cover HR interview preparation?",
                "acceptedAnswer": {
                  "@type": "Answer",
                  "text": "The HR interview preparation modules focus on behavioral storytelling, leadership prompts, and situational scenarios with coaching feedback."
                }
              },
              {
                "@type": "Question",
                "name": "Can I practice English speaking with AI?",
                "acceptedAnswer": {
                  "@type": "Answer",
                  "text": "FluenzyAI provides English speaking practice with AI through guided conversations, grammar correction, and vocabulary coaching tailored to interview contexts."
                }
              }
            ]
          })
        }}
      />
    </>
  );
}
