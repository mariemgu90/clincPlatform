#!/bin/bash

# Rename page.js files to match their function names and convert to .jsx

echo "Starting page file renaming process..."

# Function to convert PascalCase to kebab-case
to_kebab_case() {
    echo "$1" | sed 's/\([A-Z]\)/-\1/g' | sed 's/^-//' | tr '[:upper:]' '[:lower:]'
}

# Admin pages
mv src/app/admin/clinics/page.js src/app/admin/clinics/ClinicsManagement.jsx
mv src/app/admin/users/page.js src/app/admin/users/UsersManagement.jsx
mv src/app/admin/services/page.js src/app/admin/services/ServicesManagement.jsx
mv src/app/admin/staff/page.js src/app/admin/staff/StaffManagement.jsx
mv src/app/admin/dashboard/page.js src/app/admin/dashboard/AdminDashboard.jsx
mv src/app/admin/settings/page.js src/app/admin/settings/SystemSettingsPage.jsx

# Admin reports
mv src/app/admin/reports/audit/page.js src/app/admin/reports/audit/SystemAudit.jsx
mv src/app/admin/reports/financial/page.js src/app/admin/reports/financial/FinancialReport.jsx
mv src/app/admin/reports/activity/page.js src/app/admin/reports/activity/UserActivityReport.jsx

# Auth pages
mv src/app/auth/signin/page.js src/app/auth/signin/SignInPage.jsx
mv src/app/auth/signup/page.js src/app/auth/signup/SignUpPage.jsx
mv src/app/auth/login/page.js src/app/auth/login/LoginPage.jsx
mv src/app/auth/register/page.js src/app/auth/register/RegisterPage.jsx
mv src/app/auth/forgot-password/page.js src/app/auth/forgot-password/ForgotPasswordPage.jsx

# Portal pages
mv src/app/portal/dashboard/page.js src/app/portal/dashboard/PatientPortal.jsx
mv src/app/portal/appointments/page.js src/app/portal/appointments/PatientAppointmentsPage.jsx
mv src/app/portal/book-appointment/page.js src/app/portal/book-appointment/BookAppointmentPage.jsx
mv src/app/portal/invoices/page.js src/app/portal/invoices/PatientInvoicesPage.jsx
mv src/app/portal/medical-records/page.js src/app/portal/medical-records/MedicalRecordsPage.jsx

# Main app pages
mv src/app/dashboard/page.js src/app/dashboard/Dashboard.jsx
mv src/app/patients/page.js src/app/patients/PatientsPage.jsx
mv src/app/consultations/page.js src/app/consultations/ConsultationsPage.jsx
mv src/app/prescriptions/page.js src/app/prescriptions/PrescriptionsPage.jsx
mv src/app/prescriptions/new/page.js src/app/prescriptions/new/NewPrescriptionPage.jsx
mv src/app/calendar/page.js src/app/calendar/CalendarPage.jsx
mv src/app/billing/page.js src/app/billing/BillingPage.jsx
mv src/app/analytics/page.js src/app/analytics/AnalyticsPage.jsx
mv src/app/notifications/page.js src/app/notifications/NotificationsPage.jsx
mv src/app/settings/page.js src/app/settings/SettingsPage.jsx
mv src/app/profile/page.js src/app/profile/ProfilePage.jsx

# Root pages
mv src/app/page.js src/app/Home.jsx
mv src/app/layout.js src/app/RootLayout.jsx

echo "✅ All page files renamed successfully!"
echo ""
echo "Note: You need to update Next.js routing configuration."
echo "Next.js App Router requires 'page.jsx' naming convention."
