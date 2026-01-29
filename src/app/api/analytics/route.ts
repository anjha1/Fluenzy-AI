import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import prisma from "@/lib/prisma";

const normalizeScore = (value?: number | null) => {
  if (value == null || Number.isNaN(value)) return null;
  if (value <= 1) return Math.max(0, Math.min(100, value * 100));
  if (value <= 10) return Math.max(0, Math.min(100, value * 10));
  if (value <= 100) return Math.max(0, Math.min(100, value));
  return Math.max(0, Math.min(100, value));
};

const average = (values: Array<number | null | undefined>) => {
  const filtered = values.filter((v): v is number => typeof v === "number" && !Number.isNaN(v));
  if (!filtered.length) return null;
  return filtered.reduce((sum, v) => sum + v, 0) / filtered.length;
};

const formatDateKey = (value: Date) => value.toLocaleDateString("en-CA", { timeZone: "Asia/Kolkata" });

const getDurationMinutes = (start?: Date | null, end?: Date | null, stored?: number | null) => {
  if (typeof stored === "number" && stored > 0) return stored;
  if (!start || !end) return 0;
  return Math.max(0, Math.round((end.getTime() - start.getTime()) / 60000));
};

const extractGrammarIssues = (feedbacks: string[]) => {
  const patterns: Array<[RegExp, string]> = [
    [/subject[-\s]?verb/i, "Subject-verb agreement"],
    [/tense/i, "Verb tense"],
    [/article/i, "Articles (a/an/the)"],
    [/preposition/i, "Prepositions"],
    [/punctuation/i, "Punctuation"],
    [/spelling/i, "Spelling"],
    [/grammar/i, "General grammar"],
  ];
  const counts = new Map<string, number>();
  feedbacks.forEach((text) => {
    patterns.forEach(([regex, label]) => {
      if (regex.test(text)) {
        counts.set(label, (counts.get(label) || 0) + 1);
      }
    });
  });
  return Array.from(counts.entries())
    .sort((a, b) => b[1] - a[1])
    .slice(0, 4)
    .map(([label]) => label);
};

const generateTips = (scores: {
  communicationScore: number | null;
  confidenceScore: number | null;
  grammarScore: number | null;
  vocabularyScore: number | null;
  technicalScore: number | null;
}) => {
  const tips: string[] = [];
  if (scores.communicationScore != null && scores.communicationScore < 65) {
    tips.push("Practice concise answers with a clear opening, example, and summary.");
  }
  if (scores.confidenceScore != null && scores.confidenceScore < 65) {
    tips.push("Reduce pauses by outlining your response in 2-3 bullet points before speaking.");
  }
  if (scores.grammarScore != null && scores.grammarScore < 70) {
    tips.push("Focus on tense consistency and subject-verb agreement in daily practice.");
  }
  if (scores.vocabularyScore != null && scores.vocabularyScore < 60) {
    tips.push("Introduce 3-5 new advanced words per week and reuse them in mock answers.");
  }
  if (scores.technicalScore != null && scores.technicalScore < 65) {
    tips.push("Spend 20 minutes daily on core concepts and explain them aloud.");
  }
  if (!tips.length) {
    tips.push("Keep a steady weekly schedule and aim to improve response clarity by 5% each week.");
  }
  return tips;
};

export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.email) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const user = await prisma.users.findUnique({ where: { email: session.user.email } });
    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    const sessions = await prisma.session.findMany({
      where: { userId: user.id },
      select: {
        id: true,
        module: true,
        targetCompany: true,
        role: true,
        startTime: true,
        endTime: true,
        duration: true,
        aggregateScore: true,
        status: true,
      },
      orderBy: { startTime: "desc" },
    });

    const sessionIds = sessions.map((s) => s.id);

    const transcripts = sessionIds.length
      ? await prisma.transcript.findMany({
          where: { sessionId: { in: sessionIds } },
          select: {
            sessionId: true,
            turnNumber: true,
            clarityScore: true,
            confidenceScore: true,
            grammarScore: true,
            relevanceScore: true,
            technicalAccuracyScore: true,
            perQuestionScore: true,
            createdAt: true,
            aiFeedback: true,
            userAnswer: true,
          },
          orderBy: { createdAt: "asc" },
        })
      : [];

    const totalDurationMinutes = sessions.reduce(
      (sum, s) => sum + getDurationMinutes(s.startTime, s.endTime, s.duration),
      0
    );

    const totalQuestions = transcripts.length;
    const totalSessions = sessions.length;
    const avgTimePerQuestion = totalQuestions > 0 ? Number((totalDurationMinutes / totalQuestions).toFixed(2)) : 0;

    const communicationScore = normalizeScore(
      average(
        transcripts.map((t) =>
          average([normalizeScore(t.clarityScore), normalizeScore(t.grammarScore), normalizeScore(t.confidenceScore)])
        )
      )
    );

    const confidenceScore = normalizeScore(average(transcripts.map((t) => normalizeScore(t.confidenceScore))));
    const grammarScore = normalizeScore(average(transcripts.map((t) => normalizeScore(t.grammarScore))));

    const vocabularyScore = (() => {
      const words = transcripts
        .map((t) => t.userAnswer || "")
        .join(" ")
        .toLowerCase()
        .replace(/[^a-z0-9\s]/g, " ")
        .split(/\s+/)
        .filter(Boolean);
      if (!words.length) return null;
      const uniqueCount = new Set(words).size;
      const ratio = uniqueCount / words.length;
      return Math.min(100, Math.max(0, ratio * 160));
    })();

    const technicalScore = normalizeScore(
      average(transcripts.map((t) => normalizeScore(t.technicalAccuracyScore))) ??
        average(sessions.map((s) => normalizeScore(s.aggregateScore)))
    );

    const overallScore = normalizeScore(
      average([
        communicationScore ?? 0,
        confidenceScore ?? 0,
        grammarScore ?? 0,
        vocabularyScore ?? 0,
        technicalScore ?? 0,
        normalizeScore(average(sessions.map((s) => normalizeScore(s.aggregateScore)))) ?? 0,
      ])
    );

    const overallStatus = overallScore != null && overallScore >= 80 ? "Excellent" : overallScore != null && overallScore >= 60 ? "Good" : "Needs Improvement";

    const companyCounts = new Map<string, number>();
    const roleCounts = new Map<string, number>();
    const moduleCounts = new Map<string, number>();

    sessions.forEach((sessionItem) => {
      if (sessionItem.targetCompany) {
        companyCounts.set(sessionItem.targetCompany, (companyCounts.get(sessionItem.targetCompany) || 0) + 1);
      }
      if (sessionItem.role) {
        roleCounts.set(sessionItem.role, (roleCounts.get(sessionItem.role) || 0) + 1);
      }
      moduleCounts.set(sessionItem.module, (moduleCounts.get(sessionItem.module) || 0) + 1);
    });

    const totalCompanies = companyCounts.size;

    const moduleLabels: Record<string, string> = {
      english: "Communication Practice",
      hr: "HR Interview",
      technical: "Technical Interview",
      company: "Company Track",
      gd: "Group Discussion",
      daily: "Daily Practice",
      mock: "Mock Interview",
    };

    const moduleDistribution = Array.from(moduleCounts.entries()).map(([module, count]) => ({
      name: moduleLabels[module] || module,
      count,
    }));

    const mostPracticed = [...moduleDistribution].sort((a, b) => b.count - a.count).slice(0, 3);
    const leastPracticed = [...moduleDistribution].sort((a, b) => a.count - b.count).slice(0, 3);

    const trendMap = new Map<string, { date: string; communication: number[]; confidence: number[]; grammar: number[]; technical: number[] }>();
    const activityMap = new Map<string, number>();

    transcripts.forEach((t) => {
      const key = formatDateKey(t.createdAt);
      if (!trendMap.has(key)) {
        trendMap.set(key, { date: key, communication: [], confidence: [], grammar: [], technical: [] });
      }
      const entry = trendMap.get(key)!;
      entry.communication.push(
        average([normalizeScore(t.clarityScore), normalizeScore(t.grammarScore), normalizeScore(t.confidenceScore)]) || 0
      );
      entry.confidence.push(normalizeScore(t.confidenceScore) || 0);
      entry.grammar.push(normalizeScore(t.grammarScore) || 0);
      entry.technical.push(normalizeScore(t.technicalAccuracyScore) || 0);
    });

    sessions.forEach((s) => {
      const key = formatDateKey(s.startTime);
      activityMap.set(key, (activityMap.get(key) || 0) + 1);
    });

    const trends = Array.from(trendMap.values())
      .sort((a, b) => a.date.localeCompare(b.date))
      .map((item) => ({
        date: item.date,
        communication: Math.round((average(item.communication) || 0) * 10) / 10,
        confidence: Math.round((average(item.confidence) || 0) * 10) / 10,
        grammar: Math.round((average(item.grammar) || 0) * 10) / 10,
        technical: Math.round((average(item.technical) || 0) * 10) / 10,
      }));

    const activity = Array.from(activityMap.entries()).map(([date, count]) => ({ date, count }));

    const completionRate = totalSessions > 0 ? Number(((sessions.filter((s) => s.endTime).length / totalSessions) * 100).toFixed(1)) : 0;

    const accuracyVsSpeed = sessions
      .filter((s) => typeof s.aggregateScore === "number" && getDurationMinutes(s.startTime, s.endTime, s.duration) > 0)
      .map((s) => ({
        duration: getDurationMinutes(s.startTime, s.endTime, s.duration),
        score: normalizeScore(s.aggregateScore) || 0,
      }));

    const feedbacks = transcripts.map((t) => t.aiFeedback || "").filter(Boolean);
    const commonGrammarIssues = extractGrammarIssues(feedbacks);

    const sessionsById = new Map<string, typeof transcripts>();
    transcripts.forEach((t) => {
      if (!sessionsById.has(t.sessionId)) sessionsById.set(t.sessionId, []);
      sessionsById.get(t.sessionId)!.push(t);
    });

    let confidenceDropSessions = 0;
    sessionsById.forEach((list) => {
      if (list.length < 6) return;
      const sorted = [...list].sort((a, b) => a.turnNumber - b.turnNumber);
      const third = Math.floor(sorted.length / 3) || 1;
      const early = average(sorted.slice(0, third).map((t) => normalizeScore(t.confidenceScore) || 0)) || 0;
      const late = average(sorted.slice(-third).map((t) => normalizeScore(t.confidenceScore) || 0)) || 0;
      if (late + 8 < early) confidenceDropSessions += 1;
    });

    const confidenceDropPercent = sessionsById.size
      ? Number(((confidenceDropSessions / sessionsById.size) * 100).toFixed(1))
      : 0;

    const focusAreas = [
      { label: "Communication", score: communicationScore ?? 0 },
      { label: "Confidence", score: confidenceScore ?? 0 },
      { label: "Grammar", score: grammarScore ?? 0 },
      { label: "Vocabulary", score: vocabularyScore ?? 0 },
      { label: "Technical", score: technicalScore ?? 0 },
    ]
      .sort((a, b) => a.score - b.score)
      .slice(0, 2)
      .map((item) => item.label);

    const tips = generateTips({
      communicationScore,
      confidenceScore,
      grammarScore,
      vocabularyScore,
      technicalScore,
    });

    return NextResponse.json({
      summary: {
        communicationScore: communicationScore ?? 0,
        confidenceScore: confidenceScore ?? 0,
        grammarScore: grammarScore ?? 0,
        vocabularyScore: vocabularyScore ?? 0,
        technicalScore: technicalScore ?? 0,
        overallScore: overallScore ?? 0,
        overallStatus,
        totalQuestions,
        totalSessions,
        totalDurationMinutes,
        avgTimePerQuestion,
        totalCompanies,
        completionRate,
      },
      distributions: {
        company: Array.from(companyCounts.entries()).map(([name, count]) => ({ name, count })),
        role: Array.from(roleCounts.entries()).map(([name, count]) => ({ name, count })),
        module: moduleDistribution,
      },
      trends,
      activity,
      insights: {
        mostPracticed,
        leastPracticed,
        commonGrammarIssues,
        confidenceDropPercent,
        focusAreas,
        tips,
      },
      charts: {
        accuracyVsSpeed,
      },
    });
  } catch (error) {
    console.error("Analytics fetch error:", error);
    return NextResponse.json({ error: "Failed to load analytics" }, { status: 500 });
  }
}