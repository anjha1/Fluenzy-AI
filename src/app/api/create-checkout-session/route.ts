import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import Stripe from "stripe";
import prisma from "@/lib/prisma";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: "2025-08-27.basil",
});

export async function POST(request: NextRequest) {
  try {
    const authSession = await getServerSession(authOptions);

    // Temporarily allow without session for Learn_English
    // TODO: Fix authentication for Learn_English app
    let userEmail = authSession?.user?.email;
    if (!userEmail) {
      // For testing, assume a user email or get from somewhere
      // This is insecure, fix properly
      return NextResponse.json({ error: "Authentication required" }, { status: 401 });
    }

    let couponCode = '';
    try {
      const body = await request.json();
      couponCode = body?.couponCode || '';
    } catch (e) {
      // No body or invalid JSON, continue with empty couponCode
    }

    // Get or create user
    let user = await prisma.users.findUnique({
      where: { email: userEmail },
    });

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    let appliedCoupon: any = null;
    let stripeDiscounts: any[] = [];

    if (couponCode) {
      // Validate coupon
      const coupon = await (prisma as any).coupon.findUnique({
        where: { code: couponCode },
      });

      if (!coupon) {
        return NextResponse.json({ error: "Invalid coupon code" }, { status: 400 });
      }

      if (coupon.status !== 'active') {
        return NextResponse.json({ error: "Coupon is not active" }, { status: 400 });
      }

      const now = new Date();
      if (coupon.startDate && now < coupon.startDate) {
        return NextResponse.json({ error: "Coupon not yet valid" }, { status: 400 });
      }
      if (coupon.expiryDate && now > coupon.expiryDate) {
        return NextResponse.json({ error: "Coupon expired" }, { status: 400 });
      }

      // Check applicable plans
      if (coupon.applicablePlans && coupon.applicablePlans.length > 0 && !coupon.applicablePlans.includes('Pro')) {
        return NextResponse.json({ error: "Coupon not applicable for this plan" }, { status: 400 });
      }

      // Check usage
      const usageCount = await (prisma as any).couponUsage.count({
        where: { couponId: coupon.id },
      });
      if (coupon.maxUsage && usageCount >= coupon.maxUsage) {
        return NextResponse.json({ error: "Coupon usage limit reached" }, { status: 400 });
      }

      // Check per user
      const userUsage = await (prisma as any).couponUsage.count({
        where: { couponId: coupon.id, userId: user.id },
      });
      if (userUsage >= coupon.perUserLimit) {
        return NextResponse.json({ error: "Coupon already used by this user" }, { status: 400 });
      }

      appliedCoupon = coupon;

      // Create Stripe discount
      try {
        if (coupon.discountType === 'PERCENTAGE') {
          const stripeCoupon = await stripe.coupons.create({
            percent_off: coupon.discountValue,
            duration: 'once', // Apply to first invoice only
            name: coupon.code,
          });
          stripeDiscounts.push({
            coupon: stripeCoupon.id,
          });
        } else {
          // Flat amount in cents
          const stripeCoupon = await stripe.coupons.create({
            amount_off: coupon.discountValue * 100, // Convert to cents
            currency: 'usd',
            duration: 'once',
            name: coupon.code,
          });
          stripeDiscounts.push({
            coupon: stripeCoupon.id,
          });
        }
      } catch (stripeError) {
        console.error('Stripe coupon creation error:', stripeError);
        return NextResponse.json({ error: "Failed to apply discount" }, { status: 500 });
      }
    }

    // Create Stripe checkout session
    const sessionConfig: any = {
      customer_email: user.email,
      line_items: [
        {
          price: process.env.STRIPE_PRICE_ID, // Your Stripe price ID for the subscription
          quantity: 1,
        },
      ],
      mode: "subscription",
      success_url: `${process.env.NEXTAUTH_URL}/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${process.env.NEXTAUTH_URL}/?payment_canceled=true`,
      metadata: {
        userId: user.id,
        email: user.email,
        couponCode: appliedCoupon?.code || '',
      },
      subscription_data: {
        metadata: {
          userId: user.id,
          email: user.email,
          couponCode: appliedCoupon?.code || '',
        },
      },
    };

    if (stripeDiscounts.length > 0) {
      sessionConfig.discounts = stripeDiscounts;
    }

    // Check if this is a 100% discount (free upgrade)
    const isFreeUpgrade = appliedCoupon && (
      (appliedCoupon.discountType === 'PERCENTAGE' && appliedCoupon.discountValue === 100) ||
      (appliedCoupon.discountType === 'FLAT' && appliedCoupon.discountValue >= 10) // Assuming $10 base price
    );

    if (isFreeUpgrade) {
      try {
        // Skip Stripe, do direct upgrade
        await prisma.users.update({
          where: { id: user.id },
          data: {
            plan: 'Pro',
            usageLimit: 999999,
            renewalDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 days
          },
        });

        // Record coupon usage
        await (prisma as any).couponUsage.create({
          data: {
            couponId: appliedCoupon.id,
            userId: user.id,
          },
        });

        // Create payment history
        await (prisma as any).paymentHistory.create({
          data: {
            userId: user.id,
            amount: 10, // Base price
            discountAmount: 10, // Full discount
            finalAmount: 0,
            paymentMethod: 'coupon',
            status: 'paid',
            couponUsed: appliedCoupon.code,
            date: new Date(),
          },
        });

        return NextResponse.json({
          success: true,
          message: "Upgraded to Pro with 100% discount coupon!",
          plan: 'Pro'
        });
      } catch (upgradeError) {
        console.error("Free upgrade error:", upgradeError);
        return NextResponse.json({ error: "Failed to process free upgrade" }, { status: 500 });
      }
    }

    const stripeSession = await stripe.checkout.sessions.create(sessionConfig);

    return NextResponse.json({ sessionId: stripeSession.id, url: stripeSession.url });
  } catch (error) {
    console.error("Stripe checkout error:", error);
    return NextResponse.json(
      { error: "Failed to create checkout session" },
      { status: 500 }
    );
  }
}
