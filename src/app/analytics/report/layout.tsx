import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Analytics Report - FluenzyAI Performance Insights",
  description:
    "View detailed interview performance analytics from FluenzyAI. Track communication, confidence, grammar, and technical progress with AI-driven interview coaching insights.",
  alternates: {
    canonical: "https://www.fluenzyai.app/analytics/report",
  },
  openGraph: {
    title: "Analytics Report - FluenzyAI Performance Insights",
    description:
      "View detailed interview performance analytics from FluenzyAI. Track communication, confidence, grammar, and technical progress with AI-driven interview coaching insights.",
    url: "https://www.fluenzyai.app/analytics/report",
    type: "website",
    images: [
      {
        url: "https://www.fluenzyai.app/og-image.jpg",
        width: 1200,
        height: 630,
        alt: "FluenzyAI Analytics Report",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Analytics Report - FluenzyAI Performance Insights",
    description:
      "View detailed interview performance analytics from FluenzyAI. Track communication, confidence, grammar, and technical progress with AI-driven interview coaching insights.",
    images: ["https://www.fluenzyai.app/og-image.jpg"],
  },
};

export default function AnalyticsReportLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
