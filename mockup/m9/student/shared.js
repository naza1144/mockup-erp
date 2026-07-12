/* ═══ shared.js — mock data + localStorage helpers ใช้ร่วมกันทุกหน้าใน mockup/m9/student/ ═══ */

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
const MILESTONE_NAMES = [
  { name: "Proposal", due_date: "2569-08-15" },
  { name: "บทที่ 1-3", due_date: "2569-09-30" },
  { name: "เก็บข้อมูล", due_date: "2569-11-15" },
  { name: "วิเคราะห์ผล", due_date: "2570-01-15" },
  { name: "ร่างเล่ม", due_date: "2570-03-01" },
];
const MS_TH = { NOT_STARTED: "ยังไม่เริ่ม", PENDING_REVIEW: "รอที่ปรึกษาตรวจ", APPROVED: "อนุมัติแล้ว", NEEDS_REVISION: "ต้องแก้ไข" };
const MS_BADGE = { NOT_STARTED: "bg-gray-100 text-gray-500", PENDING_REVIEW: "bg-amber-100 text-amber-700",
  APPROVED: "bg-green-100 text-green-700", NEEDS_REVISION: "bg-red-100 text-red-700" };
const COMMITTEE_ROLE_TH = { CHAIR: "ประธาน", MEMBER: "กรรมการ", EXTERNAL: "กรรมการภายนอก" };
const DEFENSE_TYPE_TH = { PROPOSAL: "สอบเค้าโครง", FINAL: "สอบจบ" };
const MODE_TH = { ONSITE: " onsite", ONLINE: " online", HYBRID: " hybrid" };

function loadData(k, fb) { const s = localStorage.getItem(k); return s ? JSON.parse(s) : fb; }
function saveData(k, d) { localStorage.setItem(k, JSON.stringify(d)); }
function resetData() { localStorage.clear(); location.reload(); }

const seedRepo = [
  { title: "การพัฒนาระบบจัดตารางเรียนอัตโนมัติด้วยขั้นตอนวิธีเชิงพันธุกรรม", year: 2567, keywords: "genetic algorithm, scheduling" },
  { title: "ระบบตรวจจับความผิดปกติเครือข่ายด้วย Machine Learning", year: 2568, keywords: "network security, machine learning" },
];
const seedDefenses = [
  { title: "ระบบแนะนำวิชาเลือกด้วย AI", type: "PROPOSAL", datetime: "2569-07-25 13:00", duration: 120, mode: "ONSITE", room: "ห้องประชุม 1 (ชั้น 3)", committee: [{ name: "อ.วาโย ปุยะติ", role: "CHAIR" }, { name: "ผศ.วาสนา เหง้าเกษ", role: "MEMBER" }] },
  { title: "แอปพลิเคชันติดตามสุขภาพนักศึกษา", type: "FINAL", datetime: "2569-08-02 09:00", duration: 120, mode: "HYBRID", room: "ห้องประชุม 2 (ชั้น 3)", committee: [{ name: "รศ.ชยาพร แก่นสาร์", role: "CHAIR" }, { name: "อ.วาโย ปุยะติ", role: "MEMBER" }, { name: "ดร.วิชิต สมบัติ", role: "EXTERNAL" }] },
];

/* บอก parent shell (index.html) ว่าอยู่หน้าไหน เพื่อไฮไลต์เมนูใน sidebar — เรียกใน <body onload> ของทุกหน้าใน pages/ */
function notifyParentPage(pageKey) {
  if (window.parent && window.parent !== window) {
    window.parent.postMessage({ type: "m9-student-page", page: pageKey }, "*");
  }
}
