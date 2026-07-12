/* ═══ shared.js — mock data + localStorage helpers ใช้ร่วมกันทุกหน้าใน mockup/m1/planning/ ═══ */

const DAY_ORDER = ["จันทร์", "อังคาร", "พุธ", "พฤหัสบดี", "ศุกร์"];
const ALL_TIMES = ["08:00", "09:00", "10:00", "11:00", "12:00", "13:00", "14:00", "15:00", "16:00", "17:00"];
const ROOM_TYPE_TH = { LECTURE: "บรรยาย", LAB: "ปฏิบัติการ", SEMINAR: "สัมมนา", COMPUTER_LAB: "คอมพิวเตอร์" };

const mockCourses = [
  { code: "CS101", name: "การเขียนโปรแกรมเบื้องต้น", credit: "3(2-2-5)" },
  { code: "CS201", name: "โครงสร้างข้อมูลและอัลกอริทึม", credit: "3(2-2-5)" },
  { code: "CS490", name: "สหกิจศึกษา", credit: "3(0-40-0)" },
];

const mockInstructors = [
  { id: 101, name: "ผศ.ดร.สมหญิง ใจดี" },
  { id: 102, name: "อ.ประยุทธ ขยันสอน" },
  { id: 103, name: "ดร.วิชัย รักเรียน" },
  { id: 104, name: "ผศ.มาลี สดใส" },
  { id: 105, name: "อ.ดร.ธนพล เรียนเก่ง" }
];

function loadData(k, fb) { const s = localStorage.getItem(k); return s ? JSON.parse(s) : fb; }
function saveData(k, d) { localStorage.setItem(k, JSON.stringify(d)); }
function resetData() { localStorage.clear(); location.reload(); }

const seedTerms = [{ id: 1, code: "2569/1", start: "2569-06-01", end: "2569-10-15", regOpen: "2569-05-15", regClose: "2569-06-05" }];
const seedRooms = [
  { id: 1, code: "R101", building: "อาคารวิศวกรรม", type: "LECTURE", capacity: 60, status: "AVAILABLE" },
  { id: 2, code: "R102", building: "อาคารวิศวกรรม", type: "LAB", capacity: 30, status: "AVAILABLE" },
  { id: 3, code: "R201", building: "อาคาร IT", type: "COMPUTER_LAB", capacity: 40, status: "AVAILABLE" },
];
const seedTimeslots = [
  { id: 1, code: "SLOT1", day: "จันทร์", start: "08:00", end: "10:00" },
  { id: 2, code: "SLOT2", day: "จันทร์", start: "10:00", end: "12:00" },
  { id: 3, code: "SLOT3", day: "จันทร์", start: "13:00", end: "16:00" },
  { id: 4, code: "TUES1", day: "อังคาร", start: "09:00", end: "12:00" },
  { id: 5, code: "TUES2", day: "อังคาร", start: "13:00", end: "15:00" },
  { id: 6, code: "WED1", day: "พุธ", start: "08:00", end: "11:00" },
  { id: 7, code: "THU1", day: "พฤหัสบดี", start: "13:00", end: "16:00" },
  { id: 8, code: "FRI1", day: "ศุกร์", start: "09:00", end: "12:00" },
];
const seedCalendar = [{ id: 1, type: "TERM_START", start: "2569-06-01", end: "2569-06-01" }, { id: 2, type: "ADD_DROP", start: "2569-06-01", end: "2569-06-14" }];

// NOTE: instructorIds เป็น array (รองรับอาจารย์หลายคน)
const seedSections = [
  { sec: 1, courseCode: "CS101", instructorIds: [101, 104], roomId: 1, timeslotId: 1, mode: "ONSITE", quotaTotal: 60, status: "PUBLISHED", cross: false, id: 1001 },
  { sec: 2, courseCode: "CS101", instructorIds: [102], roomId: 3, timeslotId: 4, mode: "ONSITE", quotaTotal: 40, status: "PUBLISHED", cross: false, id: 1002 },
  { sec: 1, courseCode: "CS201", instructorIds: [102, 103, 105], roomId: 2, timeslotId: 6, mode: "ONSITE", quotaTotal: 30, status: "PUBLISHED", cross: false, id: 1003 },
  { sec: 2, courseCode: "CS201", instructorIds: [103], roomId: 1, timeslotId: 3, mode: "ONSITE", quotaTotal: 25, status: "PUBLISHED", cross: false, id: 1004 },
];

/* ═══ Helper: ดึง instructorIds จาก section (รองรับ backward compat) ═══ */
function getInstructorIds(section) {
  if (section.instructorIds && section.instructorIds.length > 0) return section.instructorIds;
  if (section.instructorId) return [section.instructorId];
  return [];
}

/* ═══ UC-B2/B3 — ตรวจ conflict ห้อง/อาจารย์ (ใช้ global `sections`, `rooms` ที่แต่ละหน้าโหลดเอง) ═══ */
function findConflicts(roomId, instructorIds, timeslotId, excludeId) {
  const conflicts = [];
  const instrIds = Array.isArray(instructorIds) ? instructorIds : [instructorIds];

  sections.forEach((s) => {
    if (s.id === excludeId) return;
    const sInstrIds = getInstructorIds(s);

    // Room conflict
    if (s.roomId == roomId && s.timeslotId == timeslotId) {
      conflicts.push(`ห้องชน: ${rooms.find((r) => r.id == roomId)?.code} ถูกใช้โดย ${s.courseCode} Sec${s.sec} เวลาเดียวกัน`);
    }

    // Instructor conflict — check each instructor
    instrIds.forEach(instrId => {
      if (sInstrIds.includes(Number(instrId)) && s.timeslotId == timeslotId) {
        const instr = mockInstructors.find(i => i.id === Number(instrId));
        conflicts.push(`อาจารย์ชน: ${instr?.name || instrId} สอน ${s.courseCode} Sec${s.sec} เวลาเดียวกันแล้ว`);
      }
    });
  });
  return conflicts;
}

/* บอก parent shell (index.html) ว่าอยู่หน้าไหน เพื่อไฮไลต์เมนูใน sidebar — เรียกใน <body onload> ของทุกหน้าใน pages/ */
function notifyParentPage(pageKey) {
  if (window.parent && window.parent !== window) {
    window.parent.postMessage({ type: "m1-planning-page", page: pageKey }, "*");
  }
}
