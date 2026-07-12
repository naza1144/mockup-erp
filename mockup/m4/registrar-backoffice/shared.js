/* ═══════════════════════════════════════════════════
   shared.js — mock data + localStorage helpers ใช้ร่วมกันทุกหน้าใน mockup/m4/registrar-backoffice/
   ตาม data-design/m4_registry.md

   Entities:
     - registry.application       (ใบสมัคร)
     - registry.interview         (นัดสัมภาษณ์ — 1:0..1 กับ application)
     - registry.student           (โปรไฟล์นักศึกษา)
     - registry.student_status_history  (append-only log)
   ═══════════════════════════════════════════════════ */

/* ระบบจริง: Identity — M0 API: GET /api/v1/accounts?role=applicant */
const mockAccounts = {
  "acc-201": { account_id: "acc-201", name_th_first: "สมชาย", name_th_last: "ใจดี", email: "somchai@mail.com", type: "STUDENT" },
  "acc-202": { account_id: "acc-202", name_th_first: "วราภรณ์", name_th_last: "ตั้งใจเรียน", email: "waraporn@mail.com", type: "STUDENT" },
  "acc-203": { account_id: "acc-203", name_th_first: "ธนกร", name_th_last: "มุ่งมั่น", email: "thanakorn@mail.com", type: "STUDENT" },
  "acc-204": { account_id: "acc-204", name_th_first: "สมหญิง", name_th_last: "มานะ", email: "somying@mail.com", type: "STUDENT" },
};

/* ระบบจริง: Curriculum — M1 API: GET /api/v1/curriculum/programs */
const mockPrograms = {
  "prog-cs": { program_id: "prog-cs", name_th: "วิศวกรรมคอมพิวเตอร์", program_code: "CS" },
  "prog-it": { program_id: "prog-it", name_th: "เทคโนโลยีสารสนเทศ", program_code: "IT" },
  "prog-se": { program_id: "prog-se", name_th: "วิศวกรรมซอฟต์แวร์", program_code: "SE" },
};

/* ระบบจริง: Curriculum — M1 API: GET /api/v1/curriculum/program-versions */
const mockProgramVersions = {
  "pv-cs-2569": { id: "pv-cs-2569", program_id: "prog-cs", name: "วิศวกรรมคอมพิวเตอร์ ปีการศึกษา 2569", year: 2569 },
  "pv-it-2569": { id: "pv-it-2569", program_id: "prog-it", name: "เทคโนโลยีสารสนเทศ ปีการศึกษา 2569", year: 2569 },
  "pv-se-2569": { id: "pv-se-2569", program_id: "prog-se", name: "วิศวกรรมซอฟต์แวร์ ปีการศึกษา 2569", year: 2569 },
};

/* ระบบจริง: Faculty — M3 API: GET /api/v1/faculty/instructors?status=ACTIVE */
const mockInstructors = {
  "inst-101": { instructor_id: "inst-101", name: "รศ.ดร. สมศักดิ์ วิชาการ", dept_id: "dept-cs", status: "FULL_TIME" },
  "inst-102": { instructor_id: "inst-102", name: "ผศ.ดร. สายฝน วิทยา", dept_id: "dept-it", status: "FULL_TIME" },
  "inst-103": { instructor_id: "inst-103", name: "อ. ธนพล คอมพิวเตอร์", dept_id: "dept-se", status: "FULL_TIME" },
};

/* ═══ Seed: registry.application ═══ */
const seedApplications = [
  {
    application_id: "a1b2c3d4-1111-4000-8000-000000000001",
    account_id: "acc-201",
    program_id: "prog-cs",
    academic_year: 2566,
    status: "ADMITTED",
    submitted_at: "2026-01-15T08:30:00Z",
    notes: "เอกสารครบถ้วน",
    imported: true,
    studentCode: "6601001"  /* รหัสนักศึกษา 7 หลัก: 66 + CS(01) + 001 */
  },
  {
    application_id: "a1b2c3d4-2222-4000-8000-000000000002",
    account_id: "acc-202",
    program_id: "prog-it",
    academic_year: 2566,
    status: "INTERVIEW_PASSED",
    submitted_at: "2026-01-20T10:15:00Z",
    notes: "",
    imported: false
  },
  {
    application_id: "a1b2c3d4-3333-4000-8000-000000000003",
    account_id: "acc-203",
    program_id: "prog-se",
    academic_year: 2566,
    status: "INTERVIEW_FAILED",
    submitted_at: "2026-01-18T14:00:00Z",
    notes: "คะแนนสอบไม่ถึงเกณฑ์",
    imported: false
  },
];

/* ═══ Seed: registry.interview (1:0..1 กับ application) ═══ */
const seedInterviews = [
  {
    interview_id: "iv-1111-4000-8000-000000000001",
    application_id: "a1b2c3d4-1111-4000-8000-000000000001",
    interviewer_id: "inst-101",
    scheduled_at: "2026-02-01T09:00:00Z",
    mode: "ONSITE",
    meeting_url: null,
    score: 85.50,
    result: "PASS",
    remarks: "ตอบคำถามได้ดี มีความเข้าใจด้าน programming"
  },
  {
    interview_id: "iv-2222-4000-8000-000000000002",
    application_id: "a1b2c3d4-2222-4000-8000-000000000002",
    interviewer_id: "inst-102",
    scheduled_at: "2026-02-03T10:00:00Z",
    mode: "ONLINE",
    meeting_url: "https://meet.google.com/abc-defg-hij",
    score: 78.00,
    result: "PASS",
    remarks: "พื้นฐานดี ควรพัฒนาทักษะการเขียนโปรแกรมเพิ่ม"
  },
  {
    interview_id: "iv-3333-4000-8000-000000000003",
    application_id: "a1b2c3d4-3333-4000-8000-000000000003",
    interviewer_id: "inst-103",
    scheduled_at: "2026-02-02T14:00:00Z",
    mode: "ONSITE",
    meeting_url: null,
    score: 45.00,
    result: "FAIL",
    remarks: "ยังไม่พร้อม ควรกลับไปเตรียมตัวก่อน"
  },
];

/* ═══ Seed: registry.student (สร้างเมื่อ application.status = 'ADMITTED') ═══ */
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
    created_at: "2026-03-01T09:00:00Z",
    updated_at: "2026-03-01T09:00:00Z"
  }
];

/* ═══ Seed: registry.student_status_history (append-only) ═══ */
const seedStatusHistory = [
  {
    id: "sh-0001",
    student_id: "std-001-aaaa-bbbb-cccc-000000000001",
    from_status: null,
    to_status: "ENROLLED",
    changed_by: "registrar-001",  /* soft FK → identity.account */
    reason: "รับเข้าเรียนเป็นนักศึกษาใหม่",
    effective_date: "2026-03-01",
    created_at: "2026-03-01T09:00:00Z"
  }
];

const STATUS_TH = {
  SUBMITTED: "ส่งใบสมัคร",
  DOCUMENT_REVIEW: "ตรวจเอกสาร",
  INTERVIEW_SCHEDULED: "นัดสัมภาษณ์",
  INTERVIEW_PASSED: "ผ่านสัมภาษณ์",
  INTERVIEW_FAILED: "ไม่ผ่านสัมภาษณ์",
  ADMITTED: "รับเข้า",
  REJECTED: "ปฏิเสธ",
  WITHDRAWN: "ถอนใบสมัคร"
};
const STATUS_BADGE = {
  SUBMITTED: "bg-blue-100 text-blue-700",
  DOCUMENT_REVIEW: "bg-amber-100 text-amber-700",
  INTERVIEW_SCHEDULED: "bg-purple-100 text-purple-700",
  INTERVIEW_PASSED: "bg-green-100 text-green-700",
  INTERVIEW_FAILED: "bg-red-100 text-red-700",
  ADMITTED: "bg-emerald-100 text-emerald-700",
  REJECTED: "bg-gray-100 text-gray-700",
  WITHDRAWN: "bg-slate-100 text-slate-700"
};
const INTERVIEW_RESULT_TH = { PASS: "ผ่าน", FAIL: "ไม่ผ่าน", null: "—" };
const INTERVIEW_RESULT_BADGE = { PASS: "bg-green-100 text-green-700", FAIL: "bg-red-100 text-red-700", null: "bg-gray-50 text-gray-400" };

function loadData(k, fb) { const s = localStorage.getItem(k); return s ? JSON.parse(s) : fb; }
function saveData(k, d) { localStorage.setItem(k, JSON.stringify(d)); }
function resetData() { localStorage.clear(); location.reload(); }

/* บอก parent shell (index.html) ว่าอยู่หน้าไหน เพื่อไฮไลต์เมนูใน sidebar — เรียกใน <body onload> ของทุกหน้าใน pages/ */
function notifyParentPage(pageKey) {
  if (window.parent && window.parent !== window) {
    window.parent.postMessage({ type: "m4-rb-page", page: pageKey }, "*");
  }
}
