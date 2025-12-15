import type { APIRoute } from 'astro';
import { createPendingSubscription, PLANS, type PlanType } from '../../../lib/services/subscriptionService';

export const prerender = false;

export const POST: APIRoute = async ({ request }) => {
  try {
    const contentType = request.headers.get('content-type');
    
    if (!contentType || !contentType.includes('application/json')) {
      return new Response(
        JSON.stringify({ success: false, error: 'Content-Type debe ser application/json' }),
        { status: 400, headers: { 'Content-Type': 'application/json' } }
      );
    }

    const body = await request.json();
    const { email, planType, userId } = body;

    // Validaciones
    if (!email) {
      return new Response(
        JSON.stringify({ success: false, error: 'El email es requerido' }),
        { status: 400, headers: { 'Content-Type': 'application/json' } }
      );
    }

    if (!planType || !['monthly', 'annual', 'lifetime'].includes(planType)) {
      return new Response(
        JSON.stringify({ success: false, error: 'Tipo de plan inválido' }),
        { status: 400, headers: { 'Content-Type': 'application/json' } }
      );
    }

    const plan = PLANS[planType as PlanType];

    // Crear suscripción pendiente
    const result = await createPendingSubscription({
      user_id: userId,
      user_email: email,
      plan_type: planType as PlanType,
      plan_name: plan.name,
      amount: plan.amount,
    });

    if (result.success) {
      return new Response(
        JSON.stringify({
          success: true,
          subscription: result.subscription,
          stripeLink: plan.stripe_link,
        }),
        { status: 201, headers: { 'Content-Type': 'application/json' } }
      );
    } else {
      return new Response(
        JSON.stringify({ success: false, error: result.error }),
        { status: 400, headers: { 'Content-Type': 'application/json' } }
      );
    }
  } catch (error: any) {
    console.error('Error creating subscription:', error);
    return new Response(
      JSON.stringify({ success: false, error: error.message || 'Error interno del servidor' }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }
};
