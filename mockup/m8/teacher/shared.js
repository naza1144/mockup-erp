/* ═══ shared.js — mock data + localStorage helpers ใช้ร่วมกันทุกหน้าใน mockup/m8/teacher/ ═══ */

const STATUS_TH = { APPLIED: "รออนุมัติ", APPROVED: "อนุมัติแล้ว รอเริ่มฝึกงาน", INTERNING: "กำลังฝึกงาน", COMPLETED: "ฝึกงานเสร็จสิ้น", PENDING_GRADE: "รอประเมินเกรด", REJECTED: "ถูกปฏิเสธ", CANCELLED: "ยกเลิกแล้ว" };
const STEP_ORDER = ["APPLIED", "APPROVED", "INTERNING", "COMPLETED", "PENDING_GRADE"];
const TEACHER_ACTOR = "teacher_manager";
const TEACHER_ACTOR_LABEL = "อาจารย์/ผจก.รายวิชา";
const ROLE_LABEL = { teacher_manager: TEACHER_ACTOR_LABEL, manager: TEACHER_ACTOR_LABEL, supervisor: TEACHER_ACTOR_LABEL };
/* ระบบจริง: ดึงจาก M3 · Faculty — GET /instructors?expertise=&available= */
const mockInstructors = [
  { id: 101, name: "ผศ.ดร.สมหญิง ใจดี", expertise: "IT" }, { id: 102, name: "อ.ประยุทธ ขยันสอน", expertise: "Manufacturing" }, { id: 103, name: "ดร.วิชัย รักเรียน", expertise: "Service" },
];

function loadData(k, fb) { const s = localStorage.getItem(k); return s ? JSON.parse(s) : fb; }
function saveData(k, d) { localStorage.setItem(k, JSON.stringify(d)); }
function resetData() { localStorage.clear(); location.reload(); }

const seedCompanies = [
  { id: 1, name: "บริษัท เอไอ โซลูชัน จำกัด", address: "กรุงเทพฯ", type: "IT", contact: "คุณสมศรี", phone: "02-111-2222", email: "hr@aisol.com",
    rating: 4, history: [{ year: 2568, position: "Backend Developer", count: 2 }], notes: "รับดูแลนักศึกษาดี มีพี่เลี้ยงประจำชัดเจน", account: null },
  { id: 2, name: "บริษัท ไทยการผลิต จำกัด", address: "ระยอง", type: "Manufacturing", contact: "คุณมานะ", phone: "038-222-3333", email: "hr@thaimfg.com",
    rating: 3, history: [], notes: "", account: null },
];
const seedStudents = [
  { id: 1, code: "6401001", name: "กิตติ ตั้งใจเรียน", gpax: 2.8, credits: 90,
    trainings: [{ id: 1, topic: "อบรม ปวช.สหกิจ", reqHours: 20, approvedHours: 0, status: "PENDING" }], application: null },
  { id: 2, code: "6401002", name: "วราภรณ์ ตั้งใจเรียน", gpax: 3.2, credits: 100,
    trainings: [{ id: 2, topic: "อบรมความปลอดภัย", reqHours: 30, approvedHours: 30, status: "APPROVED" }],
    application: { companyId: 1, position: "Backend Developer", caregiver: "คุณสมศรี HR", accommodation: "หอพักบริษัท", emergencyName: "นางสมใจ ตั้งใจเรียน", emergencyPhone: "081-234-5678", startDate: "2569-06-01", endDate: "2569-10-01",
      status: "APPLIED", history: [{ status: "APPLIED", date: "2569-05-20" }], supervisorId: null, visits: [], weeklyReports: [], evaluation: null, grade: null } },
  { id: 3, code: "6401003", name: "ธนกร มุ่งมั่น", gpax: 3.5, credits: 110,
    trainings: [{ id: 3, topic: "อบรมความปลอดภัย", reqHours: 30, approvedHours: 30, status: "APPROVED" }],
    application: { companyId: 2, position: "Production Assistant", caregiver: "คุณมานะ ฝ่ายผลิต", accommodation: "หอพักบริษัท", emergencyName: "นายธันวา มุ่งมั่น", emergencyPhone: "089-555-1122", startDate: "2569-05-01", endDate: "2569-09-01",
      status: "INTERNING", history: [{ status: "APPLIED", date: "2569-04-01" }, { status: "APPROVED", date: "2569-04-10" }, { status: "INTERNING", date: "2569-05-01" }],
      supervisorId: 102, visits: [{ seq: 1, date: "2569-05-15", mode: "ONSITE", summary: "นักศึกษาปรับตัวได้ดี" }],
      weeklyReports: [{ week: 1, summary: "ช่วยงานสายการผลิต", problems: "ยังไม่คุ้นเครื่องจักร", knowledge: "เรียนรู้ระบบ QC", feedback: "ตั้งใจดี", status: "SUBMITTED", comment: "" }],
      evaluation: { employer: { competence: 85, attitude: 90, quality: 80, total: 85, strengths: "ขยัน ตรงเวลา", comments: "ควรพัฒนาทักษะสื่อสาร", ackStatus: "UNREAD", canEdit: true }, advisor: null }, grade: null } },
  { id: 4, code: "6401004", name: "ปิยะพงษ์ ขยันเรียน", gpax: 3.1, credits: 108,
    trainings: [{ id: 4, topic: "อบรมเตรียมความพร้อมสหกิจ", reqHours: 30, approvedHours: 30, status: "APPROVED" }],
    application: { companyId: 1, position: "QA Tester", caregiver: "คุณสมศรี HR", accommodation: "หอพักบริษัท", emergencyName: "นายปรีชา ขยันเรียน", emergencyPhone: "086-222-3344", startDate: "2569-02-01", endDate: "2569-06-01",
      status: "PENDING_GRADE", history: [{ status: "APPLIED", date: "2569-01-05" }, { status: "APPROVED", date: "2569-01-10" }, { status: "INTERNING", date: "2569-02-01" }, { status: "COMPLETED", date: "2569-06-01" }, { status: "PENDING_GRADE", date: "2569-06-02" }],
      supervisorId: 101, visits: [{ seq: 1, date: "2569-04-10", mode: "ONLINE", summary: "การปฏิบัติงานเป็นไปตามแผน" }], weeklyReports: [],
      evaluation: { employer: { competence: 88, attitude: 92, quality: 86, total: 88.67, strengths: "รับผิดชอบงานดี", comments: "พร้อมรับการประเมินเกรด", ackStatus: "ACKNOWLEDGED", canEdit: false }, advisor: null }, grade: null } },
];
const seedAnnouncements = [{ title: "ประกาศรายชื่อบริษัทรับสมัครสหกิจ 2569", content: "ดูรายชื่อได้ที่ฐานข้อมูลบริษัท", pinned: true, date: "2569-04-01" }];
const seedDocuments = [{ title: "คู่มือสหกิจศึกษา 2569", date: "2569-05-15" }];
const seedSupervisionSlots = [
  { id: 1, date: "2026-07-15", time: "10:00", mode: "ONLINE", meetLink: "https://meet.google.com/abc-defg-hij", note: "นิเทศครั้งที่ 1", createdBy: "อาจารย์/ผจก.รายวิชา", googleAdded: false },
  { id: 2, date: "2026-07-22", time: "13:30", mode: "ONSITE", meetLink: "", note: "นักศึกษาสะดวกช่วงบ่าย", createdBy: "นักศึกษา", googleAdded: false },
];

function studentApprovedHours(s) { return s.trainings.filter((t) => t.status === "APPROVED").reduce((sum, t) => sum + t.approvedHours, 0); }

/* Mockup รวมสิทธิ์อาจารย์นิเทศและ ผจก.รายวิชาเป็น Actor เดียว */
function getActiveRole() { return TEACHER_ACTOR; }
function enforceRole() { return TEACHER_ACTOR; }

/* บอก parent shell (index.html) ว่าอยู่หน้าไหน เพื่อไฮไลต์เมนูใน sidebar — เรียกใน <body onload> ของทุกหน้าใน pages/ */
function notifyParentPage(pageKey) {
  if (window.parent && window.parent !== window) {
    window.parent.postMessage({ type: "m8-teacher-page", page: pageKey }, "*");
  }
}
