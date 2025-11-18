import type { APIRoute } from 'astro';
import { createClient } from '@supabase/supabase-js';
import { calcularDiasRestantes } from '../../../lib/services/subscriptionService';
import { enviarEmailNotificacionVencimiento } from '../../../lib/services/emailService';

// Este endpoint debe ser llamado por un servicio de cron job externo
// Ej: Vercel Crons, AWS Lambda, Google Cloud Scheduler, etc.

const CRON_SECRET = process.env.CRON_SECRET || 'desarrollo';

interface NotificacionPendiente {
  id: string;
  nombre: string;
  email: string;
  fecha_suscripcion: string;
  usuario_id: string;
}

export const GET: APIRoute = async ({ request }) => {
  try {
    // Verificar que la solicitud viene del cron job autorizado
    const authHeader = request.headers.get('authorization');
    if (authHeader !== `Bearer ${CRON_SECRET}`) {
      return new Response(JSON.stringify({ error: 'Unauthorized' }), {
        status: 401,
      });
    }

    const supabaseUrl = process.env.PUBLIC_SUPABASE_URL;
    const supabaseAnonKey = process.env.PUBLIC_SUPABASE_ANON_KEY;

    if (!supabaseUrl || !supabaseAnonKey) {
      return new Response(
        JSON.stringify({ error: 'Supabase not configured' }),
        { status: 500 }
      );
    }

    const supabase = createClient(supabaseUrl, supabaseAnonKey);

    // Obtener todos los clientes
    const { data: clientes, error: errorClientes } = await supabase
      .from('clientes')
      .select('id, nombre, email, fecha_suscripcion, usuario_id')
      .order('fecha_suscripcion', { ascending: true });

    if (errorClientes) {
      throw new Error(`Error fetching clients: ${errorClientes.message}`);
    }

    if (!clientes || clientes.length === 0) {
      return new Response(
        JSON.stringify({
          success: true,
          message: 'No clients found',
          notificaciones_enviadas: 0,
        }),
        { status: 200 }
      );
    }

    let notificacionesEnviadas = 0;
    let erroresEnvio = 0;
    const clientesProcessados: NotificacionPendiente[] = [];

    // Verificar cada cliente
    for (const cliente of clientes) {
      try {
        const status = calcularDiasRestantes(cliente.fecha_suscripcion);

        // Si está próximo a vencer (entre 1 y 7 días) o ya está vencido
        if (status.proximoAVencer || status.vencido) {
          // Obtener última notificación enviada
          const { data: ultimaNotificacion } = await supabase
            .from('subscription_notifications')
            .select('created_at')
            .eq('cliente_id', cliente.id)
            .order('created_at', { ascending: false })
            .limit(1);

          // Solo enviar si no se ha enviado en los últimos 24 horas
          const debemosEnviar = !ultimaNotificacion || ultimaNotificacion.length === 0
            ? true
            : (Date.now() - new Date(ultimaNotificacion[0].created_at).getTime()) > 24 * 60 * 60 * 1000;

          if (debemosEnviar && cliente.email) {
            // Calcular fecha de vencimiento
            const fechaSuscripcionDate = new Date(cliente.fecha_suscripcion);
            const fechaVencimiento = new Date(fechaSuscripcionDate);
            fechaVencimiento.setFullYear(fechaVencimiento.getFullYear() + 1);

            // Enviar email
            try {
              await enviarEmailNotificacionVencimiento({
                nombre: cliente.nombre,
                destinatario: cliente.email,
                diasRestantes: status.diasRestantes,
                fechaSuscripcion: cliente.fecha_suscripcion,
                fechaVencimiento: fechaVencimiento.toISOString(),
              });

              // Registrar que se envió la notificación
              await supabase
                .from('subscription_notifications')
                .insert({
                  cliente_id: cliente.id,
                  usuario_id: cliente.usuario_id,
                  dias_restantes: status.diasRestantes,
                  notificacion_tipo: status.vencido ? 'vencida' : 'proxima_a_vencer',
                });

              notificacionesEnviadas++;
              clientesProcessados.push(cliente);
            } catch (emailError) {
              console.error(
                `Error sending email to ${cliente.email}:`,
                emailError
              );
              erroresEnvio++;
            }
          }
        }
      } catch (clienteError) {
        console.error(`Error processing client ${cliente.id}:`, clienteError);
        erroresEnvio++;
      }
    }

    const respuesta = {
      success: true,
      message: `Verificación de suscripciones completada`,
      total_clientes: clientes.length,
      notificaciones_enviadas: notificacionesEnviadas,
      errores: erroresEnvio,
      clientes_procesados: clientesProcessados.map((c) => ({
        id: c.id,
        nombre: c.nombre,
        email: c.email,
      })),
      timestamp: new Date().toISOString(),
    };

    return new Response(JSON.stringify(respuesta), {
      status: 200,
      headers: {
        'Content-Type': 'application/json',
      },
    });
  } catch (error) {
    console.error('Error in subscription check cron:', error);
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    return new Response(
      JSON.stringify({
        success: false,
        error: errorMessage,
        timestamp: new Date().toISOString(),
      }),
      {
        status: 500,
        headers: {
          'Content-Type': 'application/json',
        },
      }
    );
  }
};
