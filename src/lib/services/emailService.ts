/**
 * Servicio para enviar emails
 */

export interface EmailParams {
  destinatario: string;
  nombre: string;
  diasRestantes: number;
  fechaSuscripcion: string;
  fechaVencimiento: string;
}

/**
 * Envía un email de notificación de próximo vencimiento
 * Usa Resend como proveedor de email
 */
export async function enviarEmailNotificacionVencimiento(
  params: EmailParams
): Promise<{ success: boolean; error?: string }> {
  try {
    const resendApiKey = import.meta.env.RESEND_API_KEY;

    if (!resendApiKey) {
      console.warn(
        'RESEND_API_KEY no configurado. Email no se envió. Configura la variable en .env'
      );
      return {
        success: false,
        error: 'Servicio de email no configurado',
      };
    }

    // Template HTML para el email
    const htmlTemplate = `
      <!DOCTYPE html>
      <html dir="ltr" lang="es">
        <head>
          <meta charset="UTF-8" />
          <style>
            body {
              font-family: Arial, sans-serif;
              line-height: 1.6;
              color: #333;
            }
            .container {
              max-width: 600px;
              margin: 0 auto;
              padding: 20px;
              background-color: #f9fafb;
            }
            .header {
              background-color: #dc2626;
              color: white;
              padding: 20px;
              border-radius: 8px 8px 0 0;
              text-align: center;
            }
            .content {
              background-color: white;
              padding: 30px;
              border-radius: 0 0 8px 8px;
            }
            .alert-box {
              background-color: #fef2f2;
              border-left: 4px solid #dc2626;
              padding: 15px;
              margin: 20px 0;
              border-radius: 4px;
            }
            .info {
              background-color: #f3f4f6;
              padding: 15px;
              border-radius: 4px;
              margin: 15px 0;
            }
            .button {
              display: inline-block;
              background-color: #2563eb;
              color: white;
              padding: 12px 24px;
              text-decoration: none;
              border-radius: 4px;
              margin-top: 20px;
            }
            .footer {
              text-align: center;
              color: #6b7280;
              font-size: 12px;
              margin-top: 30px;
              padding-top: 20px;
              border-top: 1px solid #e5e7eb;
            }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1>⚠️ Notificación de Suscripción</h1>
            </div>
            <div class="content">
              <h2>Hola ${params.nombre},</h2>
              
              <p>Tu suscripción al CRM Victoria está próxima a vencer.</p>
              
              <div class="alert-box">
                <strong>Tu suscripción vence en ${params.diasRestantes} día${params.diasRestantes !== 1 ? 's' : ''}</strong>
              </div>
              
              <div class="info">
                <p><strong>Fechas importantes:</strong></p>
                <p>📅 <strong>Suscrito desde:</strong> ${params.fechaSuscripcion}</p>
                <p>📅 <strong>Vencimiento:</strong> ${params.fechaVencimiento}</p>
              </div>
              
              <p>Para evitar interrupciones en el servicio, te recomendamos renovar tu suscripción cuanto antes.</p>
              
              <a href="https://victoriacrm.com/renovar" class="button">Renovar Suscripción</a>
              
              <p style="margin-top: 30px; color: #6b7280;">
                Si tienes preguntas, contacta a nuestro equipo de soporte: support@victoriacrm.com
              </p>
              
              <div class="footer">
                <p>Este es un mensaje automático de Victoria CRM. Por favor, no respondas a este correo.</p>
                <p>&copy; 2025 Victoria CRM. Todos los derechos reservados.</p>
              </div>
            </div>
          </div>
        </body>
      </html>
    `;

    // Llamar a la API de Resend
    const response = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${resendApiKey}`,
      },
      body: JSON.stringify({
        from: 'notificaciones@victoriacrm.com',
        to: params.destinatario,
        subject: `⚠️ Tu suscripción vence en ${params.diasRestantes} día${params.diasRestantes !== 1 ? 's' : ''}`,
        html: htmlTemplate,
      }),
    });

    if (!response.ok) {
      const error = await response.json();
      console.error('Error al enviar email con Resend:', error);
      return {
        success: false,
        error: error.message || 'Error al enviar email',
      };
    }

    const result = await response.json();
    return {
      success: true,
    };
  } catch (error) {
    console.error('Error en enviarEmailNotificacionVencimiento:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Error desconocido',
    };
  }
}

/**
 * Envía email con template simple (sin Resend)
 * Útil para desarrollo local
 */
export async function enviarEmailNotificacionVencimientoSimple(
  params: EmailParams
): Promise<{ success: boolean; error?: string }> {
  try {
    // Este es un ejemplo simple que solo loguea
    // En producción, deberías usar un servicio real como Resend, SendGrid, etc.
    console.log('📧 Email de notificación:', {
      to: params.destinatario,
      name: params.nombre,
      diasRestantes: params.diasRestantes,
      fechaSuscripcion: params.fechaSuscripcion,
      fechaVencimiento: params.fechaVencimiento,
    });

    return {
      success: true,
    };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Error desconocido',
    };
  }
}
