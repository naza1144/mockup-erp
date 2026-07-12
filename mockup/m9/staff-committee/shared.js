/* ═══ shared.js — mock data + localStorage helpers ใช้ร่วมกันทุกหน้าใน mockup/m9/staff-committee/ ═══ */

/* ระบบจริง: ดึงจาก M3 · Faculty — GET /instructors?expertise=&available= */
const mockInstructors = [
  { id: 101, name: "อ.วาโย ปุยะติ", expertise: "AI/ML" },
  { id: 102, name: "ผศ.วาสนา เหง้าเกษ", expertise: "Software Engineering" },
  { id: 103, name: "รศ.ชยาพร แก่นสาร์", expertise: "Data Engineering" },
  { id: 104, name: "ดร.ทศพร อเลิร์ป", expertise: "Software Architecture" },
  { id: 105, name: "ดร.วิชิต สมบัติ", expertise: "IoT" },
  { id: 106, name: "ผศ.ดร.สุภาวดี หิรัญพงศ์สิน", expertise: "Database Systems" },
  { id: 107, name: "ดร.เกรียงศักดิ์ ตรีประพิณ", expertise: "Information Systems" },
  { id: 108, name: "อ.วันนเรศวร์ สิงหัษฐิต", expertise: "Software Quality" },
];
const MOCK_ROOMS = ["ห้องประชุม 1 (ชั้น 3)", "ห้องประชุม 2 (ชั้น 3)", "ห้อง Sandbox IoT"];
const CANDIDATE_SLOTS = ["จ 21 ก.ค. 13:00-14:30", "จ 21 ก.ค. 15:00-16:30", "พ 23 ก.ค. 09:00-10:30", "พ 23 ก.ค. 13:00-14:30", "ศ 25 ก.ค. 10:00-11:30", "ศ 25 ก.ค. 14:00-15:30"];
const MILESTONE_NAMES = [
  { name: "Proposal", due_date: "2569-08-15" },
  { name: "บทที่ 1-3", due_date: "2569-09-30" },
  { name: "เก็บข้อมูล", due_date: "2569-11-15" },
  { name: "วิเคราะห์ผล", due_date: "2570-01-15" },
  { name: "ร่างเล่ม", due_date: "2570-03-01" },
];
const MS_TH = { NOT_STARTED: "ยังไม่เริ่ม", PENDING_REVIEW: "รอตรวจ", APPROVED: "อนุมัติแล้ว", NEEDS_REVISION: "ต้องแก้ไข" };
const MS_BADGE = { NOT_STARTED: "bg-gray-100 text-gray-500", PENDING_REVIEW: "bg-amber-100 text-amber-700",
  APPROVED: "bg-green-100 text-green-700", NEEDS_REVISION: "bg-red-100 text-red-700" };
const RESULT_TH = { PASS: "ผ่าน", PASS_WITH_REVISION: "ผ่านมีแก้ไข", FAIL: "ไม่ผ่าน" };
const DEFENSE_TYPE_TH = { PROPOSAL: "สอบเค้าโครง", PROGRESS: "สอบความก้าวหน้า", FINAL: "สอบจบ" };
const MODE_TH = { ONSITE: " onsite", ONLINE: " online", HYBRID: " hybrid" };
const COMMITTEE_ROLE_TH = { CHAIR: "ประธาน", MEMBER: "กรรมการ", EXTERNAL: "กรรมการภายนอก" };
const DEFENSE_STATUS_TH = { SCHEDULED: "กำหนดแล้ว", COMPLETED: "เสร็จสิ้น", CANCELLED: "ยกเลิก" };
const STATUS_BADGE = { DRAFT: "bg-gray-100 text-gray-500", TOPIC_SUBMITTED: "bg-amber-100 text-amber-700", SUBMITTED: "bg-amber-100 text-amber-700", TOPIC_APPROVED: "bg-green-100 text-green-700", APPROVED: "bg-green-100 text-green-700", TOPIC_REJECTED: "bg-red-100 text-red-700", REJECTED: "bg-red-100 text-red-700", IN_PROGRESS: "bg-blue-100 text-blue-700", PROPOSAL_PASSED: "bg-purple-100 text-purple-700", COMPLETED: "bg-green-100 text-green-700" };
const STATUS_TH = { DRAFT: "ร่าง", TOPIC_SUBMITTED: "รอพิจารณา", SUBMITTED: "รอพิจารณา", TOPIC_APPROVED: "อนุมัติแล้ว", APPROVED: "อนุมัติแล้ว", TOPIC_REJECTED: "ตีกลับ", REJECTED: "ตีกลับ", IN_PROGRESS: "กำลังดำเนินการ", PROPOSAL_PASSED: "สอบเค้าโครงผ่าน", COMPLETED: "สำเร็จ" };

/* กรรมการที่ login อยู่ตอนนี้ (จำลอง) — ใช้ id 101 เพื่อสาธิต UC-05/UC-17 */
const ME_INSTRUCTOR_ID = 101;

function loadData(k, fb) { const s = localStorage.getItem(k); return s ? JSON.parse(s) : fb; }
function saveData(k, d) { localStorage.setItem(k, JSON.stringify(d)); }
function resetData() { localStorage.clear(); location.reload(); }
function instrName(id) { return mockInstructors.find((i) => i.id === id)?.name ?? "-"; }
function newMilestones() { return MILESTONE_NAMES.map((n) => ({ name: n.name, due_date: n.due_date, status: "NOT_STARTED", file: null, docType: null, version: 0 })); }

const seedTheses = [
  { id: 1, title: "ระบบแนะนำวิชาเลือกด้วย AI", student: "ราชภัฏ บุญรอด", program: "CS-2566", academicYear: 2569, status: "SUBMITTED", advisorIds: [101], comment: "",
    topicHistory: [{ titleTh: "ระบบแนะนำวิชาเลือกด้วย AI", titleEn: "AI Course Recommender", reason: "เสนอหัวข้อครั้งแรก", changed_by: "นักศึกษา", changed_at: "2026-06-15T08:00:00Z" }],
    committee: [], committeeRoles: {}, defenses: [], milestones: newMilestones(), documents: [], scoreCriteria: {} },
  { id: 2, title: "แอปพลิเคชันติดตามสุขภาพนักศึกษา", student: "ชานนท์ สายแจ้", program: "CE-2562", academicYear: 2569, status: "APPROVED", advisorIds: [102], comment: "",
    topicHistory: [{ titleTh: "แอปพลิเคชันติดตามสุขภาพนักศึกษา", titleEn: "Student Health Tracker", reason: "เสนอหัวข้อครั้งแรก", changed_by: "นักศึกษา", changed_at: "2026-06-10T10:30:00Z" }],
    committee: [101, 103], committeeRoles: { 101: "CHAIR", 103: "MEMBER" },
    milestones: [
      { name: "Proposal", due_date: "2569-08-15", status: "PENDING_REVIEW", file: "proposal_v2.pdf", docType: "PROPOSAL", version: 2 },
      { name: "บทที่ 1-3", due_date: "2569-09-30", status: "NOT_STARTED", file: null, docType: null, version: 0 },
      { name: "เก็บข้อมูล", due_date: "2569-11-15", status: "NOT_STARTED", file: null, docType: null, version: 0 },
      { name: "วิเคราะห์ผล", due_date: "2570-01-15", status: "NOT_STARTED", file: null, docType: null, version: 0 },
      { name: "ร่างเล่ม", due_date: "2570-03-01", status: "NOT_STARTED", file: null, docType: null, version: 0 },
    ],
    documents: [
      { doc_type: "PROPOSAL", version: 2, original_filename: "proposal_v2.pdf", uploaded_by: "นักศึกษา", uploaded_at: "2026-07-01T14:00:00Z", status: "PENDING_REVIEW", file_size_bytes: 2457600, mime_type: "application/pdf" },
      { doc_type: "FULL_THESIS", version: 1, original_filename: "chapter1-3_draft.pdf", uploaded_by: "นักศึกษา", uploaded_at: "2026-07-10T09:30:00Z", status: "PENDING_REVIEW", file_size_bytes: 5120000, mime_type: "application/pdf" },
    ],
    defenses: [
      { type: "PROPOSAL", datetime: "2569-07-25 13:00", duration: 120, mode: "ONSITE", room: "ห้องประชุม 1 (ชั้น 3)", status: "SCHEDULED", result: null, due: true, scores: {} },
      { type: "PROGRESS", seq: 1, datetime: "2569-10-15 09:00", duration: 90, mode: "ONSITE", room: "ห้องประชุม 1 (ชั้น 3)", status: "COMPLETED", result: "PASS", due: false, scores: { 101: { total: 82 }, 103: { total: 85 } } },
    ] },
  { id: 3, title: "ระบบตรวจจับความผิดปกติเครือข่ายด้วย ML", student: "พีรวัส กองทรัพท์", program: "CS-2566", academicYear: 2569, status: "APPROVED", advisorIds: [103], comment: "",
    topicHistory: [{ titleTh: "ระบบตรวจจับความผิดปกติเครือข่ายด้วย ML", titleEn: "Network Anomaly Detection", reason: "เสนอหัวข้อครั้งแรก", changed_by: "นักศึกษา", changed_at: "2026-05-20T09:00:00Z" }],
    committee: [101, 102, 104], committeeRoles: { 101: "CHAIR", 102: "MEMBER", 104: "EXTERNAL" },
    milestones: MILESTONE_NAMES.map((n) => ({ name: n.name, due_date: n.due_date, status: "APPROVED", file: n.name + ".pdf", docType: "FULL_THESIS", version: 1 })),
    documents: [
      { doc_type: "PROPOSAL", version: 3, original_filename: "proposal_final.pdf", uploaded_by: "นักศึกษา", uploaded_at: "2026-06-01T10:00:00Z", status: "APPROVED", file_size_bytes: 1024000, mime_type: "application/pdf" },
      { doc_type: "FULL_THESIS", version: 1, original_filename: "thesis_draft.pdf", uploaded_by: "นักศึกษา", uploaded_at: "2026-07-15T16:00:00Z", status: "APPROVED", file_size_bytes: 8192000, mime_type: "application/pdf" },
    ],
    defenses: [
      { type: "PROPOSAL", datetime: "2569-05-10 09:00", duration: 120, mode: "ONSITE", room: "ห้องประชุม 2 (ชั้น 3)", status: "COMPLETED", result: "PASS", due: false, scores: { 101: { total: 85 }, 102: { total: 88 }, 104: { total: 82 } } },
      { type: "PROGRESS", seq: 1, datetime: "2569-07-20 10:00", duration: 90, mode: "ONLINE", room: "ห้องประชุม 2 (ชั้น 3)", status: "COMPLETED", result: "PASS", due: false, scores: { 101: { total: 78 }, 102: { total: 80 }, 104: { total: 75 } } },
      { type: "FINAL", datetime: "2569-08-02 09:00", duration: 120, mode: "HYBRID", room: "ห้องประชุม 2 (ชั้น 3)", status: "SCHEDULED", result: null, due: true, scores: {} },
    ] },
];

function defaultCriteria() {
  return {
    proposal: [{ name: "เนื้อหา", weight: 40 }, { name: "ระเบียบวิธี", weight: 30 }, { name: "การนำเสนอ", weight: 20 }, { name: "รูปเล่ม", weight: 10 }],
    progress: [{ name: "ความก้าวหน้า", weight: 40 }, { name: "การนำเสนอ", weight: 30 }, { name: "การตอบคำถาม", weight: 30 }],
    final: [{ name: "เนื้อหา", weight: 30 }, { name: "ระเบียบวิธี", weight: 25 }, { name: "การนำเสนอ", weight: 20 }, { name: "การตอบคำถาม", weight: 15 }, { name: "รูปเล่ม", weight: 10 }],
  };
}

/* บอก parent shell (index.html) ว่าอยู่หน้าไหน เพื่อไฮไลต์เมนูใน sidebar — เรียกใน <body onload> ของทุกหน้าใน pages/ */
function notifyParentPage(pageKey) {
  if (window.parent && window.parent !== window) {
    window.parent.postMessage({ type: "m9-sc-page", page: pageKey }, "*");
  }
}
