import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import prisma from '@/lib/prisma';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ sessionId: string }> }
) {
  try {
    const { sessionId } = await params;
    const session = await getServerSession(authOptions);
    if (!session?.user?.email) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const user = await prisma.users.findUnique({
      where: { email: session.user.email }
    });

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    const sessionData = await (prisma as any).session.findFirst({
      where: {
        sessionId: sessionId,
        userId: user.id
      },
      include: {
        transcripts: {
          orderBy: { turnNumber: 'asc' }
        }
      }
    });

    if (!sessionData) {
      return NextResponse.json({ error: 'Session not found' }, { status: 404 });
    }

    // Transform to match the expected format
    const formattedSession = {
      id: sessionData.sessionId,
      date: sessionData.startTime.toLocaleDateString(),
      startTime: sessionData.startTime.toLocaleTimeString(),
      endTime: sessionData.endTime?.toLocaleTimeString() || '',
      durationMinutes: sessionData.duration || 0,
      type: sessionData.module,
      topic: `${sessionData.module} - ${sessionData.targetCompany || 'General'} ${sessionData.role || ''}`,
      score: Math.round((sessionData.aggregateScore || 0) * 100), // Convert to percentage
      feedback: `Session completed with score: ${Math.round((sessionData.aggregateScore || 0) * 100)}%`,
      company: sessionData.targetCompany,
      role: sessionData.role,
      resumeUsed: false,
      resultStatus: sessionData.status === 'PASS' ? 'Selected' : 'Rejected',
      readinessLevel: sessionData.status === 'PASS' ? 'Interview Ready' : 'Needs Practice',
      transcript: sessionData.transcripts.map((t: any) => ({
        speaker: 'AI Interviewer',
        text: t.aiPrompt,
        timestamp: t.createdAt.toLocaleTimeString()
      })).concat(sessionData.transcripts.map((t: any) => ({
        speaker: 'Candidate (You)',
        text: t.userAnswer,
        timestamp: t.createdAt.toLocaleTimeString()
      }))).sort((a: any, b: any) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime()),
      strengths: ['Communication', 'Clarity'],
      weaknesses: ['Vocabulary'],
      mistakes: [],
      skillScores: {
        communication: 80,
        confidence: 85,
        clarity: 75,
        hrReadiness: 82,
        companyFit: 88,
        content: 90
      },
      analytics: {
        totalSpeakingTime: "8m",
        avgAnswerLength: "45s",
        pauseTime: "10s",
        responseSpeed: "Optimal",
        talkingBalance: "Good"
      },
      actionPlan: ["Practice more", "Review feedback"]
    };

    return NextResponse.json(formattedSession);
  } catch (error) {
    console.error('Session fetch error:', error);
    return NextResponse.json({ error: 'Failed to fetch session' }, { status: 500 });
  }
}