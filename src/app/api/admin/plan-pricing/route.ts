import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import prisma from "@/lib/prisma";

export async function GET() {
  try {
    const pricings = await (prisma as any).planPricing.findMany();

    // Return as object with plan as key
    const pricingObj: Record<string, any> = {};
    pricings.forEach((pricing: any) => {
      pricingObj[pricing.plan] = {
        name: pricing.name,
        price: pricing.price,
        currency: pricing.currency,
        status: pricing.status,
        updatedAt: pricing.updatedAt,
      };
    });

    // Ensure all plans have defaults
    const defaults: Record<string, any> = {
      Free: { name: 'Free', price: 0, currency: 'INR', status: 'active' },
      Standard: { name: 'Standard', price: 150, currency: 'INR', status: 'active' },
      Pro: { name: 'Pro', price: 20, currency: 'INR', status: 'active' },
    };

    Object.keys(defaults).forEach(plan => {
      if (!pricingObj[plan]) {
        pricingObj[plan] = { ...defaults[plan], updatedAt: new Date() };
      }
    });

    return NextResponse.json(pricingObj);
  } catch (error) {
    console.error("Error fetching plan pricing:", error);
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
    const { plans } = body;

    if (!plans || typeof plans !== 'object') {
      return NextResponse.json({ error: "Invalid plans data" }, { status: 400 });
    }

    const planNames = ['Free', 'Standard', 'Pro'];
    const userId = session.user.id;

    for (const planName of planNames) {
      const planData = plans[planName];
      if (planData) {
        await (prisma as any).planPricing.upsert({
          where: { plan: planName },
          update: {
            name: planData.name,
            price: planData.price,
            currency: planData.currency,
            status: planData.status,
            updatedBy: userId,
          },
          create: {
            plan: planName,
            name: planData.name,
            price: planData.price,
            currency: planData.currency,
            status: planData.status,
            updatedBy: userId,
          },
        });
      }
    }

    return NextResponse.json({ message: "Plan pricing updated successfully" });
  } catch (error) {
    console.error("Error updating plan pricing:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}