import type { APIRoute } from 'astro';
import { markSubscriptionAsPaid } from '../../../lib/services/subscriptionService';

export const prerender = false;

// Stripe webhook secret - en producción usar variable de entorno
const STRIPE_WEBHOOK_SECRET = import.meta.env.STRIPE_WEBHOOK_SECRET || '';

export const POST: APIRoute = async ({ request }) => {
  try {
    const body = await request.text();
    const signature = request.headers.get('stripe-signature');

    // En modo test, aceptamos peticiones directas sin verificar firma
    // En producción, deberías verificar la firma del webhook
    let event;
    
    try {
      // Intentar parsear el body como JSON
      event = JSON.parse(body);
    } catch (err) {
      console.error('Error parsing webhook body:', err);
      return new Response(
        JSON.stringify({ error: 'Invalid JSON' }),
        { status: 400, headers: { 'Content-Type': 'application/json' } }
      );
    }

    // Manejar eventos de Stripe
    switch (event.type) {
      case 'checkout.session.completed': {
        const session = event.data.object;
        
        // Obtener datos del cliente
        const customerEmail = session.customer_email || session.customer_details?.email;
        const paymentIntent = session.payment_intent;
        const sessionId = session.id;

        // Determinar el tipo de plan basado en el monto
        let planType: 'monthly' | 'annual' | 'lifetime' = 'monthly';
        const amount = session.amount_total / 100; // Stripe envía en centavos

        if (amount >= 199) {
          planType = 'lifetime';
        } else if (amount >= 99) {
          planType = 'annual';
        } else {
          planType = 'monthly';
        }

        if (customerEmail) {
          const result = await markSubscriptionAsPaid(customerEmail, planType, {
            session_id: sessionId,
            payment_intent: paymentIntent,
          });

          if (!result.success) {
            console.error('Error updating subscription:', result.error);
          } else {
            console.log(`Subscription marked as paid for ${customerEmail}`);
          }
        }
        break;
      }

      case 'payment_intent.succeeded': {
        const paymentIntent = event.data.object;
        console.log('Payment succeeded:', paymentIntent.id);
        break;
      }

      default:
        console.log(`Unhandled event type: ${event.type}`);
    }

    return new Response(
      JSON.stringify({ received: true }),
      { status: 200, headers: { 'Content-Type': 'application/json' } }
    );
  } catch (error: any) {
    console.error('Webhook error:', error);
    return new Response(
      JSON.stringify({ error: error.message }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }
};
