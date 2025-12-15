-- ============================================
-- ESQUEMA DE BASE DE DATOS - SOFTCONTROL CRM
-- Mini-CRM para Gestión de Clientes, Licencias y Suscripciones
-- ============================================

-- Habilitar extensiones necesarias
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ============================================
-- 1. TABLA DE PERFILES DE USUARIO
-- ============================================
-- Nota: La tabla users es gestionada por Supabase Auth
-- Esta tabla extiende la información del usuario

CREATE TABLE IF NOT EXISTS profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  full_name TEXT NOT NULL,
  role TEXT NOT NULL CHECK (role IN ('admin', 'staff')) DEFAULT 'staff',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ============================================
-- 2. TABLA DE CLIENTES
-- ============================================

CREATE TABLE IF NOT EXISTS clients (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  email TEXT UNIQUE,
  phone TEXT,
  company TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  created_by UUID NOT NULL REFERENCES profiles(id)
);

-- ============================================
-- 3. TABLA DE PRODUCTOS
-- ============================================

CREATE TABLE IF NOT EXISTS products (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  description TEXT,
  price_one_payment NUMERIC(10, 2),
  price_subscription NUMERIC(10, 2),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ============================================
-- 4. TABLA DE LICENCIAS
-- ============================================

CREATE TABLE IF NOT EXISTS licenses (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  client_id UUID NOT NULL REFERENCES clients(id) ON DELETE CASCADE,
  product_id UUID NOT NULL REFERENCES products(id) ON DELETE CASCADE,
  type TEXT NOT NULL CHECK (type IN ('licencia_unica', 'suscripcion')),
  start_date DATE NOT NULL DEFAULT CURRENT_DATE,
  end_date DATE, -- Nullable para licencias únicas
  status TEXT NOT NULL CHECK (status IN ('activa', 'inactiva', 'pendiente_pago')) DEFAULT 'pendiente_pago',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  
  -- Restricción: Las suscripciones deben tener fecha de fin
  CONSTRAINT check_subscription_end_date CHECK (
    (type = 'licencia_unica' AND end_date IS NULL) OR
    (type = 'suscripcion' AND end_date IS NOT NULL) OR
    type = 'licencia_unica'
  )
);

-- ============================================
-- ÍNDICES PARA MEJORAR RENDIMIENTO
-- ============================================

CREATE INDEX idx_clients_created_by ON clients(created_by);
CREATE INDEX idx_clients_email ON clients(email);
CREATE INDEX idx_clients_company ON clients(company);

CREATE INDEX idx_licenses_client_id ON licenses(client_id);
CREATE INDEX idx_licenses_product_id ON licenses(product_id);
CREATE INDEX idx_licenses_status ON licenses(status);
CREATE INDEX idx_licenses_type ON licenses(type);
CREATE INDEX idx_licenses_end_date ON licenses(end_date);

-- ============================================
-- ROW LEVEL SECURITY (RLS)
-- ============================================

-- Habilitar RLS en todas las tablas
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE clients ENABLE ROW LEVEL SECURITY;
ALTER TABLE products ENABLE ROW LEVEL SECURITY;
ALTER TABLE licenses ENABLE ROW LEVEL SECURITY;

-- ============================================
-- POLÍTICAS DE SEGURIDAD - PROFILES
-- ============================================

-- Todos los usuarios autenticados pueden ver perfiles
CREATE POLICY "Usuarios autenticados pueden ver perfiles" 
ON profiles FOR SELECT 
USING (auth.uid() IS NOT NULL);

-- Solo admins pueden insertar perfiles
CREATE POLICY "Solo admins pueden crear perfiles" 
ON profiles FOR INSERT 
WITH CHECK (
  EXISTS (
    SELECT 1 FROM profiles 
    WHERE id = auth.uid() AND role = 'admin'
  ) OR NOT EXISTS (SELECT 1 FROM profiles) -- Permitir crear el primer admin
);

-- Solo admins pueden actualizar perfiles
CREATE POLICY "Solo admins pueden actualizar perfiles" 
ON profiles FOR UPDATE 
USING (
  EXISTS (
    SELECT 1 FROM profiles 
    WHERE id = auth.uid() AND role = 'admin'
  )
);

-- Solo admins pueden eliminar perfiles
CREATE POLICY "Solo admins pueden eliminar perfiles" 
ON profiles FOR DELETE 
USING (
  EXISTS (
    SELECT 1 FROM profiles 
    WHERE id = auth.uid() AND role = 'admin'
  )
);

-- ============================================
-- POLÍTICAS DE SEGURIDAD - CLIENTS
-- ============================================

-- Todos los usuarios autenticados pueden ver clientes
CREATE POLICY "Usuarios autenticados pueden ver clientes" 
ON clients FOR SELECT 
USING (auth.uid() IS NOT NULL);

-- Solo admins pueden insertar clientes
CREATE POLICY "Solo admins pueden crear clientes" 
ON clients FOR INSERT 
WITH CHECK (
  EXISTS (
    SELECT 1 FROM profiles 
    WHERE id = auth.uid() AND role = 'admin'
  )
);

-- Solo admins pueden actualizar clientes
CREATE POLICY "Solo admins pueden actualizar clientes" 
ON clients FOR UPDATE 
USING (
  EXISTS (
    SELECT 1 FROM profiles 
    WHERE id = auth.uid() AND role = 'admin'
  )
);

-- Solo admins pueden eliminar clientes
CREATE POLICY "Solo admins pueden eliminar clientes" 
ON clients FOR DELETE 
USING (
  EXISTS (
    SELECT 1 FROM profiles 
    WHERE id = auth.uid() AND role = 'admin'
  )
);

-- ============================================
-- POLÍTICAS DE SEGURIDAD - PRODUCTS
-- ============================================

-- Todos los usuarios autenticados pueden ver productos
CREATE POLICY "Usuarios autenticados pueden ver productos" 
ON products FOR SELECT 
USING (auth.uid() IS NOT NULL);

-- Solo admins pueden insertar productos
CREATE POLICY "Solo admins pueden crear productos" 
ON products FOR INSERT 
WITH CHECK (
  EXISTS (
    SELECT 1 FROM profiles 
    WHERE id = auth.uid() AND role = 'admin'
  )
);

-- Solo admins pueden actualizar productos
CREATE POLICY "Solo admins pueden actualizar productos" 
ON products FOR UPDATE 
USING (
  EXISTS (
    SELECT 1 FROM profiles 
    WHERE id = auth.uid() AND role = 'admin'
  )
);

-- Solo admins pueden eliminar productos
CREATE POLICY "Solo admins pueden eliminar productos" 
ON products FOR DELETE 
USING (
  EXISTS (
    SELECT 1 FROM profiles 
    WHERE id = auth.uid() AND role = 'admin'
  )
);

-- ============================================
-- POLÍTICAS DE SEGURIDAD - LICENSES
-- ============================================

-- Todos los usuarios autenticados pueden ver licencias
CREATE POLICY "Usuarios autenticados pueden ver licencias" 
ON licenses FOR SELECT 
USING (auth.uid() IS NOT NULL);

-- Solo admins pueden insertar licencias
CREATE POLICY "Solo admins pueden crear licencias" 
ON licenses FOR INSERT 
WITH CHECK (
  EXISTS (
    SELECT 1 FROM profiles 
    WHERE id = auth.uid() AND role = 'admin'
  )
);

-- Solo admins pueden actualizar licencias
CREATE POLICY "Solo admins pueden actualizar licencias" 
ON licenses FOR UPDATE 
USING (
  EXISTS (
    SELECT 1 FROM profiles 
    WHERE id = auth.uid() AND role = 'admin'
  )
);

-- Solo admins pueden eliminar licencias
CREATE POLICY "Solo admins pueden eliminar licencias" 
ON licenses FOR DELETE 
USING (
  EXISTS (
    SELECT 1 FROM profiles 
    WHERE id = auth.uid() AND role = 'admin'
  )
);

-- ============================================
-- 5. HISTORIAL DE CAMBIOS (AUDITORÍA + REVERSIÓN)
-- ============================================

CREATE TABLE IF NOT EXISTS historial_cambios (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  tabla TEXT NOT NULL CHECK (tabla IN ('clients', 'products', 'licenses')),
  accion TEXT NOT NULL CHECK (accion IN ('insert', 'update', 'delete')),
  registro_id UUID NOT NULL,
  actor_id UUID REFERENCES profiles(id),
  fecha TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  old_data JSONB,
  new_data JSONB,
  revertido BOOLEAN NOT NULL DEFAULT false,
  revertido_en TIMESTAMP WITH TIME ZONE,
  revertido_por UUID REFERENCES profiles(id),
  error_reversion TEXT
);

CREATE INDEX IF NOT EXISTS idx_historial_cambios_fecha ON historial_cambios(fecha DESC);
CREATE INDEX IF NOT EXISTS idx_historial_cambios_actor ON historial_cambios(actor_id);
CREATE INDEX IF NOT EXISTS idx_historial_cambios_tabla ON historial_cambios(tabla);
CREATE INDEX IF NOT EXISTS idx_historial_cambios_registro ON historial_cambios(registro_id);
CREATE INDEX IF NOT EXISTS idx_historial_cambios_revertido ON historial_cambios(revertido);

ALTER TABLE historial_cambios ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Solo admins pueden ver historial" 
ON historial_cambios FOR SELECT 
USING (
  EXISTS (
    SELECT 1 FROM profiles 
    WHERE id = auth.uid() AND role = 'admin'
  )
);

CREATE POLICY "Solo admins pueden insertar historial" 
ON historial_cambios FOR INSERT 
WITH CHECK (
  EXISTS (
    SELECT 1 FROM profiles 
    WHERE id = auth.uid() AND role = 'admin'
  )
);

CREATE POLICY "Solo admins pueden actualizar historial" 
ON historial_cambios FOR UPDATE 
USING (
  EXISTS (
    SELECT 1 FROM profiles 
    WHERE id = auth.uid() AND role = 'admin'
  )
);

CREATE OR REPLACE FUNCTION public.registrar_historial_cambio()
RETURNS TRIGGER AS $$
DECLARE
  saltar_historial TEXT;
BEGIN
  -- Permite desactivar el log en operaciones internas (por ejemplo, una reversión)
  saltar_historial := current_setting('softcontrol.saltarse_historial', true);
  IF saltar_historial = '1' THEN
    RETURN COALESCE(NEW, OLD);
  END IF;

  IF TG_OP = 'INSERT' THEN
    INSERT INTO public.historial_cambios (tabla, accion, registro_id, actor_id, old_data, new_data)
    VALUES (TG_TABLE_NAME, 'insert', NEW.id, auth.uid(), NULL, to_jsonb(NEW));
    RETURN NEW;
  ELSIF TG_OP = 'UPDATE' THEN
    INSERT INTO public.historial_cambios (tabla, accion, registro_id, actor_id, old_data, new_data)
    VALUES (TG_TABLE_NAME, 'update', NEW.id, auth.uid(), to_jsonb(OLD), to_jsonb(NEW));
    RETURN NEW;
  ELSIF TG_OP = 'DELETE' THEN
    INSERT INTO public.historial_cambios (tabla, accion, registro_id, actor_id, old_data, new_data)
    VALUES (TG_TABLE_NAME, 'delete', OLD.id, auth.uid(), to_jsonb(OLD), NULL);
    RETURN OLD;
  END IF;

  RETURN COALESCE(NEW, OLD);
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS trigger_historial_clients ON clients;
CREATE TRIGGER trigger_historial_clients
  AFTER INSERT OR UPDATE OR DELETE ON clients
  FOR EACH ROW EXECUTE FUNCTION public.registrar_historial_cambio();

DROP TRIGGER IF EXISTS trigger_historial_products ON products;
CREATE TRIGGER trigger_historial_products
  AFTER INSERT OR UPDATE OR DELETE ON products
  FOR EACH ROW EXECUTE FUNCTION public.registrar_historial_cambio();

DROP TRIGGER IF EXISTS trigger_historial_licenses ON licenses;
CREATE TRIGGER trigger_historial_licenses
  AFTER INSERT OR UPDATE OR DELETE ON licenses
  FOR EACH ROW EXECUTE FUNCTION public.registrar_historial_cambio();

CREATE OR REPLACE FUNCTION public.revertir_historial_cambio(p_historial_id UUID)
RETURNS JSONB AS $$
DECLARE
  h RECORD;
  actor UUID;
BEGIN
  actor := auth.uid();
  IF actor IS NULL THEN
    RETURN jsonb_build_object('success', false, 'error', 'No autenticado');
  END IF;

  -- Validar rol admin
  IF NOT EXISTS (SELECT 1 FROM public.profiles WHERE id = actor AND role = 'admin') THEN
    RETURN jsonb_build_object('success', false, 'error', 'No autorizado');
  END IF;

  SELECT * INTO h
  FROM public.historial_cambios
  WHERE id = p_historial_id
  FOR UPDATE;

  IF h IS NULL THEN
    RETURN jsonb_build_object('success', false, 'error', 'Registro de historial no encontrado');
  END IF;

  IF h.revertido = true THEN
    RETURN jsonb_build_object('success', false, 'error', 'Este cambio ya fue revertido');
  END IF;

  -- Evitar que la reversión genere nuevos logs
  PERFORM set_config('softcontrol.saltarse_historial', '1', true);

  IF h.tabla = 'clients' THEN
    IF h.accion = 'insert' THEN
      DELETE FROM public.clients WHERE id = h.registro_id;
    ELSIF h.accion = 'delete' THEN
      INSERT INTO public.clients (id, name, email, phone, company, created_at, created_by)
      VALUES (
        (h.old_data->>'id')::uuid,
        h.old_data->>'name',
        NULLIF(h.old_data->>'email',''),
        NULLIF(h.old_data->>'phone',''),
        NULLIF(h.old_data->>'company',''),
        COALESCE(NULLIF(h.old_data->>'created_at','')::timestamptz, now()),
        COALESCE(NULLIF(h.old_data->>'created_by','')::uuid, actor)
      );
    ELSIF h.accion = 'update' THEN
      UPDATE public.clients
      SET
        name = h.old_data->>'name',
        email = NULLIF(h.old_data->>'email',''),
        phone = NULLIF(h.old_data->>'phone',''),
        company = NULLIF(h.old_data->>'company','')
      WHERE id = h.registro_id;
    END IF;
  ELSIF h.tabla = 'products' THEN
    IF h.accion = 'insert' THEN
      DELETE FROM public.products WHERE id = h.registro_id;
    ELSIF h.accion = 'delete' THEN
      INSERT INTO public.products (id, name, description, price_one_payment, price_subscription, created_at)
      VALUES (
        (h.old_data->>'id')::uuid,
        h.old_data->>'name',
        NULLIF(h.old_data->>'description',''),
        NULLIF(h.old_data->>'price_one_payment','')::numeric,
        NULLIF(h.old_data->>'price_subscription','')::numeric,
        COALESCE(NULLIF(h.old_data->>'created_at','')::timestamptz, now())
      );
    ELSIF h.accion = 'update' THEN
      UPDATE public.products
      SET
        name = h.old_data->>'name',
        description = NULLIF(h.old_data->>'description',''),
        price_one_payment = NULLIF(h.old_data->>'price_one_payment','')::numeric,
        price_subscription = NULLIF(h.old_data->>'price_subscription','')::numeric
      WHERE id = h.registro_id;
    END IF;
  ELSIF h.tabla = 'licenses' THEN
    IF h.accion = 'insert' THEN
      DELETE FROM public.licenses WHERE id = h.registro_id;
    ELSIF h.accion = 'delete' THEN
      -- Validar dependencias para evitar error FK al restaurar
      IF NOT EXISTS (SELECT 1 FROM public.clients WHERE id = (h.old_data->>'client_id')::uuid) THEN
        RAISE EXCEPTION 'No existe el cliente requerido para restaurar la licencia';
      END IF;
      IF NOT EXISTS (SELECT 1 FROM public.products WHERE id = (h.old_data->>'product_id')::uuid) THEN
        RAISE EXCEPTION 'No existe el producto requerido para restaurar la licencia';
      END IF;

      INSERT INTO public.licenses (id, client_id, product_id, type, start_date, end_date, status, created_at)
      VALUES (
        (h.old_data->>'id')::uuid,
        (h.old_data->>'client_id')::uuid,
        (h.old_data->>'product_id')::uuid,
        h.old_data->>'type',
        COALESCE(NULLIF(h.old_data->>'start_date','')::date, CURRENT_DATE),
        NULLIF(h.old_data->>'end_date','')::date,
        COALESCE(NULLIF(h.old_data->>'status',''), 'pendiente_pago'),
        COALESCE(NULLIF(h.old_data->>'created_at','')::timestamptz, now())
      );
    ELSIF h.accion = 'update' THEN
      UPDATE public.licenses
      SET
        client_id = (h.old_data->>'client_id')::uuid,
        product_id = (h.old_data->>'product_id')::uuid,
        type = h.old_data->>'type',
        start_date = COALESCE(NULLIF(h.old_data->>'start_date','')::date, CURRENT_DATE),
        end_date = NULLIF(h.old_data->>'end_date','')::date,
        status = COALESCE(NULLIF(h.old_data->>'status',''), 'pendiente_pago')
      WHERE id = h.registro_id;
    END IF;
  ELSE
    RETURN jsonb_build_object('success', false, 'error', 'Tabla no soportada');
  END IF;

  UPDATE public.historial_cambios
  SET
    revertido = true,
    revertido_en = now(),
    revertido_por = actor,
    error_reversion = NULL
  WHERE id = p_historial_id;

  RETURN jsonb_build_object('success', true, 'historial_id', p_historial_id);
EXCEPTION WHEN others THEN
  UPDATE public.historial_cambios
  SET
    error_reversion = SQLERRM
  WHERE id = p_historial_id;

  RETURN jsonb_build_object('success', false, 'error', SQLERRM);
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- ============================================
-- FUNCIONES AUXILIARES
-- ============================================

-- Función para crear perfil automáticamente después del registro
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, full_name, role)
  VALUES (
    NEW.id,
    COALESCE(NEW.raw_user_meta_data->>'full_name', 'Usuario Sin Nombre'),
    COALESCE(NEW.raw_user_meta_data->>'role', 'staff')
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger para crear perfil automáticamente
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- ============================================
-- VISTAS ÚTILES
-- ============================================

-- Vista para estadísticas del dashboard
CREATE OR REPLACE VIEW dashboard_stats AS
SELECT 
  (SELECT COUNT(*) FROM clients) as total_clients,
  (SELECT COUNT(*) FROM products) as total_products,
  (SELECT COUNT(*) FROM licenses WHERE status = 'activa') as active_licenses,
  (SELECT COUNT(*) FROM licenses WHERE status = 'pendiente_pago') as pending_payment_licenses,
  (SELECT COUNT(*) FROM licenses WHERE type = 'suscripcion' AND end_date < CURRENT_DATE AND status = 'activa') as expired_subscriptions;

-- Vista de licencias con información completa
CREATE OR REPLACE VIEW licenses_full AS
SELECT 
  l.id,
  l.type,
  l.start_date,
  l.end_date,
  l.status,
  l.created_at,
  c.id as client_id,
  c.name as client_name,
  c.email as client_email,
  c.company as client_company,
  p.id as product_id,
  p.name as product_name,
  p.description as product_description,
  CASE 
    WHEN l.type = 'licencia_unica' THEN p.price_one_payment
    WHEN l.type = 'suscripcion' THEN p.price_subscription
  END as price,
  CASE 
    WHEN l.type = 'suscripcion' AND l.end_date < CURRENT_DATE AND l.status = 'activa' THEN true
    ELSE false
  END as is_expired
FROM licenses l
JOIN clients c ON l.client_id = c.id
JOIN products p ON l.product_id = p.id;

-- ============================================
-- DATOS DE EJEMPLO (SEED DATA)
-- ============================================

-- Insertar productos de ejemplo (solo se ejecuta si no hay productos)
INSERT INTO products (name, description, price_one_payment, price_subscription)
SELECT * FROM (VALUES
  ('Software Contable Pro', 'Sistema completo de contabilidad empresarial', 1500.00, 150.00),
  ('CRM Ventas Plus', 'Gestión de relaciones con clientes y ventas', 2000.00, 200.00),
  ('Facturación Electrónica', 'Sistema de facturación compatible con SAT', 800.00, 80.00),
  ('Nómina Integral', 'Software de gestión de nómina y recursos humanos', 1200.00, 120.00),
  ('Inventario Smart', 'Control de inventario con códigos de barras', 1000.00, 100.00)
) AS v(name, description, price_one_payment, price_subscription)
WHERE NOT EXISTS (SELECT 1 FROM products LIMIT 1);

-- ============================================
-- COMENTARIOS PARA DOCUMENTACIÓN
-- ============================================

COMMENT ON TABLE profiles IS 'Perfiles de usuarios del sistema con roles de acceso';
COMMENT ON TABLE clients IS 'Registro de clientes de la empresa';
COMMENT ON TABLE products IS 'Catálogo de productos y servicios ofrecidos';
COMMENT ON TABLE licenses IS 'Licencias asignadas a clientes, pueden ser únicas o por suscripción';

COMMENT ON COLUMN profiles.role IS 'Rol del usuario: admin (acceso total) o staff (solo lectura)';
COMMENT ON COLUMN licenses.type IS 'Tipo de licencia: licencia_unica (pago único) o suscripcion (pago periódico)';
COMMENT ON COLUMN licenses.status IS 'Estado de la licencia: activa, inactiva o pendiente_pago';
