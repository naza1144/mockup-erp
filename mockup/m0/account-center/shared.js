/* ═══ shared.js — mock data + localStorage helpers ใช้ร่วมกันทุกหน้าใน mockup/m0/account-center/ ═══ */

/* Mock data ตาม Data Entities ใน data-design/m0_identity.md — account เดี่ยว (จำลองว่า login คนเดียว) */
const seedMe = {
  account_id: "a0b1c2d3-e4f5-6789-abcd-ef0123456789",
  keycloak_sub: "f1e2d3c4-b5a6-7890-fedc-ba0987654321",
  name_th_prefix: "ดร.",
  name_th_first: "วิชัย",
  name_th_last: "รักเรียน",
  name_en_prefix: "Dr.",
  name_en_first: "Wichai",
  name_en_last: "Rakrian",
  email: "wichai@ubu.ac.th",
  phone: "081-234-5678",
  dept_id: "d1e2f3a4-b5c6-7890-abcd-ef0123456789",
  dept_name: "วิศวกรรมคอมพิวเตอร์",
  type: "FACULTY",
  status: "ACTIVE",
  lang: "th",
  tz: "Asia/Bangkok",
  roles: ["faculty"],
  avatar_url: "https://api.dicebear.com/7.x/initials/svg?seed=Wichai",
  pendingAvatar: null,
};

function loadData(k, fb) { const s = localStorage.getItem(k); return s ? JSON.parse(s) : fb; }
function saveData(k, d) { localStorage.setItem(k, JSON.stringify(d)); }
function resetData() { localStorage.clear(); location.reload(); }

const STATUS_TH = { ACTIVE: "ใช้งานปกติ", SUSPENDED: "ถูกระงับ (SUSPENDED)", DEACTIVATED: "พ้นสภาพ" };
const TYPE_TH = { STUDENT: "นักศึกษา", FACULTY: "อาจารย์", STAFF: "เจ้าหน้าที่", ADMIN: "ผู้ดูแลระบบ" };
const ROLE_TH = { faculty: "อาจารย์", registrar: "เจ้าหน้าที่ทะเบียน", student: "นักศึกษา", admin: "ผู้ดูแลระบบ",
  finance_officer: "เจ้าหน้าที่การเงิน", qa_officer: "เจ้าหน้าที่ประกันคุณภาพ", coop_supervisor: "อาจารย์นิเทศสหกิจ", program_chair: "หัวหน้าหลักสูตร" };

/* บอก parent shell (index.html) ว่าอยู่หน้าไหน เพื่อไฮไลต์เมนูใน sidebar — เรียกใน <body onload> ของทุกหน้าใน pages/ */
function notifyParentPage(pageKey) {
  if (window.parent && window.parent !== window) {
    window.parent.postMessage({ type: "m0-account-page", page: pageKey }, "*");
  }
}
