/* ═══ shared.js — mock data + localStorage helpers ใช้ร่วมกันทุกหน้าใน mockup/m4/applicant/ ═══ */

/* Mock data ตาม Data Entities ใน fn req/m4_student_registry.md — application ของผู้สมัครรายนี้ */
const STAGE_TH = { APPLIED: "ส่งใบสมัครแล้ว รอนัดสัมภาษณ์", INTERVIEW_SCHEDULED: "นัดสัมภาษณ์แล้ว (ออนไลน์ 10:00 น. วันที่ 20 ก.ค. 2569)",
  PASSED: "ผลสัมภาษณ์: ผ่าน — รอเข้าสู่ขั้นตอนขึ้นทะเบียนนักศึกษา", FAILED: "ผลสัมภาษณ์: ไม่ผ่าน" };
const STAGE_ORDER = ["APPLIED", "INTERVIEW_SCHEDULED", "RESULT"];

function loadData(k, fb) { const s = localStorage.getItem(k); return s ? JSON.parse(s) : fb; }
function saveData(k, d) { localStorage.setItem(k, JSON.stringify(d)); }
function resetData() { localStorage.clear(); location.reload(); }

/* บอก parent shell (index.html) ว่าอยู่หน้าไหน — เรียกใน <body onload> ของทุกหน้าใน pages/ */
function notifyParentPage(pageKey) {
  if (window.parent && window.parent !== window) {
    window.parent.postMessage({ type: "m4-applicant-page", page: pageKey }, "*");
  }
}
