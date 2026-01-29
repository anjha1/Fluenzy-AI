"use client";

import { useEffect, useMemo, useState } from "react";
import { useSearchParams } from "next/navigation";
import Image from "next/image";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  AreaChart,
  Area,
  BarChart,
  Bar,
  CartesianGrid,
  LineChart,
  Line,
  ResponsiveContainer,
  XAxis,
  YAxis,
  Tooltip as ChartTooltip,
} from "recharts";

interface AnalyticsResponse {
  summary: {
    communicationScore: number;
    confidenceScore: number;
    grammarScore: number;
    vocabularyScore: number;
    technicalScore: number;
    overallScore: number;
    overallStatus: string;
    totalQuestions: number;
    totalSessions: number;
    totalDurationMinutes: number;
    avgTimePerQuestion: number;
    totalCompanies: number;
    completionRate: number;
  };
  distributions: {
    module: Array<{ name: string; count: number }>;
  };
  trends: Array<{ date: string; communication: number; confidence: number; grammar: number; technical: number }>;
  insights: {
    commonGrammarIssues: string[];
    tips: string[];
    mostPracticed: Array<{ name: string; count: number }>;
    leastPracticed: Array<{ name: string; count: number }>;
    focusAreas: string[];
  };
  charts: {
    accuracyVsSpeed: Array<{ duration: number; score: number }>;
  };
  advanced: {
    communication: {
      fillerRate: number;
      fillerWords: Array<{ word: string; count: number }>;
      speakingWpm: number;
      idealWpmRange: [number, number];
      speakingPaceScore: number;
      sentenceStructureScore: number;
      toneConsistency: number;
      hesitationIndex: number;
      confidenceTimeline: Array<{ turn: number; confidence: number }>;
      sessionConfidenceTrend: Array<{ date: string; confidence: number }>;
    };
    questions: {
      difficultyDistribution: Array<{ label: string; count: number }>;
      accuracyByType: Array<{ type: string; accuracy: number }>;
      reattemptSuccessRate: number;
    };
    company: {
      readiness: Array<{ name: string; score: number; missingSkills: string[] }>;
      recommendations: string[];
      readinessTimelineWeeks: number | null;
    };
    coach: {
      readinessSummary: string;
      strengths: string[];
      weaknesses: string[];
      plan7Day: string[];
      nextSessionFocus: string;
    };
  };
}

const formatDuration = (minutes: number) => {
  if (!minutes) return "0m";
  const hours = Math.floor(minutes / 60);
  const mins = minutes % 60;
  return hours > 0 ? `${hours}h ${mins}m` : `${mins}m`;
};

const getStatusColor = (status: string) => {
  if (status === "Excellent") return "bg-emerald-100 text-emerald-700";
  if (status === "Good") return "bg-sky-100 text-sky-700";
  return "bg-amber-100 text-amber-700";
};

export default function AnalyticsReportPage() {
  const searchParams = useSearchParams();
  const [data, setData] = useState<AnalyticsResponse | null>(null);

  useEffect(() => {
    const previousBackground = document.body.style.background;
    const previousColor = document.body.style.color;
    document.body.style.background = "#0b1220";
    document.body.style.color = "#e2e8f0";
    return () => {
      document.body.style.background = previousBackground;
      document.body.style.color = previousColor;
    };
  }, []);

  useEffect(() => {
    const load = async () => {
      const res = await fetch("/api/analytics");
      if (res.ok) {
        setData(await res.json());
      }
    };
    load();
  }, []);

  useEffect(() => {
    if (!data) return undefined;
    if (searchParams.get("print") === "1") {
      const timeout = setTimeout(() => window.print(), 800);
      return () => clearTimeout(timeout);
    }
    return undefined;
  }, [searchParams, data]);

  const summaryCards = useMemo(() => {
    if (!data) return [];
    return [
      { label: "Overall Score", value: Math.round(data.summary.overallScore) },
      { label: "Communication", value: Math.round(data.summary.communicationScore) },
      { label: "Confidence", value: Math.round(data.summary.confidenceScore) },
      { label: "Grammar", value: Math.round(data.summary.grammarScore) },
      { label: "Speaking Pace", value: `${data.advanced.communication.speakingWpm} WPM` },
    ];
  }, [data]);

  if (!data) {
    return <div className="min-h-screen bg-slate-950 p-10 text-slate-100">Preparing report...</div>;
  }

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 print:bg-slate-950">
      <div className="mx-auto max-w-5xl px-6 py-10 print:py-6">
        <header className="flex items-center justify-between border-b border-slate-800 pb-6">
          <div className="flex items-center gap-3">
            <Image src="/image/final_logo-removebg-preview.png" alt="Fluenzy AI" width={36} height={36} />
            <div>
              <p className="text-sm font-semibold text-slate-400">Fluenzy AI</p>
              <h1 className="text-2xl font-bold">Analytics Dashboard – Communication Performance Report</h1>
            </div>
          </div>
          <Badge className={`${getStatusColor(data.summary.overallStatus)} border-0 px-3 py-1 text-xs font-semibold`}
          >
            {data.summary.overallStatus}
          </Badge>
        </header>

        <section className="mt-8 grid gap-4 md:grid-cols-5 print:break-inside-avoid">
          {summaryCards.map((card) => (
            <div key={card.label} className="rounded-xl border border-slate-800 bg-slate-900 p-4">
              <p className="text-xs uppercase tracking-[0.2em] text-slate-400">{card.label}</p>
              <p className="mt-2 text-2xl font-semibold text-slate-100">{card.value}</p>
            </div>
          ))}
        </section>
        <p className="mt-2 text-xs text-slate-400">Ideal speaking pace: {data.advanced.communication.idealWpmRange[0]}-{data.advanced.communication.idealWpmRange[1]} WPM</p>

        <section className="mt-8 grid gap-4 md:grid-cols-4 print:break-inside-avoid">
          {[
            { label: "Overall Performance", value: Math.round(data.summary.overallScore) },
            { label: "Communication Score", value: Math.round(data.summary.communicationScore) },
            { label: "Technical Knowledge", value: Math.round(data.summary.technicalScore) },
            { label: "Avg Time per Question", value: `${data.summary.avgTimePerQuestion}m` },
          ].map((card) => (
            <div key={card.label} className="rounded-xl border border-slate-800 bg-slate-900 p-4">
              <p className="text-xs uppercase tracking-[0.2em] text-slate-400">{card.label}</p>
              <p className="mt-2 text-2xl font-semibold text-slate-100">{card.value}</p>
            </div>
          ))}
        </section>

        <section className="mt-8 grid gap-4 md:grid-cols-3 print:break-inside-avoid">
          {[
            { label: "Confidence", value: Math.round(data.summary.confidenceScore), color: "#0ea5e9" },
            { label: "Grammar Accuracy", value: Math.round(data.summary.grammarScore), color: "#22c55e" },
            { label: "Vocabulary Usage", value: Math.round(data.summary.vocabularyScore), color: "#a855f7" },
          ].map((metric) => (
            <div key={metric.label} className="rounded-xl border border-slate-800 bg-slate-900 p-4">
              <p className="text-xs uppercase tracking-[0.2em] text-slate-400">{metric.label}</p>
              <div className="mt-3 h-2 rounded-full bg-slate-800">
                <div className="h-2 rounded-full" style={{ width: `${metric.value}%`, background: metric.color }} />
              </div>
              <p className="mt-2 text-lg font-semibold text-slate-100">{metric.value}</p>
            </div>
          ))}
        </section>

        <section className="mt-10 grid gap-6 print:break-inside-avoid print-page-break">
          <Card className="border-slate-800 bg-slate-900">
            <CardHeader>
              <CardTitle>Skill Progress Over Time</CardTitle>
            </CardHeader>
            <CardContent className="h-[240px]">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={data.trends}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
                  <XAxis dataKey="date" stroke="#94a3b8" fontSize={11} tickLine={false} axisLine={false} />
                  <YAxis stroke="#94a3b8" fontSize={11} tickLine={false} axisLine={false} />
                  <ChartTooltip contentStyle={{ background: "#0f172a", border: "1px solid #1e293b", color: "#e2e8f0" }} />
                  <Line type="monotone" dataKey="communication" stroke="#0ea5e9" strokeWidth={2} dot={false} isAnimationActive={false} />
                  <Line type="monotone" dataKey="confidence" stroke="#a855f7" strokeWidth={2} dot={false} isAnimationActive={false} />
                  <Line type="monotone" dataKey="grammar" stroke="#22c55e" strokeWidth={2} dot={false} isAnimationActive={false} />
                  <Line type="monotone" dataKey="technical" stroke="#f97316" strokeWidth={2} dot={false} isAnimationActive={false} />
                </LineChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </section>

        <section className="mt-8 grid gap-6 md:grid-cols-2 print:break-inside-avoid">
          <Card className="border-slate-800 bg-slate-900">
            <CardHeader>
              <CardTitle>Confidence Timeline (Latest Session)</CardTitle>
            </CardHeader>
            <CardContent className="h-[220px]">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={data.advanced.communication.confidenceTimeline}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
                  <XAxis dataKey="turn" stroke="#94a3b8" fontSize={11} tickLine={false} axisLine={false} />
                  <YAxis stroke="#94a3b8" fontSize={11} tickLine={false} axisLine={false} domain={[0, 100]} />
                  <ChartTooltip contentStyle={{ background: "#0f172a", border: "1px solid #1e293b", color: "#e2e8f0" }} />
                  <Line type="monotone" dataKey="confidence" stroke="#0ea5e9" strokeWidth={2} dot={false} isAnimationActive={false} />
                </LineChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          <Card className="border-slate-800 bg-slate-900">
            <CardHeader>
              <CardTitle>Session Confidence Trend</CardTitle>
            </CardHeader>
            <CardContent className="h-[220px]">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={data.advanced.communication.sessionConfidenceTrend}>
                  <defs>
                    <linearGradient id="confTrend" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#22c55e" stopOpacity={0.6} />
                      <stop offset="100%" stopColor="#22c55e" stopOpacity={0.1} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
                  <XAxis dataKey="date" stroke="#94a3b8" fontSize={11} tickLine={false} axisLine={false} />
                  <YAxis stroke="#94a3b8" fontSize={11} tickLine={false} axisLine={false} domain={[0, 100]} />
                  <ChartTooltip contentStyle={{ background: "#0f172a", border: "1px solid #1e293b", color: "#e2e8f0" }} />
                  <Area type="monotone" dataKey="confidence" stroke="#22c55e" fill="url(#confTrend)" isAnimationActive={false} />
                </AreaChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </section>

        <section className="mt-8 grid gap-6 md:grid-cols-2 print:break-inside-avoid">
          <Card className="border-slate-800 bg-slate-900">
            <CardHeader>
              <CardTitle>Communication Skills Snapshot</CardTitle>
            </CardHeader>
            <CardContent className="h-[220px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={[
                    { name: "Communication", value: Math.round(data.summary.communicationScore) },
                    { name: "Confidence", value: Math.round(data.summary.confidenceScore) },
                    { name: "Grammar", value: Math.round(data.summary.grammarScore) },
                    { name: "Vocabulary", value: Math.round(data.summary.vocabularyScore) },
                  ]}
                >
                  <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
                  <XAxis dataKey="name" stroke="#94a3b8" fontSize={11} tickLine={false} axisLine={false} />
                  <YAxis stroke="#94a3b8" fontSize={11} tickLine={false} axisLine={false} domain={[0, 100]} />
                  <ChartTooltip contentStyle={{ background: "#0f172a", border: "1px solid #1e293b", color: "#e2e8f0" }} />
                  <Bar dataKey="value" fill="#0ea5e9" radius={[6, 6, 0, 0]} isAnimationActive={false} />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          <Card className="border-slate-800 bg-slate-900">
            <CardHeader>
              <CardTitle>Accuracy vs Speed</CardTitle>
            </CardHeader>
            <CardContent className="h-[220px]">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={data.charts.accuracyVsSpeed}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
                  <XAxis dataKey="duration" stroke="#94a3b8" fontSize={11} tickLine={false} axisLine={false} />
                  <YAxis stroke="#94a3b8" fontSize={11} tickLine={false} axisLine={false} />
                  <ChartTooltip contentStyle={{ background: "#0f172a", border: "1px solid #1e293b", color: "#e2e8f0" }} />
                  <Line type="monotone" dataKey="score" stroke="#f97316" strokeWidth={2} dot={false} isAnimationActive={false} />
                </LineChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </section>

        <section className="mt-8 grid gap-6 md:grid-cols-2 print:break-inside-avoid print-page-break">
          <Card className="border-slate-800 bg-slate-900">
            <CardHeader>
              <CardTitle>Filler Word Detector</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="text-sm">Filler rate: <strong>{data.advanced.communication.fillerRate}%</strong></div>
              <div className="h-[200px]">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={data.advanced.communication.fillerWords.slice(0, 6)}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
                    <XAxis dataKey="word" stroke="#94a3b8" fontSize={11} tickLine={false} axisLine={false} />
                    <YAxis stroke="#94a3b8" fontSize={11} tickLine={false} axisLine={false} />
                    <ChartTooltip contentStyle={{ background: "#0f172a", border: "1px solid #1e293b", color: "#e2e8f0" }} />
                    <Bar dataKey="count" fill="#10b981" radius={[6, 6, 0, 0]} isAnimationActive={false} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>

          <Card className="border-slate-800 bg-slate-900">
            <CardHeader>
              <CardTitle>Speaking Speed vs Ideal</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4 text-sm">
              <div>Current pace: <strong>{data.advanced.communication.speakingWpm} WPM</strong></div>
              <div>Ideal range: {data.advanced.communication.idealWpmRange[0]}-{data.advanced.communication.idealWpmRange[1]} WPM</div>
              <div>Pace quality score: <strong>{data.advanced.communication.speakingPaceScore}</strong></div>
              <div className="rounded-full bg-slate-800 h-2 relative">
                <div
                  className="absolute h-2 bg-emerald-500/50 rounded-full"
                  style={{ left: `${(data.advanced.communication.idealWpmRange[0] / 220) * 100}%`, width: `${((data.advanced.communication.idealWpmRange[1] - data.advanced.communication.idealWpmRange[0]) / 220) * 100}%` }}
                />
                <div
                  className="absolute -top-1 h-4 w-1 rounded-full bg-sky-500"
                  style={{ left: `${(data.advanced.communication.speakingWpm / 220) * 100}%` }}
                />
              </div>
            </CardContent>
          </Card>
        </section>

        <section className="mt-8 grid gap-6 md:grid-cols-3 print:break-inside-avoid">
          {[
            { label: "Sentence Structure", value: data.advanced.communication.sentenceStructureScore },
            { label: "Tone Consistency", value: data.advanced.communication.toneConsistency },
            { label: "Hesitation Index", value: data.advanced.communication.hesitationIndex },
          ].map((metric) => (
            <Card key={metric.label} className="border-slate-800 bg-slate-900">
              <CardHeader>
                <CardTitle>{metric.label}</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-semibold">{Math.round(metric.value)}</div>
                <div className="mt-3 h-2 rounded-full bg-slate-800">
                  <div className="h-2 rounded-full bg-slate-400" style={{ width: `${metric.value}%` }} />
                </div>
              </CardContent>
            </Card>
          ))}
        </section>

        <section className="mt-10 grid gap-6 md:grid-cols-2 print:break-inside-avoid print-page-break">
          <Card className="border-slate-800 bg-slate-900">
            <CardHeader>
              <CardTitle>Practice Statistics</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3 text-sm">
              <div className="flex items-center justify-between">
                <span>Total questions</span>
                <span className="font-semibold">{data.summary.totalQuestions}</span>
              </div>
              <div className="flex items-center justify-between">
                <span>Total sessions</span>
                <span className="font-semibold">{data.summary.totalSessions}</span>
              </div>
              <div className="flex items-center justify-between">
                <span>Completion consistency</span>
                <span className="font-semibold">{data.summary.completionRate}%</span>
              </div>
              <div className="flex items-center justify-between">
                <span>Total practice time</span>
                <span className="font-semibold">{formatDuration(data.summary.totalDurationMinutes)}</span>
              </div>
              <div className="flex items-center justify-between">
                <span>Companies practiced</span>
                <span className="font-semibold">{data.summary.totalCompanies}</span>
              </div>
            </CardContent>
          </Card>

          <Card className="border-slate-800 bg-slate-900">
            <CardHeader>
              <CardTitle>Practice Distribution by Module</CardTitle>
            </CardHeader>
            <CardContent className="h-[220px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={data.distributions.module}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
                  <XAxis dataKey="name" stroke="#94a3b8" fontSize={11} tickLine={false} axisLine={false} />
                  <YAxis stroke="#94a3b8" fontSize={11} tickLine={false} axisLine={false} />
                  <ChartTooltip contentStyle={{ background: "#0f172a", border: "1px solid #1e293b", color: "#e2e8f0" }} />
                  <Bar dataKey="count" fill="#0ea5e9" radius={[6, 6, 0, 0]} isAnimationActive={false} />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          <Card className="border-slate-800 bg-slate-900">
            <CardHeader>
              <CardTitle>AI Insights & Recommendations</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3 text-sm">
              <div>
                <p className="text-xs uppercase tracking-[0.2em] text-slate-400">Common Grammar Patterns</p>
                <div className="mt-2 flex flex-wrap gap-2">
                  {(data.insights.commonGrammarIssues.length ? data.insights.commonGrammarIssues : ["Not enough data"])
                    .slice(0, 4)
                    .map((issue) => (
                      <span key={issue} className="rounded-full border border-slate-700 px-3 py-1 text-xs">
                        {issue}
                      </span>
                    ))}
                </div>
              </div>
              <div>
                <p className="text-xs uppercase tracking-[0.2em] text-slate-400">Personalized Tips</p>
                <ul className="mt-2 space-y-2">
                  {data.insights.tips.map((tip) => (
                    <li key={tip} className="flex gap-2">
                      <span className="mt-1 h-2 w-2 rounded-full bg-emerald-400" />
                      {tip}
                    </li>
                  ))}
                </ul>
              </div>
            </CardContent>
          </Card>
        </section>

        <section className="mt-8 grid gap-6 md:grid-cols-2 print:break-inside-avoid">
          <Card className="border-slate-800 bg-slate-900">
            <CardHeader>
              <CardTitle>Strengths & Focus Areas</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4 text-sm">
              <div>
                <p className="text-xs uppercase tracking-[0.2em] text-slate-400">Most Practiced</p>
                <div className="mt-2 flex flex-wrap gap-2">
                  {data.insights.mostPracticed.map((item) => (
                    <span key={item.name} className="rounded-full border border-slate-700 px-3 py-1 text-xs">
                      {item.name} ({item.count})
                    </span>
                  ))}
                </div>
              </div>
              <div>
                <p className="text-xs uppercase tracking-[0.2em] text-slate-400">Least Practiced</p>
                <div className="mt-2 flex flex-wrap gap-2">
                  {data.insights.leastPracticed.map((item) => (
                    <span key={item.name} className="rounded-full border border-slate-700 px-3 py-1 text-xs">
                      {item.name} ({item.count})
                    </span>
                  ))}
                </div>
              </div>
              <div>
                <p className="text-xs uppercase tracking-[0.2em] text-slate-400">Focus Areas</p>
                <div className="mt-2 flex flex-wrap gap-2">
                  {data.insights.focusAreas.map((area) => (
                    <span key={area} className="rounded-full border border-slate-700 px-3 py-1 text-xs">
                      {area}
                    </span>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-slate-800 bg-slate-900">
            <CardHeader>
              <CardTitle>Overall Status & Summary</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3 text-sm">
              <p><strong>Status:</strong> {data.summary.overallStatus}</p>
              <p><strong>Total Questions:</strong> {data.summary.totalQuestions}</p>
              <p><strong>Total Sessions:</strong> {data.summary.totalSessions}</p>
              <p><strong>Completion Consistency:</strong> {data.summary.completionRate}%</p>
            </CardContent>
          </Card>
        </section>

        <section className="mt-8 grid gap-6 md:grid-cols-2 print:break-inside-avoid print-page-break">
          <Card className="border-slate-800 bg-slate-900">
            <CardHeader>
              <CardTitle>Question Difficulty Distribution</CardTitle>
            </CardHeader>
            <CardContent className="h-[220px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={data.advanced.questions.difficultyDistribution}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
                  <XAxis dataKey="label" stroke="#94a3b8" fontSize={11} tickLine={false} axisLine={false} />
                  <YAxis stroke="#94a3b8" fontSize={11} tickLine={false} axisLine={false} />
                  <ChartTooltip contentStyle={{ background: "#0f172a", border: "1px solid #1e293b", color: "#e2e8f0" }} />
                  <Bar dataKey="count" fill="#0ea5e9" radius={[6, 6, 0, 0]} isAnimationActive={false} />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          <Card className="border-slate-800 bg-slate-900">
            <CardHeader>
              <CardTitle>Accuracy by Question Type</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3 text-sm">
              <div>Reattempt success rate: <strong>{data.advanced.questions.reattemptSuccessRate}%</strong></div>
              <div className="h-[200px]">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={data.advanced.questions.accuracyByType}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
                    <XAxis dataKey="type" stroke="#94a3b8" fontSize={11} tickLine={false} axisLine={false} />
                    <YAxis stroke="#94a3b8" fontSize={11} tickLine={false} axisLine={false} domain={[0, 100]} />
                    <ChartTooltip contentStyle={{ background: "#0f172a", border: "1px solid #1e293b", color: "#e2e8f0" }} />
                    <Bar dataKey="accuracy" fill="#22c55e" radius={[6, 6, 0, 0]} isAnimationActive={false} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </section>

        <section className="mt-8 grid gap-6 md:grid-cols-2 print:break-inside-avoid">
          <Card className="border-slate-800 bg-slate-900">
            <CardHeader>
              <CardTitle>Company-wise Readiness</CardTitle>
            </CardHeader>
            <CardContent className="h-[220px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={data.advanced.company.readiness}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
                  <XAxis dataKey="name" stroke="#94a3b8" fontSize={11} tickLine={false} axisLine={false} />
                  <YAxis stroke="#94a3b8" fontSize={11} tickLine={false} axisLine={false} domain={[0, 100]} />
                  <ChartTooltip contentStyle={{ background: "#0f172a", border: "1px solid #1e293b", color: "#e2e8f0" }} />
                  <Bar dataKey="score" fill="#f97316" radius={[6, 6, 0, 0]} isAnimationActive={false} />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          <Card className="border-slate-800 bg-slate-900">
            <CardHeader>
              <CardTitle>Company Gaps & Recommendations</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3 text-sm">
              {data.advanced.company.readiness.slice(0, 3).map((company) => (
                <div key={company.name}>
                  <p className="font-semibold">{company.name}</p>
                  <div className="mt-1 flex flex-wrap gap-2">
                    {company.missingSkills.map((skill) => (
                      <span key={skill} className="rounded-full border border-slate-700 px-3 py-1 text-xs">
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>
              ))}
              {data.advanced.company.readinessTimelineWeeks != null && (
                <p>Estimated readiness timeline: {data.advanced.company.readinessTimelineWeeks} weeks</p>
              )}
            </CardContent>
          </Card>
        </section>

        <section className="mt-8 grid gap-6 md:grid-cols-2 print:break-inside-avoid">
          <Card className="border-slate-800 bg-slate-900">
            <CardHeader>
              <CardTitle>AI Coach Summary</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3 text-sm">
              <p>{data.advanced.coach.readinessSummary}</p>
              <div>
                <p className="text-xs uppercase tracking-[0.2em] text-slate-400">Strengths</p>
                <div className="mt-2 flex flex-wrap gap-2">
                  {data.advanced.coach.strengths.map((item) => (
                    <span key={item} className="rounded-full border border-slate-700 px-3 py-1 text-xs">
                      {item}
                    </span>
                  ))}
                </div>
              </div>
              <div>
                <p className="text-xs uppercase tracking-[0.2em] text-slate-400">Focus Areas</p>
                <div className="mt-2 flex flex-wrap gap-2">
                  {data.advanced.coach.weaknesses.map((item) => (
                    <span key={item} className="rounded-full border border-slate-700 px-3 py-1 text-xs">
                      {item}
                    </span>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-slate-800 bg-slate-900">
            <CardHeader>
              <CardTitle>7-Day Improvement Plan</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2 text-sm">
              <ul className="space-y-2">
                {data.advanced.coach.plan7Day.map((step) => (
                  <li key={step} className="flex gap-2">
                    <span className="mt-1 h-2 w-2 rounded-full bg-emerald-500" />
                    {step}
                  </li>
                ))}
              </ul>
              <p className="pt-2 text-sm">Next session focus: <strong>{data.advanced.coach.nextSessionFocus}</strong></p>
              <div className="pt-2">
                {data.advanced.company.recommendations.map((rec) => (
                  <div key={rec} className="flex gap-2">
                    <span className="mt-1 h-2 w-2 rounded-full bg-sky-500" />
                    {rec}
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </section>

        <div className="mt-10 flex justify-end print:hidden">
          <button
            className="rounded-md border border-slate-300 px-4 py-2 text-sm font-medium"
            onClick={() => window.print()}
          >
            Print / Save PDF
          </button>
        </div>
      </div>



      <style jsx global>{`
        @media print {
          @page {
            margin: 16mm;
          }
          body {
            background: #0b1220 !important;
            -webkit-print-color-adjust: exact;
            print-color-adjust: exact;
          }
          html, body {
            margin: 0;
            padding: 0;
          }
          .print\:break-inside-avoid {
            break-inside: avoid;
            page-break-inside: avoid;
          }
          .print-page-break {
            break-before: page;
            page-break-before: always;
          }
          .recharts-wrapper {
            page-break-inside: avoid;
          }
        }
      `}</style>
    </div>
  );
}
