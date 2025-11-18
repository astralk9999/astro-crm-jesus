# 📚 Documentación del Sistema de Gestión de Clientes y Notificaciones

Bienvenido a la documentación completa del sistema de gestión de clientes con notificaciones de suscripción automáticas.

## 🎯 Empezar Rápido (5 minutos)

### 1. Configurar Variables de Entorno

```bash
# Copia el archivo de ejemplo
cp .env.example .env

# Completa con tus credenciales de Supabase
# Opcionalmente, añade RESEND_API_KEY para emails
```

### 2. Ejecutar Migraciones

En Supabase SQL Editor:
- Ejecuta `migrations/001_add_fecha_suscripcion_to_clientes.sql`
- Ejecuta `migrations/002_subscription_notifications_table.sql`

### 3. Probar Localmente

```bash
npm run dev
# Navega a http://localhost:3000/customers
# Crea un cliente o accede a uno existente
```

## 📚 Documentación Disponible

### 1. **[CUSTOMERS_MODULE.md](./CUSTOMERS_MODULE.md)** - Gestión de Clientes
- ✅ Sistema CRUD completo
- ✅ Búsqueda, filtros, paginación
- ✅ Validación de datos
- ✅ Seguridad por usuario
- **Tiempo de lectura**: 10 minutos
- **Nivel**: Principiante a Intermedio

### 2. **[SUBSCRIPTION_NOTIFICATIONS.md](./SUBSCRIPTION_NOTIFICATIONS.md)** - Notificaciones de Suscripción
- ✅ Cómo funciona el sistema de alertas
- ✅ Configuración de Resend
- ✅ Templates de email
- ✅ Estados de alerta
- ✅ Testing manual
- **Tiempo de lectura**: 15 minutos
- **Nivel**: Intermedio

### 3. **[CRON_SETUP.md](./CRON_SETUP.md)** - Verificación Automática
- ✅ Configurar cron job diario
- ✅ Opciones: Vercel, AWS, Google Cloud, Heroku, n8n
- ✅ Monitoreo y logs
- ✅ Troubleshooting
- **Tiempo de lectura**: 20 minutos
- **Nivel**: Intermedio a Avanzado

### 4. **[SUBSCRIPTION_SYSTEM.md](./SUBSCRIPTION_SYSTEM.md)** - Guía Completa
- 📊 Arquitectura del sistema
- 🔄 Flujos de notificación
- 📧 Estados y cambios
- 🛠️ API endpoints
- 📝 Base de datos
- 🐛 Debugging y troubleshooting
- **Tiempo de lectura**: 25 minutos
- **Nivel**: Avanzado

## 🗂️ Estructura de Archivos

```
nasty-neptune/
├── .env.example                          # Configuración de ejemplo
├── CUSTOMERS_MODULE.md                   # Gestión de clientes
├── SUBSCRIPTION_NOTIFICATIONS.md         # Notificaciones de suscripción
├── SUBSCRIPTION_SYSTEM.md                # Guía completa del sistema
├── CRON_SETUP.md                         # Configuración de cron jobs
├── migrations/
│   ├── 001_add_fecha_suscripcion_to_clientes.sql
│   └── 002_subscription_notifications_table.sql
├── src/
│   ├── components/customers/
│   │   └── CrearClienteForm.astro        # Componente de formulario
│   ├── lib/
│   │   └── services/
│   │       ├── subscriptionService.ts    # Lógica de suscripción
│   │       ├── emailService.ts           # Servicio de emails
│   │       └── customerService.ts        # Servicios de clientes
│   ├── pages/
│   │   ├── customers/
│   │   │   ├── index.astro               # Lista de clientes
│   │   │   ├── crear.astro               # Crear cliente
│   │   │   └── [id].astro                # Detalle de cliente
│   │   └── api/
│   │       ├── customers/
│   │       │   ├── index.ts              # API GET clientes
│   │       │   ├── crear.ts              # API POST crear cliente
│   │       │   └── [id].ts               # API GET/DELETE cliente
│   │       ├── notifications/
│   │       │   └── subscription.ts       # Enviar notificación
│   │       └── cron/
│   │           └── check-subscriptions.ts # Verificar diariamente
│   └── middleware.ts                     # Protección de rutas
└── vercel.json                          # Config de Vercel (opcional)
```

## 🚀 Flujo de Trabajo

### Para Crear un Cliente
1. Ve a `/customers`
2. Haz clic en "Nuevo Cliente"
3. Completa el formulario
4. Haz clic en "Crear Cliente"
5. Se muestra el detalle del cliente

### Para Recibir Notificaciones de Suscripción
1. Al crear cliente, especifica `fecha_suscripcion`
2. El sistema calcula automáticamente vencimiento (365 días después)
3. Cuando falten < 7 días:
   - Se muestra **alerta roja** en la página del cliente
   - Se envía **email automático** (si está configurado)
4. Con cron job: Se envía email diario automáticamente

## ⚙️ Variables de Entorno

### Requeridas
```env
PUBLIC_SUPABASE_URL=https://...
PUBLIC_SUPABASE_ANON_KEY=...
```

### Opcionales pero Recomendadas
```env
RESEND_API_KEY=re_...              # Para emails reales
CRON_SECRET=tu-clave-secreta      # Para proteger cron job
```

Ver `.env.example` para detalles completos.

## 🔄 Ciclo de Vida de una Notificación

```
1. SUSCRIPCIÓN ACTIVA (> 7 días)
   └─> Sin alertas, operación normal

2. PRÓXIMA A VENCER (1-7 días)
   ├─> Alerta roja en UI
   ├─> Email al acceder a cliente
   └─> Email automático diario (si cron configurado)

3. VENCIDA (≤ 0 días)
   ├─> Alerta roja intenso
   ├─> Email diario automático
   └─> Necesita renovación inmediata
```

## 🧪 Testing

### Test Manual de Alerta
1. Crear cliente con `fecha_suscripcion` = hace 360 días
2. Navegar a `/customers/[id]`
3. Verificar que aparece alerta roja
4. Verificar que se envía email (consola o Resend dashboard)

### Test de Cron Job
```bash
curl -X GET http://localhost:3000/api/cron/check-subscriptions \
  -H "Authorization: Bearer desarrollo"
```

## 🐛 Troubleshooting Rápido

| Problema | Solución |
|----------|----------|
| No aparece alerta | Verifica `fecha_suscripcion` en BD |
| No se envían emails | Añade `RESEND_API_KEY` a `.env` |
| Cron no se ejecuta | Verifica `CRON_SECRET` y configuración |
| Cliente no guarda | Verifica autenticación y sesión |
| Error de importación | Ejecuta las migraciones en Supabase |

Ver documentación específica para troubleshooting detallado.

## 🔐 Seguridad

✅ Autenticación requerida en todas las rutas
✅ Validación de token en cada API call
✅ Aislamiento por usuario (multi-tenant)
✅ CORS configurado
✅ Protección de cron job con Bearer token
✅ Cookies seguras (httpOnly)

## 📊 Base de Datos

### Tablas Principales
- `clientes` - Información de clientes
- `subscription_notifications` - Historial de notificaciones
- `auth.users` - Usuarios (Supabase Auth)

Ver migraciones para esquema completo.

## 🔗 Links Importantes

- **Supabase Dashboard**: https://supabase.com/dashboard
- **Resend Dashboard**: https://resend.com/dashboard
- **Vercel Dashboard**: https://vercel.com/dashboard
- **Documentación Astro**: https://docs.astro.build
- **Documentación Supabase**: https://supabase.com/docs

## 📋 Checklist de Implementación

### Fase 1: Configuración Básica
- [ ] Completar `.env` con credenciales Supabase
- [ ] Ejecutar migraciones en Supabase
- [ ] Probar navegación a `/customers`
- [ ] Crear cliente de prueba

### Fase 2: Email (Opcional)
- [ ] Crear cuenta en Resend.com
- [ ] Obtener API key
- [ ] Añadir `RESEND_API_KEY` a `.env`
- [ ] Probar envío de email

### Fase 3: Cron Job (Recomendado)
- [ ] Generar `CRON_SECRET` seguro
- [ ] Configurar cron en plataforma (Vercel/AWS/etc)
- [ ] Probar ejecución del cron job
- [ ] Verificar logs y emails

### Fase 4: Production
- [ ] Configurar variables en hosting
- [ ] Ejecutar migraciones en BD de producción
- [ ] Desplegar código
- [ ] Probar end-to-end
- [ ] Monitorear logs

## 🚀 Próximas Características

- [ ] Renovación automática de suscripciones
- [ ] Historial de suscripciones del cliente
- [ ] Descuentos por renovación temprana
- [ ] SMS como alternativa a email
- [ ] Integración con Stripe
- [ ] Dashboard de renovaciones próximas
- [ ] Reportes de expiraciones

## 📞 Soporte

Para problemas:

1. **Revisar Troubleshooting** en documentación específica
2. **Consultar logs** en consola/terminal
3. **Verificar BD** en Supabase SQL Editor
4. **Revisar documentación** de herramientas (Supabase, Resend, Astro)

## 📝 Notas Finales

- El sistema funciona **sin Resend** - los emails se loguean en consola
- El cron job es **OPCIONAL** - las notificaciones manuales funcionan igual
- Puedes implementar características nuevas en cualquier momento
- Toda la información se guarda en Supabase con auditoría completa
- El sistema es escalable y preparado para producción

---

**Última actualización**: Noviembre 2025
**Versión**: 1.0.0
**Estado**: ✅ Producción
