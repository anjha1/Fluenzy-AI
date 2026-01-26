import prisma from '@/lib/prisma';
import { NextRequest, NextResponse } from 'next/server';
import Stripe from 'stripe';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2025-08-27.basil',
});

const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET!;

export async function POST(request: NextRequest) {
  try {
    const body = await request.text();
    const signature = request.headers.get('stripe-signature')!;

    let event: Stripe.Event;

    try {
      event = stripe.webhooks.constructEvent(body, signature, webhookSecret);
    } catch (err) {
      console.error('Webhook signature verification failed:', err);
      return NextResponse.json({ error: 'Invalid signature' }, { status: 400 });
    }

    switch (event.type) {
      case 'checkout.session.completed':
        const session = event.data.object as Stripe.Checkout.Session;
        await handleCheckoutSessionCompleted(session);
        break;

      case 'customer.subscription.created':
        const subscription = event.data.object as Stripe.Subscription;
        await handleSubscriptionCreated(subscription);
        break;

      case 'customer.subscription.updated':
        const updatedSubscription = event.data.object as Stripe.Subscription;
        await handleSubscriptionUpdated(updatedSubscription);
        break;

      case 'customer.subscription.deleted':
        const deletedSubscription = event.data.object as Stripe.Subscription;
        await handleSubscriptionDeleted(deletedSubscription);
        break;

      case 'invoice.payment_succeeded':
        const invoice = event.data.object as Stripe.Invoice;
        await handleInvoicePaymentSucceeded(invoice);
        break;

      default:
        console.log(`Unhandled event type: ${event.type}`);
    }

    return NextResponse.json({ received: true });
  } catch (error) {
    console.error('Webhook error:', error);
    return NextResponse.json({ error: 'Webhook handler failed' }, { status: 500 });
  }
}

async function handleCheckoutSessionCompleted(session: Stripe.Checkout.Session) {
  const userId = session.metadata?.userId;
  if (!userId) return;

  // Update user to Pro plan
  await prisma.users.update({
    where: { id: userId },
    data: {
      plan: 'Pro',
      usageLimit: 999999, // Unlimited
      stripeCustomerId: session.customer as string,
      // Reset training module usage counters for Pro users
      englishUsage: 0,
      dailyUsage: 0,
      hrUsage: 0,
      technicalUsage: 0,
      companyUsage: 0,
      mockUsage: 0,
    },
  });
}

async function handleSubscriptionCreated(subscription: Stripe.Subscription) {
  const userId = subscription.metadata?.userId;
  const couponCode = subscription.metadata?.couponCode;
  if (!userId) return;

  let couponUsed = '';
  if (couponCode) {
    const coupon = await (prisma as any).coupon.findUnique({ where: { code: couponCode } });
    if (coupon) {
      // Record usage
      await (prisma as any).couponUsage.create({
        data: {
          couponId: coupon.id,
          userId,
        },
      });
      couponUsed = couponCode;
    }
  }

  // Update user subscription details
  await (prisma as any).subscriptions.create({
    data: {
      userId,
      stripeSubscriptionId: subscription.id,
      stripeCustomerId: subscription.customer as string,
      status: subscription.status,
      currentPeriodEnd: (subscription as any).current_period_end ? new Date((subscription as any).current_period_end * 1000) : null,
      couponUsed,
    },
  });

  // Update user plan and renewal date
  await prisma.users.update({
    where: { id: userId },
    data: {
      plan: 'Pro',
      usageLimit: 999999,
      renewalDate: (subscription as any).current_period_end ? new Date((subscription as any).current_period_end * 1000) : null,
      // Reset training module usage counters for Pro users
      englishUsage: 0,
      dailyUsage: 0,
      hrUsage: 0,
      technicalUsage: 0,
      companyUsage: 0,
      mockUsage: 0,
    },
  });
}

async function handleSubscriptionUpdated(subscription: Stripe.Subscription) {
  const userId = subscription.metadata?.userId;
  if (!userId) return;

  // Update subscription record
  await prisma.subscriptions.updateMany({
    where: { stripeSubscriptionId: subscription.id },
    data: {
      status: subscription.status,
      currentPeriodEnd: (subscription as any).current_period_end ? new Date((subscription as any).current_period_end * 1000) : null,
    },
  });

  if (subscription.status === 'active') {
    // Update user to Pro plan
    await prisma.users.update({
      where: { id: userId },
      data: {
        plan: 'Pro',
        usageLimit: 999999, // Unlimited
        renewalDate: (subscription as any).current_period_end ? new Date((subscription as any).current_period_end * 1000) : null,
        // Reset training module usage counters for Pro users
        englishUsage: 0,
        dailyUsage: 0,
        hrUsage: 0,
        technicalUsage: 0,
        companyUsage: 0,
        mockUsage: 0,
      },
    });
  } else if (subscription.status === 'canceled' || subscription.status === 'unpaid' || subscription.status === 'past_due') {
    // Downgrade user to Free plan
    await prisma.users.update({
      where: { id: userId },
      data: {
        plan: 'Free',
        usageLimit: 3,
        renewalDate: null,
      },
    });
  }
}

async function handleSubscriptionDeleted(subscription: Stripe.Subscription) {
  const userId = subscription.metadata?.userId;
  if (!userId) return;

  // Downgrade user to Free plan
  await prisma.users.update({
    where: { id: userId },
    data: {
      plan: 'Free',
      usageLimit: 3,
      renewalDate: null,
    },
  });

  // Delete subscription record
  await prisma.subscriptions.deleteMany({
    where: {
      stripeSubscriptionId: subscription.id,
    },
  });
}

async function handleInvoicePaymentSucceeded(invoice: Stripe.Invoice) {
  const subscriptionId = (invoice as any).subscription as string;
  if (!subscriptionId) return;

  // Check if payment history already exists (idempotency)
  const existingPayment = await (prisma as any).paymentHistory.findFirst({
    where: { invoiceId: invoice.id },
  });
  if (existingPayment) return; // Already processed

  const subscription = await (prisma as any).subscriptions.findFirst({
    where: { stripeSubscriptionId: subscriptionId },
  });
  if (!subscription) return;

  const userId = subscription.userId;
  const couponCode = subscription.couponUsed;

  // Calculate amounts
  const originalAmount = (invoice.amount_due / 100); // Convert from cents
  const discountAmount = (invoice.total_discount_amounts?.[0]?.amount || 0) / 100;
  const finalAmount = (invoice.amount_paid / 100);

  let couponType = null;
  let couponId = null;
  if (couponCode) {
    const coupon = await (prisma as any).coupon.findUnique({
      where: { code: couponCode },
    });
    couponType = coupon?.discountType || null;
    couponId = coupon?.id;
  }

  // Create payment history
  await (prisma as any).paymentHistory.create({
    data: {
      userId,
      originalAmount,
      discountAmount,
      finalAmount,
      paymentMethod: 'stripe',
      invoiceId: invoice.id,
      status: 'paid',
      couponUsed: couponCode,
      couponType,
      date: new Date(invoice.created * 1000),
    },
  });

  // Update coupon usage if coupon was used
  if (couponId) {
    await (prisma as any).couponUsage.create({
      data: {
        couponId,
        userId,
      },
    });
  }
}
