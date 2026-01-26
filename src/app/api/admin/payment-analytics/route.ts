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

    // Payment history
    const paymentHistories = await (prisma as any).paymentHistory.findMany({
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
        date: 'desc',
      },
    });

    // Revenue analytics
    const allPayments = await (prisma as any).paymentHistory.findMany({
      where: {
        status: 'paid',
      },
      select: {
        finalAmount: true,
        date: true,
      },
    });

    const totalRevenue = allPayments.reduce((sum: number, p: any) => sum + (p.finalAmount || 0), 0);

    const monthlyRevenue: Record<string, number> = {};
    allPayments.forEach((p: any) => {
      const month = p.date.toISOString().slice(0, 7); // YYYY-MM
      monthlyRevenue[month] = (monthlyRevenue[month] || 0) + (p.finalAmount || 0);
    });

    const monthlyRevenueArray = Object.entries(monthlyRevenue).map(([month, amount]) => ({
      month,
      amount,
    })).sort((a, b) => b.month.localeCompare(a.month));

    // Active subscribers
    const activeSubscribers = await (prisma as any).subscriptions.count({
      where: {
        status: 'active',
      },
    });

    // Plan distribution
    const planDistribution = await (prisma as any).users.groupBy({
      by: ['plan'],
      _count: {
        id: true,
      },
    });

    // Coupon revenue loss
    const couponDiscounts = await (prisma as any).paymentHistory.aggregate({
      _sum: {
        discountAmount: true,
      },
      where: {
        status: 'paid',
        discountAmount: { gt: 0 },
      },
    });

    // Conversion rate (free to paid)
    const totalUsers = await (prisma as any).users.count();
    const paidUsers = await (prisma as any).users.count({
      where: {
        plan: { not: 'Free' },
      },
    });
    const conversionRate = totalUsers > 0 ? (paidUsers / totalUsers) * 100 : 0;

    return NextResponse.json({
      paymentHistories,
      revenue: {
        total: totalRevenue,
        monthly: monthlyRevenueArray,
      },
      subscribers: {
        active: activeSubscribers,
      },
      planDistribution,
      couponLoss: couponDiscounts._sum.discountAmount || 0,
      conversionRate: `${conversionRate.toFixed(2)}%`,
    });
  } catch (error) {
    console.error("Error fetching payment analytics:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}