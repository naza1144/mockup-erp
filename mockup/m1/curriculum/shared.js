/* ═══ shared.js — mock data + localStorage helpers ใช้ร่วมกันทุกหน้าใน mockup/m1/curriculum/ ═══ */

const DOMAIN_NAMES = ["คุณธรรม จริยธรรม", "ความรู้", "ทักษะทางปัญญา", "ทักษะความสัมพันธ์ระหว่างบุคคล", "ทักษะการวิเคราะห์เชิงตัวเลข"];
const DOMAIN_CODES = ["D1","D2","D3","D4","D5"];
const CATEGORY_TH = { GENERAL_ED: "ศึกษาทั่วไป", CORE_REQUIRED: "บังคับ", CORE_ELECTIVE: "เลือก", FREE_ELECTIVE: "เลือกเสรี" };
const TYPE_TH = { LECTURE: "บรรยาย", LAB: "ปฏิบัติ", SEMINAR: "สัมมนา", PROJECT: "โครงงาน", THESIS: "วิทยานิพนธ์", COOP: "สหกิจ" };
const LEVEL_CYCLE = ["-", "I", "R", "M"];
const LEVEL_COLOR = { "-": "bg-white text-gray-300", I: "bg-violet-50 text-violet-500", R: "bg-violet-200 text-violet-800", M: "bg-violet-600 text-white" };
const BLOOM_TH = { REMEMBER: "จำ", UNDERSTAND: "เข้าใจ", APPLY: "ประยุกต์", ANALYZE: "วิเคราะห์", EVALUATE: "ประเมิน", CREATE: "สร้างสรรค์" };
const STATUS_BADGE = { DRAFT: "bg-gray-100 text-gray-500", IN_REVIEW: "bg-amber-100 text-amber-700", APPROVED: "bg-green-100 text-green-700", ACTIVE: "bg-green-100 text-green-700", ARCHIVED: "bg-gray-100 text-gray-400" };
const STATUS_TH = { DRAFT: "ร่าง", IN_REVIEW: "รอพิจารณา", APPROVED: "อนุมัติแล้ว", ACTIVE: "ใช้งานอยู่", ARCHIVED: "เลิกใช้" };
const LEVEL_TH = { BACHELOR: "ปริญญาตรี", MASTER: "ปริญญาโท", DOCTORAL: "ปริญญาเอก" };

function loadData(k, fb) { const s = localStorage.getItem(k); return s ? JSON.parse(s) : fb; }
function saveData(k, d) { localStorage.setItem(k, JSON.stringify(d)); }
function resetData() { localStorage.clear(); location.reload(); }

function currentRole() { return localStorage.getItem("m1c_role") || "curriculum_officer"; }
/* ใช้ในหน้าที่มี element ที่ต้อง gate ด้วย role (เช่น ปุ่มอนุมัติ/ตีกลับ ที่เห็นเฉพาะ reviewer) — เรียกใน init() */
function applyRoleGating() {
  const role = currentRole();
  document.querySelectorAll("[data-roles]").forEach((el) => el.classList.toggle("hidden", !el.dataset.roles.split(",").includes(role)));
}

/* ═══ DATA DESIGN MAPPING (m1a_curriculum.md) ═══
   program -> curriculum.program
   program_version -> program_versions[]
   credit_structure: [{category: "GENERAL_ED"|"CORE_REQUIRED"|"CORE_ELECTIVE"|"FREE_ELECTIVE", min_credits}]
   plo: tqf_domain -> "D1"|"D2"|"D3"|"D4"|"D5"
   course: lecture_hours, lab_hours, self_study_hours
   clo: bloom_level -> REMEMBER|UNDERSTAND|APPLY|ANALYZE|EVALUATE|CREATE
   plo_clo_map: level -> I|R|M
   status: DRAFT|IN_REVIEW|APPROVED|ACTIVE|ARCHIVED
   level: BACHELOR|MASTER|DOCTORAL
═══ */
const seedPrograms = [
  { id: 1, program_code: "CS-BSC", name_th: "วิทยาการคอมพิวเตอร์", name_en: "Computer Science", level: "BACHELOR", year: 2567, total_credits: 125,
    faculty_name: "คณะวิทยาศาสตร์", dept_id: "DEPT-SCI-CS", lecture_hours: 4, lab_hours: 0, self_study_hours: 8,
    program_category: "ปกติ", coordinator: "รศ.ดร.สมศักดิ์ วิทยาเลิศ",
    philosophy: "ผลิตบัณฑิตที่มีความรู้และทักษะด้านวิทยาการคอมพิวเตอร์ สามารถประยุกต์ใช้เทคโนโลยีเพื่อพัฒนาสังคม",
    objectives: "เพื่อผลิตบัณฑิตที่มีความรู้ความสามารถด้านวิทยาการคอมพิวเตอร์ มีคุณธรรม จริยธรรม และจรรยาบรรณในวิชาชีพ",
    created_date: "2567-03-15", location: "คณะวิทยาศาสตร์ มหาวิทยาลัยอุบลราชธานี",
    status: "ACTIVE",
    credit_structure: [
      { category: "GENERAL_ED", min_credits: 30 },
      { category: "CORE_REQUIRED", min_credits: 75 },
      { category: "CORE_ELECTIVE", min_credits: 15 },
      { category: "FREE_ELECTIVE", min_credits: 5 }
    ],
    tqf_domains: DOMAIN_NAMES.map((n) => ({ name: n, desc: "" })),
    plos: [
      { plo_id: 1, code: "PLO1", description: "ประยุกต์ใช้ความรู้ทางวิทยาการคอมพิวเตอร์แก้ปัญหาจริงได้", tqf_domain: "D1", sort_order: 1 },
      { plo_id: 2, code: "PLO2", description: "พัฒนาซอฟต์แวร์ด้วยหลักวิศวกรรมซอฟต์แวร์อย่างมีระบบ", tqf_domain: "D1", sort_order: 2 },
      { plo_id: 3, code: "PLO3", description: "สื่อสารและทำงานร่วมกับผู้อื่นอย่างมีจริยธรรมและรับผิดชอบ", tqf_domain: "D2", sort_order: 3 },
      { plo_id: 4, code: "PLO4", description: "วิเคราะห์ข้อมูลและใช้เครื่องมือทางวิทยาศาสตร์เพื่อสนับสนุนการตัดสินใจ", tqf_domain: "D5", sort_order: 4 },
    ],
    program_versions: [
      { program_version_id: 1, year: 2564, total_credits: 122, status: "ARCHIVED", effective_date: "2564-06-01", course_ids: [1, 2, 4] },
      { program_version_id: 2, year: 2567, total_credits: 125, status: "ACTIVE", effective_date: "2567-06-01", course_ids: [1, 2, 3, 4] }
    ],
    plo_history: [{ plo_id: 2, changed_at: "2569-03-01", changed_by: "รศ.ดร.สมศักดิ์", before: "ออกแบบซอฟต์แวร์ได้", after: "พัฒนาซอฟต์แวร์ด้วยหลักวิศวกรรมซอฟต์แวร์อย่างมีระบบ", reason: "ปรับตาม ACM/IEEE CS2023" }] },
  { id: 2, program_code: "MATH-BSC", name_th: "คณิตศาสตร์", name_en: "Mathematics", level: "BACHELOR", year: 2566, total_credits: 130,
    faculty_name: "คณะวิทยาศาสตร์", dept_id: "DEPT-SCI-MATH", lecture_hours: 4, lab_hours: 0, self_study_hours: 8,
    program_category: "ปกติ", coordinator: "ผศ.ดร.วิมล คณิตา",
    philosophy: "ผลิตบัณฑิตที่มีความรู้ทางคณิตศาสตร์และสถิติ สามารถวิเคราะห์และแก้ปัญหาด้วยแบบจำลองทางคณิตศาสตร์",
    objectives: "เพื่อผลิตบัณฑิตที่มีความรู้ความสามารถทางคณิตศาสตร์ประยุกต์ มีทักษะการคิดวิเคราะห์และแก้ปัญหาอย่างเป็นระบบ",
    created_date: "2566-02-20", location: "คณะวิทยาศาสตร์ มหาวิทยาลัยอุบลราชธานี",
    status: "ACTIVE",
    credit_structure: [
      { category: "GENERAL_ED", min_credits: 30 }, { category: "CORE_REQUIRED", min_credits: 72 },
      { category: "CORE_ELECTIVE", min_credits: 18 }, { category: "FREE_ELECTIVE", min_credits: 10 }
    ],
    tqf_domains: DOMAIN_NAMES.map((n) => ({ name: n, desc: "" })),
    plos: [
      { plo_id: 5, code: "PLO1", description: "ประยุกต์ความรู้ทางคณิตศาสตร์และสถิติเพื่อแก้ปัญหาจริง", tqf_domain: "D1", sort_order: 1 },
      { plo_id: 6, code: "PLO2", description: "สร้างแบบจำลองทางคณิตศาสตร์สำหรับปัญหาทางวิทยาศาสตร์", tqf_domain: "D1", sort_order: 2 },
      { plo_id: 7, code: "PLO3", description: "ใช้ซอฟต์แวร์ทางคณิตศาสตร์และสถิติวิเคราะห์ข้อมูล", tqf_domain: "D5", sort_order: 3 },
      { plo_id: 8, code: "PLO4", description: "มีคุณธรรม จริยธรรม และรับผิดชอบต่องานที่ได้รับมอบหมาย", tqf_domain: "D2", sort_order: 4 },
    ],
    program_versions: [
      { program_version_id: 3, year: 2563, total_credits: 128, status: "ARCHIVED", effective_date: "2563-06-01", course_ids: [5, 6] },
      { program_version_id: 4, year: 2566, total_credits: 130, status: "ACTIVE", effective_date: "2566-06-01", course_ids: [5, 6, 7] }
    ],
    plo_history: [] },
  { id: 3, program_code: "BIO-BSC", name_th: "ชีววิทยา", name_en: "Biology", level: "BACHELOR", year: 2567, total_credits: 128,
    faculty_name: "คณะวิทยาศาสตร์", dept_id: "DEPT-SCI-BIO", lecture_hours: 3, lab_hours: 3, self_study_hours: 6,
    program_category: "ปกติ", coordinator: "รศ.ดร.ชีวิน ชีวาลัย",
    philosophy: "ผลิตบัณฑิตที่มีความรู้ทางชีววิทยา สามารถประยุกต์ใช้องค์ความรู้เพื่อพัฒนาทรัพยากรชีวภาพอย่างยั่งยืน",
    objectives: "ผลิตบัณฑิตที่มีความรู้และทักษะด้านชีววิทยา มีทักษะปฏิบัติการและวิจัย",
    created_date: "2567-01-10", location: "คณะวิทยาศาสตร์ มหาวิทยาลัยอุบลราชธานี",
    status: "ACTIVE",
    credit_structure: [
      { category: "GENERAL_ED", min_credits: 30 }, { category: "CORE_REQUIRED", min_credits: 68 },
      { category: "CORE_ELECTIVE", min_credits: 20 }, { category: "FREE_ELECTIVE", min_credits: 10 }
    ],
    tqf_domains: DOMAIN_NAMES.map((n) => ({ name: n, desc: "" })),
    plos: [
      { plo_id: 9, code: "PLO1", description: "อธิบายหลักการและทฤษฎีทางชีววิทยาตั้งแต่ระดับโมเลกุลถึงระบบนิเวศ", tqf_domain: "D1", sort_order: 1 },
      { plo_id: 10, code: "PLO2", description: "ใช้เครื่องมือและเทคนิคปฏิบัติการทางชีววิทยาได้อย่างถูกต้อง", tqf_domain: "D5", sort_order: 2 },
      { plo_id: 11, code: "PLO3", description: "วิเคราะห์และแก้ปัญหาทางชีววิทยาโดยใช้กระบวนการทางวิทยาศาสตร์", tqf_domain: "D3", sort_order: 3 },
      { plo_id: 12, code: "PLO4", description: "ทำงานร่วมกับผู้อื่นและสื่อสารผลงานทางวิชาการได้อย่างมีประสิทธิภาพ", tqf_domain: "D4", sort_order: 4 },
    ],
    program_versions: [{ program_version_id: 5, year: 2567, total_credits: 128, status: "ACTIVE", effective_date: "2567-06-01", course_ids: [8, 9, 10] }],
    plo_history: [] },
  { id: 4, program_code: "PHY-BSC", name_th: "ฟิสิกส์", name_en: "Physics", level: "BACHELOR", year: 2567, total_credits: 130,
    faculty_name: "คณะวิทยาศาสตร์", dept_id: "DEPT-SCI-PHY", lecture_hours: 4, lab_hours: 2, self_study_hours: 8,
    program_category: "ปกติ", coordinator: "ผศ.ดร.ฟิสิกส์ ธรรมศาสตร์",
    philosophy: "ผลิตบัณฑิตที่มีความรู้ทางฟิสิกส์ พร้อมทักษะการทดลองและการคิดเชิงวิทยาศาสตร์",
    objectives: "ผลิตบัณฑิตที่มีความเชี่ยวชาญด้านฟิสิกส์",
    created_date: "2567-03-01", location: "คณะวิทยาศาสตร์ มหาวิทยาลัยอุบลราชธานี",
    status: "DRAFT",
    credit_structure: [
      { category: "GENERAL_ED", min_credits: 30 }, { category: "CORE_REQUIRED", min_credits: 72 },
      { category: "CORE_ELECTIVE", min_credits: 18 }, { category: "FREE_ELECTIVE", min_credits: 10 }
    ],
    tqf_domains: DOMAIN_NAMES.map((n) => ({ name: n, desc: "" })),
    plos: [
      { plo_id: 13, code: "PLO1", description: "ประยุกต์หลักการทางฟิสิกส์เพื่ออธิบายปรากฏการณ์ธรรมชาติ", tqf_domain: "D1", sort_order: 1 },
      { plo_id: 14, code: "PLO2", description: "ออกแบบและดำเนินการทดลองทางฟิสิกส์ได้อย่างถูกต้อง", tqf_domain: "D5", sort_order: 2 },
      { plo_id: 15, code: "PLO3", description: "วิเคราะห์ข้อมูลเชิงปริมาณโดยใช้แบบจำลองทางคณิตศาสตร์", tqf_domain: "D5", sort_order: 3 },
    ],
    program_versions: [{ program_version_id: 6, year: 2567, total_credits: 130, status: "DRAFT", effective_date: "2567-06-01", course_ids: [11, 12] }],
    plo_history: [] },
];
const seedCourses = [
  { course_id: 1, code: "CS101", name_th: "การเขียนโปรแกรมเบื้องต้น", credits: 3, type: "LECTURE", lecture_hours: 3, lab_hours: 0, self_study_hours: 6, prereq_ids: [],
    clos: [{ clo_id: 1, code: "CLO1", description: "เขียนโปรแกรมพื้นฐานด้วยภาษา Python ได้", bloom_level: "APPLY" }] },
  { course_id: 2, code: "CS201", name_th: "โครงสร้างข้อมูลและอัลกอริทึม", credits: 3, type: "LECTURE", lecture_hours: 3, lab_hours: 0, self_study_hours: 6, prereq_ids: [1],
    clos: [{ clo_id: 2, code: "CLO1", description: "วิเคราะห์ความซับซ้อนของอัลกอริทึมได้", bloom_level: "ANALYZE" }] },
  { course_id: 3, code: "CS301", name_th: "วิศวกรรมซอฟต์แวร์", credits: 3, type: "LECTURE", lecture_hours: 3, lab_hours: 0, self_study_hours: 6, prereq_ids: [2],
    clos: [{ clo_id: 3, code: "CLO1", description: "ประยุกต์หลักการวิศวกรรมซอฟต์แวร์ในการพัฒนาระบบ", bloom_level: "APPLY" }] },
  { course_id: 4, code: "CS490", name_th: "สหกิจศึกษาวิทยาการคอมพิวเตอร์", credits: 6, type: "COOP", lecture_hours: 0, lab_hours: 0, self_study_hours: 12, prereq_ids: [2], clos: [] },
  { course_id: 5, code: "MATH101", name_th: "แคลคูลัส 1", credits: 3, type: "LECTURE", lecture_hours: 3, lab_hours: 0, self_study_hours: 6, prereq_ids: [],
    clos: [{ clo_id: 4, code: "CLO1", description: "คำนวณลิมิต อนุพันธ์และปริพันธ์ของฟังก์ชันได้", bloom_level: "APPLY" }] },
  { course_id: 6, code: "MATH201", name_th: "สมการเชิงอนุพันธ์", credits: 3, type: "LECTURE", lecture_hours: 3, lab_hours: 0, self_study_hours: 6, prereq_ids: [5],
    clos: [{ clo_id: 5, code: "CLO1", description: "แก้สมการเชิงอนุพันธ์สามัญและประยุกต์ใช้กับปัญหาได้", bloom_level: "ANALYZE" }] },
  { course_id: 7, code: "MATH301", name_th: "สถิติประยุกต์", credits: 3, type: "LECTURE", lecture_hours: 3, lab_hours: 0, self_study_hours: 6, prereq_ids: [5],
    clos: [{ clo_id: 6, code: "CLO1", description: "ใช้วิธีการทางสถิติวิเคราะห์ข้อมูลและแปลผลได้", bloom_level: "EVALUATE" }] },
  { course_id: 8, code: "BIO101", name_th: "ชีววิทยาทั่วไป", credits: 4, type: "LECTURE", lecture_hours: 3, lab_hours: 3, self_study_hours: 6, prereq_ids: [],
    clos: [{ clo_id: 7, code: "CLO1", description: "อธิบายหลักการพื้นฐานทางชีววิทยาและความหลากหลายทางชีวภาพ", bloom_level: "UNDERSTAND" }] },
  { course_id: 9, code: "BIO201", name_th: "พันธุศาสตร์", credits: 4, type: "LECTURE", lecture_hours: 3, lab_hours: 3, self_study_hours: 6, prereq_ids: [8],
    clos: [{ clo_id: 8, code: "CLO1", description: "วิเคราะห์รูปแบบการถ่ายทอดทางพันธุกรรมและโครงสร้างดีเอ็นเอ", bloom_level: "ANALYZE" }] },
  { course_id: 10, code: "BIO490", name_th: "สหกิจศึกษาชีววิทยา", credits: 6, type: "COOP", lecture_hours: 0, lab_hours: 0, self_study_hours: 12, prereq_ids: [8], clos: [] },
  { course_id: 11, code: "PHY101", name_th: "ฟิสิกส์ทั่วไป 1", credits: 4, type: "LECTURE", lecture_hours: 4, lab_hours: 0, self_study_hours: 8, prereq_ids: [],
    clos: [{ clo_id: 9, code: "CLO1", description: "ประยุกต์กฎการเคลื่อนที่ของนิวตันและหลักการอนุรักษ์พลังงาน", bloom_level: "APPLY" }] },
  { course_id: 12, code: "PHY201", name_th: "ฟิสิกส์เชิงคณิตศาสตร์", credits: 3, type: "LECTURE", lecture_hours: 3, lab_hours: 0, self_study_hours: 6, prereq_ids: [11],
    clos: [{ clo_id: 10, code: "CLO1", description: "ใช้เครื่องมือทางคณิตศาสตร์เพื่อแก้ปัญหาทางฟิสิกส์", bloom_level: "ANALYZE" }] },
];
const seedMapping = [
  { plo: 1, clo: 1, level: "M" }, { plo: 1, clo: 2, level: "R" }, { plo: 2, clo: 3, level: "M" },
  { plo: 3, clo: 1, level: "I" }, { plo: 4, clo: 2, level: "R" },
  { plo: 5, clo: 4, level: "M" }, { plo: 6, clo: 5, level: "M" }, { plo: 7, clo: 6, level: "M" },
  { plo: 9, clo: 7, level: "M" }, { plo: 10, clo: 8, level: "M" },
  { plo: 13, clo: 9, level: "M" }, { plo: 14, clo: 10, level: "M" },
];
const seedDocs = { TQF2: null, TQF3: null, TQF4: null };
const seedCloMeasures = {
  1: { clos: { 1: { tools: ["สอบกลางภาค", "งานมอบหมาย"], weights: { "สอบกลางภาค": 50, "งานมอบหมาย": 50 } } } },
  2: { clos: { 2: { tools: ["สอบปลายภาค", "โปรเจกต์"], weights: { "สอบปลายภาค": 60, "โปรเจกต์": 40 } } } },
  3: { clos: { 3: { tools: ["โปรเจกต์", "รายงาน"], weights: { "โปรเจกต์": 70, "รายงาน": 30 } } } },
};
const seedCloScores = {
  1: { "2569/1": { 1: { avg: 78, count: 45, passRate: 82 } } },
  2: { "2569/1": { 2: { avg: 72, count: 30, passRate: 75 } } },
  3: { "2569/1": { 3: { avg: 85, count: 25, passRate: 90 } } },
};
const seedPloAttainment = {
  1: { "2569": { score: 0.82, pass: true }, "2568": { score: 0.78, pass: true }, "2567": { score: 0.75, pass: true } },
  2: { "2569": { score: 0.65, pass: false }, "2568": { score: 0.70, pass: true }, "2567": { score: 0.72, pass: true } },
  3: { "2569": { score: 0.88, pass: true }, "2568": { score: 0.85, pass: true }, "2567": { score: 0.80, pass: true } },
  4: { "2569": { score: 0.75, pass: true }, "2568": { score: 0.72, pass: true }, "2567": { score: 0.70, pass: true } },
  5: { "2569": { score: 0.80, pass: true }, "2568": { score: 0.76, pass: true }, "2567": { score: 0.73, pass: true } },
  6: { "2569": { score: 0.68, pass: false }, "2568": { score: 0.74, pass: true }, "2567": { score: 0.71, pass: true } },
  7: { "2569": { score: 0.85, pass: true }, "2568": { score: 0.80, pass: true }, "2567": { score: 0.78, pass: true } },
  8: { "2569": { score: 0.90, pass: true }, "2568": { score: 0.87, pass: true }, "2567": { score: 0.85, pass: true } },
  9: { "2569": { score: 0.77, pass: true }, "2568": { score: 0.75, pass: true }, "2567": { score: 0.72, pass: true } },
  10: { "2569": { score: 0.71, pass: true }, "2568": { score: 0.68, pass: false }, "2567": { score: 0.73, pass: true } },
  11: { "2569": { score: 0.83, pass: true }, "2568": { score: 0.79, pass: true }, "2567": { score: 0.76, pass: true } },
  12: { "2569": { score: 0.74, pass: true }, "2568": { score: 0.71, pass: true }, "2567": { score: 0.69, pass: false } },
  13: { "2569": { score: 0.80, pass: true }, "2568": { score: 0.77, pass: true }, "2567": { score: 0.74, pass: true } },
  14: { "2569": { score: 0.62, pass: false }, "2568": { score: 0.66, pass: false }, "2567": { score: 0.70, pass: true } },
  15: { "2569": { score: 0.76, pass: true }, "2568": { score: 0.73, pass: true }, "2567": { score: 0.71, pass: true } },
};

/* บอก parent shell (index.html) ว่าอยู่หน้าไหน เพื่อไฮไลต์เมนูใน sidebar — เรียกใน <body onload> ของทุกหน้าใน pages/ */
function notifyParentPage(pageKey) {
  if (window.parent && window.parent !== window) {
    window.parent.postMessage({ type: "m1-curriculum-page", page: pageKey }, "*");
  }
}
