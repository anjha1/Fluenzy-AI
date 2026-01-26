import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import prisma from "@/lib/prisma";

export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    if (!session || (session.user.role as any) !== "SUPER_ADMIN") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
    }

    const settings = await (prisma as any).globalPlanSettings.findMany();

    // Return as object with plan as key
    const settingsObj: Record<string, any> = {};
    settings.forEach((setting: any) => {
      settingsObj[setting.plan] = {
        monthlyLimit: setting.monthlyLimit,
        lastReset: setting.lastReset,
        updatedAt: setting.updatedAt,
      };
    });

    return NextResponse.json(settingsObj);
  } catch (error) {
    console.error("Error fetching global settings:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

export async function PUT(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || (session.user.role as any) !== "SUPER_ADMIN") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
    }

    const body = await request.json();
    const { freeLimit, proLimit } = body;

    if (freeLimit == null || proLimit == null) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    // Update or create settings
    await (prisma as any).globalPlanSettings.upsert({
      where: { plan: 'Free' },
      update: { monthlyLimit: freeLimit },
      create: { plan: 'Free', monthlyLimit: freeLimit },
    });

    await (prisma as any).globalPlanSettings.upsert({
      where: { plan: 'Pro' },
      update: { monthlyLimit: proLimit },
      create: { plan: 'Pro', monthlyLimit: proLimit },
    });

    return NextResponse.json({ message: "Settings updated successfully" });
  } catch (error) {
    console.error("Error updating global settings:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

// Monthly reset function (can be called by cron)
export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || (session.user.role as any) !== "SUPER_ADMIN") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
    }

    // Reset all users' usage to 0
    await prisma.users.updateMany({
      data: {
        usageCount: 0,
        englishUsage: 0,
        dailyUsage: 0,
        hrUsage: 0,
        technicalUsage: 0,
        companyUsage: 0,
        mockUsage: 0,
        gdUsage: 0,
      },
    });

    // Update last reset timestamp
    await (prisma as any).globalPlanSettings.updateMany({
      data: { lastReset: new Date() },
    });

    return NextResponse.json({ message: "Monthly reset completed" });
  } catch (error) {
    console.error("Error during monthly reset:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}