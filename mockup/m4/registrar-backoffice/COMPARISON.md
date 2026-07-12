# Comparison: Mockup vs Design Documents (M4 · Registrar Back-office)

> เปรียบเทียบ mockup กับ `data-design/m4_registry.md` + `designDiag/m4_registry.md`

---

## 1. Entity Fields Comparison

### `registry.application`

| Field | data-design | designDiag | mockup (shared.js) | สถานะ |
|-------|-----------|-----------|--------|--------|
| `application_id` | UUID PK | UUID PK | `application_id: "a1b2c3d4-..."` (UUID) | ✅ |
| `account_id` | UUID NOT NULL (soft FK→identity) | UUID (soft FK) | `account_id: "acc-201"` | ✅ |
| `program_id` | UUID NOT NULL (soft FK→curriculum) | UUID (soft FK) | `program_id: "prog-cs"` (UUID) | ✅ |
| `academic_year` | INTEGER NOT NULL | INTEGER | `academic_year: 2566` | ✅ |
| `status` | VARCHAR(25) NOT NULL (SUBMITTED/DOCUMENT_REVIEW/INTERVIEW_SCHEDULED/INTERVIEW_PASSED/INTERVIEW_FAILED/ADMITTED/REJECTED/WITHDRAWN) | VARCHAR | `status` ตรงตาม design | ✅ |
| `submitted_at` | TIMESTAMPTZ NOT NULL | TIMESTAMPTZ | `submitted_at: "2026-01-15T08:30:00Z"` | ✅ |
| `notes` | TEXT | TEXT | `notes: "เอกสารครบถ้วน"` | ✅ |
| `created_at` | TIMESTAMPTZ NOT NULL | — | ไม่มี (backend-only) | ⚠️ |
| `updated_at` | TIMESTAMPTZ NOT NULL | — | ไม่มี (backend-only) | ⚠️ |

### `registry.interview`

| Field | data-design | designDiag | mockup (shared.js) | สถานะ |
|-------|-----------|-----------|--------|--------|
| `interview_id` | UUID PK | UUID PK | `interview_id: "iv-1111-..."` (UUID) | ✅ |
| `application_id` | UUID NOT NULL UNIQUE FK | UUID FK UNIQUE | `application_id` ตรงตาม design | ✅ |
| `interviewer_id` | UUID NOT NULL (soft FK→faculty.instructor) | UUID (soft FK) | `interviewer_id: "inst-101"` | ✅ |
| `scheduled_at` | TIMESTAMPTZ NOT NULL | TIMESTAMPTZ | `scheduled_at: "2026-02-01T09:00:00Z"` | ✅ |
| `mode` | VARCHAR(10) NOT NULL (ONSITE/ONLINE) | VARCHAR | `mode: "ONSITE"|"ONLINE"` | ✅ |
| `meeting_url` | TEXT | TEXT | `meeting_url` ตรงตาม design | ✅ |
| `score` | NUMERIC(5,2) CHECK (0-100) | NUMERIC | `score: 85.50` | ✅ |
| `result` | VARCHAR(10) CHECK (PASS/FAIL) | VARCHAR | `result: "PASS"|"FAIL"` (ใช้ PASS/FAIL ตรงตาม design) | ✅ |
| `remarks` | TEXT | TEXT | `remarks` ตรงตาม design | ✅ |

### `registry.student`

| Field | data-design | designDiag | mockup | สถานะ |
|-------|-----------|-----------|--------|--------|
| `student_id` | UUID PK | UUID PK | ไม่มี (ยังไม่สร้าง student record จริง) | ⚠️ |
| `student_code` | TEXT NOT NULL UNIQUE (format: `\d{7}`) | TEXT UK | `studentCode: "6601001"` (7 digits) | ✅ |
| `account_id` | UUID NOT NULL UNIQUE (soft FK→identity) | UUID UK | `is-account` select | ✅ |
| `application_id` | UUID NOT NULL UNIQUE FK | UUID FK UNIQUE | อ้างอิงผ่าน application | ✅ |
| `program_id` | UUID NOT NULL (soft FK→curriculum) | UUID (soft FK) | อ้างอิงผ่าน program select | ✅ |
| `program_version_id` | UUID NOT NULL (soft FK→curriculum) | UUID (soft FK) | `is-program` select | ✅ |
| `enrolled_year` | INTEGER NOT NULL | INTEGER | `is-enrolled-year` select | ✅ |
| `enrolled_semester` | INTEGER NOT NULL CHECK (1,2,3) | INTEGER | `is-enrolled-semester` select | ✅ |
| `status` | VARCHAR(15) NOT NULL DEFAULT 'ENROLLED' | VARCHAR | — (default) | ✅ |
| `expected_grad_year` | INTEGER | — | ไม่มี | ⚠️ |
| `advisor_id` | UUID (soft FK→faculty.instructor) | UUID (soft FK) | `is-advisor` select | ✅ |

---

## 2. Business Rules (BR) Comparison

| BR | เอกสาร | mockup | สถานะ |
|----|-------|--------|--------|
| BR-M4-001 | student สร้างได้เมื่อ application.status='ADMITTED' เท่านั้น | page-import-student.html ตรวจสอบ INTERVIEW_PASSED ก่อน import + เปลี่ยนเป็น ADMITTED | ✅ |
| BR-M4-002 | student_code format `\d{7}` (7 digits) | validation `/^\d{7}$/` ใน page-import-student.html | ✅ |
| BR-M4-003 | interview UNIQUE ต่อ application_id | seedInterviews มี UNIQUE ต่อ application_id | ✅ |
| BR-M4-004 | ห้าม DELETE student record | ไม่มีปุ่มลบ | ✅ |
| BR-M4-005 | ทุก status change ต้อง INSERT student_status_history | seedStatusHistory + console.log ใน page-import-student.html | ✅ |
| BR-M4-006 | advisor_id ต้อง check instructor.status != 'TERMINATED' | ตรวจสอบใน page-import-student.html | ✅ |

---

## 3. State Machine Comparison

### `application.status`

| Transition | เอกสาร | mockup | สถานะ |
|-----------|-------|--------|--------|
| SUBMITTED → DOCUMENT_REVIEW | Registrar ตรวจเอกสาร | — (ยังไม่มีหน้า) | ❌ |
| DOCUMENT_REVIEW → INTERVIEW_SCHEDULED | Registrar นัดสัมภาษณ์ | — (ยังไม่มีหน้า) | ❌ |
| INTERVIEW_SCHEDULED → INTERVIEW_PASSED/FAILED | Interviewer บันทึกผล | — (ยังไม่มีหน้า) | ❌ |
| INTERVIEW_PASSED → ADMITTED | Registrar รับเข้า → สร้าง student | page-import-student.html (ถูกต้อง) | ✅ |
| INTERVIEW_FAILED → REJECTED | Registrar ปฏิเสธ | — (ยังไม่มีหน้า) | ❌ |
| INTERVIEW_SCHEDULED → WITHDRAWN | Applicant ถอน | — (ยังไม่มีหน้า) | ❌ |

---

## 4. Cross-module References

| Reference | เอกสาร | mockup | สถานะ |
|-----------|-------|--------|--------|
| application.account_id → identity.account | M0 API | `mockAccounts` จำลอง | ✅ |
| application.program_id → curriculum.program | M1 API | `mockPrograms` จำลอง | ✅ |
| interview.interviewer_id → faculty.instructor | M3 API | `mockInstructors` จำลอง | ✅ |
| student.account_id → identity.account | M0 API | `is-account` select | ✅ |
| student.program_id → curriculum.program | M1 API | ใช้ program select | ✅ |
| student.program_version_id → curriculum.program_version | M1 API | `is-program` select | ✅ |
| student.advisor_id → faculty.instructor | M3 API | `is-advisor` select | ✅ |

---

## 5. Seed Data Issues

| # | ปัญหา | ปัจจุบัน | ที่ถูกต้อง | สถานะ |
|---|-------|---------|----------|--------|
| 1 | ID type | UUID | UUID | ✅ แก้แล้ว |
| 2 | Missing account_id | มี `account_id` field | ต้องมี | ✅ แก้แล้ว |
| 3 | Missing academic_year | มี `academic_year` field | ต้องมี | ✅ แก้แล้ว |
| 4 | Wrong status field | `status` field ตรงตาม design | `SUBMITTED/DOCUMENT_REVIEW/...` + interview entity แยก | ✅ แก้แล้ว |
| 5 | Missing submitted_at | มี `submitted_at` | ต้องมี | ✅ แก้แล้ว |
| 6 | student_code format | `6601001` (7 digits) | `\d{7}` | ✅ แก้แล้ว |
| 7 | program เป็น TEXT | `program_id` UUID | ต้องเป็น UUID | ✅ แก้แล้ว |

---

## สรุป

| หมวด | ✅ ถูกต้อง | ❌ ไม่ตรง | ⚠️ ต้องปรับปรุง |
|------|-----------|---------|---------------|
| Entity fields | 18 | 0 | 4 |
| Business Rules | 6 | 0 | 0 |
| State machine | 1 | 4 | 1 |
| Cross-module refs | 7 | 0 | 0 |
| Seed data | 7 | 0 | 0 |
| **รวม** | **39** | **4** | **5** |

---

## หมายเหตุ

- Issues ใน COMPARISON.md เวอร์ชันเก่า (10/07/2026) ส่วนใหญ่ได้รับการแก้ไขแล้ว โดยเฉพาะ seed data ที่เปลี่ยนเป็น UUID, เพิ่ม account_id/academic_year/submitted_at, แก้ student_code format, แยก interview entity, และเปลี่ยน program เป็น UUID
- ยังขาดหน้า UI สำหรับ workflow: DOCUMENT_REVIEW, INTERVIEW_SCHEDULED (นัดสัมภาษณ์), บันทึกผลสัมภาษณ์, REJECTED, WITHDRAWN 
- student record ยังไม่ได้สร้าง entity จริง (page-import-student.html จำลองเฉพาะการเปลี่ยน status application → ADMITTED)