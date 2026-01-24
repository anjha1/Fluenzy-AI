import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import prisma from '@/lib/prisma';
import { calculateInterviewScore } from '@/lib/utils';

export async function POST(request: NextRequest) {
  try {
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

    const {
      module,
      targetCompany,
      role,
      startTime,
      endTime,
      transcripts,
      aggregateScore,
      status
    } = await request.json();

    const sessionId = `S_${Date.now()}`;

    const duration = endTime && startTime
      ? Math.round((new Date(endTime).getTime() - new Date(startTime).getTime()) / 60000)
      : null;

    const newSession = await (prisma as any).session.create({
      data: {
        sessionId,
        userId: user.id,
        module,
        targetCompany,
        role,
        startTime: new Date(startTime),
        endTime: endTime ? new Date(endTime) : null,
        duration,
        aggregateScore,
        status,
        transcripts: {
          create: transcripts.map((t: any, index: number) => ({
            turnNumber: index + 1,
            aiPrompt: t.aiPrompt,
            userAnswer: t.userAnswer,
            aiFeedback: t.aiFeedback,
            idealAnswer: t.idealAnswer,
            clarityScore: t.scores?.clarity,
            relevanceScore: t.scores?.relevance,
            grammarScore: t.scores?.grammar,
            confidenceScore: t.scores?.confidence,
            technicalAccuracyScore: t.scores?.technicalAccuracy,
            perQuestionScore: t.perQuestionScore
          }))
        }
      },
      include: {
        transcripts: true
      }
    });

    // Calculate real score based on transcripts
    const { score, status: calculatedStatus } = calculateInterviewScore(newSession.transcripts, duration || undefined);

    // Update the session with real score
    await (prisma as any).session.update({
      where: { id: newSession.id },
      data: {
        aggregateScore: score / 100, // Store as decimal
        status: calculatedStatus
      }
    });

    return NextResponse.json({ sessionId: newSession.sessionId });
  } catch (error) {
    console.error('Session save error:', error);
    return NextResponse.json({ error: 'Failed to save session' }, { status: 500 });
  }
}

export async function GET(request: NextRequest) {
  try {
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

    const sessions = await (prisma as any).session.findMany({
      where: { userId: user.id },
      orderBy: { createdAt: 'desc' },
      select: {
        sessionId: true,
        module: true,
        createdAt: true,
        aggregateScore: true,
        status: true,
        targetCompany: true,
        role: true,
        duration: true
      }
    });

    return NextResponse.json(sessions);
  } catch (error) {
    console.error('Sessions fetch error:', error);
    return NextResponse.json({ error: 'Failed to fetch sessions' }, { status: 500 });
  }
}