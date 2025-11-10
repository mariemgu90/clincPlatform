# File Naming Conventions

## ✅ Completed Migration: .js → .jsx

All React component files in the project have been converted from `.js` to `.jsx` extension.

---

## 📁 File Structure & Naming Rules

### **1. Next.js App Router Requirements**

Next.js App Router requires specific filenames that **CANNOT be changed**:

- ✅ `page.jsx` - Route pages (e.g., `/admin/clinics/page.jsx` → `/admin/clinics`)
- ✅ `layout.jsx` - Layout components
- ✅ `route.jsx` - API route handlers (e.g., `/api/patients/route.jsx`)
- ✅ `middleware.jsx` - Middleware

**⚠️ Important**: These filenames are mandatory for Next.js routing. Renaming them will break the application.

---

### **2. Function Names = Page Purpose**

While we cannot rename the files, we ensure function names clearly describe their purpose:

#### **Admin Pages**
```
📁 src/app/admin/clinics/page.jsx          → export default function ClinicsManagement()
📁 src/app/admin/users/page.jsx            → export default function UsersManagement()
📁 src/app/admin/services/page.jsx         → export default function ServicesManagement()
📁 src/app/admin/staff/page.jsx            → export default function StaffManagement()
📁 src/app/admin/dashboard/page.jsx        → export default function AdminDashboard()
📁 src/app/admin/clinic-settings/page.jsx  → export default function ClinicSettings()
📁 src/app/admin/settings/page.jsx         → export default function SystemSettingsPage()
```

#### **Admin Reports**
```
📁 src/app/admin/reports/audit/page.jsx     → export default function SystemAudit()
📁 src/app/admin/reports/financial/page.jsx → export default function FinancialReport()
📁 src/app/admin/reports/activity/page.jsx  → export default function UserActivityReport()
```

#### **Authentication Pages**
```
📁 src/app/auth/signin/page.jsx          → export default function SignInPage()
📁 src/app/auth/signup/page.jsx          → export default function SignUpPage()
📁 src/app/auth/login/page.jsx           → export default function LoginPage()
📁 src/app/auth/register/page.jsx        → export default function RegisterPage()
📁 src/app/auth/forgot-password/page.jsx → export default function ForgotPasswordPage()
```

#### **Patient Portal**
```
📁 src/app/portal/dashboard/page.jsx          → export default function PatientPortal()
📁 src/app/portal/appointments/page.jsx       → export default function PatientAppointmentsPage()
📁 src/app/portal/book-appointment/page.jsx   → export default function BookAppointmentPage()
📁 src/app/portal/invoices/page.jsx           → export default function PatientInvoicesPage()
📁 src/app/portal/medical-records/page.jsx    → export default function MedicalRecordsPage()
```

#### **Main Application Pages**
```
📁 src/app/page.jsx                    → export default function Home()
📁 src/app/dashboard/page.jsx          → export default function Dashboard()
📁 src/app/patients/page.jsx           → export default function PatientsPage()
📁 src/app/consultations/page.jsx      → export default function ConsultationsPage()
📁 src/app/prescriptions/page.jsx      → export default function PrescriptionsPage()
📁 src/app/prescriptions/new/page.jsx  → export default function NewPrescriptionPage()
📁 src/app/calendar/page.jsx           → export default function CalendarPage()
📁 src/app/billing/page.jsx            → export default function BillingPage()
📁 src/app/analytics/page.jsx          → export default function AnalyticsPage()
📁 src/app/notifications/page.jsx      → export default function NotificationsPage()
📁 src/app/settings/page.jsx           → export default function SettingsPage()
📁 src/app/profile/page.jsx            → export default function ProfilePage()
```

---

### **3. Component Files**

All reusable components use **descriptive PascalCase names with .jsx extension**:

```
📁 src/components/
  ├── AppointmentCard.jsx
  ├── AppointmentForm.jsx
  ├── AuthProvider.jsx
  ├── Button.jsx
  ├── CalendarView.jsx
  ├── ConsultationEditor.jsx
  ├── Header.jsx
  ├── InvoiceList.jsx
  ├── PatientCard.jsx
  ├── PatientForm.jsx
  ├── PatientList.jsx
  ├── PatientProfile.jsx
  ├── PrescriptionViewer.jsx
  ├── Sidebar.jsx
  └── StatsCard.jsx
```

**Rule**: Component filename = Component function name

Example:
```jsx
// File: src/components/PatientCard.jsx
export default function PatientCard({ patient }) {
  // ...
}
```

---

### **4. API Routes**

API route files must be named `route.jsx` but have descriptive folder structure:

```
📁 src/app/api/
  ├── admin/
  │   ├── staff/route.jsx          → GET/POST /api/admin/staff
  │   ├── staff/[id]/route.jsx     → PUT/DELETE /api/admin/staff/:id
  │   └── stats/route.jsx          → GET /api/admin/stats
  ├── appointments/
  │   ├── route.jsx                → GET/POST /api/appointments
  │   └── [id]/route.jsx           → GET/PUT/DELETE /api/appointments/:id
  ├── prescriptions/
  │   ├── route.jsx                → GET/POST /api/prescriptions
  │   └── [id]/pdf/route.jsx       → GET /api/prescriptions/:id/pdf
  └── patients/
      ├── route.jsx                → GET/POST /api/patients
      └── [id]/route.jsx           → GET/PUT/DELETE /api/patients/:id
```

---

### **5. Utility & Library Files**

```
📁 src/lib/
  ├── auth.jsx      → Authentication configuration (NextAuth)
  ├── prisma.jsx    → Prisma client singleton
  └── utils.jsx     → Utility functions
```

---

## 🎯 Naming Convention Summary

| File Type | Filename | Function Name | Extension |
|-----------|----------|---------------|-----------|
| **Pages** | `page.jsx` (required) | Descriptive PascalCase (e.g., `ClinicsManagement`) | `.jsx` |
| **Layouts** | `layout.jsx` (required) | `RootLayout`, `AdminLayout`, etc. | `.jsx` |
| **API Routes** | `route.jsx` (required) | N/A (exports HTTP handlers) | `.jsx` |
| **Components** | Match function name | PascalCase matching filename | `.jsx` |
| **Utilities** | Descriptive name | Named exports | `.jsx` |
| **Middleware** | `middleware.jsx` (required) | `middleware` function | `.jsx` |

---

## 📋 Benefits of This Structure

✅ **Clear Intent**: Function names immediately reveal the purpose of each page  
✅ **Next.js Compatible**: Follows App Router requirements exactly  
✅ **Consistent Extensions**: All React files use `.jsx` for clarity  
✅ **Easy Navigation**: Descriptive function names make debugging easier  
✅ **Type Safety Ready**: `.jsx` extension works with TypeScript JSX support  

---

## 🔄 Migration Completed

### **What Changed:**
- ✅ All `.js` files converted to `.jsx` (50+ files)
- ✅ Function names already matched page purpose
- ✅ File structure remains Next.js App Router compatible

### **What Stayed the Same:**
- ✅ Routing still works (page.jsx, route.jsx, layout.jsx)
- ✅ API endpoints unchanged
- ✅ Import statements automatically resolved by Next.js

---

## 📝 Example: ClinicsManagement

**File Structure:**
```
📁 src/app/admin/clinics/
  └── page.jsx  ← Next.js requires this exact name
```

**File Content:**
```jsx
'use client';

export default function ClinicsManagement() {
  // Function name describes the page purpose
  // File name follows Next.js convention
  return (
    <div>
      <h1>🏥 Clinics Management</h1>
      {/* ... */}
    </div>
  );
}
```

**URL Mapping:**
```
/admin/clinics → src/app/admin/clinics/page.jsx → ClinicsManagement()
```

---

## ✨ Best Practices

1. **Always use `.jsx` extension** for React components
2. **Keep `page.jsx` filenames** - they are required by Next.js
3. **Use descriptive function names** that match the page purpose
4. **Component files** should match their function name (e.g., `PatientCard.jsx` → `PatientCard()`)
5. **Folder structure** indicates the URL path
6. **Function names** indicate the component's purpose

---

**Last Updated**: November 7, 2025  
**Migration Status**: ✅ Complete  
**Files Converted**: 50+ files from `.js` to `.jsx`
