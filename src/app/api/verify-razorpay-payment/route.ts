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

    // Update user plan
    const usageLimit = plan === 'Standard' ? 999999 : (plan === 'Pro' ? 100 : 3);

    await prisma.users.update({
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

    // Create payment history record
    await (prisma as any).paymentHistory.create({
      data: {
        userId: user.id,
        paymentId: razorpay_payment_id,
        orderId: razorpay_order_id,
        originalAmount: planPricing.price,
        discountAmount: 0, // TODO: Handle discounts
        finalAmount: planPricing.price,
        paymentMethod: 'razorpay',
        status: 'paid',
        plan: plan,
        date: new Date(),
      },
    });

    // Handle coupon usage if any
    // TODO: Implement coupon tracking for Razorpay payments

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