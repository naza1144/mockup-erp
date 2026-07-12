# M10 · Platform Console — Flow การทำงานแต่ละหน้า

## ภาพรวมระบบ (System Overview)

M10 Platform Console เป็น Dashboard สำหรับ Platform Engineer / Admin ในการจัดการโครงสร้างพื้นฐานส่วนกลางของระบบ ERP บริหารหลักสูตร ประกอบด้วย 9 หน้า ครอบคลุม 7 Epics (E1–E7) ตาม Functional Requirements

```
┌─────────────────────────────────────────────────────────────┐
│                    M10 · Platform Console                     │
├──────────┬──────────┬──────────┬──────────┬─────────────────┤
│Dashboard │ Schema   │ Event Bus│ Storage  │  Notification   │
│ (ภาพรวม)  │ (E1)     │ (E2)     │ (E3)     │  (E4)           │
├──────────┼──────────┼──────────┼──────────┼─────────────────┤
│ Audit Log│ DevOps   │ API      │ Traefik  │                 │
│ (E5)     │ & CI/CD  │ Standards│ Admin    │                 │
│          │ (E6)     │ (E7)     │          │                 │
└──────────┴──────────┴──────────┴──────────┴─────────────────┘
```

---

## 1. Dashboard (`page-dashboard.html`) — หน้าแรก

### Epic: E6 (DevOps) + E2 (Event Bus) + E4 (Notification) + E5 (Audit)

**วัตถุประสงค์:** แสดงสถานะโดยรวมของระบบ (Single Pane of Glass)

### Flow การทำงาน

```
[โหลดหน้า] 
    ↓
├─ 1. แสดง KPI Cards: Schema ทั้งหมด, Core Events, Buckets, DLQ Messages
│     (ดึงข้อมูลจาก shared.js → seed data)
│
├─ 2. แสดง Service Status (Business Modules)
│     ├─ M0  Identity & Account      🟢 healthy
│     ├─ M1  หลักสูตร                 🟢 healthy
│     ├─ M1p จัดตารางเรียน            🟢 healthy
│     ├─ M3  ข้อมูลอาจารย์            🟢 healthy
│     ├─ M4  ทะเบียนนักศึกษา          🟡 degraded (OOMKilled)
│     ├─ M8  สหกิจศึกษา               🟢 healthy
│     └─ M9  โครงงาน/วิทยานิพนธ์     🔴 down (CrashLoopBackOff)
│
│     [ผู้ใช้คลิก "Restart" บน service ที่มีปัญหา]
│         ↓
│     confirm → alert "กำลัง restart..."
│     setTimeout 2 วิ → status กลับเป็น healthy
│     saveData → re-render
│
├─ 3. Event Bus Status
│     ├─ NATS Nodes: 3/3
│     ├─ Queue Depth: 1,289
│     └─ DLQ: 3 messages
│
├─ 4. Notification Status
│     ├─ ส่งสำเร็จ: 3
│     ├─ ล้มเหลว: 1
│     └─ Dead: 1
│
└─ 5. Recent Audit Log (4 รายการล่าสุด)
      ├─ เวลา · ผู้กระทำ · Action · Service · รายละเอียด
      └─ สีตาม Action: INSERT=🟢, UPDATE=🔵, DELETE=🔴

[ปุ่ม "รีเฟรช"] → อัปเดตเวลา + re-render service status
```

### User Stories ที่เกี่ยวข้อง
- ในฐานะ Platform Engineer ฉันต้องการดูภาพรวมระบบจากหน้าเดียว
- ในฐานะ Admin ฉันต้องการ restart service ที่มีปัญหาได้ทันที

---

## 2. Schema & Data Silo (`page-schemas.html`) — E1

### Epic: E1 · Data Silo — UC-01, UC-02

**วัตถุประสงค์:** จัดการ PostgreSQL schema แยกต่อ service พร้อม DB user แบบ least-privilege

### Flow การทำงาน

```
[โหลดหน้า]
    ↓
├─ ซ้าย: Schema ต่อ Service (10 schemas)
│   identity, curriculum, planning, faculty, registry,
│   coop, thesis, quality, finance, analytics
│   ├─ แสดง: ชื่อ schema, module, จำนวน tables, db_user, สถานะ
│   └─ สถานะ: 🟢 active (7) / 🟡 pending (3)
│
├─ ขวา: No Cross-schema JOIN Policy
│   ├─ ✅ DB user มีสิทธิ์เฉพาะ schema ตัวเอง
│   ├─ ✅ CI Lint ตรวจ cross-schema SQL
│   └─ 📝 ADR: ข้ามโดเมนต้องผ่าน API/Event
│
└─ ล่าง: Migration Status (6 migrations applied)
    ├─ M0 · 001_create_account.sql    ✅ 2569-06-15
    ├─ M1 · 002_create_program.sql    ✅ 2569-06-20
    ├─ M3 · 001_create_instructor.sql ✅ 2569-06-10
    ├─ M4 · 003_create_application.sql ✅ 2569-06-22
    ├─ M8 · 001_create_company.sql    ✅ 2569-06-18
    └─ M9 · 001_create_thesis.sql     ✅ 2569-06-12
```

### User Stories ที่เกี่ยวข้อง
- ในฐานะ Platform Engineer ฉันต้องการเห็น schema และ migration ของทุก service ในที่เดียว
- ในฐานะ Developer ฉันต้องการรู้ว่า cross-schema JOIN ผิด policy

---

## 3. Event Bus (`page-events.html`) — E2

### Epic: E2 · Message Bus — UC-03, UC-04, UC-05

**วัตถุประสงค์:** จัดการ NATS JetStream cluster, Event Schema Registry, Core Events, และ Dead-letter Queue

### Flow การทำงาน

```
[โหลดหน้า]
    ↓
├─ ซ้าย: NATS JetStream Cluster Status
│   ├─ Nodes: 3/3 🟢
│   ├─ Messages/sec: 245
│   └─ Queue Depth: 1,289 (amber)
│
├─ ขวา: Dead-letter Queue (DLQ)
│   ├─ แสดงรายการ message ที่ failed
│   │   └─ event name · error · retry count (x/3)
│   └─ [ปุ่ม "Retry ทั้งหมด"] → saveData(dlq, []) → re-render → alert success
│
└─ ล่าง: Core Events (10 events)
    ├─ ชื่อ event (namespace.action)
    ├─ publisher → consumer(s)
    └─ version
    └─ ตัวอย่าง: account.synced (M0 → M3, M4, M8, M9)
```

### Data Flow (Event-driven)

```
M0 ──account.synced──→ M3, M4, M8, M9
M0 ──account.role_changed──→ M3, M4, M8, M9
M1 ──schedule.published──→ M4, M10
M1 ──grade.submitted──→ M4, M7
M4 ──student.enrolled──→ M0, M6
M8 ──coop.completed──→ M4, M10
M8 ──coop.evaluation_submitted──→ M10
M9 ──defense.scheduled──→ M10
M9 ──thesis.passed──→ M4, M10
M6 ──payment.confirmed──→ M4
```

### User Stories ที่เกี่ยวข้อง
- ในฐานะ Platform Engineer ฉันต้องการเห็น event schema และ consumers ทั้งหมด
- ในฐานะ Admin ฉันต้องการ retry message ที่ติด DLQ

---

## 4. File Storage (`page-storage.html`) — E3

### Epic: E3 · File Storage (MinIO) — UC-06, UC-07, UC-08

**วัตถุประสงค์:** จัดการ MinIO buckets, Presigned URL สำหรับ upload/download, Lifecycle Policy

### Flow การทำงาน

```
[โหลดหน้า]
    ↓
├─ ซ้ายบน: Buckets ต่อ Domain
│   account-avatars (M0) · 145 objects · 256MB
│   curriculum-docs (M1) · 89 objects · 1.2GB
│   student-files (M4) · 1,234 objects · 45GB
│   thesis-files (M9) · 67 objects · 8.5GB
│   coop-reports (M8) · 456 objects · 3.1GB
│
├─ ขวาบน: Presigned URL Generator (UC-07)
│   [เลือก bucket] → [คลิก Generate]
│       ↓
│   สร้าง URL: https://minio.erp.ubu.ac.th/{bucket}/uploads/{timestamp}.pdf
│   แสดง URL ในกล่อง (expires 900 วิ) → client upload ตรงถึง MinIO
│
└─ ล่าง: Lifecycle Policy (UC-08)
    ├─ student-files · Delete temp uploads · age >30d · DELETE
    ├─ curriculum-docs · Archive old TQF · age >2y · Archive to Glacier
    └─ coop-reports · Archive after completion · age >5y · Archive to Glacier
```

### Upload Flow (Presigned URL)

```
Client → ขอ Presigned URL → Backend (M10) → MinIO สร้าง URL → คืน Client
                                                                    ↓
Client ──────────────────────────────────────────────────────────→ MinIO (upload ตรง)
                                                                    ↓
MinIO ส่ง event (object.created) → NATS → service ที่ subscribe
```

### User Stories ที่เกี่ยวข้อง
- ในฐานะ Platform Engineer ฉันต้องการเห็น bucket และ lifecycle policies
- ในฐานะ Service อื่น ฉันต้องการ presigned URL เพื่อ upload ไฟล์ตรงไป MinIO

---

## 5. Notification (`page-notifications.html`) — E4

### Epic: E4 · Notification Service — UC-09, UC-10, UC-11, UC-12

**วัตถุประสงค์:** จัดการการแจ้งเตือนอัตโนมัติ (Email + In-app) แบบ event-driven พร้อม User Preference

### Flow การทำงาน

```
[โหลดหน้า]
    ↓
├─ ซ้าย: User Preference
│   แสดง checkbox สำหรับเปิด/ปิดช่องทางต่อ event type
│   ├─ M9 · แจ้งสอบ             📧✓  💬✓
│   ├─ M9 · อนุมัติหัวข้อ        📧✓  💬✓
│   ├─ M8 · ผลประเมินสหกิจ      📧✓  💬✓
│   ├─ M8 · เอกสารใหม่          📧✗  💬✓
│   ├─ M4 · นัดสัมภาษณ์         📧✓  💬✓
│   ├─ M4 · ผลสัมภาษณ์          📧✓  💬✓
│   ├─ M1 · ตารางเรียน          📧✗  💬✓
│   └─ M0 · เปลี่ยนสิทธิ์       📧✓  💬✓
│
│   [แก้ไข checkbox] → [คลิก "บันทึก"] → saveData → alert success
│
└─ ขวา: Delivery Log
    แสดง 5 รายการส่งล่าสุด
    ├─ เวลา · event · title · channel · สถานะ
    └─ สถานะ: 🟢 sent / 🟡 failed / 🔴 dead
```

### Notification Flow (Event-driven)

```
Service A ──publish event──→ NATS
                              ↓
                    M10 Notification Service subscribe
                              ↓
                    ตรวจสอบ User Preference
                    ├─ email=true → ส่ง Email (SMTP)
                    └─ in_app=true → ส่ง In-app (WebSocket)
                    ↓
                    บันทึก Delivery Log
                    ├─ sent    → success
                    ├─ failed  → retry (max 3)
                    └─ dead    → ไป DLQ
```

### User Stories ที่เกี่ยวข้อง
- ในฐานะ User ฉันต้องการเลือกช่องทางรับแจ้งเตือนตามความต้องการ
- ในฐานะ Admin ฉันต้องการดูประวัติการส่งแจ้งเตือนและแก้ไขปัญหา

---

## 6. Audit Log (`page-audit.html`) — E5

### Epic: E5 · Audit Log — UC-13, UC-14

**วัตถุประสงค์:** Append-only audit log middleware — บันทึก who/what/when ทุก write operation

### Flow การทำงาน

```
[โหลดหน้า]
    ↓
└─ ตาราง Audit Log (8 รายการ)
    ├─ เวลา     · ผู้กระทำ          · Action  · Service   · Entity       · รายละเอียด
    ├─ 15:23    · admin@ubu.ac.th   · UPDATE  · curriculum · program      · แก้ปี พ.ศ. หลักสูตร
    ├─ 14:10    · admin@ubu.ac.th   · INSERT  · planning   · schedule     · สร้างตารางเรียนใหม่
    ├─ 12:45    · staff@ubu.ac.th   · UPDATE  · thesis     · topic        · อนุมัติหัวข้อโครงงาน
    ├─ 11:30    · staff@ubu.ac.th   · INSERT  · thesis     · exam         · บันทึกการสอบ
    ├─ 10:15    · admin@ubu.ac.th   · DELETE  · registry   · application  · ลบใบสมัคร
    ├─ 09:00    · lecturer@ubu.ac.th· UPDATE  · curriculum · grade        · แก้ไขคะแนน
    ├─ 16:50    · admin@ubu.ac.th   · UPDATE  · coop       · company      · แก้ไขที่อยู่บริษัท
    └─ 14:20    · staff@ubu.ac.th   · INSERT  · registry   · student      · เพิ่มข้อมูลนศ.ใหม่

🔒 Append-only · Immutable — ไม่สามารถแก้ไขหรือลบได้
```

### Audit Flow

```
Request → Traefik → Service API → Middleware บันทึก Audit
                                    ↓
                            NATS (audit.logged)
                                    ↓
                            M10 Audit Service
                                    ↓
                            PostgreSQL (append-only)
                                    ↓
                            Audit Viewer UI
```

### User Stories ที่เกี่ยวข้อง
- ในฐานะ Admin ฉันต้องการตรวจสอบย้อนหลังได้ว่าใคร ทำอะไร เมื่อไหร่
- ในฐานะ Security ฉันต้องการมั่นใจว่า audit log ถูกแก้ไขหรือลบไม่ได้

---

## 7. DevOps & CI/CD (`page-devops.html`) — E6

### Epic: E6 · DevOps & K8s — UC-15, UC-16, UC-17, UC-18, UC-19

**วัตถุประสงค์:** จัดการ Docker, Helm, Kubernetes, CI/CD Pipeline, Observability, Secret Management, และ Terraform (IaC)

### Flow การทำงาน

```
[โหลดหน้า]
    ↓
├─ Row 1: สถานะ Tools (3 คอลัมน์)
│   ├─ Docker: ✅ Dockerfile template, ✅ Helm chart
│   ├─ Kubernetes: ✅ K8s manifests, ✅ Namespace แยกต่อ service
│   └─ Secret Management: ✅ No plain-text in git
│
├─ CI/CD Pipeline Status (7 services)
│   ├─ M0  Identity     · 15 นาทีที่แล้ว · success · v2.4.1 · production
│   ├─ M1  Curriculum   · 2 ชม.ที่แล้ว   · success · v3.1.0 · production
│   ├─ M1p Planning     · 1 ชม.ที่แล้ว   · success · v1.7.2 · staging
│   ├─ M3  Faculty      · 6 ชม.ที่แล้ว   · success · v2.0.1 · production
│   ├─ M4  Registry     · 30 นาทีที่แล้ว  · failed  · v1.9.3 · development
│   ├─ M8  Co-op        · 1 วันที่แล้ว    · success · v1.5.0 · production
│   └─ M9  Thesis       · 3 ชม.ที่แล้ว   · running · v1.2.4 · staging
│
├─ Observability
│   ├─ Loki (Log)       🟢 retention 30d
│   ├─ Prometheus (Metrics) 🟢 retention 90d
│   └─ Grafana (Dashboard) 🟢 Active
│
└─ Terraform (IaC)
    ├─ State Backend: MinIO (s3://erp-terraform-state/)
    ├─ Providers: kubectl, helm, keycloak, minio, random
    ├─ Modules: network, k8s, database, storage, monitoring, iam
    ├─ Env Workspaces: dev · staging · prod
    ├─ Resources Managed: 47
    └─ Last Plan: ✅ Clean (no drift)
```

### CI/CD Pipeline Flow

```
Developer Push → GitHub → GitHub Actions
                              ↓
                          Build Docker Image
                              ↓
                          Push to Container Registry
                              ↓
                          Helm Deploy to K8s
                              ↓
                          Health Check ✅
                              ↓
                          Notify (Email/Slack)
```

### User Stories ที่เกี่ยวข้อง
- ในฐานะ Platform Engineer ฉันต้องการเห็นสถานะ CI/CD pipeline ของทุก service
- ในฐานะ Admin ฉันต้องการตรวจสอบ Observability stack และ Terraform state

---

## 8. API & Platform Standards (`page-standards.html`) — E7

### Epic: E7 · API & Platform Standards — UC-20, UC-21

**วัตถุประสงค์:** กำหนดมาตรฐานกลางของ API — OpenAPI 3.0, Error Format, Pagination, API Versioning, Traefik Middleware

### Flow การทำงาน

```
[โหลดหน้า]
    ↓
├─ OpenAPI 3.0
│   ├─ ทุก service มี OpenAPI spec + Swagger UI
│   └─ CI validation: OpenAPI lint ใน pipeline
│
├─ Error Format มาตรฐาน
│   {
│     "code": "VALIDATION_ERROR",
│     "message": "กรุณากรอกข้อมูลให้ครบ",
│     "traceId": "abc-123-def"
│   }
│
├─ Pagination Convention
│   GET /v1/items?page=1&limit=20&sort=name:asc
│   Response: { data: [...], pagination: { page, limit, total, totalPages } }
│
├─ API Versioning
│   URL prefix: /v1/... → ทุก service ใช้ /v1/ ตั้งแต่ต้น
│
└─ Traefik Middleware (รวมศูนย์)
    ├─ JWT ForwardAuth → ตรวจสอบ token ผ่าน Keycloak
    ├─ Rate Limit → 100 requests/sec ต่อ IP
    ├─ CORS → จำกัดเฉพาะ origin ที่อนุญาต
    └─ Security Headers → HSTS, XSS Protection
```

### API Request Flow

```
Client → Traefik (API Gateway)
           ├─ Rate Limit check
           ├─ JWT ForwardAuth → Keycloak (verify token)
           ├─ CORS check
           └─ Security Headers
           ↓
         Service API (/v1/...)
           ↓
         Response (มาตรฐาน Error Format + Pagination)
```

### User Stories ที่เกี่ยวข้อง
- ในฐานะ Developer ฉันต้องการมาตรฐาน API ที่ชัดเจนสำหรับทุก service
- ในฐานะ Admin ฉันต้องการเห็น middleware ที่ Traefik ใช้

---

## 9. Traefik Admin (`page-traefik.html`) — Gateway Management

### Epic: E7 · Traefik Middleware — UC-21

**วัตถุประสงค์:** API Gateway Dashboard (จำลองหน้า Traefik UI) สำหรับดู Routers, Services, Middlewares, Providers

### Flow การทำงาน

```
[โหลดหน้า]
    ↓
├─ Sidebar (4 tabs)
│   ├─ Dashboard (Overview)
│   ├─ HTTP Routers
│   ├─ HTTP Services
│   ├─ Middlewares
│   └─ Providers
│
├─ [คลิก切换 tab] → switchTab() → show/hide views
│
├─ Overview Tab
│   ├─ KPI: 8 Routers · 8 Services · 4 Middlewares · 1 Provider
│   ├─ Provider Info: Kubernetes CRD · namespace erp-traefik · v3.0.0
│   └─ Router Table: ชื่อ · Rule · Middleware · Service · Status
│
├─ Routers Tab → ตาราง 8 routers + TLS status
│   ตัวอย่าง: m0-identity → Host(`erp.ubu.ac.th`) && PathPrefix(`/m0`)
│            → rate-limit, jwt-auth → m0-service → TLS ✅ → 🟢 UP
│
├─ Services Tab → ตาราง 8 services + Load Balancer
│
├─ Middlewares Tab → 4 middlewares
│   rate-limit · jwt-auth · cors-policy · admin-auth
│
└─ Providers Tab → Kubernetes CRD (Connected)
```

### Traefik Request Flow

```
Internet → Traefik (erp.ubu.ac.th:443)
            ↓
          Router matching (PathPrefix)
            ↓
          Middleware Chain
            ├─ Rate Limit
            ├─ JWT ForwardAuth → Keycloak
            └─ CORS Headers
            ↓
          Service → Backend Pods
```

### User Stories ที่เกี่ยวข้อง
- ในฐานะ Platform Engineer ฉันต้องการเห็น router rules และ middleware ที่ทำงาน
- ในฐานะ Admin ฉันต้องการตรวจสอบสถานะของ services ผ่าน Traefik

---

## ความสัมพันธ์ระหว่างหน้า (Cross-page Dependencies)

| หน้า | ใช้ข้อมูลร่วมกับ | หมายเหตุ |
|------|----------------|---------|
| Dashboard | ทุกหน้า | KPI ดึงจาก data ของทุก epic |
| Event Bus | Notification | Notification subscribe events จาก NATS |
| Storage | Dashboard | Bucket count แสดงใน KPI |
| Audit | Dashboard | Recent audit แสดงใน Dashboard |
| DevOps | Traefik | Observability stack แยกจาก gateway |
| API Standards | Traefik | Middleware กำหนดที่ Standards -->

---

## หมายเหตุการพัฒนา

- ทุกหน้าใช้ `shared.js` ร่วมกันสำหรับ seed data และ localStorage management
- ข้อมูลเริ่มต้น (seed data) จะถูกโหลดเมื่อยังไม่เคยบันทึก (localStorage ว่าง)
- สถานะ "restart service" และ "retry DLQ" เปลี่ยนแปลงได้ผ่าน UI และบันทึกใน localStorage
- สามารถรีเซ็ตข้อมูลทั้งหมดได้จากปุ่ม "รีเซ็ตข้อมูล" ที่ Header