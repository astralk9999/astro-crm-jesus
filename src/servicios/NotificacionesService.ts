export type TipoNotificacion = 'cliente' | 'producto' | 'licencia';

export interface Notificacion {
  id: string;
  tipo: TipoNotificacion;
  titulo: string;
  descripcion: string;
  fecha_iso: string;
  leida: boolean;
  enlace?: string;
  datos_basicos?: Record<string, unknown>;
}

const claveAlmacenamiento = 'softcontrol_notificaciones';

function generarId(): string {
  if (typeof crypto !== 'undefined' && 'randomUUID' in crypto) {
    return crypto.randomUUID();
  }

  return `${Date.now()}-${Math.random().toString(16).slice(2)}`;
}

function notificarActualizacion(): void {
  if (typeof window === 'undefined') return;

  window.dispatchEvent(new CustomEvent('notificaciones:actualizadas'));
}

function leerNotificaciones(): Notificacion[] {
  if (typeof window === 'undefined') return [];

  try {
    const bruto = window.localStorage.getItem(claveAlmacenamiento);
    if (!bruto) return [];

    const parseado = JSON.parse(bruto);
    if (!Array.isArray(parseado)) return [];

    return parseado as Notificacion[];
  } catch {
    return [];
  }
}

function guardarNotificaciones(notificaciones: Notificacion[]): void {
  if (typeof window === 'undefined') return;

  window.localStorage.setItem(claveAlmacenamiento, JSON.stringify(notificaciones));
  notificarActualizacion();
}

export function obtenerNotificaciones(): Notificacion[] {
  return leerNotificaciones().sort((a, b) => (b.fecha_iso || '').localeCompare(a.fecha_iso || ''));
}

export function obtenerConteoNoLeidas(): number {
  return leerNotificaciones().filter((n) => !n.leida).length;
}

export function agregarNotificacion(entrada: {
  tipo: TipoNotificacion;
  titulo: string;
  descripcion: string;
  enlace?: string;
  datos_basicos?: Record<string, unknown>;
}): Notificacion {
  const notificacionesActuales = leerNotificaciones();

  const nueva: Notificacion = {
    id: generarId(),
    tipo: entrada.tipo,
    titulo: entrada.titulo,
    descripcion: entrada.descripcion,
    fecha_iso: new Date().toISOString(),
    leida: false,
    enlace: entrada.enlace,
    datos_basicos: entrada.datos_basicos,
  };

  guardarNotificaciones([nueva, ...notificacionesActuales]);

  return nueva;
}

export function marcarNotificacionComoLeida(id: string): void {
  const notificacionesActuales = leerNotificaciones();
  const actualizadas = notificacionesActuales.map((n) => (n.id === id ? { ...n, leida: true } : n));
  guardarNotificaciones(actualizadas);
}

export function marcarTodasComoLeidas(): void {
  const notificacionesActuales = leerNotificaciones();
  const actualizadas = notificacionesActuales.map((n) => ({ ...n, leida: true }));
  guardarNotificaciones(actualizadas);
}

export function limpiarNotificaciones(): void {
  guardarNotificaciones([]);
}
