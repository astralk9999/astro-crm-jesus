import type { APIRoute } from 'astro';

export const prerender = false;

export const POST: APIRoute = async ({ cookies }) => {
  try {
    // Eliminar cookies de sesión
    cookies.delete('sb-access-token', {
      path: '/',
    });
    
    cookies.delete('sb-refresh-token', {
      path: '/',
    });
    
    cookies.delete('sb-user-id', {
      path: '/',
    });

    return new Response(
      JSON.stringify({
        success: true,
        message: 'Sesión cerrada exitosamente',
      }),
      { 
        status: 200,
        headers: { 'Content-Type': 'application/json' }
      }
    );
  } catch (error: any) {
    console.error('Logout error:', error);
    return new Response(
      JSON.stringify({
        success: false,
        error: error.message || 'Error al cerrar sesión',
      }),
      { 
        status: 500,
        headers: { 'Content-Type': 'application/json' }
      }
    );
  }
};
