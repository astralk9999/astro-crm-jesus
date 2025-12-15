import { defineMiddleware } from 'astro:middleware';

export const onRequest = defineMiddleware(async (context, next) => {
  // Rutas públicas que no requieren autenticación
  const publicRoutes = [
    '/login',
    '/signup',
    '/auth/login',
    '/auth/signup',
    '/forgot-password',
    '/auth/forgot-password',
    '/auth/reset-password',
  ];

  const currentPath = new URL(context.request.url).pathname;

  // Permitir rutas públicas
  if (publicRoutes.includes(currentPath) || publicRoutes.some((route) => currentPath.startsWith(route))) {
    return next();
  }

  // Permitir rutas de API
  if (currentPath.startsWith('/api/')) {
    return next();
  }

  // Permitir archivos estáticos
  if (currentPath.startsWith('/_') || currentPath.includes('.')) {
    return next();
  }

  // Verificar si es una ruta protegida
  const protectedRoutes = ['/dashboard', '/clientes', '/productos', '/licencias'];
  const isProtectedRoute = protectedRoutes.some((route) => currentPath.startsWith(route));

  if (isProtectedRoute) {
    // Verificar token en cookies
    const token = context.cookies.get('sb-access-token')?.value || 
                   context.cookies.get('sb-refresh-token')?.value;

    if (!token) {
      // Redirigir a login si no hay token
      return context.redirect('/login');
    }
  }

  return next();
});
