# MedFlow — Requirements (extracted)

Source: `Cahier_des_Charges_Projet_React (2).pdf`

## Project overview

MedFlow — SaaS for clinics and physicians to manage patients, appointments, consultations, and billing. Project is intended for learning full-stack development, security and deployment.

## Roles

- Admin (owner): create clinic, configure services, manage staff.
- Médecin (Doctor): manage calendar, medical records, prescriptions.
- Réceptionniste (Receptionist): appointments, patient registration, billing.
- Patient: book/modify appointments, pay, download prescriptions (PDF).

## Functional modules (high-level)

Each module below includes a short description, priority (MUST/SHOULD/CAN) and acceptance criteria (testable).

1. Authentication & RBAC
   - Priority: MUST
   - Description: account creation, login, role-based access control, password hashing.
   - Acceptance: users can register/login; protected routes return 403 for missing permissions; password hashes stored (not plaintext).

2. Patient Management (CRUD)
   - Priority: MUST
   - Description: create/read/update/delete patient profiles; view visits and medical history.
   - Acceptance: staff can create a patient and view profile; created patient appears in search/list; deleting a patient removes the record (or marks inactive) and is reflected in UI.

3. Calendar & Appointments
   - Priority: MUST
   - Description: create/modify/cancel appointments, calendar view for staff and doctors, patient booking flow.
   - Acceptance: patient can book an available timeslot; staff or doctor can reschedule/cancel and changes are reflected for all participants.

4. Consultations & Prescriptions
   - Priority: SHOULD
   - Description: allow doctors to record consultations, create prescriptions and export as PDF.
   - Acceptance: a prescription can be generated and downloaded as a PDF document; consultation notes are stored and retrievable.

5. Billing & Payments
   - Priority: SHOULD
   - Description: create invoices, track payments, integrate Stripe in test mode.
   - Acceptance: invoice created after consultation/checkout; Stripe test payments succeed in sandbox and payment status updates on invoice.

6. Patient Portal
   - Priority: MUST
   - Description: patient dashboard to view appointments, documents, and pay online.
   - Acceptance: patient can log in, see upcoming appointments, download prescription PDFs and complete a test payment.

7. Administration & Settings
   - Priority: SHOULD
   - Description: manage services, prices, staff roles and clinic configuration.
   - Acceptance: admin can add services and prices; changes affect appointment booking options.

## Non-functional requirements & constraints

- Front-end stack: Next.js 14, React, Tailwind, shadcn/ui (MUST)
- Back-end: Next.js API Routes (or NestJS if separated) — choose one (SHOULD)
- Database: PostgreSQL or MySQL (MUST)
- Security: use Auth.js (NextAuth), password hashing, input validation with Zod (MUST)
- Multi-tenant support (optional): tenantId per clinic (CAN)
- Deployment target: Vercel for frontend; Railway/Render for DB/API (SHOULD)

## Deliverables (from spec)

- UML diagrams: use-case, class, sequence (MUST)
- DB schema (ERD) (MUST)
- Figma mockups/maquettes (MUST)
- Source code repository with migrations & seeds (Prisma suggested) (MUST)
- Deployed version and short demo video (SHOULD)
- README and documentation (MUST)

## Pages / Screens (initial list for UI mapping)

- Public landing / marketing page (optional)
- Auth: Login, Register, Forgot Password
- Onboarding / Clinic creation (Admin)
- Dashboard (Admin / Doctor / Receptionist) — role-dependent views
- Patients list / Patient profile (view + edit)
- Appointment calendar (monthly/weekly/day) + booking modal
- Consultation / Medical record editor
- Prescription viewer & PDF export
- Billing / Invoice list / Invoice detail + payment
- Patient portal (dashboard) — appointments, documents, payments
- Settings / Administration (services, staff, pricing)

Acceptance: each of the above screens should be reachable from the app route map and have basic placeholder content for MVP.

## Key user flows (short)

1. Patient booking flow
   - Patient registers (or as guest), selects clinic/service/date/time, confirms booking, receives confirmation; can view/reschedule/cancel.
   - Acceptance: end-to-end booking results in an appointment entry and confirmation UI.

2. Doctor consultation -> prescription
   - Doctor opens appointment, records notes, creates prescription, exports PDF.
   - Acceptance: saved consultation and generated PDF downloadable by patient.

3. Billing & payment
   - After consultation, generate invoice; patient pays via Stripe (test mode); payment status updates.
   - Acceptance: successful test payment updates invoice and marks as paid.

## Data models (core entities, initial sketch)

- User: id, email, hashed_password, role (admin/doctor/receptionist/patient), name, clinic_id
- Clinic: id, name, address, settings, tenant_id
- Patient: id, user_id (nullable), name, dob, contact_info, medical_history (notes)
- Appointment: id, clinic_id, patient_id, doctor_id, start_time, end_time, status
- Consultation: id, appointment_id, doctor_id, notes, prescriptions[]
- Prescription: id, consultation_id, medications[], issued_at, pdf_url
- Invoice: id, clinic_id, patient_id, amount, status, line_items[], created_at

Acceptance: database schema implemented with migrations and seed data for development.

## Acceptance criteria & testable checks (summary)

- Auth: registration/login works; protected routes enforce RBAC (403/401 as appropriate).
- Patient CRUD: create/read/list/update/delete operations succeed in UI and API.
- Appointment booking: create/reschedule/cancel flows persist and reflect in calendar.
- PDF generation: prescriptions can be exported as PDF and downloaded.
- Payments: Stripe test integration processes payments and updates invoice status.
- Build: project builds with Next.js and runs locally; README documents run steps.

## Notes & assumptions

- Use Prisma for DB migrations and seeds (recommended). If using another ORM, provide equivalent migrations.
- UI stack recommended (Tailwind + shadcn/ui) — implement components accordingly.
- Multi-tenant is optional; initial MVP can be single-tenant per deployment.

---

Document generated from the provided PDF. Next: I will create a component inventory and a one-page UI summary if you want me to proceed. If you'd like a YAML version or additional detail per requirement (priority/owner/estimate), tell me which format you prefer.