import { supabase } from '../database/supabase';

/**
 * Servicio para gestionar suscripciones y pagos
 */

// Tipos de planes disponibles
export type PlanType = 'monthly' | 'annual' | 'lifetime';
export type PaymentStatus = 'pending' | 'paid' | 'cancelled' | 'expired';

export interface Subscription {
  id: string;
  user_id: string;
  user_email: string;
  plan_type: PlanType;
  plan_name: string;
  amount: number;
  currency: string;
  status: PaymentStatus;
  stripe_session_id?: string;
  stripe_payment_intent?: string;
  created_at: string;
  paid_at?: string;
  expires_at?: string;
  updated_at: string;
}

export interface CreateSubscriptionInput {
  user_id?: string;
  user_email: string;
  plan_type: PlanType;
  plan_name: string;
  amount: number;
}

// Configuración de planes
export const PLANS = {
  monthly: {
    name: 'Plan Mensual',
    amount: 9.99,
    stripe_link: 'https://buy.stripe.com/test_9B6cMY6Oz9rqbYTcco08g00',
  },
  annual: {
    name: 'Plan Anual',
    amount: 99.99,
    stripe_link: 'https://buy.stripe.com/test_5kQ14g1uf476fb51xK08g02',
  },
  lifetime: {
    name: 'Licencia Definitiva',
    amount: 199.99,
    stripe_link: 'https://buy.stripe.com/test_eVq14g7SD7ji6EzgsE08g01',
  },
};

/**
 * Crear una suscripción pendiente de pago
 */
export async function createPendingSubscription(input: CreateSubscriptionInput): Promise<{ success: boolean; subscription?: Subscription; error?: string }> {
  try {
    const { data, error } = await supabase
      .from('subscriptions')
      .insert({
        user_id: input.user_id || null,
        user_email: input.user_email,
        plan_type: input.plan_type,
        plan_name: input.plan_name,
        amount: input.amount,
        currency: 'EUR',
        status: 'pending',
      })
      .select()
      .single();

    if (error) {
      console.error('Error creating subscription:', error);
      return { success: false, error: error.message };
    }

    return { success: true, subscription: data };
  } catch (err: any) {
    console.error('Error creating subscription:', err);
    return { success: false, error: err.message };
  }
}

/**
 * Actualizar estado de pago de una suscripción
 */
export async function updateSubscriptionStatus(
  subscriptionId: string,
  status: PaymentStatus,
  stripeData?: { session_id?: string; payment_intent?: string }
): Promise<{ success: boolean; error?: string }> {
  try {
    const updateData: any = {
      status,
      updated_at: new Date().toISOString(),
    };

    if (status === 'paid') {
      updateData.paid_at = new Date().toISOString();
    }

    if (stripeData?.session_id) {
      updateData.stripe_session_id = stripeData.session_id;
    }

    if (stripeData?.payment_intent) {
      updateData.stripe_payment_intent = stripeData.payment_intent;
    }

    const { error } = await supabase
      .from('subscriptions')
      .update(updateData)
      .eq('id', subscriptionId);

    if (error) {
      console.error('Error updating subscription:', error);
      return { success: false, error: error.message };
    }

    return { success: true };
  } catch (err: any) {
    console.error('Error updating subscription:', err);
    return { success: false, error: err.message };
  }
}

/**
 * Marcar suscripción como pagada por email y tipo de plan
 */
export async function markSubscriptionAsPaid(
  email: string,
  planType: PlanType,
  stripeData?: { session_id?: string; payment_intent?: string }
): Promise<{ success: boolean; error?: string }> {
  try {
    const updateData: any = {
      status: 'paid',
      paid_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };

    if (stripeData?.session_id) {
      updateData.stripe_session_id = stripeData.session_id;
    }

    if (stripeData?.payment_intent) {
      updateData.stripe_payment_intent = stripeData.payment_intent;
    }

    // Buscar la suscripción pendiente más reciente para este email y plan
    const { error } = await supabase
      .from('subscriptions')
      .update(updateData)
      .eq('user_email', email)
      .eq('plan_type', planType)
      .eq('status', 'pending')
      .order('created_at', { ascending: false })
      .limit(1);

    if (error) {
      console.error('Error marking subscription as paid:', error);
      return { success: false, error: error.message };
    }

    return { success: true };
  } catch (err: any) {
    console.error('Error marking subscription as paid:', err);
    return { success: false, error: err.message };
  }
}

/**
 * Obtener suscripciones de un usuario
 */
export async function getUserSubscriptions(userEmail: string): Promise<{ success: boolean; subscriptions?: Subscription[]; error?: string }> {
  try {
    const { data, error } = await supabase
      .from('subscriptions')
      .select('*')
      .eq('user_email', userEmail)
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching subscriptions:', error);
      return { success: false, error: error.message };
    }

    return { success: true, subscriptions: data };
  } catch (err: any) {
    console.error('Error fetching subscriptions:', err);
    return { success: false, error: err.message };
  }
}

/**
 * Obtener suscripción activa de un usuario
 */
export async function getActiveSubscription(userEmail: string): Promise<{ success: boolean; subscription?: Subscription; error?: string }> {
  try {
    const { data, error } = await supabase
      .from('subscriptions')
      .select('*')
      .eq('user_email', userEmail)
      .eq('status', 'paid')
      .order('paid_at', { ascending: false })
      .limit(1)
      .single();

    if (error && error.code !== 'PGRST116') { // PGRST116 = no rows returned
      console.error('Error fetching active subscription:', error);
      return { success: false, error: error.message };
    }

    return { success: true, subscription: data || undefined };
  } catch (err: any) {
    console.error('Error fetching active subscription:', err);
    return { success: false, error: err.message };
  }
}

// ============================================
// FUNCIONES DE UTILIDAD PARA NOTIFICACIONES
// ============================================

export interface SubscriptionStatus {
  diasRestantes: number;
  proximoAVencer: boolean;
  vencido: boolean;
  mensaje: string;
}

/**
 * Calcula los días restantes desde la fecha de suscripción
 * Asume que la suscripción vence 365 días después de la fecha de suscripción
 */
export function calcularDiasRestantes(fechaSuscripcion: string): SubscriptionStatus {
  const hoy = new Date();
  hoy.setHours(0, 0, 0, 0);

  const fechaSuscripcionDate = new Date(fechaSuscripcion);
  fechaSuscripcionDate.setHours(0, 0, 0, 0);

  // Calcular fecha de vencimiento (365 días después)
  const fechaVencimiento = new Date(fechaSuscripcionDate);
  fechaVencimiento.setFullYear(fechaVencimiento.getFullYear() + 1);

  // Calcular días restantes
  const diferencia = fechaVencimiento.getTime() - hoy.getTime();
  const diasRestantes = Math.ceil(diferencia / (1000 * 60 * 60 * 24));

  let proximoAVencer = false;
  let vencido = false;
  let mensaje = '';

  if (diasRestantes <= 0) {
    vencido = true;
    mensaje = 'Tu suscripción ha vencido';
  } else if (diasRestantes <= 7) {
    proximoAVencer = true;
    mensaje = `Tu suscripción vence en ${diasRestantes} día${diasRestantes !== 1 ? 's' : ''}`;
  } else {
    mensaje = `Tu suscripción vence en ${diasRestantes} días`;
  }

  return {
    diasRestantes: Math.max(0, diasRestantes),
    proximoAVencer,
    vencido,
    mensaje,
  };
}

/**
 * Formatea la fecha de suscripción para mostrar en la UI
 */
export function formatearFechaSuscripcion(fecha: string): string {
  const date = new Date(fecha);
  return date.toLocaleDateString('es-ES', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
}

/**
 * Calcula la fecha de vencimiento
 */
export function calcularFechaVencimiento(fechaSuscripcion: string): string {
  const fecha = new Date(fechaSuscripcion);
  fecha.setFullYear(fecha.getFullYear() + 1);
  return fecha.toLocaleDateString('es-ES', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
}
