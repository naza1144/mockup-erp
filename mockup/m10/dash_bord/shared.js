/* ═══════════════════════════════════════════════════════
   M10 · Platform Console — Shared Mock Data & Helpers
   ใช้ร่วมกันทุกหน้าใน pages/
   ═══════════════════════════════════════════════════════ */

/* ─── localStorage Helpers ─── */
function loadData(key, fallback) {
  const s = localStorage.getItem('m10_' + key);
  return s ? JSON.parse(s) : fallback;
}
function saveData(key, data) {
  localStorage.setItem('m10_' + key, JSON.stringify(data));
}
function resetData() {
  const keys = Object.keys(localStorage).filter(k => k.startsWith('m10_'));
  keys.forEach(k => localStorage.removeItem(k));
  location.reload();
}

/* ─── Seed Data ─── */

// E1: Schema & Data Silo
const SEED_SCHEMAS = [
  { name: "identity",    module: "M0", desc: "Identity & Account",     tables: 4,  db_user: "m0_user",  status: "active" },
  { name: "curriculum",  module: "M1", desc: "หลักสูตร",               tables: 6,  db_user: "m1_user",  status: "active" },
  { name: "planning",    module: "M1", desc: "จัดตารางเรียน",          tables: 4,  db_user: "m1p_user", status: "active" },
  { name: "faculty",     module: "M3", desc: "ข้อมูลอาจารย์",           tables: 3,  db_user: "m3_user",  status: "active" },
  { name: "registry",    module: "M4", desc: "ทะเบียนนักศึกษา",        tables: 5,  db_user: "m4_user",  status: "active" },
  { name: "coop",        module: "M8", desc: "สหกิจศึกษา",             tables: 5,  db_user: "m8_user",  status: "active" },
  { name: "thesis",      module: "M9", desc: "โครงงาน/วิทยานิพนธ์",    tables: 4,  db_user: "m9_user",  status: "active" },
  { name: "quality",     module: "M5", desc: "ประกันคุณภาพ",           tables: 0,  db_user: "m5_user",  status: "pending" },
  { name: "finance",     module: "M6", desc: "การเงิน",                tables: 0,  db_user: "m6_user",  status: "pending" },
  { name: "analytics",   module: "M7", desc: "รายงาน",                tables: 0,  db_user: "m7_user",  status: "pending" },
];

// E2: Events
const SEED_EVENTS = [
  { name: "account.synced",         publisher: "M0", consumers: "M3, M4, M8, M9", version: "v1" },
  { name: "account.role_changed",   publisher: "M0", consumers: "M3, M4, M8, M9", version: "v1" },
  { name: "schedule.published",     publisher: "M1", consumers: "M4, M10",         version: "v1" },
  { name: "grade.submitted",        publisher: "M1", consumers: "M4, M7",          version: "v1" },
  { name: "student.enrolled",       publisher: "M4", consumers: "M0, M6",          version: "v1" },
  { name: "coop.completed",         publisher: "M8", consumers: "M4, M10",         version: "v1" },
  { name: "coop.evaluation_submitted", publisher: "M8", consumers: "M10",          version: "v1" },
  { name: "defense.scheduled",      publisher: "M9", consumers: "M10",             version: "v1" },
  { name: "thesis.passed",          publisher: "M9", consumers: "M4, M10",         version: "v1" },
  { name: "payment.confirmed",      publisher: "M6", consumers: "M4",              version: "v1" },
];

const SEED_DLQ = [
  { id: 1, event: "grade.submitted",    error: "Consumer timeout",              retry: 3 },
  { id: 2, event: "coop.completed",     error: "Invalid payload schema",        retry: 2 },
  { id: 3, event: "account.synced",     error: "Duplicate key violation",       retry: 3 },
];

// E3: Storage
const SEED_BUCKETS = [
  { name: "account-avatars",  objects: 145, size: "256MB",  module: "M0" },
  { name: "curriculum-docs",  objects: 89,  size: "1.2GB",  module: "M1" },
  { name: "student-files",    objects: 1234, size: "45GB",  module: "M4" },
  { name: "thesis-files",     objects: 67,  size: "8.5GB",  module: "M9" },
  { name: "coop-reports",     objects: 456, size: "3.1GB",  module: "M8" },
];

// E4: Notification
const SEED_DELIVERIES = [
  { id: "n1", created_at: "2569-07-08 16:30", event: "thesis.topic_approved",  title: "อนุมัติหัวข้อโครงงาน",  channel: "email", status: "sent" },
  { id: "n2", created_at: "2569-07-08 16:25", event: "coop.evaluation_submitted", title: "ผลประเมินสหกิจ",    channel: "email", status: "sent" },
  { id: "n3", created_at: "2569-07-08 16:20", event: "student.interview_scheduled", title: "นัดสัมภาษณ์",    channel: "email", status: "dead", error: "SMTP timeout" },
  { id: "n4", created_at: "2569-07-08 16:15", event: "defense.scheduled",      title: "กำหนดสอบเค้าโครง",    channel: "email", status: "failed", error: "Service unavailable" },
  { id: "n5", created_at: "2569-07-08 16:10", event: "schedule.published",     title: "ตารางเรียนเผยแพร่",   channel: "in_app", status: "sent" },
];

// E5: Audit
const SEED_AUDIT = [
  { id: "a1", time: "2569-07-08 15:23", actor: "admin@ubu.ac.th",  action: "UPDATE", service: "curriculum", entity: "program", detail: "แก้ปี พ.ศ. หลักสูตร" },
  { id: "a2", time: "2569-07-08 14:10", actor: "admin@ubu.ac.th",  action: "INSERT", service: "planning",   entity: "schedule", detail: "สร้างตารางเรียนใหม่" },
  { id: "a3", time: "2569-07-08 12:45", actor: "staff@ubu.ac.th",  action: "UPDATE", service: "thesis",     entity: "topic",    detail: "อนุมัติหัวข้อโครงงาน" },
  { id: "a4", time: "2569-07-08 11:30", actor: "staff@ubu.ac.th",  action: "INSERT", service: "thesis",     entity: "exam",     detail: "บันทึกการสอบ" },
  { id: "a5", time: "2569-07-08 10:15", actor: "admin@ubu.ac.th",  action: "DELETE", service: "registry",   entity: "application", detail: "ลบใบสมัคร" },
  { id: "a6", time: "2569-07-08 09:00", actor: "lecturer@ubu.ac.th", action: "UPDATE", service: "curriculum", entity: "grade",   detail: "แก้ไขคะแนน" },
  { id: "a7", time: "2569-07-07 16:50", actor: "admin@ubu.ac.th",  action: "UPDATE", service: "coop",       entity: "company",  detail: "แก้ไขที่อยู่บริษัท" },
  { id: "a8", time: "2569-07-07 14:20", actor: "staff@ubu.ac.th",  action: "INSERT", service: "registry",   entity: "student",  detail: "เพิ่มข้อมูลนักศึกษาใหม่" },
];

// E6: DevOps
const SEED_PIPELINES = [
  { service: "M0 · Identity",     lastBuild: "15 นาทีที่แล้ว", status: "success", version: "v2.4.1", env: "production" },
  { service: "M1 · Curriculum",   lastBuild: "2 ชม.ที่แล้ว",   status: "success", version: "v3.1.0", env: "production" },
  { service: "M1p · Planning",    lastBuild: "1 ชม.ที่แล้ว",   status: "success", version: "v1.7.2", env: "staging" },
  { service: "M3 · Faculty",      lastBuild: "6 ชม.ที่แล้ว",   status: "success", version: "v2.0.1", env: "production" },
  { service: "M4 · Registry",     lastBuild: "30 นาทีที่แล้ว",  status: "failed",  version: "v1.9.3", env: "development" },
  { service: "M8 · Co-op",        lastBuild: "1 วันที่แล้ว",    status: "success", version: "v1.5.0", env: "production" },
  { service: "M9 · Thesis",       lastBuild: "3 ชม.ที่แล้ว",   status: "running", version: "v1.2.4", env: "staging" },
];

/* ─── Utility Functions ─── */
function notifyParentPage(pageKey) {
  if (window.parent && window.parent !== window) {
    window.parent.postMessage({ type: "m10-page", page: pageKey }, "*");
  }
}

function formatDate() {
  const now = new Date();
  const y = now.getFullYear() + 543;
  const m = String(now.getMonth() + 1).padStart(2, '0');
  const d = String(now.getDate()).padStart(2, '0');
  const h = String(now.getHours()).padStart(2, '0');
  const min = String(now.getMinutes()).padStart(2, '0');
  return `${y}-${m}-${d} ${h}:${min}`;
}