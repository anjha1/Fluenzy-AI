import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import Razorpay from "razorpay";
import prisma from "@/lib/prisma";
import crypto from "crypto";

const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_API_KEY!,
  key_secret: process.env.RAZORPAY_API_SECRET!,
});

export async function POST(request: NextRequest) {
  try {
    // Validate Razorpay credentials at runtime
    if (!process.env.RAZORPAY_API_KEY || !process.env.RAZORPAY_API_SECRET) {
      return NextResponse.json({ error: "Razorpay credentials not configured" }, { status: 500 });
    }

    const authSession = await getServerSession(authOptions);

    if (!authSession?.user?.email) {
      return NextResponse.json({ error: "Authentication required" }, { status: 401 });
    }

    let couponCode = '';
    let targetPlan = 'Pro'; // Default to Pro for backward compatibility
    try {
      const body = await request.json();
      couponCode = body?.couponCode || '';
      targetPlan = body?.targetPlan || 'Pro';
    } catch (e) {
      // No body or invalid JSON, continue with defaults
    }

    // Get user
    const user = await prisma.users.findUnique({
      where: { email: authSession.user.email },
    });

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    // Get plan pricing
    const planPricing = await (prisma as any).planPricing.findUnique({
      where: { plan: targetPlan },
    });

    if (!planPricing) {
      return NextResponse.json({ error: `Pricing not found for plan: ${targetPlan}` }, { status: 400 });
    }

    // Handle coupon logic
    let finalAmount = planPricing.price * 100; // Convert to paise
    let appliedCoupon: any = null;

    if (couponCode) {
      const trimmedCode = couponCode.trim().toUpperCase();
      const coupon = await (prisma as any).coupon.findFirst({
        where: {
          code: {
            equals: trimmedCode,
            mode: 'insensitive'
          }
        },
      });

      if (!coupon) {
        return NextResponse.json({ error: "Invalid coupon code" }, { status: 400 });
      }

      // Status validation - case insensitive
      if (coupon.status?.toLowerCase() !== 'active') {
        return NextResponse.json({ error: "This coupon is currently disabled" }, { status: 400 });
      }

      // Date validation
      const now = new Date();
      if (coupon.startDate && now < coupon.startDate) {
        return NextResponse.json({ error: "Coupon not active yet" }, { status: 400 });
      }
      if (coupon.expiryDate && now > coupon.expiryDate) {
        return NextResponse.json({ error: "Coupon has expired" }, { status: 400 });
      }

      // Applicable plans validation
      if (coupon.applicablePlans && coupon.applicablePlans.length > 0 && !coupon.applicablePlans.includes(targetPlan)) {
        return NextResponse.json({ error: "Coupon not valid for this plan" }, { status: 400 });
      }

      // Max total usage validation
      const totalUsageCount = await (prisma as any).couponUsage.count({
        where: { couponId: coupon.id },
      });
      if (coupon.maxUsage && totalUsageCount >= coupon.maxUsage) {
        return NextResponse.json({ error: "Coupon usage limit reached" }, { status: 400 });
      }

      // Per user limit validation
      const userUsageCount = await (prisma as any).couponUsage.count({
        where: { couponId: coupon.id, userId: user.id },
      });
      if (userUsageCount >= coupon.perUserLimit) {
        return NextResponse.json({ error: "You have already used this coupon" }, { status: 400 });
      }

      appliedCoupon = coupon;

      // Apply discount
      if (coupon.discountType?.toUpperCase() === 'PERCENTAGE') {
        finalAmount = finalAmount * (1 - coupon.discountValue / 100);
      } else {
        finalAmount = Math.max(0, finalAmount - coupon.discountValue * 100);
      }
    }

    // Check for 100% discount (free upgrade)
    const isFreeUpgrade = appliedCoupon && (
      (appliedCoupon.discountType?.toUpperCase() === 'PERCENTAGE' && appliedCoupon.discountValue === 100) ||
      (appliedCoupon.discountType?.toUpperCase() === 'FLAT' && appliedCoupon.discountValue * 100 >= planPricing.price * 100)
    );

    if (isFreeUpgrade) {
      try {
        await prisma.users.update({
          where: { id: user.id },
          data: {
            plan: targetPlan as any,
            usageLimit: targetPlan === 'Standard' ? 999999 : (targetPlan === 'Pro' ? 100 : 3),
            renewalDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 days
          },
        });

        await (prisma as any).couponUsage.create({
          data: {
            couponId: appliedCoupon.id,
            userId: user.id,
          },
        });

        await (prisma as any).paymentHistory.create({
          data: {
            userId: user.id,
            originalAmount: planPricing.price,
            discountAmount: planPricing.price,
            finalAmount: 0,
            paymentMethod: 'coupon',
            status: 'free_via_coupon',
            couponUsed: appliedCoupon.code,
            couponType: appliedCoupon.discountType,
            date: new Date(),
          },
        });

        return NextResponse.json({
          success: true,
          message: `Successfully upgraded to ${targetPlan} with 100% discount coupon!`,
          plan: targetPlan
        });
      } catch (upgradeError) {
        console.error("Free upgrade error:", upgradeError);
        return NextResponse.json({ error: "Failed to process free upgrade" }, { status: 500 });
      }
    }

    // Create Razorpay order
    const receipt = `rcpt_${Date.now().toString(36)}_${crypto.randomUUID().replace(/-/g, "").slice(0, 8)}`;
    const options = {
      amount: Math.round(finalAmount), // Amount in paise
      currency: "INR",
      receipt,
      notes: {
        userId: user.id,
        email: user.email,
        targetPlan: targetPlan,
        couponCode: appliedCoupon?.code || '',
      },
    };

    const order = await razorpay.orders.create(options);

    return NextResponse.json({
      orderId: order.id,
      amount: order.amount,
      currency: order.currency,
      key: process.env.RAZORPAY_API_KEY,
      notes: order.notes,
    });
  } catch (error) {
    console.error("Razorpay order creation error:", error);
    return NextResponse.json(
      { error: "Failed to create order" },
      { status: 500 }
    );
  }
}