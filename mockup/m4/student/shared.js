/* ═══════════════════════════════════════════════════
   shared.js — mock data + localStorage helpers ใช้ร่วมกันทุกหน้าใน mockup/m4/student/
   ตาม data-design/m4_registry.md — student self-service

   Entities ที่เกี่ยวข้อง:
     - registry.student           (โปรไฟล์นักศึกษา)
     - identity.account (M0)      (resolve ชื่อ-อีเมล)
     - curriculum.program_version (M1) (หลักสูตร)
     - faculty.instructor (M3)    (อาจารย์ที่ปรึกษา)
   ═══════════════════════════════════════════════════ */

/* ระบบจริง: M0 API — GET /api/v1/accounts */
const mockAccounts = {
  "acc-201": { account_id: "acc-201", name_th_prefix: "นาย", name_th_first: "สมชาย", name_th_last: "ใจดี",
    name_en_prefix: "Mr.", name_en_first: "Somchai", name_en_last: "Jaidee",
    email: "somchai@mail.com", phone: "081-2345678", avatar_url: "", type: "STUDENT", status: "ACTIVE",
    dept_name: "วิศวกรรมคอมพิวเตอร์" },
  "acc-202": { account_id: "acc-202", name_th_first: "วราภรณ์", name_th_last: "ตั้งใจเรียน",
    email: "waraporn@mail.com", phone: "082-3456789", type: "STUDENT" },
};

/* ระบบจริง: M1 API — GET /api/v1/curriculum/programs */
const mockPrograms = {
  "prog-cs": { program_id: "prog-cs", name_th: "วิศวกรรมคอมพิวเตอร์", program_code: "CS" },
  "prog-it": { program_id: "prog-it", name_th: "เทคโนโลยีสารสนเทศ", program_code: "IT" },
  "prog-se": { program_id: "prog-se", name_th: "วิศวกรรมซอฟต์แวร์", program_code: "SE" },
};

const mockProgramVersions = {
  "pv-cs-2569": { id: "pv-cs-2569", program_id: "prog-cs", name: "วิศวกรรมคอมพิวเตอร์ ปีการศึกษา 2569", year: 2569 },
  "pv-it-2569": { id: "pv-it-2569", program_id: "prog-it", name: "เทคโนโลยีสารสนเทศ ปีการศึกษา 2569", year: 2569 },
  "pv-se-2569": { id: "pv-se-2569", program_id: "prog-se", name: "วิศวกรรมซอฟต์แวร์ ปีการศึกษา 2569", year: 2569 },
};

/* ระบบจริง: M3 API — GET /api/v1/faculty/instructors */
const mockInstructors = {
  "inst-101": { instructor_id: "inst-101", account_id: "acc-101",
    name: "รศ.ดร. สมศักดิ์ วิชาการ", academic_rank: "ASSOC_PROF", dept_id: "dept-cs" },
  "inst-102": { instructor_id: "inst-102", account_id: "acc-102",
    name: "ผศ.ดร. สายฝน วิทยา", academic_rank: "ASST_PROF", dept_id: "dept-it" },
};

/* ═══ Seed: registry.student (นักศึกษาปัจจุบันที่ล็อกอิน) ═══ */
const seedStudents = [
  {
    student_id: "std-001-aaaa-bbbb-cccc-000000000001",
    student_code: "6601001",
    account_id: "acc-201",
    application_id: "a1b2c3d4-1111-4000-8000-000000000001",
    program_id: "prog-cs",
    program_version_id: "pv-cs-2569",
    enrolled_year: 2566,
    enrolled_semester: 1,
    status: "ENROLLED",
    expected_grad_year: 2570,
    advisor_id: "inst-101",
    gpa: 3.45,
    credits_earned: 72,
    total_credits: 140,
    created_at: "2026-03-01T09:00:00Z",
    updated_at: "2026-06-15T10:30:00Z"
  }
];

const STUDENT_STATUS_TH = {
  ENROLLED: "กำลังศึกษา",
  LEAVE: "ลาพัก",
  TEMP_LEAVE: "ลาชั่วคราว",
  RESIGNED: "สละสิทธิ์",
  EXPELLED: "ถูกไล่ออก",
  GRADUATED: "สำเร็จการศึกษา"
};

const STUDENT_STATUS_BADGE = {
  ENROLLED: "bg-green-100 text-green-700",
  LEAVE: "bg-amber-100 text-amber-700",
  TEMP_LEAVE: "bg-amber-100 text-amber-700",
  RESIGNED: "bg-gray-100 text-gray-600",
  EXPELLED: "bg-red-100 text-red-700",
  GRADUATED: "bg-blue-100 text-blue-700"
};

const ENROLLED_SEMESTER_TH = { 1: "ภาคต้น", 2: "ภาคปลาย", 3: "ภาคฤดูร้อน" };

function loadData(k, fb) { const s = localStorage.getItem(k); return s ? JSON.parse(s) : fb; }
function saveData(k, d) { localStorage.setItem(k, JSON.stringify(d)); }
function resetData() { localStorage.clear(); location.reload(); }

/* resolve ชื่อจาก M0 API */
function getAccountName(accountId) {
  const acct = mockAccounts[accountId];
  if (!acct) return accountId;
  const prefix = acct.name_th_prefix ? acct.name_th_prefix + " " : "";
  return prefix + (acct.name_th_first || "") + " " + (acct.name_th_last || "");
}

function notifyParentPage(pageKey) {
  if (window.parent && window.parent !== window) {
    window.parent.postMessage({ type: "m4-student-page", page: pageKey }, "*");
  }
}