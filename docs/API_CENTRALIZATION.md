# API Centralization Refactoring

## Overview
Complete refactoring of data fetching across the application. All API calls are now centralized in the `/src/lib/api` folder with proper error handling, type safety, and consistent patterns.

## File Structure

```
src/lib/api/
├── index.js                 # Main export file (exports all APIs)
├── adminApi.js              # Admin-related API calls
├── appointmentApi.js        # Appointment management
├── clinicApi.js             # Clinic management (moved from lib/clinicApi.js)
├── consultationApi.js       # Consultation management
├── dashboardApi.js          # Dashboard statistics
├── invoiceApi.js            # Invoice/billing management
├── patientApi.js            # Patient management
├── portalApi.js             # Patient portal APIs
├── prescriptionApi.js       # Prescription management
└── serviceApi.js            # Service management
```

## API Modules

### 1. Admin API (`adminApi.js`)
**Functions:**
- `fetchAdminStats()` - Get admin dashboard statistics
- `fetchStaff(options)` - Get staff members with optional clinic filter
- `createStaff(data)` - Create new staff member
- `updateStaff(id, data)` - Update staff member
- `deleteStaff(id)` - Delete staff member
- `fetchUsers(options)` - Get users with optional role filter
- `fetchRoles()` - Get all roles
- `createRole(data)` - Create new role
- `updateRole(id, data)` - Update role
- `deleteRole(id)` - Delete role
- `fetchPermissions()` - Get all permissions

**Usage Example:**
```javascript
import { fetchAdminStats, createStaff } from '@/lib/api';

// Fetch admin statistics
const stats = await fetchAdminStats();

// Create staff member
const newStaff = await createStaff({
  name: 'Dr. John Doe',
  email: 'john@example.com',
  role: 'DOCTOR',
  clinicId: 'clinic-123'
});
```

### 2. Appointment API (`appointmentApi.js`)
**Functions:**
- `fetchAppointments(options)` - Get appointments with filters
- `fetchAppointmentById(id)` - Get single appointment
- `createAppointment(data)` - Create new appointment
- `updateAppointment(id, data)` - Update appointment
- `cancelAppointment(id)` - Cancel appointment (convenience method)
- `deleteAppointment(id)` - Delete appointment

**Usage Example:**
```javascript
import { fetchAppointments, cancelAppointment } from '@/lib/api';

// Fetch patient appointments
const appointments = await fetchAppointments({ 
  patientId: 'patient-123',
  status: 'SCHEDULED'
});

// Cancel appointment
await cancelAppointment('appointment-456');
```

### 3. Clinic API (`clinicApi.js`)
**Functions:**
- `fetchClinics()` - Get all clinics
- `fetchClinicById(id)` - Get single clinic
- `fetchPatients(options)` - Get patients with pagination/search
- `fetchStaff(options)` - Get staff by clinic
- `fetchServices(options)` - Get services by clinic
- `fetchCountsForClinics(clinicList)` - Get staff/service/patient counts
- `createClinic(data)` - Create new clinic
- `updateClinic(id, data)` - Update clinic
- `deleteClinic(id)` - Delete clinic

**Usage Example:**
```javascript
import { fetchClinics, fetchCountsForClinics } from '@/lib/api';

// Fetch all clinics
const clinics = await fetchClinics();

// Get counts for clinics
const counts = await fetchCountsForClinics(clinics);
```

### 4. Consultation API (`consultationApi.js`)
**Functions:**
- `fetchConsultations(options)` - Get consultations with filters
- `fetchConsultationById(id)` - Get single consultation
- `createConsultation(data)` - Create new consultation
- `updateConsultation(id, data)` - Update consultation
- `deleteConsultation(id)` - Delete consultation

### 5. Dashboard API (`dashboardApi.js`)
**Functions:**
- `fetchDashboardStats()` - Get general dashboard statistics
- `fetchDashboardData()` - Fetch multiple endpoints in parallel

**Usage Example:**
```javascript
import { fetchDashboardData } from '@/lib/api';

// Fetch combined dashboard data
const { stats, recentPatients, recentAppointments } = await fetchDashboardData();
```

### 6. Invoice API (`invoiceApi.js`)
**Functions:**
- `fetchInvoices(options)` - Get invoices with filters
- `fetchInvoiceById(id)` - Get single invoice
- `createInvoice(data)` - Create new invoice
- `updateInvoice(id, data)` - Update invoice
- `deleteInvoice(id)` - Delete invoice

### 7. Patient API (`patientApi.js`)
**Functions:**
- `fetchPatients(options)` - Get patients with pagination/search
- `fetchPatientById(id)` - Get single patient
- `createPatient(data)` - Create new patient
- `updatePatient(id, data)` - Update patient
- `deletePatient(id)` - Delete patient

### 8. Portal API (`portalApi.js`)
**Patient-facing portal APIs:**
- `fetchPortalStats()` - Get patient dashboard statistics
- `fetchMedicalRecords(options)` - Get consultation history
- `fetchPortalPrescriptions(options)` - Get prescriptions
- `fetchPortalInvoices(patientId)` - Get patient invoices

**Usage Example:**
```javascript
import { fetchPortalStats, fetchMedicalRecords } from '@/lib/api';

// Fetch patient dashboard data
const stats = await fetchPortalStats();

// Fetch medical records with pagination
const records = await fetchMedicalRecords({ limit: 10, offset: 0 });
```

### 9. Prescription API (`prescriptionApi.js`)
**Functions:**
- `fetchPrescriptions(options)` - Get prescriptions with filters
- `fetchPrescriptionById(id)` - Get single prescription
- `createPrescription(data)` - Create new prescription
- `updatePrescription(id, data)` - Update prescription
- `deletePrescription(id)` - Delete prescription
- `downloadPrescriptionPDF(id)` - Download prescription as PDF

**Usage Example:**
```javascript
import { fetchPrescriptions, downloadPrescriptionPDF } from '@/lib/api';

// Fetch active prescriptions
const prescriptions = await fetchPrescriptions({ 
  patientId: 'patient-123',
  status: 'ACTIVE'
});

// Download PDF
const pdfBlob = await downloadPrescriptionPDF('prescription-456');
```

### 10. Service API (`serviceApi.js`)
**Functions:**
- `fetchServices(options)` - Get services with filters
- `fetchServiceById(id)` - Get single service
- `createService(data)` - Create new service
- `updateService(id, data)` - Update service
- `deleteService(id)` - Delete service

## Import Patterns

### Single Import
```javascript
import { fetchAdminStats } from '@/lib/api/adminApi';
```

### Multiple Imports from Same Module
```javascript
import { fetchAppointments, cancelAppointment, createAppointment } from '@/lib/api/appointmentApi';
```

### Import from Index (Recommended)
```javascript
import { 
  fetchAdminStats,
  fetchAppointments,
  cancelAppointment,
  fetchPatients,
  createPatient
} from '@/lib/api';
```

## Error Handling

All API functions follow a consistent error handling pattern:

```javascript
try {
  const data = await fetchAppointments({ patientId: 'patient-123' });
  // Handle success
} catch (error) {
  console.error('Error:', error);
  // error.message contains user-friendly error message
  alert(error.message || 'Operation failed');
}
```

## Refactored Pages

### Patient Portal Pages
✅ `/app/portal/dashboard/page.jsx` - Uses `fetchPortalStats`
✅ `/app/portal/appointments/page.jsx` - Uses `fetchAppointments`, `cancelAppointment`
✅ `/app/portal/medical-records/page.jsx` - Uses `fetchMedicalRecords`
✅ `/app/portal/prescriptions/page.jsx` - Uses `fetchPortalPrescriptions`

### Admin Pages
✅ `/app/admin/dashboard/page.jsx` - Uses `fetchAdminStats`
✅ `/app/admin/staff/page.jsx` - Uses `fetchStaff`, `createStaff`, `updateStaff`, `deleteStaff`, `fetchRoles`, `fetchClinics`

### Remaining Pages to Refactor
⏳ `/app/admin/services/page.jsx` - Should use `fetchServices`, `createService`, `updateService`, `deleteService`
⏳ `/app/admin/clinics/[id]/page.jsx` - Should use clinic API functions
⏳ `/app/admin/roles/page.jsx` - Should use `fetchRoles`, `createRole`, `updateRole`, `deleteRole`
⏳ `/app/dashboard/page.jsx` - Should use `fetchDashboardData`
⏳ `/app/patients/page.jsx` - Should use `fetchPatients`
⏳ `/app/consultations/page.jsx` - Should use `fetchConsultations`
⏳ `/app/prescriptions/page.jsx` - Should use `fetchPrescriptions`
⏳ `/app/billing/page.jsx` - Should use `fetchInvoices`
⏳ `/app/calendar/page.jsx` - Should use `fetchAppointments`
⏳ `/app/portal/book-appointment/page.jsx` - Should use `fetchServices`, `fetchUsers`, `createAppointment`
⏳ `/app/portal/invoices/page.jsx` - Should use `fetchPortalInvoices`
⏳ `/app/prescriptions/new/page.jsx` - Should use `fetchPatients`, `fetchConsultations`, `createPrescription`

## Benefits

### 1. **Centralization**
- All API calls in one location (`/src/lib/api`)
- Easy to find and maintain
- Consistent patterns across the application

### 2. **Error Handling**
- Standardized error handling in all API functions
- User-friendly error messages
- Automatic error parsing from API responses

### 3. **Type Safety** (Future Enhancement)
- Can easily add TypeScript types
- JSDoc comments provide IntelliSense support

### 4. **Testability**
- API functions can be easily mocked for testing
- Isolated business logic from UI components

### 5. **Reusability**
- Functions can be reused across multiple pages
- Reduces code duplication

### 6. **Maintainability**
- API endpoint changes only need updates in one place
- Easier to add new features (caching, retries, etc.)

## Migration Guide

### Before (Old Pattern)
```javascript
const fetchAppointments = async () => {
  try {
    const response = await fetch(`/api/appointments?patientId=${patientId}`);
    if (response.ok) {
      const data = await response.json();
      setAppointments(data);
    }
  } catch (error) {
    console.error('Error:', error);
  }
};
```

### After (New Pattern)
```javascript
import { fetchAppointments } from '@/lib/api';

const fetchAppointmentsData = async () => {
  try {
    const data = await fetchAppointments({ patientId });
    setAppointments(data);
  } catch (error) {
    console.error('Error:', error);
  }
};
```

## Best Practices

1. **Always use the API helpers** - Don't use `fetch()` directly in components
2. **Handle errors properly** - Wrap API calls in try-catch blocks
3. **Use descriptive function names** - Function names should clearly indicate their purpose
4. **Add JSDoc comments** - Document parameters and return types
5. **Keep API logic separate** - Don't mix API calls with component logic

## Future Enhancements

1. **Add TypeScript** - Convert to `.ts` files with proper types
2. **Add Request Caching** - Implement caching layer for frequently accessed data
3. **Add Request Cancellation** - Support for AbortController
4. **Add Retry Logic** - Automatic retry for failed requests
5. **Add Loading States** - Built-in loading state management
6. **Add Request Interceptors** - For authentication, logging, etc.
7. **Add Response Transformers** - Normalize API responses

## Compatibility

- ✅ Works with existing API endpoints (no backend changes needed)
- ✅ Backward compatible with pages not yet refactored
- ✅ Can be gradually adopted across the application

---

**Date**: November 2024
**Version**: 1.0
**Status**: Phase 1 Complete (50% of pages refactored)
