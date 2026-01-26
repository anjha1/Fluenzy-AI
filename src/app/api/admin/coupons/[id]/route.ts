import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import prisma from "@/lib/prisma";

export async function DELETE(request: NextRequest, context: { params: Promise<{ id: string }> }) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || (session.user.role as any) !== "SUPER_ADMIN") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
    }

    const params = await context.params;
    const { id } = params;

    await (prisma as any).coupon.delete({
      where: { id },
    });

    return NextResponse.json({ message: "Coupon deleted" });
  } catch (error) {
    console.error("Error deleting coupon:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}