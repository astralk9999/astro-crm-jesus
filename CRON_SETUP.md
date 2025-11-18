# Configuración de Cron Job - Verificación Automática de Suscripciones

## 📋 Descripción

El endpoint `/api/cron/check-subscriptions` verifica automáticamente todos los clientes cada día y envía notificaciones de suscripción próxima a vencer sin necesidad de que el usuario acceda a cada cliente manualmente.

## 🔒 Seguridad

El endpoint está protegido con un token de autenticación:

```
Authorization: Bearer {CRON_SECRET}
```

**Configura la variable de entorno:**

```env
CRON_SECRET=tu-clave-secreta-super-segura-aqui
```

⚠️ **Importante**: Mantén este valor en secreto. No lo compartas ni lo comitees en el repositorio.

## 🚀 Opciones de Implementación

### Opción 1: Vercel Crons (Recomendado si usas Vercel)

1. Crea archivo `vercel.json` en la raíz del proyecto:

```json
{
  "crons": [
    {
      "path": "/api/cron/check-subscriptions",
      "schedule": "0 8 * * *"
    }
  ]
}
```

2. Configura la variable de entorno en Vercel Dashboard:
   - Settings → Environment Variables
   - Añade `CRON_SECRET` con un valor seguro

3. Deploy para activar el cron

**Horario**: 8:00 AM UTC diariamente (ajusta según necesites)

### Opción 2: AWS Lambda + EventBridge

1. **Crear función Lambda:**

```bash
# Package the Astro app and deploy to Lambda
# Esta opción es más compleja, requiere:
# - Crear un IAM role
# - Configurar un Event Rule
# - Crear funciones HTTP wrapper
```

2. **En AWS EventBridge:**
   - Crear regla con schedule: `cron(0 8 * * ? *)`
   - Target: Lambda function
   - Headers: `Authorization: Bearer {CRON_SECRET}`

### Opción 3: Google Cloud Scheduler

1. **Crear Cloud Scheduler job:**

```bash
gcloud scheduler jobs create http check-subscriptions \
  --schedule="0 8 * * *" \
  --http-method=GET \
  --uri="https://tu-dominio.com/api/cron/check-subscriptions" \
  --headers='{"Authorization":"Bearer {CRON_SECRET}"}'
```

2. Configura las variables de entorno en Cloud Run/App Engine

### Opción 4: Heroku Scheduler (Gratuito)

1. Instala Heroku Scheduler add-on:

```bash
heroku addons:create scheduler:standard
```

2. Desde dashboard de Heroku, crea un job:
   - Frecuencia: Daily at 8:00 AM
   - Comando: 
   ```bash
   curl -X GET https://tu-dominio.com/api/cron/check-subscriptions \
     -H "Authorization: Bearer $CRON_SECRET"
   ```

3. Configura `CRON_SECRET` en Config Vars

### Opción 5: n8n.io (Automatización Visual)

1. Ve a [n8n.io](https://n8n.io)
2. Crea nuevo workflow
3. Añade trigger "Schedule"
4. Configura para ejecutar diariamente a las 8 AM
5. Añade nodo "HTTP Request"
6. Configura:
   - URL: `https://tu-dominio.com/api/cron/check-subscriptions`
   - Method: GET
   - Headers: `Authorization: Bearer {CRON_SECRET}`

## 📊 ¿Qué hace el Cron?

1. ✅ Obtiene todos los clientes de la BD
2. ✅ Calcula días restantes para cada cliente
3. ✅ Identifica clientes con suscripción próxima a vencer (< 7 días) o vencida
4. ✅ Verifica si ya se envió notificación en últimas 24 horas (evita duplicados)
5. ✅ Envía email a clientes que necesitan notificación
6. ✅ Registra cada notificación en tabla `subscription_notifications`
7. ✅ Retorna resumen con cantidad de notificaciones enviadas

## 📋 Respuesta del Endpoint

### Exitosa (200):
```json
{
  "success": true,
  "message": "Verificación de suscripciones completada",
  "total_clientes": 45,
  "notificaciones_enviadas": 3,
  "errores": 0,
  "clientes_procesados": [
    {
      "id": "uuid...",
      "nombre": "Cliente A",
      "email": "cliente@a.com"
    }
  ],
  "timestamp": "2025-11-15T08:00:00.000Z"
}
```

### Error de Autenticación (401):
```json
{
  "error": "Unauthorized"
}
```

### Error de Servidor (500):
```json
{
  "success": false,
  "error": "Error message here",
  "timestamp": "2025-11-15T08:00:00.000Z"
}
```

## 🧪 Test Manual

Prueba el endpoint localmente:

```bash
# En desarrollo (sin verificar CRON_SECRET si está en "desarrollo")
curl -X GET http://localhost:3000/api/cron/check-subscriptions \
  -H "Authorization: Bearer desarrollo"

# En producción
curl -X GET https://tu-dominio.com/api/cron/check-subscriptions \
  -H "Authorization: Bearer tu-clave-segura"
```

## 📊 Monitoreo

### Verificar que funciona:

1. **Vercel Dashboard:**
   - Functions → check-subscriptions
   - Ver logs y ejecuciones

2. **Logs de Supabase:**
   - Database → subscription_notifications
   - Verificar que se crean registros nuevos

3. **Gmail/Email:**
   - Verifica bandeja de entrada de clientes
   - Busca emails con asunto "⚠️ Tu suscripción vence en..."

## ⚙️ Variables de Entorno Necesarias

```env
# Obligatorias
PUBLIC_SUPABASE_URL=https://xxxxx.supabase.co
PUBLIC_SUPABASE_ANON_KEY=xxxxxxxxxxxxxxx
CRON_SECRET=tu-clave-secreta-aqui

# Recomendado para producción
RESEND_API_KEY=re_xxxxxxxxxxxxx
```

## 🔧 Ajustar Frecuencia

El endpoint está configurado por defecto para ejecutarse:
- **Horario**: 8:00 AM UTC
- **Frecuencia**: Diariamente

### Para cambiar:

- **Vercel**: Edita `vercel.json` → schedule
- **AWS EventBridge**: Edita la regla
- **Google Cloud Scheduler**: Edita el job
- **n8n**: Edita el trigger de Schedule

### Formatos de Schedule:

- **Vercel/Unix cron**: `0 8 * * *` (8 AM diariamente)
- **AWS cron**: `cron(0 8 * * ? *)` (con ? para día)
- **ISO-8601**: `2025-01-01T08:00:00Z`

## 🚨 Troubleshooting

### No se envían notificaciones:

1. Verifica que `CRON_SECRET` es correcto
2. Verifica que los clientes tienen `email` configurado
3. Verifica que `RESEND_API_KEY` está en `.env` si usas Resend
4. Revisa logs del servicio de cron

### Notificaciones duplicadas:

- Reduce frecuencia del cron (máximo 1 vez al día)
- El sistema incluye protección para no enviar 2x en 24h

### Datos incompletos en respuesta:

- Verifica conexión a Supabase
- Verifica permisos RLS en BD
- Revisa logs del servidor

## 📝 Notas Finales

- El cron NO deja fuera a clientes sin email, pero NO falla
- Las notificaciones se registran en `subscription_notifications` para auditoría
- Puedes consultar historial de notificaciones por cliente
- El sistema es resiliente: un error en un cliente no afecta a los demás
