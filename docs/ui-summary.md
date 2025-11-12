# UI & UX Summary — MedFlow (one-page)

Source: `docs/requirements.md`

## Primary screens

- Auth: Login, Register, Forgot Password
- Onboarding / Clinic creation (Admin)
- Dashboard (role-specific): quick stats, upcoming appointments, recent patients
- Patients: list, search/filter, patient profile (view/edit)
- Appointments / Calendar: calendar view (month/week/day), booking modal, list view
- Consultation editor: notes, diagnoses, create prescription
- Prescription viewer: prescription details + PDF export/download
- Billing: invoices list, invoice detail + payment flow
- Patient Portal: appointments, documents, payments
- Settings / Admin: services, staff, pricing

## Key UI elements

- Header (top): clinic name, role switch, user menu, notifications
- Primary nav: left sidebar (desktop) or bottom drawer (mobile) with icons for Dashboard, Patients, Calendar, Billing, Settings
- Cards: patient card, invoice card, appointment card
- Calendar component: time grid, day/week/month toggle, event popovers
- Forms: inputs, selects, date/time pickers, file upload (for PDF)
- Modals and drawers: booking modal, patient quick-edit, confirmation dialogs
- Tables & lists: sortable columns, pagination, bulk actions
- Buttons: primary, secondary, ghost (use consistent sizing and icons)
- Toasts & alerts: success/error messages for actions (payment success, save confirmation)
- PDF viewer: embedded preview or link to download

## Component behavior and interactions (expected)

- Booking flow: open booking modal from calendar or patient profile -> select service/doctor/time -> confirm -> show success toast and update calendar.
- Calendar interactions: click to open booking modal; drag-and-drop to reschedule (optional); click event to open consultation or appointment detail.
- Patient search: incremental search with debounce (300ms), client-side filter + server search fallback.
- Forms: inline validation with Zod, show field-level errors, prevent submission on invalid input.
- Payments: redirect or modal to Stripe checkout (test mode), show loader and update invoice status on return.
- PDF export: generate PDF on server (API route) and provide secure link; patient can download from portal.

## Responsive breakpoints

- Mobile (<= 639px): single column, bottom navigation, collapsed header, full-screen modals
- Tablet (640px - 1023px): two-column where possible, collapsible sidebar
- Desktop (>= 1024px): sidebar + content area, expanded tables and calendars

## Accessibility notes

- Color contrast: adhere to WCAG AA for text and UI controls; ensure primary/secondary colors meet contrast ratios.
- Keyboard navigation: all interactive controls reachable by Tab; modals trap focus; Escape closes modal.
- ARIA: use ARIA roles for dialogs, alerts, menus and label form fields correctly.
- Focus states: visible focus rings for keyboard users; avoid relying on color alone to indicate state.
- Screen reader: meaningful labels for buttons and icons (aria-label), table headers defined.

## Data & empty states

- Provide clear empty states with actions (e.g., "No patients yet — Add a patient").
- Skeleton loaders for async content: lists and cards should show skeletons while loading.

## Content examples (sample patient card)

Patient Card
- Name: Lina Ben Ali
- Age / DOB: 34 (14/02/1991)
- Contact: +216 98 765 432
- Last visit: 2025-10-12
- Tags: Diabetic, Allergies
- Actions: View profile, New appointment, Invoice

## Visual & design tokens (starter)

- Spacing scale: 4,8,12,16,20,24,32,40
- Border radius: sm (4px), md (8px), lg (12px)
- Font sizes: base 16px, sm 14px, lg 18px, xl 20px
- Primary color: #0f62fe (example)
- Secondary color: #6f7c8a

## Deliverables from this step

- `docs/ui-summary.md` (this file)
- Next: component inventory (`docs/components.md`) mapping each screen to components and prop shapes.


---

If you want a Figma-ready style guide or explicit token values (Tailwind config), I can generate a `tailwind.config.js` snippet and a Figma MCP ruleset next. Would you like that now?