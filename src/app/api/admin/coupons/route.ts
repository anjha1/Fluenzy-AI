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

    const coupons = await prisma.coupon.findMany({
      include: {
        usages: {
          select: {
            userId: true,
            usedAt: true,
            appliedPlan: true,
            originalPrice: true,
            discountAmount: true,
            finalPrice: true,
            couponCode: true,
            user: {
              select: {
                email: true,
              },
            },
          },
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
    });

    return NextResponse.json(coupons);
  } catch (error) {
    console.error("Error fetching coupons:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || (session.user.role as any) !== "SUPER_ADMIN") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
    }

    const body = await request.json();
    const { code, discountType, discountValue, maxUsage, perUserLimit, startDate, expiryDate, applicablePlans, status } = body;

    if (!code || !discountType || discountValue == null) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    // Get user ID - fallback to db lookup if not in session
    let userId: string | undefined = session.user.id;
    if (!userId) {
      const dbUser = await prisma.users.findUnique({
        where: { email: session.user.email },
      });
      userId = dbUser?.id;
    }

    if (!userId) {
      return NextResponse.json({ error: "User ID not found" }, { status: 400 });
    }

    const coupon = await (prisma as any).coupon.create({
      data: {
        code: code.toUpperCase(),
        discountType,
        discountValue,
        maxUsage,
        perUserLimit,
        startDate: startDate ? new Date(startDate) : null,
        expiryDate: expiryDate ? new Date(expiryDate) : null,
        applicablePlans: applicablePlans.map((plan: string) => plan.toUpperCase()),
        status: status || 'active',
        createdBy: userId,
      },
    });

    return NextResponse.json(coupon, { status: 201 });
  } catch (error) {
    console.error("Error creating coupon:", error);
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
    const { id, code, discountType, discountValue, maxUsage, perUserLimit, startDate, expiryDate, applicablePlans, status } = body;

    if (!id) {
      return NextResponse.json({ error: "Coupon ID required" }, { status: 400 });
    }

    const coupon = await (prisma as any).coupon.update({
      where: { id },
      data: {
        code: code ? code.toUpperCase() : undefined,
        discountType,
        discountValue,
        maxUsage,
        perUserLimit,
        startDate: startDate ? new Date(startDate) : null,
        expiryDate: expiryDate ? new Date(expiryDate) : null,
        applicablePlans,
        status,
      },
    });

    return NextResponse.json(coupon);
  } catch (error) {
    console.error("Error updating coupon:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}