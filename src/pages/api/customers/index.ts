import type { APIRoute } from 'astro';
import { supabase } from '../../../lib/database/supabase';

export const GET: APIRoute = async ({ request, cookies }) => {
  try {
    // Verificar autenticación
    const token = cookies.get('sb-access-token')?.value;
    
    if (!token) {
      return new Response(
        JSON.stringify({ error: 'No autorizado' }),
        { status: 401, headers: { 'Content-Type': 'application/json' } }
      );
    }

    // Obtener datos del usuario autenticado
    const { data: { user }, error: authError } = await supabase.auth.getUser(token);

    if (authError || !user) {
      return new Response(
        JSON.stringify({ error: 'Token inválido o expirado' }),
        { status: 401, headers: { 'Content-Type': 'application/json' } }
      );
    }

    // Obtener parámetros de la query
    const url = new URL(request.url);
    const limite = parseInt(url.searchParams.get('limite') || '10');
    const offset = parseInt(url.searchParams.get('offset') || '0');
    const busqueda = url.searchParams.get('busqueda');
    const estado = url.searchParams.get('estado');
    const ordenarPor = url.searchParams.get('ordenar_por') || 'fecha_creacion';
    const orden = url.searchParams.get('orden') || 'desc';

    // Construir query
    let query = supabase
      .from('clientes')
      .select('*', { count: 'exact' })
      .eq('usuario_id', user.id);

    // Aplicar filtros
    if (estado) {
      query = query.eq('estado', estado);
    }

    if (busqueda) {
      query = query.or(
        `nombre.ilike.%${busqueda}%,` +
        `correo_electronico.ilike.%${busqueda}%,` +
        `empresa.ilike.%${busqueda}%`
      );
    }

    // Ordenamiento
    query = query.order(ordenarPor, { ascending: orden === 'asc' });

    // Paginación
    query = query.range(offset, offset + limite - 1);

    const { data, error, count } = await query;

    if (error) {
      console.error('Error al obtener clientes:', error);
      return new Response(
        JSON.stringify({ 
          error: 'Error al obtener clientes',
          details: error.message 
        }),
        { status: 500, headers: { 'Content-Type': 'application/json' } }
      );
    }

    // Respuesta exitosa
    return new Response(
      JSON.stringify({
        success: true,
        data: data || [],
        total: count || 0,
        limite,
        offset,
        tiene_mas: count ? offset + limite < count : false,
      }),
      { 
        status: 200, 
        headers: { 'Content-Type': 'application/json' } 
      }
    );

  } catch (error) {
    console.error('Error en GET /api/customers:', error);
    return new Response(
      JSON.stringify({ 
        error: 'Error interno del servidor',
        message: error instanceof Error ? error.message : 'Error desconocido'
      }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }
};
