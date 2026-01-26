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

    const { userId, disabled } = await request.json();

    if (!userId) {
      return NextResponse.json({ error: "Missing userId" }, { status: 400 });
    }

    // Log the action
    console.log(`Super Admin ${session.user.email} ${disabled ? 'disabled' : 'enabled'} user ${userId}`);

    const updatedUser = await prisma.users.update({
      where: { id: userId },
      data: { disabled },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        plan: true,
        usageCount: true,
        usageLimit: true,
        disabled: true,
      },
    });

    return NextResponse.json(updatedUser);
  } catch (error) {
    console.error("Error toggling user:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}