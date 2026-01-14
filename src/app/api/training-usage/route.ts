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
  gd: "gdUsage",
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
        gdUsage: true,
      },
    });

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    const usage = {
      english: user.englishUsage ?? 0,
      daily: user.dailyUsage ?? 0,
      hr: user.hrUsage ?? 0,
      technical: user.technicalUsage ?? 0,
      company: user.companyUsage ?? 0,
      mock: user.mockUsage ?? 0,
      gd: user.gdUsage ?? 0,
    };

    // For Pro users, always allow
    const isPro = user.plan?.toString().toLowerCase() === 'pro';
    const canUse = isPro ? {
      english: true,
      daily: true,
      hr: true,
      technical: true,
      company: true,
      mock: true,
      gd: true,
    } : {
      english: (user.englishUsage ?? 0) < TRAINING_LIMIT,
      daily: (user.dailyUsage ?? 0) < TRAINING_LIMIT,
      hr: (user.hrUsage ?? 0) < TRAINING_LIMIT,
      technical: (user.technicalUsage ?? 0) < TRAINING_LIMIT,
      company: (user.companyUsage ?? 0) < TRAINING_LIMIT,
      mock: (user.mockUsage ?? 0) < TRAINING_LIMIT,
      gd: (user.gdUsage ?? 0) < TRAINING_LIMIT,
    };

    const remaining = isPro ? {
      english: "Unlimited",
      daily: "Unlimited",
      hr: "Unlimited",
      technical: "Unlimited",
      company: "Unlimited",
      mock: "Unlimited",
      gd: "Unlimited",
    } : {
      english: Math.max(0, TRAINING_LIMIT - (user.englishUsage ?? 0)),
      daily: Math.max(0, TRAINING_LIMIT - (user.dailyUsage ?? 0)),
      hr: Math.max(0, TRAINING_LIMIT - (user.hrUsage ?? 0)),
      technical: Math.max(0, TRAINING_LIMIT - (user.technicalUsage ?? 0)),
      company: Math.max(0, TRAINING_LIMIT - (user.companyUsage ?? 0)),
      mock: Math.max(0, TRAINING_LIMIT - (user.mockUsage ?? 0)),
      gd: Math.max(0, TRAINING_LIMIT - (user.gdUsage ?? 0)),
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
        gdUsage: true,
      },
    });

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    // Pro users don't have limits
    if (user.plan?.toString().toLowerCase() === 'pro') {
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
        gdUsage: true,
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