/* ═══ shared.js — mock data + localStorage helpers ใช้ร่วมกันทุกหน้าใน mockup/m3/ ═══ */

/* Mock data ตาม Data Entities ใน data-design/m3_faculty.md เท่านั้น */
/* UUID generator helper */
function genId() { return crypto.randomUUID ? crypto.randomUUID() : "uuid-" + Date.now() + "-" + Math.random().toString(36).slice(2, 10); }

/* faculty.instructor — ตาม data-design: instructor_id, account_id, academic_rank, dept_id, status, hired_at */
/* BR-M3-002: ห้าม store name/email/phone/avatar — resolve จาก M0 API (mockM0Accounts) */
const seedInstructors = [
  { instructor_id: "inst-1001-aaaa-bbbb-cccc-000000000001", account_id: "acc-101", academic_rank: "ASST_PROF", dept_id: "dept-cs", status: "FULL_TIME",
    hired_at: "2015-06-01", quals: [{ level: "DOCTORAL", field: "Computer Science", institute: "มหาวิทยาลัยขอนแก่น", country: "Thailand", year_completed: 2557 }] },
  { instructor_id: "inst-1002-aaaa-bbbb-cccc-000000000002", account_id: "acc-102", academic_rank: "LECTURER", dept_id: "dept-cs", status: "PART_TIME",
    hired_at: "2020-01-15", quals: [] },
];

/* identity.department — shared master data (M0) */
const mockDepartments = {
  "dept-cs": { dept_id: "dept-cs", name_th: "วิศวกรรมคอมพิวเตอร์", name_en: "Computer Engineering" },
  "dept-it": { dept_id: "dept-it", name_th: "เทคโนโลยีสารสนเทศ", name_en: "Information Technology" },
  "dept-se": { dept_id: "dept-se", name_th: "วิศวกรรมซอฟต์แวร์", name_en: "Software Engineering" },
};

/* ระบบจริง: ค้นหาบัญชีผ่าน M0 — GET /accounts?role=faculty (M0 UC-11) แล้ว consume event account.synced */
const mockM0Accounts = [
  { account_id: "acc-101", name_th_first: "วิชัย", name_th_last: "รักเรียน", email: "wichai@ubu.ac.th", type: "FACULTY" },
  { account_id: "acc-102", name_th_first: "มานี", name_th_last: "มีวินัย", email: "manee@ubu.ac.th", type: "FACULTY" },
];

/* faculty.expertise_tag — master list */
const seedExpertiseTags = [
  { tag_id: "tag-ai-001", name: "AI/ML", description: "ปัญญาประดิษฐ์และการเรียนรู้ของเครื่อง" },
  { tag_id: "tag-iot-002", name: "IoT", description: "อินเทอร์เน็ตของสรรพสิ่ง" },
  { tag_id: "tag-se-003", name: "Software Engineering", description: "วิศวกรรมซอฟต์แวร์" },
  { tag_id: "tag-de-004", name: "Data Engineering", description: "วิศวกรรมข้อมูล" },
  { tag_id: "tag-cyber-005", name: "Cybersecurity", description: "ความมั่นคงปลอดภัยไซเบอร์" },
  { tag_id: "tag-hci-006", name: "HCI", description: "ปฏิสัมพันธ์ระหว่างมนุษย์กับคอมพิวเตอร์" },
];

/* faculty.instructor_expertise — M:N junction */
const seedInstructorExpertise = [
  { instructor_id: "inst-1001-aaaa-bbbb-cccc-000000000001", tag_id: "tag-ai-001" },
];

/* Helpers — resolve name จาก M0 API (BR-M3-002) */
function getInstructorName(accountId) {
  const acct = mockM0Accounts.find((a) => a.account_id === accountId);
  return acct ? acct.name_th_first + " " + acct.name_th_last : accountId;
}
function getDeptName(deptId) {
  const dept = mockDepartments[deptId];
  return dept ? dept.name_th : deptId;
}

const ACADEMIC_RANK_TH = { LECTURER: "อาจารย์", ASST_PROF: "ผู้ช่วยศาสตราจารย์", ASSOC_PROF: "รองศาสตราจารย์", PROF: "ศาสตราจารย์" };
const ACADEMIC_RANK_OPTIONS = ["LECTURER", "ASST_PROF", "ASSOC_PROF", "PROF"];
const QUAL_LEVEL_TH = { BACHELOR: "ป.ตรี", MASTER: "ป.โท", DOCTORAL: "ป.เอก" };
const QUAL_LEVEL_OPTIONS = ["BACHELOR", "MASTER", "DOCTORAL"];
const STATUS_TH = { FULL_TIME: "ประจำ", PART_TIME: "พิเศษ", STUDY_LEAVE: "ลาศึกษาต่อ", RETIRED: "เกษียณ", TERMINATED: "พ้นสภาพ" };
const STATUS_BADGE = {
  FULL_TIME: "bg-green-100 text-green-700", PART_TIME: "bg-amber-100 text-amber-700",
  STUDY_LEAVE: "bg-amber-100 text-amber-700", RETIRED: "bg-gray-100 text-gray-600", TERMINATED: "bg-red-100 text-red-700",
};

function loadData(k, fb) { const s = localStorage.getItem(k); return s ? JSON.parse(s) : fb; }
function saveData(k, d) { localStorage.setItem(k, JSON.stringify(d)); }
function resetData() { localStorage.clear(); location.reload(); }

function notifyParentPage(pageKey) {
  if (window.parent && window.parent !== window) {
    window.parent.postMessage({ type: "m3-page", page: pageKey }, "*");
  }
}