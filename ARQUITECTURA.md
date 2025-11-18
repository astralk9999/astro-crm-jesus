# 🏗️ Arquitectura de Victoria CRM

## 📋 Tabla de Contenidos

1. [Módulos del Sistema](#módulos-del-sistema)
2. [Estructura de Base de Datos](#estructura-de-base-de-datos)
3. [Flujos de Trabajo](#flujos-de-trabajo)
4. [Integraciones](#integraciones)
5. [Roadmap de Implementación](#roadmap-de-implementación)

---

## 🎯 Módulos del Sistema

### 1. 📇 Gestión de Contactos y Leads

**Características:**
- ✅ CRUD completo de contactos
- ✅ Información detallada (email, teléfono, empresa, notas)
- ✅ Clasificación por tags y etiquetas
- ✅ Estados personalizables (nuevo, contactado, calificado, etc.)
- ✅ Scoring de leads
- ✅ Campos personalizados
- ✅ Historial completo de interacciones
- ✅ Asignación de contactos a usuarios
- ✅ Importación/Exportación de contactos

**Archivos clave:**
```
src/
├── pages/
│   └── customers/
│       ├── index.astro                 # Lista de contactos
│       ├── [id].astro                  # Detalle de contacto
│       └── new.astro                   # Crear contacto
├── components/
│   └── customers/
│       ├── ContactList.astro
│       ├── ContactCard.astro
│       ├── ContactForm.astro
│       ├── ContactTimeline.astro       # Historial
│       └── ContactTags.astro
└── lib/
    └── services/
        └── contactService.ts
```

---

### 2. 💰 Pipeline de Ventas (Embudo)

**Características:**
- ✅ Vista Kanban del pipeline
- ✅ Múltiples pipelines configurables
- ✅ Etapas personalizables con probabilidades
- ✅ Drag & drop para mover oportunidades
- ✅ Valor total por etapa
- ✅ Predicción de ventas
- ✅ Filtros avanzados
- ✅ Vista de lista y tarjetas

**Archivos clave:**
```
src/
├── pages/
│   └── sales/
│       ├── pipeline.astro              # Vista Kanban
│       ├── opportunities.astro         # Lista
│       └── [id].astro                  # Detalle oportunidad
├── components/
│   └── sales/
│       ├── PipelineBoard.astro
│       ├── OpportunityCard.astro
│       ├── StageColumn.astro
│       └── OpportunityForm.astro
└── lib/
    └── services/
        └── opportunityService.ts
```

---

### 3. ✅ Gestión de Tareas y Recordatorios

**Características:**
- ✅ Crear, asignar y gestionar tareas
- ✅ Tipos de tareas (llamada, email, reunión, seguimiento)
- ✅ Prioridades (baja, media, alta, urgente)
- ✅ Fechas de vencimiento
- ✅ Recordatorios automáticos
- ✅ Vinculación con contactos y oportunidades
- ✅ Vista de calendario
- ✅ Notificaciones

**Archivos clave:**
```
src/
├── pages/
│   └── tasks/
│       ├── index.astro                 # Lista de tareas
│       ├── calendar.astro              # Vista calendario
│       └── [id].astro                  # Detalle tarea
├── components/
│   └── tasks/
│       ├── TaskList.astro
│       ├── TaskCard.astro
│       ├── TaskForm.astro
│       ├── TaskCalendar.astro
│       └── TaskNotifications.astro
└── lib/
    └── services/
        └── taskService.ts
```

---

### 4. 📧 Email Marketing y Campañas

**Características:**
- ✅ Creación de campañas de email
- ✅ Templates de email personalizables
- ✅ Segmentación de audiencias
- ✅ Programación de envíos
- ✅ Tracking de aperturas y clics
- ✅ Métricas y analytics
- ✅ A/B testing
- ✅ Secuencias automatizadas

**Archivos clave:**
```
src/
├── pages/
│   └── marketing/
│       ├── campaigns.astro             # Lista campañas
│       ├── [id].astro                  # Detalle campaña
│       ├── templates.astro             # Templates
│       └── segments.astro              # Segmentos
├── components/
│   └── marketing/
│       ├── CampaignList.astro
│       ├── CampaignForm.astro
│       ├── EmailEditor.astro
│       ├── TemplateList.astro
│       └── CampaignMetrics.astro
└── lib/
    └── services/
        └── campaignService.ts
```

---

### 5. 🤖 Automatización

**Características:**
- ✅ Workflows personalizables
- ✅ Triggers basados en eventos
- ✅ Acciones automatizadas
- ✅ Secuencias de seguimiento
- ✅ Asignación automática de leads
- ✅ Emails automáticos
- ✅ Tareas automáticas
- ✅ Webhooks

**Tipos de Workflows:**
1. **Lead Nurturing**: Secuencias automáticas cuando se crea un lead
2. **Follow-up**: Recordatorios automáticos si no hay respuesta
3. **Stage Automation**: Acciones al cambiar de etapa
4. **Task Automation**: Creación automática de tareas
5. **Email Sequences**: Secuencias de emails basadas en comportamiento

**Archivos clave:**
```
src/
├── pages/
│   └── automation/
│       ├── workflows.astro             # Lista workflows
│       ├── [id].astro                  # Editor workflow
│       └── logs.astro                  # Logs ejecución
├── components/
│   └── automation/
│       ├── WorkflowBuilder.astro
│       ├── TriggerSelector.astro
│       ├── ActionEditor.astro
│       └── WorkflowStats.astro
└── lib/
    └── services/
        └── workflowService.ts
```

---

### 6. 📊 Dashboard y Reportes

**Características:**
- ✅ KPIs principales
- ✅ Gráficos de ventas
- ✅ Embudo de conversión
- ✅ Rendimiento de vendedores
- ✅ Actividades del equipo
- ✅ Predicción de ingresos
- ✅ Reportes personalizables
- ✅ Exportación a PDF/Excel

**Métricas Clave:**
- Total de oportunidades
- Valor del pipeline
- Tasa de conversión
- Ciclo de ventas promedio
- Valor promedio del deal
- Actividades por usuario
- Tasa de respuesta
- ROI de campañas

**Archivos clave:**
```
src/
├── pages/
│   └── dashboard/
│       └── index.astro                 # Dashboard principal
├── components/
│   └── dashboard/
│       ├── KPICards.astro
│       ├── SalesChart.astro
│       ├── PipelineChart.astro
│       ├── ActivityChart.astro
│       ├── TopPerformers.astro
│       └── RecentActivities.astro
└── lib/
    └── services/
        └── analyticsService.ts
```

---

### 7. 📦 Productos y Catálogo

**Características:**
- ✅ Gestión de productos/servicios
- ✅ Precios y costos
- ✅ SKUs y categorías
- ✅ Vinculación con oportunidades
- ✅ Cálculo automático de totales
- ✅ Descuentos
- ✅ Inventario (opcional)

**Archivos clave:**
```
src/
├── pages/
│   └── products/
│       ├── index.astro                 # Lista productos
│       ├── [id].astro                  # Detalle producto
│       └── new.astro                   # Crear producto
└── lib/
    └── services/
        └── productService.ts
```

---

### 8. 💬 Historial de Interacciones

**Características:**
- ✅ Registro de todas las interacciones
- ✅ Llamadas, emails, reuniones, notas
- ✅ Timeline visual
- ✅ Búsqueda y filtros
- ✅ Adjuntar archivos
- ✅ Vinculación con contactos y oportunidades

**Tipos de Interacciones:**
- 📞 Llamadas telefónicas
- 📧 Emails
- 🤝 Reuniones
- 📝 Notas
- 💬 SMS/WhatsApp
- 📄 Documentos compartidos

---

## 🗄️ Estructura de Base de Datos

### Tablas Principales

1. **contacts** - Contactos y leads
2. **opportunities** - Oportunidades de venta
3. **pipelines** - Configuración de pipelines
4. **pipeline_stages** - Etapas de pipeline
5. **tasks** - Tareas y recordatorios
6. **interactions** - Historial de interacciones
7. **campaigns** - Campañas de marketing
8. **workflows** - Automatizaciones
9. **products** - Catálogo de productos
10. **tags** - Etiquetas
11. **attachments** - Archivos adjuntos
12. **user_settings** - Configuración de usuario

### Relaciones

```
auth.users (1) -----> (N) contacts
contacts (1) --------> (N) opportunities
contacts (1) --------> (N) interactions
contacts (1) --------> (N) tasks
contacts (N) <------> (N) tags
opportunities (N) ---> (N) products
pipelines (1) -------> (N) pipeline_stages
opportunities (N) ---> (1) pipeline_stages
```

---

## 🔄 Flujos de Trabajo Típicos

### Flujo 1: Nuevo Lead

```
1. Lead creado (web form, import, manual)
   ↓
2. Asignación automática a vendedor
   ↓
3. Tarea creada: "Contactar en 24h"
   ↓
4. Email de bienvenida automático
   ↓
5. Lead calificado → Oportunidad creada
   ↓
6. Pipeline: Etapa "Nuevo"
```

### Flujo 2: Seguimiento de Oportunidad

```
1. Oportunidad en etapa "Contactado"
   ↓
2. Reunión programada (tarea + calendar)
   ↓
3. Interacción registrada: Reunión
   ↓
4. Oportunidad avanza a "Propuesta"
   ↓
5. Email automático con propuesta
   ↓
6. Tarea: Follow-up en 3 días
```

### Flujo 3: Campaña de Email

```
1. Crear segmento de contactos
   ↓
2. Diseñar email con template
   ↓
3. Programar envío
   ↓
4. Sistema envía emails
   ↓
5. Tracking de aperturas/clics
   ↓
6. Workflow: Si abrió → crear tarea
```

---

## 🔌 Integraciones Planeadas

### Fase 1 (MVP)
- ✅ Supabase Authentication
- ✅ Supabase Database
- ✅ Supabase Storage (archivos)

### Fase 2
- 📧 Gmail/Outlook (envío y recepción)
- 📅 Google Calendar / Outlook Calendar
- 📱 WhatsApp Business API
- 📞 Twilio (SMS y llamadas)

### Fase 3
- 🔗 Webhooks personalizados
- 📊 Zapier integration
- 💳 Stripe/PayPal (pagos)
- 📈 Google Analytics

---

## 🗺️ Roadmap de Implementación

### Sprint 1: Fundación (Semanas 1-2)
- [x] Base de datos completa
- [x] Autenticación
- [x] Tipos TypeScript
- [ ] Servicios base (CRUD)

### Sprint 2: Contactos (Semanas 3-4)
- [ ] CRUD de contactos
- [ ] Vista de lista y detalle
- [ ] Tags y filtros
- [ ] Importación CSV

### Sprint 3: Pipeline (Semanas 5-6)
- [ ] Vista Kanban
- [ ] CRUD de oportunidades
- [ ] Drag & drop
- [ ] Métricas básicas

### Sprint 4: Tareas (Semana 7)
- [ ] CRUD de tareas
- [ ] Calendario
- [ ] Notificaciones

### Sprint 5: Dashboard (Semana 8)
- [ ] KPIs principales
- [ ] Gráficos de ventas
- [ ] Actividades recientes

### Sprint 6: Interacciones (Semana 9)
- [ ] Timeline de interacciones
- [ ] Registro de llamadas/emails
- [ ] Adjuntar archivos

### Sprint 7: Productos (Semana 10)
- [ ] CRUD de productos
- [ ] Vinculación con oportunidades
- [ ] Cálculos automáticos

### Sprint 8: Email Marketing (Semanas 11-12)
- [ ] Campañas básicas
- [ ] Templates
- [ ] Segmentación

### Sprint 9: Automatización (Semanas 13-14)
- [ ] Workflow builder
- [ ] Triggers básicos
- [ ] Acciones automáticas

### Sprint 10: Integraciones (Semana 15+)
- [ ] Gmail integration
- [ ] Calendar integration
- [ ] WhatsApp Business

---

## 📂 Estructura de Carpetas del Proyecto

```
nasty-neptune/
├── src/
│   ├── pages/
│   │   ├── index.astro                      # Home/Dashboard
│   │   ├── auth/                            # ✅ Autenticación
│   │   ├── dashboard/                       # Dashboard principal
│   │   ├── customers/                       # 📇 Contactos
│   │   ├── sales/                           # 💰 Pipeline
│   │   ├── tasks/                           # ✅ Tareas
│   │   ├── marketing/                       # 📧 Campañas
│   │   ├── automation/                      # 🤖 Workflows
│   │   ├── products/                        # 📦 Productos
│   │   ├── reports/                         # 📊 Reportes
│   │   └── settings/                        # ⚙️ Configuración
│   ├── components/
│   │   ├── ui/                              # Componentes UI
│   │   ├── auth/                            # ✅ Auth components
│   │   ├── customers/                       # Contactos
│   │   ├── sales/                           # Ventas
│   │   ├── tasks/                           # Tareas
│   │   ├── dashboard/                       # Dashboard
│   │   └── marketing/                       # Marketing
│   ├── lib/
│   │   ├── services/                        # Servicios API
│   │   │   ├── authService.ts              # ✅
│   │   │   ├── contactService.ts
│   │   │   ├── opportunityService.ts
│   │   │   ├── taskService.ts
│   │   │   ├── campaignService.ts
│   │   │   ├── workflowService.ts
│   │   │   └── analyticsService.ts
│   │   ├── database/
│   │   │   └── supabase.ts                 # ✅
│   │   └── utils/
│   │       ├── formatters.ts
│   │       ├── validators.ts
│   │       └── helpers.ts
│   ├── types/
│   │   ├── index.ts
│   │   └── crm.ts                          # ✅ Tipos CRM
│   └── styles/
│       └── global.css
├── database-schema.sql                      # ✅ Schema SQL
├── .env.local                               # ✅ Variables entorno
└── README.md
```

---

## 🎨 Stack Tecnológico

### Frontend
- **Astro 5** - Framework principal
- **TypeScript** - Tipado estático
- **Tailwind CSS** - Estilos (opcional)

### Backend
- **Supabase** - Base de datos PostgreSQL
- **Supabase Auth** - Autenticación
- **Supabase Storage** - Almacenamiento de archivos
- **Supabase Realtime** - Updates en tiempo real

### Integraciones Futuras
- **Resend/SendGrid** - Email transaccional
- **Twilio** - SMS y llamadas
- **Stripe** - Pagos

---

## 🔐 Seguridad

- ✅ Row Level Security (RLS) en Supabase
- ✅ Autenticación con JWT
- ✅ Políticas de acceso por usuario
- ✅ Validación de datos en servidor
- ✅ Sanitización de inputs
- ✅ HTTPS obligatorio

---

## 📝 Notas de Desarrollo

### Prioridades Inmediatas
1. ✅ Esquema de base de datos
2. ✅ Tipos TypeScript
3. 🔄 Servicios CRUD básicos
4. 🔲 Interfaz de contactos
5. 🔲 Pipeline visual

### Decisiones Técnicas
- Usar Astro en modo servidor (`output: 'server'`)
- Implementar SSR para páginas dinámicas
- Client-side rendering para interacciones complejas
- Optimistic updates para mejor UX

---

**Última actualización:** 18 de noviembre de 2025
**Versión:** 1.0.0
**Estado:** En desarrollo
