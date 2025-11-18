import type { APIRoute } from 'astro';
import { supabase } from '../../../lib/database/supabase';

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

    // Obtener datos del usuario autenticado
    const { data: { user }, error: authError } = await supabase.auth.getUser(token);

    if (authError || !user) {
      return new Response(
        JSON.stringify({ error: 'Token inválido o expirado' }),
        { status: 401, headers: { 'Content-Type': 'application/json' } }
      );
    }

    // Obtener datos del cuerpo de la petición
    const body = await request.json();
    const { nombre, correo_electronico, telefono, empresa, estado, notas, fecha_suscripcion } = body;

    // Validaciones
    if (!nombre || typeof nombre !== 'string' || nombre.trim().length < 2) {
      return new Response(
        JSON.stringify({ error: 'El nombre es requerido y debe tener al menos 2 caracteres' }),
        { status: 400, headers: { 'Content-Type': 'application/json' } }
      );
    }

    if (!correo_electronico || typeof correo_electronico !== 'string') {
      return new Response(
        JSON.stringify({ error: 'El correo electrónico es requerido' }),
        { status: 400, headers: { 'Content-Type': 'application/json' } }
      );
    }

    // Validar formato de email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(correo_electronico)) {
      return new Response(
        JSON.stringify({ error: 'El correo electrónico no es válido' }),
        { status: 400, headers: { 'Content-Type': 'application/json' } }
      );
    }

    // Validar estado
    const estadosValidos = ['activo', 'inactivo', 'prospecto', 'lead'];
    if (estado && !estadosValidos.includes(estado)) {
      return new Response(
        JSON.stringify({ error: `El estado debe ser uno de: ${estadosValidos.join(', ')}` }),
        { status: 400, headers: { 'Content-Type': 'application/json' } }
      );
    }

    // Verificar si ya existe un cliente con ese correo para este usuario
    const { data: clienteExistente, error: checkError } = await supabase
      .from('clientes')
      .select('id')
      .eq('usuario_id', user.id)
      .eq('correo_electronico', correo_electronico.trim())
      .single();

    if (clienteExistente) {
      return new Response(
        JSON.stringify({ error: 'Ya existe un cliente con este correo electrónico' }),
        { status: 409, headers: { 'Content-Type': 'application/json' } }
      );
    }

    // Crear el cliente
    const nuevoCliente = {
      usuario_id: user.id,
      nombre: nombre.trim(),
      correo_electronico: correo_electronico.trim().toLowerCase(),
      telefono: telefono?.trim() || null,
      empresa: empresa?.trim() || null,
      estado: estado || 'activo',
      notas: notas?.trim() || null,
      fecha_suscripcion: fecha_suscripcion || new Date().toISOString(),
    };

    const { data: cliente, error: insertError } = await supabase
      .from('clientes')
      .insert(nuevoCliente as any)
      .select()
      .single();

    if (insertError) {
      console.error('Error al insertar cliente:', insertError);
      return new Response(
        JSON.stringify({ 
          error: 'Error al crear el cliente en la base de datos',
          details: insertError.message 
        }),
        { status: 500, headers: { 'Content-Type': 'application/json' } }
      );
    }

    // Respuesta exitosa
    return new Response(
      JSON.stringify({
        success: true,
        message: 'Cliente creado exitosamente',
        data: cliente
      }),
      { 
        status: 201, 
        headers: { 'Content-Type': 'application/json' } 
      }
    );

  } catch (error) {
    console.error('Error en POST /api/customers/crear:', error);
    return new Response(
      JSON.stringify({ 
        error: 'Error interno del servidor',
        message: error instanceof Error ? error.message : 'Error desconocido'
      }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }
};
