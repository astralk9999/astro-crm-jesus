import type { APIRoute } from 'astro';
import { getUserSubscriptions } from '../../../lib/services/subscriptionService';

export const prerender = false;

export const GET: APIRoute = async ({ request, url }) => {
  try {
    const email = url.searchParams.get('email');

    if (!email) {
      return new Response(
        JSON.stringify({ success: false, error: 'Email es requerido' }),
        { status: 400, headers: { 'Content-Type': 'application/json' } }
      );
    }

    const result = await getUserSubscriptions(email);

    if (result.success) {
      return new Response(
        JSON.stringify({ success: true, subscriptions: result.subscriptions }),
        { status: 200, headers: { 'Content-Type': 'application/json' } }
      );
    } else {
      return new Response(
        JSON.stringify({ success: false, error: result.error }),
        { status: 400, headers: { 'Content-Type': 'application/json' } }
      );
    }
  } catch (error: any) {
    console.error('Error fetching subscriptions:', error);
    return new Response(
      JSON.stringify({ success: false, error: error.message || 'Error interno del servidor' }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }
};
