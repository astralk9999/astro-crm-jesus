# Sistema de Notificaciones de Suscripción

## 📋 Descripción

Sistema completo para notificar a los clientes cuando su suscripción está próxima a vencer (menos de 7 días).

## ✅ Funcionalidades Implementadas

### 1. **Cálculo de Días Restantes**
   - ✅ Calcula automáticamente los días restantes desde la fecha de suscripción
   - ✅ Asume una suscripción de 365 días
   - ✅ Detecta vencimientos próximos (< 7 días) y vencimientos (≤ 0 días)

### 2. **Alerta Visual en la UI**
   - ✅ Muestra una alerta destacada cuando faltan < 7 días
   - ✅ Alerta roja con diseño responsive
   - ✅ Botón "Renovar Suscripción" (placeholder para función futura)
   - ✅ Información clara sobre fecha de vencimiento

### 3. **Envío de Emails**
   - ✅ Email automático al ver el cliente si está próximo a vencer
   - ✅ Template HTML profesional
   - ✅ Información sobre días restantes y fechas importantes
   - ✅ Link para renovación

### 4. **Integración con Resend**
   - ✅ Soporte para Resend (servicio de email profesional)
   - ✅ Fallback a modo desarrollo si no está configurado
   - ✅ Emails con diseño responsive

## 🔧 Configuración

### Configurar Resend (Recomendado)

1. Ve a [Resend.com](https://resend.com) y crea una cuenta
2. Obtén tu API Key
3. Añade a tu archivo `.env`:

```env
RESEND_API_KEY=re_xxxxxxxxxxxxxxxxxxxxx
```

4. Redeploy tu aplicación

### Sin Resend (Desarrollo Local)

Si no tienes Resend configurado, el sistema funciona en modo simple:
- Los emails se loguean en la consola
- Útil para desarrollo y testing
- En producción, se recomienda configurar Resend

## 📊 Flujo de Funcionamiento

### Cuando un usuario accede al detalle de un cliente:

1. Se carga la información del cliente
2. Se calcula la fecha de vencimiento (365 días desde suscripción)
3. Se calcula los días restantes hasta el vencimiento
4. **Si días restantes < 7:**
   - Muestra alerta roja en la UI
   - Envía email de notificación (si está configurado)
5. **Si días restantes ≤ 0:**
   - Muestra alerta de suscripción vencida

## 📁 Archivos Creados/Modificados

### Nuevos Archivos:
- `src/lib/services/subscriptionService.ts` - Lógica de cálculo de suscripción
- `src/lib/services/emailService.ts` - Servicio de envío de emails
- `src/pages/api/notifications/subscription.ts` - Endpoint para enviar notificaciones
- `SUBSCRIPTION_NOTIFICATIONS.md` - Esta documentación

### Modificados:
- `src/pages/customers/[id].astro` - Agregada alerta visual y lógica de notificaciones
- `CUSTOMERS_MODULE.md` - Documentación actualizada

## 🎨 Estilos de Alerta

La alerta se muestra con:
- Fondo gradiente rojo
- Icono de advertencia (⚠️)
- Título y mensaje descriptivo
- Botón de renovación roja

### Estados Posibles:

**Próximo a Vencer (< 7 días):**
```
⚠️ Suscripción próxima a vencer
Tu suscripción vence en 3 días. 15 de noviembre de 2025
[🔄 Renovar Suscripción]
```

**Vencida:**
```
❌ Suscripción Vencida
Tu suscripción ha vencido. Por favor, renuévala cuanto antes.
```

## 📧 Template del Email

El email incluye:
- Asunto con días restantes
- Saludo personalizado
- Alerta destacada con días restantes
- Fechas importantes
- Botón para renovar
- Información de contacto
- Footer

## 🔄 Próximas Mejoras

### Sistema Automático de Verificación (Cron Job)
Para verificar y enviar emails automáticamente cada día:

```typescript
// Este sería un cron job externo (ej: con Vercel Crons)
// que ejecutaría este endpoint diariamente:
GET /api/cron/check-subscriptions
```

### Características Futuras:
- [ ] Implementar cron job para verificación automática
- [ ] Historial de notificaciones enviadas
- [ ] Permite al usuario desactivar notificaciones
- [ ] Múltiples recordatorios (7 días, 3 días, 1 día)
- [ ] Integración con Stripe para renovación automática
- [ ] SMS como alternativa a email
- [ ] Dashboard de renovaciones próximas

## 🧪 Testing

### Test Manual:

1. Ve a un cliente con `fecha_suscripcion` hace 359 días (o menos de 7 días antes del vencimiento)
2. Accede a `/customers/[id]`
3. Verifica que aparezca la alerta roja
4. Verifica que se envíe el email (check consola o Resend dashboard)

### Con Resend:
- Ve a tu dashboard de Resend para ver emails enviados
- Revisa el tab "Emails" para ver historial

## 🐛 Troubleshooting

### No aparece la alerta:
- Verifica que `fecha_suscripcion` está correcta en BD
- Abre la consola del navegador (F12) para ver logs
- Verifica que los días restantes son < 7

### Email no se envía:
- Si tienes Resend: verifica que `RESEND_API_KEY` está en `.env`
- Si no tienes Resend: revisa consola para el log simple
- Verifica la dirección de email del cliente

### Email parece roto:
- Los templates pueden no renderizar correctamente en algunos clientes de email
- Resend tiene vista previa en su dashboard

## 📝 Variables de Entorno Necesarias

```env
# Obligatorio para producción, opcional para desarrollo
RESEND_API_KEY=re_xxxxxxxxxxxxxxxxxxxxx
```

## 📞 Soporte

Para problemas con:
- **Resend**: Ve a https://resend.com/docs
- **Supabase**: Ve a https://supabase.com/docs
- **Astro**: Ve a https://docs.astro.build
