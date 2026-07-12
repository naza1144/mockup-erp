/* ═══ shared.js — mock data + localStorage helpers ใช้ร่วมกันทุกหน้าใน mockup/m0/admin-console/ ═══ */

/* ═══ Mock data ตาม Data Entities ใน data-design/m0_identity.md ═══ */
const ADMIN_ID = "e5f6a7b8-c9d0-1234-efab-012345678901"; /* admin จำลอง */
const NOW = new Date().toISOString();

const seedAccounts = [
  { account_id: "a0b1c2d3-e4f5-6789-abcd-ef0123456789", keycloak_sub: "f1e2d3c4-b5a6-7890-fedc-ba0987654321",
    name_th_prefix: "ดร.", name_th_first: "วิชัย", name_th_last: "รักเรียน",
    name_en_prefix: "Dr.", name_en_first: "Wichai", name_en_last: "Rakrian",
    email: "wichai@ubu.ac.th", phone: "081-234-5678",
    dept_id: "d1e2f3a4-b5c6-7890-abcd-ef0123456789",
    type: "FACULTY", status: "ACTIVE", lang: "th", timezone: "Asia/Bangkok",
    avatar_url: "account-avatars/a0b1c2d3-e4f5-6789-abcd-ef0123456789/thumb.jpg",
    created_at: "2025-01-15T08:30:00+07:00", updated_at: "2026-03-10T14:20:00+07:00",
    roles: [
      { code: "faculty", granted_by: ADMIN_ID, granted_at: "2025-01-15T08:30:00+07:00" }
    ],
    permissions: [] },
  { account_id: "b2c3d4e5-f6a7-8901-bcde-f01234567890", keycloak_sub: "a2b3c4d5-e6f7-8901-abcd-ef0123456789",
    name_th_prefix: "", name_th_first: "สมศรี", name_th_last: "ใจงาม",
    name_en_prefix: "", name_en_first: "Somsri", name_en_last: "Jaingam",
    email: "somsri@ubu.ac.th", phone: "082-345-6789",
    dept_id: "a1b2c3d4-e5f6-7890-abcd-ef0123456789",
    type: "STUDENT", status: "ACTIVE", lang: "th", timezone: "Asia/Bangkok",
    avatar_url: null,
    created_at: "2025-06-01T09:00:00+07:00", updated_at: "2026-02-20T11:30:00+07:00",
    roles: [
      { code: "student", granted_by: ADMIN_ID, granted_at: "2025-06-01T09:00:00+07:00" }
    ],
    permissions: [] },
  { account_id: "c3d4e5f6-a7b8-9012-cdef-012345678901", keycloak_sub: "b3c4d5e6-f7a8-9012-bcde-f01234567890",
    name_th_prefix: "", name_th_first: "อรุณ", name_th_last: "ทำงานดี",
    name_en_prefix: "", name_en_first: "Arun", name_en_last: "Thamngandee",
    email: "arun@ubu.ac.th", phone: "083-456-7890",
    dept_id: "d1e2f3a4-b5c6-7890-abcd-ef0123456789",
    type: "STAFF", status: "ACTIVE", lang: "th", timezone: "Asia/Bangkok",
    avatar_url: null,
    created_at: "2024-11-01T10:00:00+07:00", updated_at: "2026-01-15T16:45:00+07:00",
    roles: [
      { code: "registrar", granted_by: ADMIN_ID, granted_at: "2024-11-01T10:00:00+07:00" }
    ],
    permissions: [] },
  { account_id: "d4e5f6a7-b8c9-0123-defa-0123456789012", keycloak_sub: "c4d5e6f7-a8b9-0123-cdef-012345678901",
    name_th_prefix: "ผศ.ดร.", name_th_first: "สมหญิง", name_th_last: "ใจดี",
    name_en_prefix: "Asst.Prof.Dr.", name_en_first: "Somying", name_en_last: "Jaidee",
    email: "somying@ubu.ac.th", phone: "084-567-8901",
    dept_id: "e3f4a5b6-c7d8-9012-efab-012345678901",
    type: "FACULTY", status: "SUSPENDED", lang: "th", timezone: "Asia/Bangkok",
    avatar_url: "account-avatars/d4e5f6a7-b8c9-0123-defa-0123456789012/thumb.jpg",
    created_at: "2024-08-20T07:30:00+07:00", updated_at: "2026-06-01T09:15:00+07:00",
    roles: [
      { code: "faculty", granted_by: ADMIN_ID, granted_at: "2024-08-20T07:30:00+07:00" },
      { code: "program_chair", granted_by: ADMIN_ID, granted_at: "2025-03-01T13:00:00+07:00" }
    ],
    permissions: [
      { id: "p001", scope: "curriculum:write", granted_by: ADMIN_ID, granted_at: "2025-03-01T13:00:00+07:00" }
    ] },
];
const seedRoles = [
  { code: "admin", name: "ผู้ดูแลระบบ", desc: "สิทธิ์สูงสุด จัดการทั้งระบบ", created_at: "2024-01-01T00:00:00+07:00", updated_at: "2024-01-01T00:00:00+07:00" },
  { code: "faculty", name: "อาจารย์", desc: "จัดการข้อมูลวิชาชีพ/สอน", created_at: "2024-01-01T00:00:00+07:00", updated_at: "2024-01-01T00:00:00+07:00" },
  { code: "registrar", name: "เจ้าหน้าที่ทะเบียน", desc: "งานรับสมัคร/ทะเบียนนักศึกษา", created_at: "2024-01-01T00:00:00+07:00", updated_at: "2024-01-01T00:00:00+07:00" },
  { code: "student", name: "นักศึกษา", desc: "ผู้เรียน", created_at: "2024-01-01T00:00:00+07:00", updated_at: "2024-01-01T00:00:00+07:00" },
  { code: "finance_officer", name: "เจ้าหน้าที่การเงิน", desc: "อนุมัติ/ตรวจสอบการเงิน", created_at: "2024-01-01T00:00:00+07:00", updated_at: "2024-01-01T00:00:00+07:00" },
  { code: "qa_officer", name: "เจ้าหน้าที่ประกันคุณภาพ", desc: "งานประกันคุณภาพหลักสูตร", created_at: "2024-01-01T00:00:00+07:00", updated_at: "2024-01-01T00:00:00+07:00" },
  { code: "coop_supervisor", name: "อาจารย์นิเทศสหกิจ", desc: "ดูแลนักศึกษาสหกิจศึกษา", created_at: "2024-01-01T00:00:00+07:00", updated_at: "2024-01-01T00:00:00+07:00" },
  { code: "program_chair", name: "หัวหน้าหลักสูตร", desc: "บริหารหลักสูตรระดับ CS", created_at: "2024-01-01T00:00:00+07:00", updated_at: "2024-01-01T00:00:00+07:00" },
];
/* CHECK constraint scope ~ '^[a-z_]+:[a-z_]+$' — ตาม data-design permission_flag */
const SCOPE_REGEX = /^[a-z_]+:[a-z_]+$/;
const STATUS_TH = { ACTIVE: "ใช้งานปกติ", SUSPENDED: "ถูกระงับ", DEACTIVATED: "พ้นสภาพ" };
const STATUS_BADGE = { ACTIVE: "bg-green-100 text-green-700", SUSPENDED: "bg-red-100 text-red-700", DEACTIVATED: "bg-gray-100 text-gray-600" };
const TYPE_TH = { STUDENT: "นักศึกษา", FACULTY: "อาจารย์", STAFF: "เจ้าหน้าที่", ADMIN: "ผู้ดูแลระบบ" };

function loadData(k, fb) { const s = localStorage.getItem(k); return s ? JSON.parse(s) : fb; }
function saveData(k, d) { localStorage.setItem(k, JSON.stringify(d)); }
function resetData() { localStorage.clear(); location.reload(); }

/* แสดงชื่อเต็มตาม data-design: [prefix] first last */
function fullNameTH(a) {
  return [a.name_th_prefix, a.name_th_first, a.name_th_last].filter(Boolean).join(" ");
}
function fullNameEN(a) {
  return [a.name_en_prefix, a.name_en_first, a.name_en_last].filter(Boolean).join(" ");
}

/* ═══ Audit helper — BR-M0-005: ทุก sensitive operation ต้องบันทึก audit ═══ */
function addAudit(who, action, targetAccountId, oldValue, newValue) {
  const auditLog = loadData("m0_admin_audit", []);
  const entry = {
    id: crypto.randomUUID ? crypto.randomUUID() : "aud-" + Date.now() + "-" + Math.random().toString(36).slice(2, 8),
    who: who,
    action: action,
    target_account_id: targetAccountId,
    old_value: oldValue || null,
    new_value: newValue || null,
    created_at: new Date().toISOString()
  };
  auditLog.push(entry);
  saveData("m0_admin_audit", auditLog);
  /* ระบบจริง: INSERT INTO identity.account_audit — append-only, REVOKE UPDATE/DELETE */
}

/* บอก parent shell (index.html) ว่าอยู่หน้าไหน เพื่อไฮไลต์เมนูใน sidebar — เรียกใน <body onload> ของทุกหน้าใน pages/ */
function notifyParentPage(pageKey) {
  if (window.parent && window.parent !== window) {
    window.parent.postMessage({ type: "m0-admin-page", page: pageKey }, "*");
  }
}
