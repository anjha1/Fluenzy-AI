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

    const totalUsers = await prisma.users.count();
    const activeSessions = await prisma.session.count({
      where: { endTime: null },
    });
    const totalSessions = await prisma.session.count();
    // For resume parses, assuming it's logged somewhere, for now return 0
    const resumeParses = 0;

    return NextResponse.json({
      totalUsers,
      activeSessions,
      totalSessions,
      resumeParses,
    });
  } catch (error) {
    console.error("Error fetching analytics:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}