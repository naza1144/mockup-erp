/* ═══ shared.js — mock data + localStorage helpers ใช้ร่วมกันทุกหน้าใน mockup/m8/company/ ═══ */

function loadData(k, fb) { const s = localStorage.getItem(k); return s ? JSON.parse(s) : fb; }
function saveData(k, d) { localStorage.setItem(k, JSON.stringify(d)); }
function resetData() { localStorage.clear(); location.reload(); }

const seedStudents = [
  { id: 1, name: "ธนกร มุ่งมั่น", code: "6401003", position: "Backend Developer", startDate: "2569-05-01", endDate: "2569-09-01", evaluation: null },
  { id: 2, name: "ปิยะพงษ์ ขยันเรียน", code: "6401004", position: "QA Tester", startDate: "2569-05-01", endDate: "2569-09-01", evaluation: null },
];

/* บอก parent shell (index.html) ว่าอยู่หน้าไหน เพื่อไฮไลต์เมนูใน sidebar — เรียกใน <body onload> ของทุกหน้าใน pages/ */
function notifyParentPage(pageKey) {
  if (window.parent && window.parent !== window) {
    window.parent.postMessage({ type: "m8-company-page", page: pageKey }, "*");
  }
}
