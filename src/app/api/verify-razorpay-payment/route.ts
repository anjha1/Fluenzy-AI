import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import prisma from "@/lib/prisma";
import crypto from "crypto";

export async function POST(request: NextRequest) {
  try {
    const authSession = await getServerSession(authOptions);

    if (!authSession?.user?.email) {
      return NextResponse.json({ error: "Authentication required" }, { status: 401 });
    }

    const body = await request.json();
    const {
      razorpay_payment_id,
      razorpay_order_id,
      razorpay_signature,
      order_id,
      plan,
      couponCode,
    } = body;

    if (!razorpay_payment_id || !razorpay_order_id || !razorpay_signature) {
      return NextResponse.json({ error: "Missing payment verification data" }, { status: 400 });
    }

    // Verify payment signature
    const sign = razorpay_order_id + "|" + razorpay_payment_id;
    const expectedSign = crypto
      .createHmac("sha256", process.env.RAZORPAY_API_SECRET!)
      .update(sign.toString())
      .digest("hex");

    if (razorpay_signature !== expectedSign) {
      console.error("Payment signature verification failed");
      return NextResponse.json({ error: "Payment verification failed" }, { status: 400 });
    }

    // Get user
    const user = await prisma.users.findUnique({
      where: { email: authSession.user.email },
    });

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    // Check if payment already processed (idempotency)
    const existingPayment = await (prisma as any).paymentHistory.findFirst({
      where: { paymentId: razorpay_payment_id },
    });

    if (existingPayment) {
      return NextResponse.json({ success: true, message: "Payment already processed" });
    }

    // Get plan pricing for amount
    const planPricing = await (prisma as any).planPricing.findUnique({
      where: { plan: plan },
    });

    if (!planPricing) {
      return NextResponse.json({ error: `Pricing not found for plan: ${plan}` }, { status: 400 });
    }

    // Calculate discount and final amount
    let discountAmount = 0;
    let couponType = null;
    let finalAmount = planPricing.price;

    if (couponCode) {
      const coupon = await prisma.coupon.findUnique({
        where: { code: couponCode },
      });

      if (coupon) {
          couponType = coupon.discountType;
          if (coupon.discountType?.toUpperCase() === 'PERCENTAGE') {
            discountAmount = planPricing.price * (coupon.discountValue / 100);
          } else {
            discountAmount = coupon.discountValue;
          }

          finalAmount = Math.max(0, planPricing.price - discountAmount);

        // Use transaction to create coupon usage and increment usedCount
        await prisma.$transaction(async (tx) => {
          // Create coupon usage record with pricing data
          await tx.couponUsage.create({
            data: {
              couponId: coupon.id,
              userId: user.id,
              appliedPlan: plan,
              originalPrice: planPricing.price,
              discountAmount: discountAmount,
              finalPrice: finalAmount,
              couponCode: coupon.code,
              appliedAt: new Date(),
            },
          });

          // Increment usedCount
          await tx.coupon.update({
            where: { id: coupon.id },
            data: { usedCount: { increment: 1 } },
          });
        });

        console.log('Database: Coupon usage recorded and count incremented', {
          couponId: coupon.id,
          userId: user.id,
          appliedPlan: plan
        });
      }
    }

    // Update user plan
    const usageLimit = plan === 'Standard' ? 999999 : (plan === 'Pro' ? 100 : 3);

    const updatedUser = await prisma.users.update({
      where: { id: user.id },
      data: {
        plan: plan as any,
        usageLimit: usageLimit,
        renewalDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 days
        // Reset training module usage counters
        englishUsage: 0,
        dailyUsage: 0,
        hrUsage: 0,
        technicalUsage: 0,
        companyUsage: 0,
        mockUsage: 0,
        gdUsage: 0,
      },
    });

    console.log('Database: User plan updated successfully', {
      userId: user.id,
      newPlan: updatedUser.plan,
      usageLimit: updatedUser.usageLimit
    });

    // Create payment history record
    const paymentHistory = await (prisma as any).paymentHistory.create({
      data: {
        userId: user.id,
        paymentId: razorpay_payment_id,
        orderId: razorpay_order_id,
        originalAmount: planPricing.price,
        discountAmount: discountAmount,
        finalAmount: finalAmount,
        paymentMethod: 'razorpay',
        status: 'paid',
        plan: plan,
        couponUsed: couponCode || null,
        couponType: couponType,
        date: new Date(),
      },
    });

    console.log('Database: Payment history created', {
      paymentHistoryId: paymentHistory.id,
      paymentId: razorpay_payment_id,
      userId: user.id,
      plan: plan,
      finalAmount: finalAmount,
      couponUsed: couponCode
    });

    return NextResponse.json({
      success: true,
      message: `Successfully upgraded to ${plan}`,
      plan: plan
    });
  } catch (error) {
    console.error("Payment verification error:", error);
    return NextResponse.json(
      { error: "Payment verification failed" },
      { status: 500 }
    );
  }
}