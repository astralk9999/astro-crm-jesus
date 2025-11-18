# 🔔 Sistema de Notificaciones de Suscripción - Guía Completa

## 📚 Índice de Documentación

1. **[SUBSCRIPTION_NOTIFICATIONS.md](./SUBSCRIPTION_NOTIFICATIONS.md)** 
   - Cómo funciona el sistema de notificaciones
   - Configuración de Resend
   - Flujo de funcionamiento
   - Estados de alerta
   - Template del email
   - Testing manual
   - Troubleshooting

2. **[CRON_SETUP.md](./CRON_SETUP.md)**
   - Configuración de verificación automática diaria
   - Opciones: Vercel, AWS Lambda, Google Cloud, Heroku, n8n
   - Cómo funcionan los cron jobs
   - Monitoreo y logs
   - Troubleshooting de crons

3. **[CUSTOMERS_MODULE.md](./CUSTOMERS_MODULE.md)**
   - Módulo completo de gestión de clientes
   - Incluye sección de notificaciones de suscripción
   - API endpoints
   - Esquema de base de datos

## 🚀 Quick Start (30 minutos)

### 1. Configurar Email (Opcional pero Recomendado)

```bash
# 1. Crea cuenta en Resend.com
# 2. Copia tu API key
# 3. Añade a .env:
echo "RESEND_API_KEY=re_xxxxxxxxxxxxx" >> .env
```

### 2. Ejecutar Migración de BD

En Supabase SQL Editor, ejecuta el contenido de:
- `migrations/002_subscription_notifications_table.sql`

Esto crea la tabla para registrar notificaciones.

### 3. Probar Localmente

```bash
# Crear un cliente con fecha_suscripcion de 5 días atrás
# (Esto hará que venza en 360 días = dentro de 7 días)

# Navegar a /customers y crear un cliente
# O ir a /customers/[id] de un cliente existente

# Si vence en < 7 días, deberías ver:
# ✅ Alerta roja en la UI
# ✅ Email en consola o en Resend dashboard
```

### 4. Configurar Cron Job (Recomendado)

El sistema puede enviar emails automáticamente cada día sin que los usuarios accedan manualmente.

**Si usas Vercel:**
```json
// vercel.json
{
  "crons": [{
    "path": "/api/cron/check-subscriptions",
    "schedule": "0 8 * * *"
  }]
}
```

**Si usas otro hosting:**
- Sigue instrucciones en [CRON_SETUP.md](./CRON_SETUP.md)

## 📊 Arquitectura del Sistema

```
┌─────────────────────────────────────────┐
│         UI de Detalles del Cliente       │
│      (/customers/[id].astro)            │
│                                         │
│  - Muestra alerta si < 7 días           │
│  - Llama a enviarNotificacion()         │
└──────────────┬──────────────────────────┘
               │
               ▼
┌─────────────────────────────────────────┐
│  API: /notifications/subscription       │
│                                         │
│  - Valida el token                      │
│  - Llama a emailService                 │
└──────────────┬──────────────────────────┘
               │
               ▼
┌─────────────────────────────────────────┐
│      emailService.ts                    │
│                                         │
│  - Intenta enviar con Resend            │
│  - Fallback a console.log()             │
└──────────────┬──────────────────────────┘
               │
      ┌────────┴────────┐
      ▼                 ▼
  ✉️ Resend           📝 Console
  (Producción)       (Desarrollo)
```

## 🔄 Flujo de Notificación por Evento

### Evento: Usuario accede a detalle de cliente

```javascript
// 1. Página carga
GET /customers/[id]

// 2. Se ejecuta verificarYMostrarAlertaSuscripcion()
- Calcula días restantes
- Si < 7 días, muestra alerta roja

// 3. Si mostró alerta, ejecuta enviarNotificacion()
POST /api/notifications/subscription
{
  clienteId: "uuid",
  nombre: "Cliente",
  email: "client@example.com",
  diasRestantes: 3,
  fechaSuscripcion: "2025-08-15",
  fechaVencimiento: "2026-08-15"
}

// 4. Endpoint envía email
emailService.enviarEmailNotificacionVencimiento()
```

## 🔄 Flujo de Notificación Automática (Cron)

```javascript
// 1. Cada día a las 8 AM (configurable)
GET /api/cron/check-subscriptions
Authorization: Bearer {CRON_SECRET}

// 2. El endpoint:
- Obtiene TODOS los clientes
- Calcula días restantes para c/u
- Identifica los que vencen en < 7 días
- Verifica que no se envió email en últimas 24h

// 3. Para cada cliente que lo necesita:
- Envía email automáticamente
- Registra en tabla subscription_notifications

// 4. Retorna resumen:
{
  total_clientes: 45,
  notificaciones_enviadas: 3,
  clientes_procesados: [...]
}
```

## 📧 Estados de Notificación

### 1. Suscripción Activa (> 7 días)
- ✅ SIN alerta
- ✅ SIN email automático
- ✅ Operación normal

### 2. Próxima a Vencer (1-7 días)
- 🔴 **Alerta roja** en la UI
- 📧 **Email enviado** cuando se accede a cliente
- 📧 **Email automático** cada día si no se ha enviado en 24h
- Información clara: "Tu suscripción vence en X días"

### 3. Vencida (≤ 0 días)
- 🔴 **Alerta roja intenso** en la UI
- ❌ "Suscripción Vencida"
- 📧 **Email diario** automático
- Información: "Tu suscripción ha vencido"

## 🛠️ API Endpoints

### Enviar Notificación Manual
```
POST /api/notifications/subscription

Headers:
  Authorization: Bearer {access_token}

Body:
  {
    clienteId: string
    nombre: string
    email: string
    diasRestantes: number
    fechaSuscripcion: string
    fechaVencimiento: string
  }

Response:
  {
    success: boolean
    message: string
  }
```

### Verificar Suscripciones (Cron)
```
GET /api/cron/check-subscriptions

Headers:
  Authorization: Bearer {CRON_SECRET}

Response:
  {
    success: boolean
    total_clientes: number
    notificaciones_enviadas: number
    errores: number
    clientes_procesados: array
    timestamp: string
  }
```

## 📋 Base de Datos

### Tabla: subscription_notifications
```sql
- id (uuid) - Identificador único
- cliente_id (uuid) - Referencia al cliente
- usuario_id (uuid) - Referencia al usuario
- dias_restantes (integer) - Días que faltaban
- notificacion_tipo (text) - 'proxima_a_vencer' o 'vencida'
- created_at (timestamp) - Cuándo se envió
- updated_at (timestamp) - Última actualización
```

**Propósito:** Mantener auditoría de qué notificaciones se han enviado y cuándo.

## ✅ Checklist de Implementación

- [ ] Copiar `RESEND_API_KEY` a `.env`
- [ ] Ejecutar migración `002_subscription_notifications_table.sql`
- [ ] Probar alerta en UI (/customers/[id])
- [ ] Probar email (consola o Resend dashboard)
- [ ] Configurar cron job en Vercel/AWS/etc
- [ ] Verificar que cron se ejecuta diariamente
- [ ] Revisar logs y emails recibidos
- [ ] ✅ Todo funciona!

## 🐛 Debugging

### Ver logs en desarrollo:
```bash
# Consola del navegador (F12)
- Logs de JavaScript
- Llamadas a /api/notifications/subscription

# Terminal (npm run dev)
- Logs de servidor
- Logs de Supabase
- Logs de emails fallidos
```

### Ver emails en Resend:
1. Inicia sesión en https://resend.com
2. Dashboard → Emails
3. Busca por cliente o dominio

### Ver notificaciones en BD:
```sql
-- Supabase SQL Editor
SELECT * FROM subscription_notifications 
ORDER BY created_at DESC 
LIMIT 20;
```

## 🚨 Errores Comunes

| Error | Causa | Solución |
|-------|-------|----------|
| "Email no enviado" | RESEND_API_KEY no configurado | Añadir a .env |
| "No aparece alerta" | fecha_suscripcion incorrecta | Verificar BD |
| "Alerta pero sin email" | Resend no configurado | Añadir RESEND_API_KEY |
| "Emails duplicados" | Cron ejecutándose muy frecuente | Cambiar schedule a diario |
| "401 Unauthorized" | CRON_SECRET incorrecto | Verificar en .env |

## 📞 Contacto & Soporte

- **Resend Docs:** https://resend.com/docs
- **Supabase Docs:** https://supabase.com/docs
- **Astro Docs:** https://docs.astro.build

## 📝 Notas Finales

- Sistema está **100% funcional** en modo desarrollo sin Resend
- Emails se loguean en consola si no tienes Resend
- Cron job es **OPCIONAL** - el sistema funciona con notificaciones manuales
- Puedes implementar Resend en cualquier momento
- La tabla de auditoría mantiene histórico completo de notificaciones

**¡Listo para usar! 🚀**
