# Módulo de Gestión de Clientes

## 📋 Descripción

Sistema completo de gestión de clientes (CRUD) integrado con Supabase, que permite crear, listar y ver detalles de clientes en el CRM.

## 🗂️ Estructura de Archivos Creados

### Páginas
- `/src/pages/customers/index.astro` - Lista de todos los clientes con filtros y búsqueda
- `/src/pages/customers/crear.astro` - Formulario para crear nuevos clientes
- `/src/pages/customers/[id].astro` - Vista detallada de un cliente específico

### Componentes
- `/src/components/customers/CrearClienteForm.astro` - Componente del formulario de creación

### API Endpoints
- `/src/pages/api/customers/index.ts` - GET: Lista paginada de clientes con filtros
- `/src/pages/api/customers/crear.ts` - POST: Crear nuevo cliente
- `/src/pages/api/customers/[id].ts` - GET: Obtener detalles de un cliente

## 🎯 Funcionalidades Implementadas

### 1. Crear Cliente (`/customers/crear`)
- ✅ Formulario completo con validación
- ✅ Campos concordantes con la base de datos:
  - `nombre` (requerido)
  - `correo_electronico` (requerido, con validación de email)
  - `telefono` (opcional)
  - `empresa` (opcional)
  - `estado` (activo, prospecto, lead, inactivo)
  - `notas` (opcional)
  - `fecha_suscripcion` (opcional - se usa la fecha actual si no se especifica)
- ✅ Validación en frontend y backend
- ✅ Prevención de duplicados (mismo email)
- ✅ Asociación automática con el usuario autenticado
- ✅ Redirección al detalle del cliente tras creación exitosa

### 2. Listar Clientes (`/customers`)
- ✅ Vista tipo tarjeta responsive
- ✅ Búsqueda en tiempo real (nombre, email, empresa)
- ✅ Filtro por estado
- ✅ Ordenamiento (fecha, nombre)
- ✅ Paginación (10 clientes por página)
- ✅ Estados visualizados con badges de color
- ✅ Click en tarjeta para ver detalle

### 3. Detalle de Cliente (`/customers/:id`)
- ✅ Información completa del cliente
- ✅ Datos de contacto
- ✅ Notas
- ✅ Estados con badges visuales
- ✅ Sección de estadísticas (preparada para transacciones e interacciones)
- ✅ Acciones rápidas (preparadas para futuras funcionalidades)
- ✅ Navegación de vuelta a la lista
- ✅ **NUEVO**: Alerta de suscripción próxima a vencer (< 7 días)
- ✅ **NUEVO**: Envío automático de emails cuando se ve cliente con suscripción próxima a vencer
- ✅ **NUEVO**: Botón para renovar suscripción (placeholder para futuras funcionalidades)

## 🔐 Seguridad

- ✅ Autenticación requerida en todas las rutas
- ✅ Validación de token en cada API endpoint
- ✅ Filtrado por `usuario_id` - cada usuario solo ve sus clientes
- ✅ Validación de datos en backend
- ✅ Prevención de inyección SQL (mediante Supabase)

## 📊 Esquema de Base de Datos

```sql
CREATE TABLE public.clientes (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  usuario_id uuid NOT NULL REFERENCES auth.users(id),
  nombre text NOT NULL,
  correo_electronico text NOT NULL,
  telefono text,
  empresa text,
  notas text,
  estado text DEFAULT 'activo',
  fecha_creacion timestamp DEFAULT now(),
  fecha_actualizacion timestamp DEFAULT now(),
  fecha_suscripcion timestamp DEFAULT now()
);
```

## 🎨 Diseño

- Responsive (móvil, tablet, desktop)
- Consistente con el diseño del CRM
- Paleta de colores:
  - Activo: Verde (#d1fae5)
  - Prospecto: Azul (#dbeafe)
  - Lead: Amarillo (#fef3c7)
  - Inactivo: Gris (#f3f4f6)

## 🚀 Próximas Mejoras

### Funcionalidades Pendientes
- [ ] Editar cliente
- [ ] Eliminar cliente
- [ ] Exportar lista de clientes (CSV, Excel)
- [ ] Importar clientes desde archivo
- [ ] Vista de timeline de actividad
- [ ] Integración con transacciones
- [ ] Integración con interacciones
- [ ] Envío de emails desde el CRM
- [ ] Registro de llamadas
- [ ] Etiquetas personalizadas
- [ ] Segmentación de clientes
- [ ] Dashboard de métricas por cliente

## 📧 Sistema de Notificaciones de Suscripción

### Características

El sistema monitorea automáticamente las suscripciones de los clientes:

- ✅ Alerta visual en rojo cuando faltan < 7 días para vencer
- ✅ Email automático al ver el cliente si está próximo a vencer
- ✅ Cron job diario que verifica todos los clientes
- ✅ Evita envío duplicado de emails (máx 1 por 24 horas)
- ✅ Registra historial de notificaciones enviadas

### Funcionalidades

**En la página de detalle de cliente:**
1. Se muestra alerta roja si `fecha_suscripcion + 365 días - hoy <= 7 días`
2. Alerta incluye días restantes y fecha de vencimiento
3. Botón "Renovar Suscripción" (placeholder)
4. Si se cumple la condición, se envía email automático

**Con Cron Job (opcional):**
1. Endpoint `/api/cron/check-subscriptions` verifica todos los clientes diariamente
2. Envía emails proactivamente sin necesidad de que se vea el cliente
3. Perfecto para mantener a usuarios informados automáticamente

### Configuración

**Requerido:**
- Variable `fecha_suscripcion` en cada cliente

**Opcional pero recomendado:**
- Variable `RESEND_API_KEY` en `.env` (para enviar emails reales)
- Variable `CRON_SECRET` en `.env` (para proteger el cron job)

Ver [SUBSCRIPTION_NOTIFICATIONS.md](./SUBSCRIPTION_NOTIFICATIONS.md) para detalles de configuración de emails.

Ver [CRON_SETUP.md](./CRON_SETUP.md) para configurar verificación automática diaria.

## 📝 Uso

### Crear un Cliente

1. Navega a `/customers`
2. Click en "Nuevo Cliente"
3. Completa el formulario
4. Click en "Crear Cliente"

### Ver Lista de Clientes

1. Navega a `/customers`
2. Usa el buscador para filtrar
3. Selecciona un estado en el dropdown
4. Cambia el orden si lo deseas
5. Click en una tarjeta para ver detalles

### Ver Detalle de Cliente

1. Desde la lista, click en un cliente
2. O navega directamente a `/customers/{id}`

## 🔗 API Endpoints

### GET `/api/customers`
Lista de clientes con paginación y filtros.

**Query Parameters:**
- `limite` (default: 10)
- `offset` (default: 0)
- `busqueda` (opcional)
- `estado` (opcional)
- `ordenar_por` (default: fecha_creacion)
- `orden` (asc/desc, default: desc)

**Response:**
```json
{
  "success": true,
  "data": [...],
  "total": 100,
  "limite": 10,
  "offset": 0,
  "tiene_mas": true
}
```

### POST `/api/customers/crear`
Crear nuevo cliente.

**Body:**
```json
{
  "nombre": "Juan Pérez",
  "correo_electronico": "juan@example.com",
  "telefono": "+34 600 000 000",
  "empresa": "Empresa S.L.",
  "estado": "activo",
  "notas": "Cliente importante"
}
```

**Response:**
```json
{
  "success": true,
  "message": "Cliente creado exitosamente",
  "data": {...}
}
```

### GET `/api/customers/:id`
Obtener detalles de un cliente.

**Response:**
```json
{
  "success": true,
  "data": {...}
}
```

## ⚠️ Notas Importantes

1. Todos los endpoints requieren autenticación válida
2. Los clientes están aislados por usuario (multi-tenant)
3. El email debe ser único por usuario
4. Los errores de TypeScript en los archivos .astro son falsos positivos del linter y no afectan la funcionalidad
5. Las estadísticas en el detalle del cliente están preparadas para futuras integraciones

## 🧪 Testing

Para probar la funcionalidad:

1. Inicia sesión en el CRM
2. Navega a `/customers/crear`
3. Crea un cliente de prueba
4. Verifica que aparece en `/customers`
5. Click en el cliente para ver su detalle
6. Prueba los filtros y búsqueda

## 📚 Documentación Relacionada

- [Supabase Client](../lib/database/supabase.ts)
- [Tipos de Datos](../types/index.ts)
- [Servicio de Clientes](../lib/services/customerService.ts)
- [Sistema de Notificaciones de Suscripción](./SUBSCRIPTION_NOTIFICATIONS.md)
- [Configuración de Cron Jobs](./CRON_SETUP.md)
