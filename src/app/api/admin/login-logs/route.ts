import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import prisma from "@/lib/prisma";

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || (session.user.role as any) !== "SUPER_ADMIN") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
    }

    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('userId');

    let where: any = {};
    if (userId) {
      where.userId = userId;
    }

    const loginLogs = await (prisma as any).userLoginLog.findMany({
      where,
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
      },
      orderBy: {
        loginTime: 'desc',
      },
    });

    // For device analytics, fetch all and aggregate
    const allLogs = await (prisma as any).userLoginLog.findMany({
      where,
      select: {
        deviceType: true,
        os: true,
        browser: true,
        sessionDuration: true,
        userId: true,
      },
    });

    const deviceAnalytics: Record<string, { count: number; totalDuration: number }> = {};
    const osAnalytics: Record<string, number> = {};
    const browserAnalytics: Record<string, number> = {};
    const userDeviceStats: Record<string, Record<string, number>> = {};

    allLogs.forEach((log: any) => {
      if (log.deviceType) {
        if (!deviceAnalytics[log.deviceType]) {
          deviceAnalytics[log.deviceType] = { count: 0, totalDuration: 0 };
        }
        deviceAnalytics[log.deviceType].count++;
        if (log.sessionDuration) {
          deviceAnalytics[log.deviceType].totalDuration += log.sessionDuration;
        }

        if (!userDeviceStats[log.userId]) {
          userDeviceStats[log.userId] = {};
        }
        userDeviceStats[log.userId][log.deviceType] = (userDeviceStats[log.userId][log.deviceType] || 0) + 1;
      }

      if (log.os) {
        osAnalytics[log.os] = (osAnalytics[log.os] || 0) + 1;
      }

      if (log.browser) {
        browserAnalytics[log.browser] = (browserAnalytics[log.browser] || 0) + 1;
      }
    });

    // Convert to arrays
    const deviceAnalyticsArray = Object.entries(deviceAnalytics).map(([device, data]) => ({
      deviceType: device,
      count: data.count,
      totalDuration: data.totalDuration,
    }));

    const osAnalyticsArray = Object.entries(osAnalytics).map(([os, count]) => ({
      os,
      count,
    }));

    const browserAnalyticsArray = Object.entries(browserAnalytics).map(([browser, count]) => ({
      browser,
      count,
    }));

    const userDeviceStatsArray = Object.entries(userDeviceStats).map(([userId, devices]) => ({
      userId,
      devices,
    }));

    return NextResponse.json({
      loginLogs,
      deviceAnalytics: deviceAnalyticsArray,
      osAnalytics: osAnalyticsArray,
      browserAnalytics: browserAnalyticsArray,
      userDeviceStats: userDeviceStatsArray,
    });
  } catch (error) {
    console.error("Error fetching login logs:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}