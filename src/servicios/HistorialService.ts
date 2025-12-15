import { supabase, createSupabaseClient } from '../lib/database/supabase';

export type TablaHistorial = 'clients' | 'products' | 'licenses';
export type AccionHistorial = 'insert' | 'update' | 'delete';

export interface RegistroHistorialCambio {
  id: string;
  tabla: TablaHistorial;
  accion: AccionHistorial;
  registro_id: string;
  actor_id: string | null;
  fecha: string;
  old_data: Record<string, any> | null;
  new_data: Record<string, any> | null;
  revertido: boolean;
  revertido_en: string | null;
  revertido_por: string | null;
  error_reversion: string | null;
}

export interface RespuestaHistorial {
  success: boolean;
  data?: RegistroHistorialCambio[];
  error?: string;
}

export interface RespuestaReversionHistorial {
  success: boolean;
  data?: any;
  error?: string;
}

// Obtener historial filtrado.
// IMPORTANTE: por defecto se consulta solo el historial del admin actual (`idActor`), tal como pediste.
export async function obtenerHistorialCambios(params: {
  token?: string;
  idActor: string;
  limite?: number;
  tabla?: TablaHistorial | 'todas';
  accion?: AccionHistorial | 'todas';
  incluirRevertidos?: boolean;
}): Promise<RespuestaHistorial> {
  const {
    token,
    idActor,
    limite = 200,
    tabla = 'todas',
    accion = 'todas',
    incluirRevertidos = true,
  } = params;

  try {
    const client = token ? createSupabaseClient(token) : supabase;

    let query = client
      .from('historial_cambios')
      .select('*')
      .eq('actor_id', idActor)
      .order('fecha', { ascending: false })
      .limit(limite);

    if (tabla !== 'todas') {
      query = query.eq('tabla', tabla);
    }

    if (accion !== 'todas') {
      query = query.eq('accion', accion);
    }

    if (!incluirRevertidos) {
      query = query.eq('revertido', false);
    }

    const { data, error } = await query;

    if (error) {
      return { success: false, error: error.message };
    }

    return { success: true, data: (data || []) as RegistroHistorialCambio[] };
  } catch (err: any) {
    return { success: false, error: err.message };
  }
}

// Revertir un cambio del historial usando la función RPC en BD.
// IMPORTANTE: la reversión ocurre en PostgreSQL para mantener consistencia y evitar errores de lógica en frontend.
export async function revertirCambioHistorial(params: {
  token?: string;
  idHistorial: string;
}): Promise<RespuestaReversionHistorial> {
  const { token, idHistorial } = params;

  try {
    const client = token ? createSupabaseClient(token) : supabase;

    const { data, error } = await client.rpc('revertir_historial_cambio', {
      p_historial_id: idHistorial,
    });

    if (error) {
      return { success: false, error: error.message };
    }

    if (data && data.success === false) {
      return { success: false, error: data.error || 'No se pudo revertir el cambio' };
    }

    return { success: true, data };
  } catch (err: any) {
    return { success: false, error: err.message };
  }
}
