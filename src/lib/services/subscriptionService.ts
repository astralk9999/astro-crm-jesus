/**
 * Servicio para gestionar notificaciones de suscripción
 */

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
