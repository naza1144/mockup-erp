/* ═══ shared.js — mock data + localStorage helpers ใช้ร่วมกันทุกหน้าใน mockup/m4/interview/ ═══ */

/* ===== Mock Data — ตาม Data Design M4 Registry §2 ===== */
const STATUS = {
  WAITING:  'WAITING',
  CALLED:   'CALLED',    // ถูกเรียกแล้ว → กำลังสัมภาษณ์
  DONE:     'DONE',
  SKIPPED:  'SKIPPED'
};
const MODE = { ONLINE: 'online', ONSITE: 'onsite' };
const DECISION = { PASS: 'PASS', FAIL: 'FAIL' };

const MOCK_PROGRAMS = ['วิทยาการข้อมูลและนวัตกรรมซอฟต์แวร์'];

// seed data: walk-in queue for today
const seedQueue = [
  { id: 1, name: 'กวิณชฎา มีศรี',            email: 'somchai@ubu.ac.th',   phone: '081-234-5678', program: 'วิทยาการข้อมูลและนวัตกรรมซอฟต์แวร์', mode: 'online', link: 'https://meet.example.com/room-1', place: null,   status: 'WAITING',   arrivedAt: '09:15', score: null, decision: null, comment: null },
  { id: 2, name: 'กายทิพย์ กฤษณะเดชา',    email: 'waraporn@ubu.ac.th', phone: '082-345-6789', program: 'วิทยาการข้อมูลและนวัตกรรมซอฟต์แวร์',   mode: 'onsite', link: null, place: 'ห้อง 301 ตึกวิศวกรรม',  status: 'WAITING',   arrivedAt: '09:22', score: null, decision: null, comment: null },
  { id: 3, name: 'จริยา คำภูแก้ว',          email: 'thanakorn@ubu.ac.th',phone: '083-456-7890', program: 'วิทยาการข้อมูลและนวัตกรรมซอฟต์แวร์',   mode: 'online', link: 'https://meet.example.com/room-3', place: null,   status: 'CALLED',    arrivedAt: '08:50', score: null, decision: null, comment: null },
  { id: 4, name: 'ชัยอนันต์ บุญเรืองศรี',      email: 'orathai@ubu.ac.th', phone: '084-567-8901', program: 'วิทยาการข้อมูลและนวัตกรรมซอฟต์แวร์', mode: 'onsite', link: null, place: 'ห้องสัมภาษณ์ 2',        status: 'DONE',     arrivedAt: '08:30', score: 85,   decision: 'PASS', comment: 'มีความพร้อมดี' },
  { id: 5, name: 'ชานนท์ สายแจ้',     email: 'piyapong@ubu.ac.th',phone: '085-678-9012', program: 'วิทยาการข้อมูลและนวัตกรรมซอฟต์แวร์',   mode: 'online', link: 'https://meet.example.com/room-5', place: null,   status: 'DONE',     arrivedAt: '08:00', score: 62,   decision: 'FAIL', comment: 'ต้องปรับปรุงด้านเทคนิค' },
  { id: 7, name: 'ปุณยพัฒน์ โกทัน',         email: 'noppadol@ubu.ac.th',phone: '087-890-1234', program: 'วิทยาการข้อมูลและนวัตกรรมซอฟต์แวร์', mode: 'online', link: 'https://meet.example.com/room-7', place: null,   status: 'WAITING',   arrivedAt: '10:05', score: null, decision: null, comment: null },
];

/* ===== Storage helpers ===== */
function loadData(k, fb) { const s = localStorage.getItem(k); return s ? JSON.parse(s) : fb; }
function saveData(k, d) { localStorage.setItem(k, JSON.stringify(d)); }
function resetData() { localStorage.clear(); location.reload(); }

/* โหลด + normalize คิว (เทียบ init() เดิม) — เรียกในทุกหน้าใน pages/ ก่อน render */
function loadQueue() {
  const q = loadData('m4_interview_queue', seedQueue.map(a => ({ ...a })));
  q.forEach(a => { if (!a.status) a.status = 'WAITING'; });
  saveData('m4_interview_queue', q);
  return q;
}

/* บอก parent shell (index.html) ว่าอยู่หน้าไหน เพื่อไฮไลต์เมนู + รีเฟรชสถิติใน sidebar — เรียกใน <body onload> ของทุกหน้าใน pages/ */
function notifyParentPage(pageKey) {
  if (window.parent && window.parent !== window) {
    window.parent.postMessage({ type: "m4-interview-page", page: pageKey }, "*");
  }
}
