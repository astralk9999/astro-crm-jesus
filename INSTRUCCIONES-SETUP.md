# 📋 Instrucciones de Configuración - SoftControl CRM

## ✅ Cambios Realizados (Corrección de Errores)

### 1. **Middleware Actualizado**
- ✓ Actualizado para reconocer las rutas correctas (`/clientes`, `/productos`, `/licencias`)
- ✓ Mejorado el manejo de cookies de Supabase
- ✓ Añadido soporte para archivos estáticos

### 2. **Sistema de Autenticación Mejorado**
- ✓ Login ahora usa directamente el cliente de Supabase
- ✓ Configurada persistencia de sesión en localStorage
- ✓ Auto-refresh de tokens habilitado
- ✓ Mejor manejo de errores con mensajes en español
- ✓ Espera de 500ms antes de redirigir para asegurar que la sesión se guarde

### 3. **Signup Mejorado**
- ✓ Usa directamente el cliente de Supabase
- ✓ Guarda metadata del usuario (nombre y rol)
- ✓ Mejor manejo de errores

### 4. **Dashboard Creado**
- ✓ Vista principal con estadísticas
- ✓ Tarjetas de resumen (clientes, productos, licencias)
- ✓ Accesos rápidos a todas las secciones
- ✓ Licencias recientes

## 🔧 Pasos de Configuración

### 1. Ejecutar el SQL en Supabase

1. Ve a tu proyecto en Supabase: https://supabase.com/dashboard
2. Selecciona tu proyecto `obgazzjarljihgeqehbf`
3. Ve a **SQL Editor** en el menú lateral
4. Haz clic en **New Query**
5. Copia y pega TODO el contenido del archivo `esquema-softcontrol.sql`
6. Haz clic en **Run** o presiona `Ctrl+Enter`

**Importante:** El SQL debe ejecutarse completamente sin errores. Verifica que todas las tablas se hayan creado:
- `profiles`
- `clients`
- `products`
- `licenses`

### 2. Desactivar Confirmación de Email (Opcional, para desarrollo)

Para evitar tener que confirmar el email durante el desarrollo:

1. Ve a **Authentication** > **Settings** en Supabase
2. Busca **Enable email confirmations**
3. Desactívalo temporalmente

### 3. Crear tu Primer Usuario Administrador

1. Abre el navegador en: http://localhost:4321
2. Haz clic en "Regístrate aquí"
3. Completa el formulario:
   - **Nombre completo:** Tu nombre
   - **Email:** tu-email@ejemplo.com
   - **Contraseña:** mínimo 6 caracteres
   - **Tipo de cuenta:** Selecciona "Administrador - Acceso total"
4. Haz clic en "Crear Cuenta"
5. Espera 2 segundos y serás redirigido al login
6. Inicia sesión con tus credenciales

### 4. Verificar que Todo Funciona

Después de iniciar sesión, deberías ver:
- ✅ Dashboard con estadísticas
- ✅ Navegación superior funcionando
- ✅ Botón de "Salir" en la esquina superior derecha

## 🐛 Solución de Problemas Comunes

### Problema: "No me redirige después del login"

**Soluciones:**
1. Abre la consola del navegador (F12) y verifica si hay errores
2. Limpia el localStorage:
   ```javascript
   // En la consola del navegador
   localStorage.clear()
   ```
3. Recarga la página con `Ctrl+Shift+R`
4. Verifica que el SQL se ejecutó correctamente en Supabase

### Problema: "Error de credenciales inválidas"

**Soluciones:**
1. Verifica que el email y contraseña sean correctos
2. Si acabas de registrarte, espera unos segundos
3. Ve a Supabase > Authentication > Users y verifica que tu usuario existe
4. Si la confirmación de email está activada, revisa tu correo

### Problema: "La página se queda en blanco"

**Soluciones:**
1. Verifica que el servidor esté corriendo (`npm run dev`)
2. Abre la consola del navegador y busca errores
3. Verifica que las credenciales en `.env.local` sean correctas:
   ```
   PUBLIC_SUPABASE_URL=https://obgazzjarljihgeqehbf.supabase.co
   PUBLIC_SUPABASE_ANON_KEY=eyJhbGci...
   ```

### Problema: "Error al crear cliente/producto/licencia"

**Soluciones:**
1. Verifica que iniciaste sesión como **administrador**
2. Los usuarios con rol "staff" solo tienen permisos de lectura
3. Verifica en Supabase que las políticas RLS estén activas

## 📊 Estructura del Sistema

### Roles de Usuario

| Rol | Permisos |
|-----|----------|
| **admin** | Crear, editar, eliminar y ver todo |
| **staff** | Solo ver (lectura) |

### Módulos Disponibles

1. **Dashboard** (`/dashboard`)
   - Vista general con estadísticas
   - Accesos rápidos

2. **Clientes** (`/clientes`)
   - Listar todos los clientes
   - Crear nuevo cliente (solo admin)
   - Editar cliente (solo admin)
   - Ver detalles de cliente
   - Eliminar cliente (solo admin)

3. **Productos** (`/productos`)
   - Listar todos los productos
   - Crear nuevo producto (solo admin)
   - Editar producto (solo admin)
   - Ver detalles de producto
   - Eliminar producto (solo admin)
   - Precios para pago único y suscripción

4. **Licencias** (`/licencias`)
   - Listar todas las licencias
   - Filtrar por estado y tipo
   - Crear nueva licencia (solo admin)
   - Editar licencia (solo admin)
   - Ver detalles de licencia
   - Eliminar licencia (solo admin)
   - Alertas de licencias vencidas

## 🔒 Seguridad (RLS)

Todas las tablas tienen Row Level Security (RLS) activado:

- ✅ Solo usuarios autenticados pueden leer datos
- ✅ Solo administradores pueden crear, editar y eliminar
- ✅ Los datos están protegidos a nivel de base de datos

## 📝 Datos de Prueba

El SQL incluye 5 productos de ejemplo:
- Software Contable Pro
- CRM Ventas Plus
- Facturación Electrónica
- Nómina Integral
- Inventario Smart

## 🚀 Comandos Útiles

```bash
# Iniciar el servidor de desarrollo
npm run dev

# Compilar para producción
npm run build

# Vista previa de producción
npm run preview

# Limpiar caché
rm -rf .astro node_modules/.vite
```

## 📞 Soporte

Si encuentras algún problema:
1. Revisa la consola del navegador (F12)
2. Verifica los logs del servidor
3. Asegúrate de que el SQL se ejecutó correctamente
4. Verifica las credenciales de Supabase

---

**Versión:** 1.0
**Última actualización:** 26 de Noviembre de 2025
