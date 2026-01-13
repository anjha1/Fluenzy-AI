import prisma from "@/lib/prisma";
import { getToken } from "next-auth/jwt";
import { NextRequest, NextResponse } from "next/server";

const MODULE_USAGE_FIELDS = {
  english: "englishUsage",
  daily: "dailyUsage",
  hr: "hrUsage",
  technical: "technicalUsage",
  company: "companyUsage",
  mock: "mockUsage",
} as const;

const TRAINING_LIMIT = 3;

export async function GET(request: NextRequest) {
  try {
    const token = await getToken({ req: request });

    if (!token?.email) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const user = await prisma.users.findUnique({
      where: { email: token.email as string },
      select: {
        id: true,
        plan: true,
        englishUsage: true,
        dailyUsage: true,
        hrUsage: true,
        technicalUsage: true,
        companyUsage: true,
        mockUsage: true,
      },
    });

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    const usage = {
      english: user.englishUsage,
      daily: user.dailyUsage,
      hr: user.hrUsage,
      technical: user.technicalUsage,
      company: user.companyUsage,
      mock: user.mockUsage,
    };

    // For Pro users, always allow
    const canUse = user.plan === "Pro" ? {
      english: true,
      daily: true,
      hr: true,
      technical: true,
      company: true,
      mock: true,
    } : {
      english: user.englishUsage < TRAINING_LIMIT,
      daily: user.dailyUsage < TRAINING_LIMIT,
      hr: user.hrUsage < TRAINING_LIMIT,
      technical: user.technicalUsage < TRAINING_LIMIT,
      company: user.companyUsage < TRAINING_LIMIT,
      mock: user.mockUsage < TRAINING_LIMIT,
    };

    const remaining = user.plan === "Pro" ? {
      english: "Unlimited",
      daily: "Unlimited",
      hr: "Unlimited",
      technical: "Unlimited",
      company: "Unlimited",
      mock: "Unlimited",
    } : {
      english: Math.max(0, TRAINING_LIMIT - user.englishUsage),
      daily: Math.max(0, TRAINING_LIMIT - user.dailyUsage),
      hr: Math.max(0, TRAINING_LIMIT - user.hrUsage),
      technical: Math.max(0, TRAINING_LIMIT - user.technicalUsage),
      company: Math.max(0, TRAINING_LIMIT - user.companyUsage),
      mock: Math.max(0, TRAINING_LIMIT - user.mockUsage),
    };

    return NextResponse.json({
      usage,
      canUse,
      remaining,
      plan: user.plan,
      limit: TRAINING_LIMIT,
    });
  } catch (error) {
    console.error("Training usage check error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const token = await getToken({ req: request });

    if (!token?.email) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const { module } = body;

    if (!module || !MODULE_USAGE_FIELDS[module as keyof typeof MODULE_USAGE_FIELDS]) {
      return NextResponse.json({ error: "Invalid module" }, { status: 400 });
    }

    const user = await prisma.users.findUnique({
      where: { email: token.email as string },
      select: {
        id: true,
        plan: true,
        englishUsage: true,
        dailyUsage: true,
        hrUsage: true,
        technicalUsage: true,
        companyUsage: true,
        mockUsage: true,
      },
    });

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    // Pro users don't have limits
    if (user.plan === "Pro") {
      return NextResponse.json({
        success: true,
        message: "Pro user - no limits",
        plan: user.plan,
      });
    }

    const currentUsage = user[MODULE_USAGE_FIELDS[module as keyof typeof MODULE_USAGE_FIELDS] as keyof typeof user] as number;

    if (currentUsage >= TRAINING_LIMIT) {
      return NextResponse.json(
        {
          error: "Usage limit reached",
          usage: currentUsage,
          limit: TRAINING_LIMIT,
          plan: user.plan,
          canUse: false,
        },
        { status: 403 }
      );
    }

    // Increment usage
    const updateData = {
      [MODULE_USAGE_FIELDS[module as keyof typeof MODULE_USAGE_FIELDS]]: currentUsage + 1,
    };

    const updatedUser = await prisma.users.update({
      where: { id: user.id },
      data: updateData,
      select: {
        englishUsage: true,
        dailyUsage: true,
        hrUsage: true,
        technicalUsage: true,
        companyUsage: true,
        mockUsage: true,
        plan: true,
      },
    });

    const newUsage = updatedUser[MODULE_USAGE_FIELDS[module as keyof typeof MODULE_USAGE_FIELDS] as keyof typeof updatedUser] as number;

    return NextResponse.json({
      success: true,
      usage: newUsage,
      limit: TRAINING_LIMIT,
      plan: updatedUser.plan,
      canUse: newUsage < TRAINING_LIMIT,
      remaining: Math.max(0, TRAINING_LIMIT - newUsage),
    });
  } catch (error) {
    console.error("Training usage increment error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}