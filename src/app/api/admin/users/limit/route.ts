import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import prisma from "@/lib/prisma";

export async function PATCH(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || (session.user.role as any) !== "SUPER_ADMIN") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
    }

    const body = await request.json();
    const { userId, usageLimit } = body;

    if (!userId || usageLimit == null) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    await prisma.users.update({
      where: { id: userId },
      data: { usageLimit },
    });

    return NextResponse.json({ message: "Limit updated" });
  } catch (error) {
    console.error("Error updating user limit:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}