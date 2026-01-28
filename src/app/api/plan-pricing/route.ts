import { NextResponse } from "next/server";
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