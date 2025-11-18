-- Migración: Añadir columna fecha_suscripcion a tabla clientes
-- Fecha: 12 de noviembre de 2025

-- Añadir columna fecha_suscripcion si no existe
ALTER TABLE public.clientes
ADD COLUMN IF NOT EXISTS fecha_suscripcion timestamp without time zone DEFAULT now();

-- Crear comentario para la columna
COMMENT ON COLUMN public.clientes.fecha_suscripcion IS 'Fecha en la que el cliente se suscribió al CRM';

-- Crear índice para mejorar búsquedas por fecha de suscripción
CREATE INDEX IF NOT EXISTS idx_clientes_fecha_suscripcion 
ON public.clientes(fecha_suscripcion DESC);
