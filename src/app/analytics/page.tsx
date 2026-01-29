"use client";

import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";
import {
  AreaChart,
  Area,
  BarChart,
  Bar,
  CartesianGrid,
  LineChart,
  Line,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import {
  Activity,
  ArrowUpRight,
  BrainCircuit,
  CheckCircle2,
  Flame,
  Gauge,
  MessageSquare,
  Mic2,
  Target,
  Timer,
  TrendingUp,
} from "lucide-react";

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
    company: Array<{ name: string; count: number }>;
    role: Array<{ name: string; count: number }>;
    module: Array<{ name: string; count: number }>;
  };
  trends: Array<{ date: string; communication: number; confidence: number; grammar: number; technical: number }>;
  activity: Array<{ date: string; count: number }>;
  insights: {
    mostPracticed: Array<{ name: string; count: number }>;
    leastPracticed: Array<{ name: string; count: number }>;
    commonGrammarIssues: string[];
    confidenceDropPercent: number;
    focusAreas: string[];
    tips: string[];
  };
  charts: {
    accuracyVsSpeed: Array<{ duration: number; score: number }>;
  };
}

const formatDuration = (minutes: number) => {
  if (!minutes) return "0m";
  const hours = Math.floor(minutes / 60);
  const mins = minutes % 60;
  return hours > 0 ? `${hours}h ${mins}m` : `${mins}m`;
};

const getStatusColor = (status: string) => {
  if (status === "Excellent") return "bg-emerald-500/20 text-emerald-200 border-emerald-500/40";
  if (status === "Good") return "bg-sky-500/20 text-sky-200 border-sky-500/40";
  return "bg-amber-500/20 text-amber-200 border-amber-500/40";
};

const ProgressRing = ({ value, label }: { value: number; label: string }) => {
  const radius = 44;
  const circumference = 2 * Math.PI * radius;
  const progress = Math.min(100, Math.max(0, value));
  const offset = circumference - (progress / 100) * circumference;

  return (
    <div className="flex flex-col items-center gap-2">
      <svg width="120" height="120" className="text-slate-700">
        <circle cx="60" cy="60" r={radius} stroke="currentColor" strokeWidth="10" fill="transparent" />
        <circle
          cx="60"
          cy="60"
          r={radius}
          stroke="url(#ringGradient)"
          strokeWidth="10"
          fill="transparent"
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          strokeLinecap="round"
        />
        <defs>
          <linearGradient id="ringGradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#38bdf8" />
            <stop offset="100%" stopColor="#a855f7" />
          </linearGradient>
        </defs>
        <text x="60" y="64" textAnchor="middle" className="fill-white text-xl font-semibold">
          {Math.round(progress)}
        </text>
      </svg>
      <span className="text-xs uppercase tracking-[0.2em] text-slate-400">{label}</span>
    </div>
  );
};

const Heatmap = ({ activity }: { activity: Array<{ date: string; count: number }> }) => {
  const activityMap = useMemo(() => new Map(activity.map((item) => [item.date, item.count])), [activity]);
  const today = new Date();
  const days: Array<{ date: string; count: number }> = [];
  for (let i = 111; i >= 0; i -= 1) {
    const date = new Date(today);
    date.setDate(today.getDate() - i);
    const key = date.toLocaleDateString("en-CA", { timeZone: "Asia/Kolkata" });
    days.push({ date: key, count: activityMap.get(key) || 0 });
  }
  const max = Math.max(1, ...days.map((d) => d.count));

  return (
    <div className="grid grid-cols-16 gap-1">
      {days.map((day) => {
        const intensity = day.count / max;
        const bg = intensity === 0
          ? "bg-slate-800/40"
          : intensity > 0.7
          ? "bg-emerald-500"
          : intensity > 0.4
          ? "bg-emerald-400"
          : "bg-emerald-300/80";
        return <div key={day.date} className={`h-3 w-3 rounded-sm ${bg}`} title={`${day.date}: ${day.count}`} />;
      })}
    </div>
  );
};

export default function AnalyticsDashboardPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [data, setData] = useState<AnalyticsResponse | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/");
    }
  }, [status, router]);

  useEffect(() => {
    const load = async () => {
      try {
        const res = await fetch("/api/analytics");
        if (res.ok) {
          setData(await res.json());
        }
      } finally {
        setLoading(false);
      }
    };
    if (status === "authenticated") {
      load();
    }
  }, [status]);

  if (loading) {
    return <div className="container mx-auto px-4 py-12">Loading analytics...</div>;
  }

  if (!session?.user || !data) {
    return <div className="container mx-auto px-4 py-12">No analytics data available yet.</div>;
  }

  const { summary, distributions, trends, activity, insights, charts } = data;

  return (
    <div className="container mx-auto px-4 py-12 space-y-10">
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
        <div>
          <h1 className="text-3xl font-bold text-white">Analytics Dashboard</h1>
          <p className="text-sm text-slate-400 mt-2">Your communication-first performance report with clear next steps.</p>
        </div>
        <Badge variant="outline" className={`border ${getStatusColor(summary.overallStatus)}`}>
          {summary.overallStatus}
        </Badge>
      </div>

      <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        <Card className="border-slate-800/70 bg-slate-900/60">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-sm font-medium text-slate-300">
              <Gauge className="h-4 w-4 text-sky-400" /> Overall Performance
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-semibold text-white">{Math.round(summary.overallScore)}</div>
            <p className="text-xs text-slate-400 mt-2">Status: {summary.overallStatus}</p>
          </CardContent>
        </Card>
        <Card className="border-slate-800/70 bg-slate-900/60">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-sm font-medium text-slate-300">
              <MessageSquare className="h-4 w-4 text-emerald-400" /> Communication Score
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-semibold text-white">{Math.round(summary.communicationScore)}</div>
            <p className="text-xs text-slate-400 mt-2">Clarity, grammar, confidence combined</p>
          </CardContent>
        </Card>
        <Card className="border-slate-800/70 bg-slate-900/60">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-sm font-medium text-slate-300">
              <BrainCircuit className="h-4 w-4 text-purple-400" /> Technical Knowledge
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-semibold text-white">{Math.round(summary.technicalScore)}</div>
            <p className="text-xs text-slate-400 mt-2">Accuracy across technical questions</p>
          </CardContent>
        </Card>
        <Card className="border-slate-800/70 bg-slate-900/60">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-sm font-medium text-slate-300">
              <Timer className="h-4 w-4 text-amber-400" /> Avg Time / Question
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-semibold text-white">{summary.avgTimePerQuestion}m</div>
            <p className="text-xs text-slate-400 mt-2">Total practice {formatDuration(summary.totalDurationMinutes)}</p>
          </CardContent>
        </Card>
      </section>

      <section className="grid gap-6 lg:grid-cols-3">
        <Card className="border-slate-800/70 bg-slate-900/60 lg:col-span-1">
          <CardHeader>
            <CardTitle className="text-sm font-medium text-slate-300">Communication Skills</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <ProgressRing value={summary.communicationScore} label="Communication" />
            <div className="space-y-3">
              <div>
                <div className="flex items-center justify-between text-xs text-slate-400">
                  <span>Confidence</span>
                  <span>{Math.round(summary.confidenceScore)}</span>
                </div>
                <div className="h-2 bg-slate-800 rounded-full mt-1">
                  <div className="h-2 rounded-full bg-sky-400" style={{ width: `${summary.confidenceScore}%` }} />
                </div>
              </div>
              <div>
                <div className="flex items-center justify-between text-xs text-slate-400">
                  <span>Grammar Accuracy</span>
                  <span>{Math.round(summary.grammarScore)}</span>
                </div>
                <div className="h-2 bg-slate-800 rounded-full mt-1">
                  <div className="h-2 rounded-full bg-emerald-400" style={{ width: `${summary.grammarScore}%` }} />
                </div>
              </div>
              <div>
                <div className="flex items-center justify-between text-xs text-slate-400">
                  <span>Vocabulary Usage</span>
                  <span>{Math.round(summary.vocabularyScore)}</span>
                </div>
                <div className="h-2 bg-slate-800 rounded-full mt-1">
                  <div className="h-2 rounded-full bg-purple-400" style={{ width: `${summary.vocabularyScore}%` }} />
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-slate-800/70 bg-slate-900/60 lg:col-span-2">
          <CardHeader>
            <CardTitle className="text-sm font-medium text-slate-300 flex items-center gap-2">
              <TrendingUp className="h-4 w-4 text-sky-400" /> Skill Progress Over Time
            </CardTitle>
          </CardHeader>
          <CardContent className="h-[280px]">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={trends}>
                <CartesianGrid strokeDasharray="3 3" stroke="#1f2937" />
                <XAxis dataKey="date" stroke="#94a3b8" fontSize={10} tickLine={false} axisLine={false} />
                <YAxis stroke="#94a3b8" fontSize={10} tickLine={false} axisLine={false} />
                <Tooltip contentStyle={{ background: "#0f172a", border: "1px solid #1e293b" }} />
                <Line type="monotone" dataKey="communication" stroke="#38bdf8" strokeWidth={2} dot={false} />
                <Line type="monotone" dataKey="confidence" stroke="#a855f7" strokeWidth={2} dot={false} />
                <Line type="monotone" dataKey="grammar" stroke="#22c55e" strokeWidth={2} dot={false} />
                <Line type="monotone" dataKey="technical" stroke="#f97316" strokeWidth={2} dot={false} />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </section>

      <section className="grid gap-6 lg:grid-cols-3">
        <Card className="border-slate-800/70 bg-slate-900/60">
          <CardHeader>
            <CardTitle className="text-sm font-medium text-slate-300 flex items-center gap-2">
              <Activity className="h-4 w-4 text-emerald-400" /> Practice Statistics
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4 text-sm text-slate-300">
            <div className="flex items-center justify-between"><span>Total Questions</span><span className="text-white font-semibold">{summary.totalQuestions}</span></div>
            <div className="flex items-center justify-between"><span>Total Sessions</span><span className="text-white font-semibold">{summary.totalSessions}</span></div>
            <div className="flex items-center justify-between"><span>Completion Consistency</span><span className="text-white font-semibold">{summary.completionRate}%</span></div>
            <div className="flex items-center justify-between"><span>Companies Practiced</span><span className="text-white font-semibold">{summary.totalCompanies}</span></div>
            <div className="flex items-center justify-between"><span>Total Practice Time</span><span className="text-white font-semibold">{formatDuration(summary.totalDurationMinutes)}</span></div>
          </CardContent>
        </Card>

        <Card className="border-slate-800/70 bg-slate-900/60 lg:col-span-2">
          <CardHeader>
            <CardTitle className="text-sm font-medium text-slate-300 flex items-center gap-2">
              <Target className="h-4 w-4 text-purple-400" /> Practice Distribution by Module
            </CardTitle>
          </CardHeader>
          <CardContent className="h-[260px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={distributions.module}>
                <CartesianGrid strokeDasharray="3 3" stroke="#1f2937" />
                <XAxis dataKey="name" stroke="#94a3b8" fontSize={10} tickLine={false} axisLine={false} />
                <YAxis stroke="#94a3b8" fontSize={10} tickLine={false} axisLine={false} />
                <Tooltip contentStyle={{ background: "#0f172a", border: "1px solid #1e293b" }} />
                <Bar dataKey="count" fill="#38bdf8" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </section>

      <section className="grid gap-6 lg:grid-cols-3">
        <Card className="border-slate-800/70 bg-slate-900/60">
          <CardHeader>
            <CardTitle className="text-sm font-medium text-slate-300 flex items-center gap-2">
              <Flame className="h-4 w-4 text-amber-400" /> Activity Heatmap
            </CardTitle>
          </CardHeader>
          <CardContent>
            <Heatmap activity={activity} />
          </CardContent>
        </Card>

        <Card className="border-slate-800/70 bg-slate-900/60">
          <CardHeader>
            <CardTitle className="text-sm font-medium text-slate-300 flex items-center gap-2">
              <Mic2 className="h-4 w-4 text-emerald-400" /> Communication vs Confidence
            </CardTitle>
          </CardHeader>
          <CardContent className="h-[260px]">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={[{ name: "Communication", value: summary.communicationScore }, { name: "Confidence", value: summary.confidenceScore }]}>
                <defs>
                  <linearGradient id="areaGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#38bdf8" stopOpacity={0.8} />
                    <stop offset="100%" stopColor="#38bdf8" stopOpacity={0.1} />
                  </linearGradient>
                </defs>
                <XAxis dataKey="name" stroke="#94a3b8" fontSize={10} tickLine={false} axisLine={false} />
                <YAxis stroke="#94a3b8" fontSize={10} tickLine={false} axisLine={false} />
                <Tooltip contentStyle={{ background: "#0f172a", border: "1px solid #1e293b" }} />
                <Area type="monotone" dataKey="value" stroke="#38bdf8" fill="url(#areaGrad)" />
              </AreaChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card className="border-slate-800/70 bg-slate-900/60">
          <CardHeader>
            <CardTitle className="text-sm font-medium text-slate-300 flex items-center gap-2">
              <ArrowUpRight className="h-4 w-4 text-sky-400" /> Accuracy vs Speed
            </CardTitle>
          </CardHeader>
          <CardContent className="h-[260px]">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={charts.accuracyVsSpeed}>
                <CartesianGrid strokeDasharray="3 3" stroke="#1f2937" />
                <XAxis dataKey="duration" stroke="#94a3b8" fontSize={10} tickLine={false} axisLine={false} />
                <YAxis stroke="#94a3b8" fontSize={10} tickLine={false} axisLine={false} />
                <Tooltip contentStyle={{ background: "#0f172a", border: "1px solid #1e293b" }} />
                <Line type="monotone" dataKey="score" stroke="#f97316" strokeWidth={2} dot={{ r: 3 }} />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </section>

      <section className="grid gap-6 lg:grid-cols-2">
        <Card className="border-slate-800/70 bg-slate-900/60">
          <CardHeader>
            <CardTitle className="text-sm font-medium text-slate-300 flex items-center gap-2">
              <CheckCircle2 className="h-4 w-4 text-emerald-400" /> Strengths & Focus Areas
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <p className="text-xs uppercase tracking-[0.2em] text-slate-500">Most Practiced</p>
              <div className="mt-2 flex flex-wrap gap-2">
                {insights.mostPracticed.map((item) => (
                  <Badge key={item.name} variant="outline" className="border-emerald-500/40 text-emerald-200">
                    {item.name} ({item.count})
                  </Badge>
                ))}
              </div>
            </div>
            <div>
              <p className="text-xs uppercase tracking-[0.2em] text-slate-500">Least Practiced</p>
              <div className="mt-2 flex flex-wrap gap-2">
                {insights.leastPracticed.map((item) => (
                  <Badge key={item.name} variant="outline" className="border-amber-500/40 text-amber-200">
                    {item.name} ({item.count})
                  </Badge>
                ))}
              </div>
            </div>
            <Separator className="bg-slate-800" />
            <div>
              <p className="text-xs uppercase tracking-[0.2em] text-slate-500">Focus Areas</p>
              <div className="mt-2 flex flex-wrap gap-2">
                {insights.focusAreas.map((area) => (
                  <Badge key={area} variant="outline" className="border-sky-500/40 text-sky-200">
                    {area}
                  </Badge>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-slate-800/70 bg-slate-900/60">
          <CardHeader>
            <CardTitle className="text-sm font-medium text-slate-300 flex items-center gap-2">
              <TrendingUp className="h-4 w-4 text-purple-400" /> AI Insights
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <p className="text-xs uppercase tracking-[0.2em] text-slate-500">Common Grammar Patterns</p>
              <div className="flex flex-wrap gap-2">
                {(insights.commonGrammarIssues.length ? insights.commonGrammarIssues : ["Not enough data yet"]).map((issue) => (
                  <Badge key={issue} variant="outline" className="border-purple-500/40 text-purple-200">
                    {issue}
                  </Badge>
                ))}
              </div>
            </div>
            <div className="space-y-2">
              <p className="text-xs uppercase tracking-[0.2em] text-slate-500">Confidence Drop Points</p>
              <p className="text-sm text-slate-300">{insights.confidenceDropPercent}% of long sessions show confidence dips.</p>
            </div>
            <div className="space-y-2">
              <p className="text-xs uppercase tracking-[0.2em] text-slate-500">Personalized Tips</p>
              <ul className="space-y-2 text-sm text-slate-300">
                {insights.tips.map((tip) => (
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

      <div className="flex justify-end">
        <Button variant="outline" onClick={() => router.push("/train")}>Start Next Practice</Button>
      </div>
    </div>
  );
}
