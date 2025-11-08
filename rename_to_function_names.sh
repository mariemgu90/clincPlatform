#!/bin/bash

# WARNING: This will break Next.js App Router routing!
# Next.js requires page.jsx naming convention

echo "⚠️  WARNING: This will break Next.js routing!"
echo "Next.js App Router requires 'page.jsx' filenames."
echo ""
read -p "Are you sure you want to continue? (yes/no): " confirm

if [ "$confirm" != "yes" ]; then
    echo "Operation cancelled."
    exit 0
fi

echo "Starting file renaming process..."

# Admin pages
mv src/app/admin/dashboard/page.jsx src/app/admin/dashboard/admin-dashboard.jsx
mv src/app/admin/clinics/page.jsx src/app/admin/clinics/clinics-management.jsx
mv src/app/admin/users/page.jsx src/app/admin/users/users-management.jsx
mv src/app/admin/services/page.jsx src/app/admin/services/services-management.jsx
mv src/app/admin/staff/page.jsx src/app/admin/staff/staff-management.jsx
mv src/app/admin/settings/page.jsx src/app/admin/settings/system-settings-page.jsx

# Admin reports
mv src/app/admin/reports/audit/page.jsx src/app/admin/reports/audit/system-audit.jsx
mv src/app/admin/reports/financial/page.jsx src/app/admin/reports/financial/financial-report.jsx
mv src/app/admin/reports/activity/page.jsx src/app/admin/reports/activity/user-activity-report.jsx

# Auth pages
mv src/app/auth/signin/page.jsx src/app/auth/signin/sign-in-page.jsx
mv src/app/auth/signup/page.jsx src/app/auth/signup/sign-up-page.jsx
mv src/app/auth/login/page.jsx src/app/auth/login/login-page.jsx
mv src/app/auth/register/page.jsx src/app/auth/register/register-page.jsx
mv src/app/auth/forgot-password/page.jsx src/app/auth/forgot-password/forgot-password-page.jsx

# Portal pages
mv src/app/portal/dashboard/page.jsx src/app/portal/dashboard/patient-portal.jsx
mv src/app/portal/appointments/page.jsx src/app/portal/appointments/patient-appointments-page.jsx
mv src/app/portal/book-appointment/page.jsx src/app/portal/book-appointment/book-appointment-page.jsx
mv src/app/portal/invoices/page.jsx src/app/portal/invoices/patient-invoices-page.jsx
mv src/app/portal/medical-records/page.jsx src/app/portal/medical-records/medical-records-page.jsx

# Main app pages
mv src/app/dashboard/page.jsx src/app/dashboard/dashboard.jsx
mv src/app/patients/page.jsx src/app/patients/patients-page.jsx
mv src/app/consultations/page.jsx src/app/consultations/consultations-page.jsx
mv src/app/prescriptions/page.jsx src/app/prescriptions/prescriptions-page.jsx
mv src/app/prescriptions/new/page.jsx src/app/prescriptions/new/new-prescription-page.jsx
mv src/app/calendar/page.jsx src/app/calendar/calendar-page.jsx
mv src/app/billing/page.jsx src/app/billing/billing-page.jsx
mv src/app/analytics/page.jsx src/app/analytics/analytics-page.jsx
mv src/app/notifications/page.jsx src/app/notifications/notifications-page.jsx
mv src/app/settings/page.jsx src/app/settings/settings-page.jsx
mv src/app/profile/page.jsx src/app/profile/profile-page.jsx

# Root pages
mv src/app/page.jsx src/app/home.jsx
mv src/app/layout.jsx src/app/root-layout.jsx

echo ""
echo "✅ All files renamed!"
echo ""
echo "⚠️  IMPORTANT NEXT STEPS:"
echo "1. Your Next.js App Router will NOT work anymore"
echo "2. You need to manually import these files in new page.jsx files"
echo "3. Or switch to a different routing mechanism"
echo ""
echo "Files renamed based on their export function names."
