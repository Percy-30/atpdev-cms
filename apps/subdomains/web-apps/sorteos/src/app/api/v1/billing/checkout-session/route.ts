import { NextRequest, NextResponse } from 'next/server';
import { PRICING_PLANS } from '@/lib/types';

export async function POST(req: NextRequest) {
  try {
    const { planId, billingCycle = 'monthly', customerEmail } = await req.json();

    const plan = PRICING_PLANS.find((p) => p.id === planId);
    if (!plan) {
      return NextResponse.json({ error: 'Plan no encontrado.' }, { status: 404 });
    }

    if (plan.id === 'free') {
      return NextResponse.json({
        success: true,
        message: 'Plan Free activado automáticamente.',
        url: '/dashboard'
      });
    }

    const price = billingCycle === 'annual' ? plan.priceAnnual : plan.priceMonthly;

    // Simulación de sesión de Checkout de Stripe (RF-028)
    const sessionId = `cs_test_${Date.now().toString(36)}`;
    const checkoutUrl = `/dashboard?payment=success&session_id=${sessionId}&plan=${plan.id}`;

    return NextResponse.json({
      success: true,
      sessionId,
      url: checkoutUrl,
      plan: plan.name,
      amount: price,
      currency: 'USD',
      billingCycle,
      provider: 'stripe'
    });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || 'Error en checkout.' }, { status: 500 });
  }
}
