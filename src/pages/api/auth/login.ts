import type { APIRoute } from 'astro';
import { createClient } from '@supabase/supabase-js';

export const prerender = false;

export const POST: APIRoute = async ({ request, cookies }) => {
  try {
    // Leer el body del request
    const contentType = request.headers.get('content-type');
    
    if (!contentType || !contentType.includes('application/json')) {
      return new Response(
        JSON.stringify({
          success: false,
          error: 'Content-Type debe ser application/json',
        }),
        { 
          status: 400,
          headers: { 'Content-Type': 'application/json' }
        }
      );
    }

    const body = await request.json();
    const { email, password } = body;

    if (!email || !password) {
      return new Response(
        JSON.stringify({
          success: false,
          error: 'El correo y la contraseña son requeridos',
        }),
        { 
          status: 400,
          headers: { 'Content-Type': 'application/json' }
        }
      );
    }

    // Crear cliente de Supabase
    const supabaseUrl = import.meta.env.PUBLIC_SUPABASE_URL;
    const supabaseKey = import.meta.env.PUBLIC_SUPABASE_ANON_KEY;

    if (!supabaseUrl || !supabaseKey) {
      throw new Error('Faltan variables de entorno de Supabase');
    }

    const supabase = createClient(supabaseUrl, supabaseKey, {
      auth: {
        flowType: 'pkce',
        autoRefreshToken: true,
        persistSession: true,
        detectSessionInUrl: false,
      },
    });

    // Intentar login
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      console.error('Login error:', error);
      return new Response(
        JSON.stringify({
          success: false,
          error: error.message || 'Error al iniciar sesión',
        }),
        { 
          status: 401,
          headers: { 'Content-Type': 'application/json' }
        }
      );
    }

    if (!data.session) {
      return new Response(
        JSON.stringify({
          success: false,
          error: 'No se pudo obtener la sesión',
        }),
        { 
          status: 401,
          headers: { 'Content-Type': 'application/json' }
        }
      );
    }

    // Guardar tokens en cookies
    cookies.set('sb-access-token', data.session.access_token, {
      path: '/',
      maxAge: data.session.expires_in,
      secure: import.meta.env.PROD,
      httpOnly: true,
      sameSite: 'lax',
    });

    cookies.set('sb-refresh-token', data.session.refresh_token, {
      path: '/',
      maxAge: 60 * 60 * 24 * 7, // 7 días
      secure: import.meta.env.PROD,
      httpOnly: true,
      sameSite: 'lax',
    });

    // Opcional: guardar datos del usuario
    if (data.user?.id) {
      cookies.set('sb-user-id', data.user.id, {
        path: '/',
        maxAge: data.session.expires_in,
        secure: import.meta.env.PROD,
        httpOnly: false,
        sameSite: 'lax',
      });
    }

    return new Response(
      JSON.stringify({
        success: true,
        message: 'Inicio de sesión exitoso',
        user: data.user,
      }),
      { 
        status: 200,
        headers: { 'Content-Type': 'application/json' }
      }
    );
  } catch (error: any) {
    console.error('Login error:', error);
    return new Response(
      JSON.stringify({
        success: false,
        error: error.message || 'Error interno del servidor',
      }),
      { 
        status: 500,
        headers: { 'Content-Type': 'application/json' }
      }
    );
  }
};
