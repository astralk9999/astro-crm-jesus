import type { APIRoute } from 'astro';
import { supabase } from '../../../lib/database/supabase';

export const GET: APIRoute = async ({ params, cookies }) => {
  try {
    const { id } = params;

    if (!id) {
      return new Response(
        JSON.stringify({ error: 'ID de cliente requerido' }),
        { status: 400, headers: { 'Content-Type': 'application/json' } }
      );
    }

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

    // Obtener cliente
    const { data: cliente, error } = await supabase
      .from('clientes')
      .select('*')
      .eq('id', id)
      .eq('usuario_id', user.id) // Asegurar que el cliente pertenece al usuario
      .single();

    if (error) {
      console.error('Error al obtener cliente:', error);
      
      if (error.code === 'PGRST116') {
        return new Response(
          JSON.stringify({ error: 'Cliente no encontrado' }),
          { status: 404, headers: { 'Content-Type': 'application/json' } }
        );
      }

      return new Response(
        JSON.stringify({ 
          error: 'Error al obtener cliente',
          details: error.message 
        }),
        { status: 500, headers: { 'Content-Type': 'application/json' } }
      );
    }

    if (!cliente) {
      return new Response(
        JSON.stringify({ error: 'Cliente no encontrado' }),
        { status: 404, headers: { 'Content-Type': 'application/json' } }
      );
    }

    // Respuesta exitosa
    return new Response(
      JSON.stringify({
        success: true,
        data: cliente
      }),
      { 
        status: 200, 
        headers: { 'Content-Type': 'application/json' } 
      }
    );

  } catch (error) {
    console.error('Error en GET /api/customers/[id]:', error);
    return new Response(
      JSON.stringify({ 
        error: 'Error interno del servidor',
        message: error instanceof Error ? error.message : 'Error desconocido'
      }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }
};

export const DELETE: APIRoute = async ({ params, cookies }) => {
  try {
    const { id } = params;

    if (!id) {
      return new Response(
        JSON.stringify({ error: 'ID de cliente requerido' }),
        { status: 400, headers: { 'Content-Type': 'application/json' } }
      );
    }

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

    // Verificar que el cliente pertenece al usuario
    const { data: cliente, error: checkError } = await supabase
      .from('clientes')
      .select('id')
      .eq('id', id)
      .eq('usuario_id', user.id)
      .single();

    if (checkError || !cliente) {
      return new Response(
        JSON.stringify({ error: 'Cliente no encontrado o no tienes permiso para eliminarlo' }),
        { status: 404, headers: { 'Content-Type': 'application/json' } }
      );
    }

    // Eliminar el cliente
    const { error: deleteError } = await supabase
      .from('clientes')
      .delete()
      .eq('id', id)
      .eq('usuario_id', user.id);

    if (deleteError) {
      console.error('Error al eliminar cliente:', deleteError);
      return new Response(
        JSON.stringify({ 
          error: 'Error al eliminar el cliente',
          details: deleteError.message 
        }),
        { status: 500, headers: { 'Content-Type': 'application/json' } }
      );
    }

    // Respuesta exitosa
    return new Response(
      JSON.stringify({
        success: true,
        message: 'Cliente eliminado exitosamente'
      }),
      { 
        status: 200, 
        headers: { 'Content-Type': 'application/json' } 
      }
    );

  } catch (error) {
    console.error('Error en DELETE /api/customers/[id]:', error);
    return new Response(
      JSON.stringify({ 
        error: 'Error interno del servidor',
        message: error instanceof Error ? error.message : 'Error desconocido'
      }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }
};
