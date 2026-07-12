/* ═══ shared.js — mock data + localStorage helpers ใช้ร่วมกันทุกหน้าใน mockup/m8/student/ ═══ */

const STATUS_TH = { APPLIED: "ส่งใบสมัครแล้ว รออนุมัติ", APPROVED: "อนุมัติแล้ว รอเริ่มฝึกงาน", INTERNING: "กำลังฝึกงาน", COMPLETED: "ฝึกงานเสร็จสิ้น", PENDING_GRADE: "รอประเมินเกรด", REJECTED: "ถูกปฏิเสธ", CANCELLED: "ยกเลิกแล้ว" };
const STEP_ORDER = ["APPLIED", "APPROVED", "INTERNING", "COMPLETED", "PENDING_GRADE"];

function loadData(k, fb) { const s = localStorage.getItem(k); return s ? JSON.parse(s) : fb; }
function saveData(k, d) { localStorage.setItem(k, JSON.stringify(d)); }
function resetData() { localStorage.clear(); location.reload(); }

const seedCompanies = [
  { id: 1, name: "บริษัท เอไอ โซลูชัน จำกัด", location: "กรุงเทพฯ", type: "IT" },
  { id: 2, name: "บริษัท ไทยการผลิต จำกัด", location: "ระยอง", type: "Manufacturing" },
  { id: 3, name: "บริษัท เซอร์วิสพลัส จำกัด", location: "อุบลราชธานี", type: "Service" },
];
let mockCompanies = loadData("m8_st_companies", seedCompanies);
const seedMe = { gpax: 2.75, credits: 95 }; /* ผ่านเกณฑ์วิชาการ (M4 mock) */
const seedTrainings = [{ id: 1, topic: "อบรมความปลอดภัยในการทำงาน", reqHours: 30, approvedHours: 30, status: "APPROVED" }];
const seedAnnouncements = [{ title: "เปิดรับสมัครสหกิจศึกษา รอบ 2/2569", content: "นักศึกษาที่มีชั่วโมงอบรมครบ 30 ชม. สามารถสมัครได้แล้ว", pinned: true, date: "2569-06-01" }];
const seedDocuments = [{ title: "คู่มือสหกิจศึกษา 2569", date: "2569-05-15" }, { title: "แบบฟอร์มรายงานรายสัปดาห์", date: "2569-05-15" }];
const seedSupervisionSlots = [
  { id: 1, date: "2026-07-15", time: "10:00", mode: "ONLINE", meetLink: "https://meet.google.com/abc-defg-hij", note: "นิเทศครั้งที่ 1", createdBy: "อาจารย์/ผจก.รายวิชา", googleAdded: false },
  { id: 2, date: "2026-07-22", time: "13:30", mode: "ONSITE", meetLink: "", note: "นักศึกษาสะดวกช่วงบ่าย", createdBy: "นักศึกษา", googleAdded: false },
];

/* บอก parent shell (index.html) ว่าอยู่หน้าไหน เพื่อไฮไลต์เมนูใน sidebar — เรียกใน <body onload> ของทุกหน้าใน pages/ */
function notifyParentPage(pageKey) {
  if (window.parent && window.parent !== window) {
    window.parent.postMessage({ type: "m8-student-page", page: pageKey }, "*");
  }
}
