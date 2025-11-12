# Component Inventory — MedFlow

This file maps UI screens to React components (atomic → page-level). Use this as the single source of truth for implementation.

Format: Component — props (shape) — state needs — events — sample markup — page(s)

## Global layout

Header — { user, clinicName } — no local state — events: onSignOut, onOpenProfile —
Sample:
<Header user={{name: 'Lina'}} clinicName="Clinique ABC" />
Pages: all

Sidebar — { items } — collapsed (bool) — events: onNavigate —
Sample:
<Sidebar items={[{label:'Dashboard',href:'/'}]} />
Pages: all (desktop)

Button — { variant, onClick, children, disabled } — no state — events: onClick —
Sample:
<Button variant="primary">Save</Button>
Pages: used across app

Card — { title, children, footer } — no state — events: none —
Sample:
<Card title="Patient">...</Card>
Pages: Dashboard, Patients

## Dashboard

StatsCard — { metric, value, delta } — no state — events: none —
Sample: <StatsCard metric="Appointments" value={42} delta={+3} />

RecentPatientsList — { patients } — loading state — events: onOpenPatient —
Sample: <RecentPatientsList patients={[...]} />

## Patients

PatientList — { patients, onEdit, onDelete } — pagination state, loading — events: onEdit/onDelete/onSelect —
Sample: <PatientList patients={patients} />

PatientCard — { patient, onOpen, onBook } — no local state (stateless) — events: onOpen, onBook —
Sample:
<PatientCard patient={patient} onOpen={() => {}} onBook={() => {}} />

PatientProfile — { patientId } — loading, edit state — events: onSave, onUploadDocument —
Sample: <PatientProfile patientId="123" />

## Calendar & Appointments

CalendarView — { events, onCreate, onEdit } — viewMode (day/week/month) — events: onDateClick, onEventClick —
Sample: <CalendarView events={events} />

AppointmentModal — { patientId?, initialSlot } — form state, submitting — events: onConfirm, onCancel —

AppointmentCard — { appointment, onOpen } — no state — events: onOpen

## Consultation & Prescription

ConsultationEditor — { appointmentId } — form state, autosave — events: onSave, onGeneratePrescription —

PrescriptionViewer — { prescription } — no state — events: onDownloadPDF

## Billing

InvoiceList — { invoices } — filters, pagination — events: onPay, onView

InvoiceCard — { invoice } — no state — events: onPay

PaymentModal — { invoiceId } — payment state, loading — events: onSuccess, onCancel

## Forms / Primitives

Input — { name, value, onChange, label, type } — local validation state — events: onChange

Select — { options, value, onChange } — no local state — events: onChange

DatePicker — { value, onChange } — no local state — events: onChange

ToastProvider — { } — manages queue of toasts — events: showToast

## Notes / Next steps

- When implementing, export each component from `src/components` and provide PropTypes or TypeScript types.
- Create sample stories (Storybook) later for visual regression.
- The JSON code-connect map (`docs/components-map.json`) provides a simple mapping from component name to intended file path; it is used by later code generation.
