import { defineMiddleware } from 'astro:middleware';

export const onRequest = defineMiddleware(async (context, next) => {
  // Rutas públicas que no requieren autenticación
  const publicRoutes = [
    '/auth/login',
    '/auth/signup',
    '/auth/forgot-password',
    '/auth/reset-password',
  ];

  const currentPath = new URL(context.request.url).pathname;

  // Permitir rutas públicas
  if (publicRoutes.some((route) => currentPath.startsWith(route))) {
    return next();
  }

  // Permitir rutas de API de auth
  if (currentPath.startsWith('/api/auth/')) {
    return next();
  }

  // Verificar si es una ruta protegida
  const protectedRoutes = ['/dashboard', '/customers', '/products', '/sales', '/reports'];
  const isProtectedRoute = protectedRoutes.some((route) => currentPath.startsWith(route));

  if (isProtectedRoute) {
    // Verificar token en cookies
    const token = context.cookies.get('sb-access-token')?.value;

    if (!token) {
      // Redirigir a login si no hay token
      return context.redirect('/auth/login');
    }
  }

  return next();
});
