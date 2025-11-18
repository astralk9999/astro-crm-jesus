import type { APIRoute } from 'astro';
import { enviarEmailNotificacionVencimiento, enviarEmailNotificacionVencimientoSimple } from '../../../lib/services/emailService';

export const prerender = false;

export const POST: APIRoute = async ({ request, cookies }) => {
  try {
    // Verificar autenticación
    const token = cookies.get('sb-access-token')?.value;
    
    if (!token) {
      return new Response(
        JSON.stringify({ error: 'No autorizado' }),
        { status: 401, headers: { 'Content-Type': 'application/json' } }
      );
    }

    // Obtener datos del cuerpo
    const body = await request.json();
    const { clienteId, nombre, email, diasRestantes, fechaSuscripcion, fechaVencimiento } = body;

    if (!email || !nombre || diasRestantes === undefined) {
      return new Response(
        JSON.stringify({ error: 'Datos incompletos' }),
        { status: 400, headers: { 'Content-Type': 'application/json' } }
      );
    }

    // Intentar enviar con Resend primero, si falla usar versión simple
    let resultado = await enviarEmailNotificacionVencimiento({
      destinatario: email,
      nombre: nombre,
      diasRestantes: diasRestantes,
      fechaSuscripcion: fechaSuscripcion,
      fechaVencimiento: fechaVencimiento,
    });

    // Si Resend no está configurado, usar versión simple
    if (!resultado.success && resultado.error?.includes('no configurado')) {
      console.log('Usando envío de email simple (desarrollo)');
      resultado = await enviarEmailNotificacionVencimientoSimple({
        destinatario: email,
        nombre: nombre,
        diasRestantes: diasRestantes,
        fechaSuscripcion: fechaSuscripcion,
        fechaVencimiento: fechaVencimiento,
      });
    }

    if (!resultado.success) {
      return new Response(
        JSON.stringify({
          error: 'Error al enviar notificación',
          details: resultado.error,
        }),
        { status: 500, headers: { 'Content-Type': 'application/json' } }
      );
    }

    return new Response(
      JSON.stringify({
        success: true,
        message: 'Notificación enviada correctamente',
      }),
      { status: 200, headers: { 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    console.error('Error en POST /api/notifications/subscription:', error);
    return new Response(
      JSON.stringify({
        error: 'Error interno del servidor',
        message: error instanceof Error ? error.message : 'Error desconocido',
      }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }
};
