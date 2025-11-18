-- ============================================
-- ESQUEMA COMPLETO DE BASE DE DATOS - VICTORIA CRM
-- ============================================

-- Habilitar extensiones necesarias
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ============================================
-- 1. GESTIÓN DE CONTACTOS Y LEADS
-- ============================================

-- Tabla de contactos/clientes
CREATE TABLE contacts (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  
  -- Información básica
  first_name VARCHAR(100) NOT NULL,
  last_name VARCHAR(100),
  email VARCHAR(255) UNIQUE,
  phone VARCHAR(50),
  mobile VARCHAR(50),
  
  -- Información de empresa
  company_name VARCHAR(255),
  job_title VARCHAR(100),
  website VARCHAR(255),
  
  -- Dirección
  address_line1 VARCHAR(255),
  address_line2 VARCHAR(255),
  city VARCHAR(100),
  state VARCHAR(100),
  postal_code VARCHAR(20),
  country VARCHAR(100),
  
  -- Clasificación
  contact_type VARCHAR(50) DEFAULT 'lead', -- 'lead', 'customer', 'partner', 'vendor'
  status VARCHAR(50) DEFAULT 'new', -- 'new', 'contacted', 'qualified', 'unqualified', 'active', 'inactive'
  source VARCHAR(100), -- 'website', 'referral', 'social_media', 'event', 'cold_call'
  
  -- Scoring y prioridad
  score INTEGER DEFAULT 0,
  priority VARCHAR(20) DEFAULT 'medium', -- 'low', 'medium', 'high', 'urgent'
  
  -- Información adicional
  notes TEXT,
  avatar_url VARCHAR(500),
  
  -- Asignación
  assigned_to UUID REFERENCES auth.users(id),
  
  -- Timestamps
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  last_contact_date TIMESTAMP WITH TIME ZONE
);

-- Tabla de tags/etiquetas
CREATE TABLE tags (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  name VARCHAR(50) NOT NULL,
  color VARCHAR(7) DEFAULT '#6366f1',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(user_id, name)
);

-- Relación muchos a muchos entre contactos y tags
CREATE TABLE contact_tags (
  contact_id UUID NOT NULL REFERENCES contacts(id) ON DELETE CASCADE,
  tag_id UUID NOT NULL REFERENCES tags(id) ON DELETE CASCADE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  PRIMARY KEY (contact_id, tag_id)
);

-- Tabla de campos personalizados
CREATE TABLE custom_fields (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  field_name VARCHAR(100) NOT NULL,
  field_type VARCHAR(50) NOT NULL, -- 'text', 'number', 'date', 'select', 'multiselect'
  options JSONB, -- Para select y multiselect
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Valores de campos personalizados
CREATE TABLE contact_custom_values (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  contact_id UUID NOT NULL REFERENCES contacts(id) ON DELETE CASCADE,
  field_id UUID NOT NULL REFERENCES custom_fields(id) ON DELETE CASCADE,
  value TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(contact_id, field_id)
);

-- ============================================
-- 2. GESTIÓN DE OPORTUNIDADES Y VENTAS
-- ============================================

-- Tabla de pipeline (embudo de ventas)
CREATE TABLE pipelines (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  name VARCHAR(100) NOT NULL,
  description TEXT,
  is_default BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Tabla de etapas del pipeline
CREATE TABLE pipeline_stages (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  pipeline_id UUID NOT NULL REFERENCES pipelines(id) ON DELETE CASCADE,
  name VARCHAR(100) NOT NULL,
  order_index INTEGER NOT NULL,
  probability INTEGER DEFAULT 0, -- Probabilidad de cierre (0-100)
  color VARCHAR(7) DEFAULT '#6366f1',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Tabla de oportunidades
CREATE TABLE opportunities (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  contact_id UUID NOT NULL REFERENCES contacts(id) ON DELETE CASCADE,
  pipeline_id UUID REFERENCES pipelines(id),
  stage_id UUID REFERENCES pipeline_stages(id),
  
  -- Información de la oportunidad
  title VARCHAR(255) NOT NULL,
  description TEXT,
  value DECIMAL(15, 2) DEFAULT 0,
  currency VARCHAR(3) DEFAULT 'USD',
  
  -- Probabilidad y fecha estimada
  probability INTEGER DEFAULT 0,
  expected_close_date DATE,
  actual_close_date DATE,
  
  -- Estado
  status VARCHAR(50) DEFAULT 'open', -- 'open', 'won', 'lost', 'abandoned'
  lost_reason TEXT,
  
  -- Asignación
  assigned_to UUID REFERENCES auth.users(id),
  
  -- Timestamps
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ============================================
-- 3. HISTORIAL DE INTERACCIONES
-- ============================================

CREATE TABLE interactions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  contact_id UUID NOT NULL REFERENCES contacts(id) ON DELETE CASCADE,
  opportunity_id UUID REFERENCES opportunities(id) ON DELETE SET NULL,
  
  -- Tipo de interacción
  type VARCHAR(50) NOT NULL, -- 'call', 'email', 'meeting', 'note', 'task', 'sms', 'whatsapp'
  direction VARCHAR(20), -- 'inbound', 'outbound'
  
  -- Contenido
  subject VARCHAR(255),
  content TEXT,
  
  -- Resultados
  outcome VARCHAR(100), -- 'successful', 'no_answer', 'voicemail', 'meeting_scheduled'
  duration INTEGER, -- Duración en minutos
  
  -- Metadata
  metadata JSONB,
  
  -- Timestamps
  interaction_date TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ============================================
-- 4. TAREAS Y RECORDATORIOS
-- ============================================

CREATE TABLE tasks (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  contact_id UUID REFERENCES contacts(id) ON DELETE CASCADE,
  opportunity_id UUID REFERENCES opportunities(id) ON DELETE CASCADE,
  
  -- Información de la tarea
  title VARCHAR(255) NOT NULL,
  description TEXT,
  
  -- Tipo y prioridad
  type VARCHAR(50) DEFAULT 'general', -- 'call', 'email', 'meeting', 'follow_up', 'general'
  priority VARCHAR(20) DEFAULT 'medium', -- 'low', 'medium', 'high', 'urgent'
  
  -- Estado
  status VARCHAR(50) DEFAULT 'pending', -- 'pending', 'in_progress', 'completed', 'cancelled'
  
  -- Fechas
  due_date TIMESTAMP WITH TIME ZONE,
  reminder_date TIMESTAMP WITH TIME ZONE,
  completed_at TIMESTAMP WITH TIME ZONE,
  
  -- Asignación
  assigned_to UUID REFERENCES auth.users(id),
  
  -- Timestamps
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ============================================
-- 5. EMAIL MARKETING Y CAMPAÑAS
-- ============================================

-- Tabla de campañas
CREATE TABLE campaigns (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  
  -- Información de la campaña
  name VARCHAR(255) NOT NULL,
  description TEXT,
  type VARCHAR(50) DEFAULT 'email', -- 'email', 'sms', 'social'
  
  -- Estado
  status VARCHAR(50) DEFAULT 'draft', -- 'draft', 'scheduled', 'active', 'paused', 'completed'
  
  -- Fechas
  start_date TIMESTAMP WITH TIME ZONE,
  end_date TIMESTAMP WITH TIME ZONE,
  
  -- Métricas
  total_sent INTEGER DEFAULT 0,
  total_opened INTEGER DEFAULT 0,
  total_clicked INTEGER DEFAULT 0,
  total_bounced INTEGER DEFAULT 0,
  
  -- Timestamps
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Tabla de templates de email
CREATE TABLE email_templates (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  
  name VARCHAR(255) NOT NULL,
  subject VARCHAR(255),
  body_html TEXT,
  body_text TEXT,
  
  -- Categoría
  category VARCHAR(100),
  
  -- Timestamps
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Tabla de segmentos (para email marketing)
CREATE TABLE segments (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  
  name VARCHAR(255) NOT NULL,
  description TEXT,
  
  -- Filtros
  filters JSONB NOT NULL,
  
  -- Timestamps
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Relación de contactos en campañas
CREATE TABLE campaign_contacts (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  campaign_id UUID NOT NULL REFERENCES campaigns(id) ON DELETE CASCADE,
  contact_id UUID NOT NULL REFERENCES contacts(id) ON DELETE CASCADE,
  
  -- Estado
  status VARCHAR(50) DEFAULT 'pending', -- 'pending', 'sent', 'opened', 'clicked', 'bounced', 'unsubscribed'
  
  -- Métricas
  sent_at TIMESTAMP WITH TIME ZONE,
  opened_at TIMESTAMP WITH TIME ZONE,
  clicked_at TIMESTAMP WITH TIME ZONE,
  bounced_at TIMESTAMP WITH TIME ZONE,
  
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ============================================
-- 6. AUTOMATIZACIÓN
-- ============================================

-- Tabla de workflows de automatización
CREATE TABLE workflows (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  
  name VARCHAR(255) NOT NULL,
  description TEXT,
  
  -- Trigger
  trigger_type VARCHAR(100) NOT NULL, -- 'contact_created', 'stage_changed', 'task_completed', etc.
  trigger_conditions JSONB,
  
  -- Acciones
  actions JSONB NOT NULL,
  
  -- Estado
  is_active BOOLEAN DEFAULT true,
  
  -- Estadísticas
  times_triggered INTEGER DEFAULT 0,
  last_triggered_at TIMESTAMP WITH TIME ZONE,
  
  -- Timestamps
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ============================================
-- 7. PRODUCTOS Y SERVICIOS
-- ============================================

CREATE TABLE products (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  
  -- Información del producto
  name VARCHAR(255) NOT NULL,
  description TEXT,
  sku VARCHAR(100) UNIQUE,
  
  -- Precios
  price DECIMAL(15, 2) DEFAULT 0,
  cost DECIMAL(15, 2) DEFAULT 0,
  currency VARCHAR(3) DEFAULT 'USD',
  
  -- Categoría
  category VARCHAR(100),
  
  -- Estado
  is_active BOOLEAN DEFAULT true,
  
  -- Timestamps
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Productos en oportunidades
CREATE TABLE opportunity_products (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  opportunity_id UUID NOT NULL REFERENCES opportunities(id) ON DELETE CASCADE,
  product_id UUID NOT NULL REFERENCES products(id) ON DELETE CASCADE,
  
  quantity INTEGER DEFAULT 1,
  unit_price DECIMAL(15, 2),
  discount DECIMAL(5, 2) DEFAULT 0,
  total DECIMAL(15, 2),
  
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ============================================
-- 8. ARCHIVOS Y DOCUMENTOS
-- ============================================

CREATE TABLE attachments (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  
  -- Relaciones
  contact_id UUID REFERENCES contacts(id) ON DELETE CASCADE,
  opportunity_id UUID REFERENCES opportunities(id) ON DELETE CASCADE,
  interaction_id UUID REFERENCES interactions(id) ON DELETE CASCADE,
  
  -- Información del archivo
  file_name VARCHAR(255) NOT NULL,
  file_type VARCHAR(100),
  file_size INTEGER,
  file_url VARCHAR(1000) NOT NULL,
  
  -- Timestamps
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ============================================
-- 9. CONFIGURACIÓN Y PREFERENCIAS
-- ============================================

CREATE TABLE user_settings (
  user_id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  
  -- Preferencias generales
  timezone VARCHAR(100) DEFAULT 'UTC',
  date_format VARCHAR(20) DEFAULT 'DD/MM/YYYY',
  currency VARCHAR(3) DEFAULT 'USD',
  language VARCHAR(10) DEFAULT 'es',
  
  -- Notificaciones
  email_notifications BOOLEAN DEFAULT true,
  push_notifications BOOLEAN DEFAULT true,
  
  -- Configuración
  settings JSONB DEFAULT '{}',
  
  -- Timestamps
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ============================================
-- ÍNDICES PARA MEJORAR RENDIMIENTO
-- ============================================

-- Contactos
CREATE INDEX idx_contacts_user_id ON contacts(user_id);
CREATE INDEX idx_contacts_email ON contacts(email);
CREATE INDEX idx_contacts_status ON contacts(status);
CREATE INDEX idx_contacts_type ON contacts(contact_type);
CREATE INDEX idx_contacts_assigned_to ON contacts(assigned_to);

-- Oportunidades
CREATE INDEX idx_opportunities_user_id ON opportunities(user_id);
CREATE INDEX idx_opportunities_contact_id ON opportunities(contact_id);
CREATE INDEX idx_opportunities_stage_id ON opportunities(stage_id);
CREATE INDEX idx_opportunities_status ON opportunities(status);
CREATE INDEX idx_opportunities_assigned_to ON opportunities(assigned_to);

-- Interacciones
CREATE INDEX idx_interactions_contact_id ON interactions(contact_id);
CREATE INDEX idx_interactions_user_id ON interactions(user_id);
CREATE INDEX idx_interactions_date ON interactions(interaction_date);

-- Tareas
CREATE INDEX idx_tasks_user_id ON tasks(user_id);
CREATE INDEX idx_tasks_contact_id ON tasks(contact_id);
CREATE INDEX idx_tasks_assigned_to ON tasks(assigned_to);
CREATE INDEX idx_tasks_due_date ON tasks(due_date);
CREATE INDEX idx_tasks_status ON tasks(status);

-- ============================================
-- TRIGGERS PARA ACTUALIZAR updated_at
-- ============================================

CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_contacts_updated_at BEFORE UPDATE ON contacts FOR EACH ROW EXECUTE PROCEDURE update_updated_at_column();
CREATE TRIGGER update_opportunities_updated_at BEFORE UPDATE ON opportunities FOR EACH ROW EXECUTE PROCEDURE update_updated_at_column();
CREATE TRIGGER update_tasks_updated_at BEFORE UPDATE ON tasks FOR EACH ROW EXECUTE PROCEDURE update_updated_at_column();
CREATE TRIGGER update_campaigns_updated_at BEFORE UPDATE ON campaigns FOR EACH ROW EXECUTE PROCEDURE update_updated_at_column();

-- ============================================
-- ROW LEVEL SECURITY (RLS)
-- ============================================

-- Habilitar RLS en todas las tablas
ALTER TABLE contacts ENABLE ROW LEVEL SECURITY;
ALTER TABLE tags ENABLE ROW LEVEL SECURITY;
ALTER TABLE opportunities ENABLE ROW LEVEL SECURITY;
ALTER TABLE interactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE tasks ENABLE ROW LEVEL SECURITY;
ALTER TABLE campaigns ENABLE ROW LEVEL SECURITY;
ALTER TABLE products ENABLE ROW LEVEL SECURITY;

-- Políticas de seguridad (los usuarios solo pueden ver sus propios datos)
CREATE POLICY "Users can view their own contacts" ON contacts FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert their own contacts" ON contacts FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update their own contacts" ON contacts FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete their own contacts" ON contacts FOR DELETE USING (auth.uid() = user_id);

CREATE POLICY "Users can view their own opportunities" ON opportunities FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert their own opportunities" ON opportunities FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update their own opportunities" ON opportunities FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete their own opportunities" ON opportunities FOR DELETE USING (auth.uid() = user_id);

CREATE POLICY "Users can view their own tasks" ON tasks FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert their own tasks" ON tasks FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update their own tasks" ON tasks FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete their own tasks" ON tasks FOR DELETE USING (auth.uid() = user_id);

-- ============================================
-- DATOS INICIALES (SEED DATA)
-- ============================================

-- Estos se ejecutarán automáticamente al crear un nuevo usuario
-- mediante triggers o funciones de Supabase
