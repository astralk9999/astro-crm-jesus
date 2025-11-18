-- Añadir columna fecha_suscripcion a la tabla clientes (si aún no existe)
ALTER TABLE public.clientes ADD COLUMN IF NOT EXISTS fecha_suscripcion timestamp without time zone DEFAULT now();
CREATE INDEX IF NOT EXISTS idx_clientes_fecha_suscripcion ON public.clientes(fecha_suscripcion DESC);

-- Crear tabla subscription_notifications para registrar notificaciones enviadas
CREATE TABLE IF NOT EXISTS public.subscription_notifications (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  cliente_id uuid NOT NULL REFERENCES public.clientes(id) ON DELETE CASCADE,
  usuario_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  dias_restantes integer NOT NULL,
  notificacion_tipo text DEFAULT 'proxima_a_vencer' CHECK (notificacion_tipo IN ('proxima_a_vencer', 'vencida', 'renovacion_manual')),
  created_at timestamp with time zone DEFAULT now(),
  updated_at timestamp with time zone DEFAULT now()
);

-- Crear índices para búsquedas rápidas
CREATE INDEX IF NOT EXISTS idx_subscription_notifications_cliente_id ON public.subscription_notifications(cliente_id);
CREATE INDEX IF NOT EXISTS idx_subscription_notifications_usuario_id ON public.subscription_notifications(usuario_id);
CREATE INDEX IF NOT EXISTS idx_subscription_notifications_created_at ON public.subscription_notifications(created_at DESC);

-- Habilitar RLS (Row Level Security) en la tabla
ALTER TABLE public.subscription_notifications ENABLE ROW LEVEL SECURITY;

-- Crear políticas de seguridad
CREATE POLICY "Users can view their own subscription notifications"
  ON public.subscription_notifications
  FOR SELECT
  USING (auth.uid() = usuario_id);

CREATE POLICY "System can insert subscription notifications"
  ON public.subscription_notifications
  FOR INSERT
  WITH CHECK (true);

-- Crear función para actualizar updated_at automáticamente
CREATE OR REPLACE FUNCTION update_subscription_notifications_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Crear trigger para actualizar updated_at
DROP TRIGGER IF EXISTS trigger_subscription_notifications_updated_at ON public.subscription_notifications;
CREATE TRIGGER trigger_subscription_notifications_updated_at
  BEFORE UPDATE ON public.subscription_notifications
  FOR EACH ROW
  EXECUTE FUNCTION update_subscription_notifications_updated_at();
