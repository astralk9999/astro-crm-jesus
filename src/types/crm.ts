// ============================================
// TIPOS PARA VICTORIA CRM
// ============================================

// ============================================
// 1. CONTACTOS Y LEADS
// ============================================

export type ContactType = 'lead' | 'customer' | 'partner' | 'vendor';
export type ContactStatus = 'new' | 'contacted' | 'qualified' | 'unqualified' | 'active' | 'inactive';
export type ContactSource = 'website' | 'referral' | 'social_media' | 'event' | 'cold_call' | 'other';
export type Priority = 'low' | 'medium' | 'high' | 'urgent';

export interface Contact {
  id: string;
  user_id: string;
  
  // Información básica
  first_name: string;
  last_name?: string;
  email?: string;
  phone?: string;
  mobile?: string;
  
  // Información de empresa
  company_name?: string;
  job_title?: string;
  website?: string;
  
  // Dirección
  address_line1?: string;
  address_line2?: string;
  city?: string;
  state?: string;
  postal_code?: string;
  country?: string;
  
  // Clasificación
  contact_type: ContactType;
  status: ContactStatus;
  source?: ContactSource;
  
  // Scoring y prioridad
  score: number;
  priority: Priority;
  
  // Información adicional
  notes?: string;
  avatar_url?: string;
  
  // Asignación
  assigned_to?: string;
  
  // Timestamps
  created_at: string;
  updated_at: string;
  last_contact_date?: string;
}

export interface Tag {
  id: string;
  user_id: string;
  name: string;
  color: string;
  created_at: string;
}

export interface ContactTag {
  contact_id: string;
  tag_id: string;
  created_at: string;
}

export interface CustomField {
  id: string;
  user_id: string;
  field_name: string;
  field_type: 'text' | 'number' | 'date' | 'select' | 'multiselect';
  options?: string[];
  created_at: string;
}

export interface ContactCustomValue {
  id: string;
  contact_id: string;
  field_id: string;
  value: string;
  created_at: string;
}

// ============================================
// 2. OPORTUNIDADES Y PIPELINE
// ============================================

export type OpportunityStatus = 'open' | 'won' | 'lost' | 'abandoned';

export interface Pipeline {
  id: string;
  user_id: string;
  name: string;
  description?: string;
  is_default: boolean;
  created_at: string;
}

export interface PipelineStage {
  id: string;
  pipeline_id: string;
  name: string;
  order_index: number;
  probability: number;
  color: string;
  created_at: string;
}

export interface Opportunity {
  id: string;
  user_id: string;
  contact_id: string;
  pipeline_id?: string;
  stage_id?: string;
  
  // Información
  title: string;
  description?: string;
  value: number;
  currency: string;
  
  // Probabilidad y fechas
  probability: number;
  expected_close_date?: string;
  actual_close_date?: string;
  
  // Estado
  status: OpportunityStatus;
  lost_reason?: string;
  
  // Asignación
  assigned_to?: string;
  
  // Timestamps
  created_at: string;
  updated_at: string;
}

// ============================================
// 3. INTERACCIONES
// ============================================

export type InteractionType = 'call' | 'email' | 'meeting' | 'note' | 'task' | 'sms' | 'whatsapp';
export type InteractionDirection = 'inbound' | 'outbound';
export type InteractionOutcome = 'successful' | 'no_answer' | 'voicemail' | 'meeting_scheduled' | 'other';

export interface Interaction {
  id: string;
  user_id: string;
  contact_id: string;
  opportunity_id?: string;
  
  // Tipo
  type: InteractionType;
  direction?: InteractionDirection;
  
  // Contenido
  subject?: string;
  content?: string;
  
  // Resultados
  outcome?: InteractionOutcome;
  duration?: number;
  
  // Metadata
  metadata?: Record<string, any>;
  
  // Timestamps
  interaction_date: string;
  created_at: string;
}

// ============================================
// 4. TAREAS
// ============================================

export type TaskType = 'call' | 'email' | 'meeting' | 'follow_up' | 'general';
export type TaskStatus = 'pending' | 'in_progress' | 'completed' | 'cancelled';

export interface Task {
  id: string;
  user_id: string;
  contact_id?: string;
  opportunity_id?: string;
  
  // Información
  title: string;
  description?: string;
  
  // Tipo y prioridad
  type: TaskType;
  priority: Priority;
  
  // Estado
  status: TaskStatus;
  
  // Fechas
  due_date?: string;
  reminder_date?: string;
  completed_at?: string;
  
  // Asignación
  assigned_to?: string;
  
  // Timestamps
  created_at: string;
  updated_at: string;
}

// ============================================
// 5. CAMPAÑAS Y EMAIL MARKETING
// ============================================

export type CampaignType = 'email' | 'sms' | 'social';
export type CampaignStatus = 'draft' | 'scheduled' | 'active' | 'paused' | 'completed';

export interface Campaign {
  id: string;
  user_id: string;
  
  // Información
  name: string;
  description?: string;
  type: CampaignType;
  
  // Estado
  status: CampaignStatus;
  
  // Fechas
  start_date?: string;
  end_date?: string;
  
  // Métricas
  total_sent: number;
  total_opened: number;
  total_clicked: number;
  total_bounced: number;
  
  // Timestamps
  created_at: string;
  updated_at: string;
}

export interface EmailTemplate {
  id: string;
  user_id: string;
  name: string;
  subject?: string;
  body_html?: string;
  body_text?: string;
  category?: string;
  created_at: string;
  updated_at: string;
}

export interface Segment {
  id: string;
  user_id: string;
  name: string;
  description?: string;
  filters: Record<string, any>;
  created_at: string;
  updated_at: string;
}

export type CampaignContactStatus = 'pending' | 'sent' | 'opened' | 'clicked' | 'bounced' | 'unsubscribed';

export interface CampaignContact {
  id: string;
  campaign_id: string;
  contact_id: string;
  status: CampaignContactStatus;
  sent_at?: string;
  opened_at?: string;
  clicked_at?: string;
  bounced_at?: string;
  created_at: string;
}

// ============================================
// 6. AUTOMATIZACIÓN
// ============================================

export type WorkflowTriggerType = 
  | 'contact_created'
  | 'contact_updated'
  | 'stage_changed'
  | 'task_completed'
  | 'opportunity_won'
  | 'opportunity_lost'
  | 'email_opened'
  | 'email_clicked';

export interface Workflow {
  id: string;
  user_id: string;
  name: string;
  description?: string;
  
  // Trigger
  trigger_type: WorkflowTriggerType;
  trigger_conditions?: Record<string, any>;
  
  // Acciones
  actions: WorkflowAction[];
  
  // Estado
  is_active: boolean;
  
  // Estadísticas
  times_triggered: number;
  last_triggered_at?: string;
  
  // Timestamps
  created_at: string;
  updated_at: string;
}

export interface WorkflowAction {
  type: 'send_email' | 'create_task' | 'update_contact' | 'change_stage' | 'wait' | 'webhook';
  config: Record<string, any>;
  order: number;
}

// ============================================
// 7. PRODUCTOS
// ============================================

export interface Product {
  id: string;
  user_id: string;
  name: string;
  description?: string;
  sku?: string;
  price: number;
  cost: number;
  currency: string;
  category?: string;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface OpportunityProduct {
  id: string;
  opportunity_id: string;
  product_id: string;
  quantity: number;
  unit_price: number;
  discount: number;
  total: number;
  created_at: string;
}

// ============================================
// 8. ARCHIVOS
// ============================================

export interface Attachment {
  id: string;
  user_id: string;
  contact_id?: string;
  opportunity_id?: string;
  interaction_id?: string;
  file_name: string;
  file_type?: string;
  file_size?: number;
  file_url: string;
  created_at: string;
}

// ============================================
// 9. CONFIGURACIÓN
// ============================================

export interface UserSettings {
  user_id: string;
  timezone: string;
  date_format: string;
  currency: string;
  language: string;
  email_notifications: boolean;
  push_notifications: boolean;
  settings: Record<string, any>;
  created_at: string;
  updated_at: string;
}

// ============================================
// TIPOS DE FORMULARIOS Y DTOs
// ============================================

export interface CreateContactDTO {
  first_name: string;
  last_name?: string;
  email?: string;
  phone?: string;
  mobile?: string;
  company_name?: string;
  job_title?: string;
  contact_type?: ContactType;
  status?: ContactStatus;
  source?: ContactSource;
  notes?: string;
  assigned_to?: string;
}

export interface UpdateContactDTO extends Partial<CreateContactDTO> {
  id: string;
}

export interface CreateOpportunityDTO {
  contact_id: string;
  title: string;
  description?: string;
  value: number;
  pipeline_id?: string;
  stage_id?: string;
  expected_close_date?: string;
  assigned_to?: string;
}

export interface CreateTaskDTO {
  title: string;
  description?: string;
  type?: TaskType;
  priority?: Priority;
  due_date?: string;
  contact_id?: string;
  opportunity_id?: string;
  assigned_to?: string;
}

export interface CreateInteractionDTO {
  contact_id: string;
  type: InteractionType;
  subject?: string;
  content?: string;
  direction?: InteractionDirection;
  outcome?: InteractionOutcome;
  duration?: number;
  opportunity_id?: string;
}

// ============================================
// TIPOS DE RESPUESTA DE API
// ============================================

export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

export interface PaginatedResponse<T> {
  success: boolean;
  data: T[];
  pagination: {
    total: number;
    page: number;
    per_page: number;
    total_pages: number;
  };
}

// ============================================
// TIPOS PARA ANALYTICS Y REPORTES
// ============================================

export interface SalesMetrics {
  total_opportunities: number;
  total_value: number;
  won_opportunities: number;
  won_value: number;
  lost_opportunities: number;
  lost_value: number;
  win_rate: number;
  average_deal_size: number;
  average_sales_cycle: number;
}

export interface PipelineMetrics {
  stage_id: string;
  stage_name: string;
  opportunities_count: number;
  total_value: number;
  average_value: number;
  conversion_rate: number;
}

export interface ActivityMetrics {
  calls: number;
  emails: number;
  meetings: number;
  tasks_completed: number;
  tasks_pending: number;
}

export interface TopPerformer {
  user_id: string;
  name: string;
  opportunities_won: number;
  total_value: number;
  activities: number;
}
