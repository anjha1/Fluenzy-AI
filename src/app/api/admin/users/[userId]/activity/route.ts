import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import prisma from "@/lib/prisma";

export async function GET(
  request: NextRequest,
  context: { params: Promise<{ userId: string }> }
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || (session.user.role as any) !== "SUPER_ADMIN") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
    }

    const params = await context.params;
    const { userId } = params;

    // Fetch user with all related data
    const user = await (prisma as any).users.findUnique({
      where: { id: userId },
      include: {
        sessions: {
          orderBy: { startTime: 'desc' },
        },
        lessonProgress: {
          orderBy: { completedAt: 'desc' },
        },
        hrProgress: {
          orderBy: { completedAt: 'desc' },
        },
        resumes: {
          orderBy: { uploadedAt: 'desc' },
        },
        loginLogs: {
          orderBy: { loginTime: 'desc' },
          take: 10, // Last 10 logins
        },
        subscriptions: {
          orderBy: { createdAt: 'desc' },
          take: 1, // Latest subscription
        },
        paymentHistories: {
          orderBy: { date: 'desc' },
        },
      },
    });

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    // Calculate analytics
    const totalTimeSpent = user.sessions.reduce((sum: number, session: any) => sum + (session.duration || 0), 0);
    const totalSessions = user.sessions.length;

    // English Learning analytics
    const englishLessons = user.lessonProgress;
    const englishCompleted = englishLessons.filter((l: any) => l.isCompleted).length;
    const englishPending = englishLessons.filter((l: any) => !l.isCompleted).length;
    const englishCompletionPercentage = englishLessons.length > 0 ? (englishCompleted / englishLessons.length) * 100 : 0;

    // HR Interview analytics
    const hrSessions = user.sessions.filter((s: any) => s.module === 'hr');
    const hrTimeSpent = hrSessions.reduce((sum: number, s: any) => sum + (s.duration || 0), 0);
    const hrAverageScore = hrSessions.length > 0 ? hrSessions.reduce((sum: number, s: any) => sum + (s.aggregateScore || 0), 0) / hrSessions.length : 0;
    const hrBestScore = Math.max(...hrSessions.map((s: any) => s.aggregateScore || 0), 0);

    // Technical Mastery analytics
    const techSessions = user.sessions.filter((s: any) => s.module === 'technical');
    const techTimeSpent = techSessions.reduce((sum: number, s: any) => sum + (s.duration || 0), 0);

    // Company Tracks analytics
    const companySessions = user.sessions.filter((s: any) => s.module === 'company');
    const companyTimeSpent = companySessions.reduce((sum: number, s: any) => sum + (s.duration || 0), 0);

    // GD Agent analytics
    const gdSessions = user.sessions.filter((s: any) => s.module === 'gd');
    const gdTimeSpent = gdSessions.reduce((sum: number, s: any) => sum + (s.duration || 0), 0);
    const gdAverageScore = gdSessions.length > 0 ? gdSessions.reduce((sum: number, s: any) => sum + (s.aggregateScore || 0), 0) / gdSessions.length : 0;

    // Time analytics
    const moduleTimeBreakdown = {
      english: user.sessions.filter((s: any) => s.module === 'english').reduce((sum: number, s: any) => sum + (s.duration || 0), 0),
      hr: hrTimeSpent,
      technical: techTimeSpent,
      company: companyTimeSpent,
      gd: gdTimeSpent,
    };

    // Resume details
    const latestResume = user.resumes[0];

    const response = {
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        plan: user.plan,
        role: user.role,
        disabled: user.disabled,
        createdAt: user.createdAt,
        renewalDate: user.renewalDate,
        lastActive: user.loginLogs[0]?.loginTime || null,
        totalTimeSpent,
        totalSessions,
      },
      resume: latestResume ? {
        fileName: latestResume.fileName,
        fileUrl: latestResume.fileUrl,
        uploadedAt: latestResume.uploadedAt,
      } : null,
      englishLearning: {
        totalTimeSpent: moduleTimeBreakdown.english,
        totalLessons: englishLessons.length,
        completedLessons: englishCompleted,
        pendingLessons: englishPending,
        completionPercentage: englishCompletionPercentage,
        lessons: englishLessons.map((l: any) => ({
          lessonId: l.lessonId,
          isCompleted: l.isCompleted,
          completedAt: l.completedAt,
          score: l.score,
        })),
      },
      hrInterview: {
        totalSessions: hrSessions.length,
        totalTimeSpent: hrTimeSpent,
        averageScore: hrAverageScore,
        bestScore: hrBestScore,
        sessions: hrSessions.map((s: any) => ({
          id: s.id,
          targetCompany: s.targetCompany,
          role: s.role,
          startTime: s.startTime,
          duration: s.duration,
          aggregateScore: s.aggregateScore,
          status: s.status,
          resumeId: s.resumeId,
        })),
      },
      technicalMastery: {
        totalSessions: techSessions.length,
        totalTimeSpent: techTimeSpent,
        sessions: techSessions.map((s: any) => ({
          id: s.id,
          startTime: s.startTime,
          duration: s.duration,
          aggregateScore: s.aggregateScore,
          status: s.status,
        })),
      },
      companyTracks: {
        totalSessions: companySessions.length,
        totalTimeSpent: companyTimeSpent,
        sessions: companySessions.map((s: any) => ({
          id: s.id,
          targetCompany: s.targetCompany,
          role: s.role,
          startTime: s.startTime,
          duration: s.duration,
          aggregateScore: s.aggregateScore,
          status: s.status,
        })),
      },
      gdAgent: {
        totalSessions: gdSessions.length,
        totalTimeSpent: gdTimeSpent,
        averageScore: gdAverageScore,
        sessions: gdSessions.map((s: any) => ({
          id: s.id,
          startTime: s.startTime,
          duration: s.duration,
          aggregateScore: s.aggregateScore,
          status: s.status,
        })),
      },
      timeAnalytics: {
        moduleBreakdown: moduleTimeBreakdown,
        totalTimeSpent,
      },
      recentActivity: user.loginLogs.slice(0, 5).map((log: any) => ({
        loginTime: log.loginTime,
        logoutTime: log.logoutTime,
        sessionDuration: log.sessionDuration,
        deviceType: log.deviceType,
        status: log.status,
      })),
      subscription: user.subscriptions[0] ? {
        plan: user.subscriptions[0].plan,
        status: user.subscriptions[0].status,
        currentPeriodEnd: user.subscriptions[0].currentPeriodEnd,
        autoRenew: user.subscriptions[0].autoRenew,
      } : null,
      payments: user.paymentHistories.map((p: any) => ({
        id: p.id,
        originalAmount: p.originalAmount,
        discountAmount: p.discountAmount,
        finalAmount: p.finalAmount,
        couponUsed: p.couponUsed,
        status: p.status,
        date: p.date,
      })),
    };

    return NextResponse.json(response);
  } catch (error) {
    console.error("Error fetching user activity:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}