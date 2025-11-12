# API Quick Reference Guide

## Quick Import Cheatsheet

```javascript
// Import everything you need in one line
import {
  // Admin
  fetchAdminStats, fetchStaff, createStaff, updateStaff, deleteStaff,
  fetchUsers, fetchRoles, createRole, updateRole, deleteRole,
  
  // Appointments
  fetchAppointments, createAppointment, updateAppointment, 
  cancelAppointment, deleteAppointment,
  
  // Patients
  fetchPatients, fetchPatientById, createPatient, 
  updatePatient, deletePatient,
  
  // Portal (Patient-facing)
  fetchPortalStats, fetchMedicalRecords, fetchPortalPrescriptions,
  
  // Prescriptions
  fetchPrescriptions, createPrescription, downloadPrescriptionPDF,
  
  // Services
  fetchServices, createService, updateService, deleteService,
  
  // Clinics
  fetchClinics, fetchClinicById, createClinic, updateClinic,
  
  // Invoices
  fetchInvoices, createInvoice, updateInvoice,
  
  // Consultations
  fetchConsultations, createConsultation, updateConsultation,
  
  // Dashboard
  fetchDashboardStats, fetchDashboardData
} from '@/lib/api';
```

## Common Patterns

### 1. Fetch List with Filters
```javascript
const appointments = await fetchAppointments({ 
  patientId: 'patient-123',
  status: 'SCHEDULED',
  limit: 10 
});
```

### 2. Create Resource
```javascript
const newPatient = await createPatient({
  firstName: 'John',
  lastName: 'Doe',
  email: 'john@example.com',
  phone: '555-0100'
});
```

### 3. Update Resource
```javascript
const updated = await updatePatient('patient-123', {
  phone: '555-0200'
});
```

### 4. Delete Resource
```javascript
await deletePatient('patient-123');
```

### 5. Cancel Operation (Convenience)
```javascript
await cancelAppointment('appointment-456');
// Equivalent to: updateAppointment('appointment-456', { status: 'CANCELLED' })
```

## Error Handling Template

```javascript
const MyComponent = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const result = await fetchAppointments({ patientId: '123' });
      setData(result);
      setError(null);
    } catch (err) {
      console.error('Error:', err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;
  
  return <div>{/* Render data */}</div>;
};
```

## Function Signatures

### Admin APIs
```typescript
fetchAdminStats() → Promise<Object>
fetchStaff({ clinicId?: string }) → Promise<Array>
createStaff(data: Object) → Promise<Object>
updateStaff(id: string, data: Object) → Promise<Object>
deleteStaff(id: string) → Promise<boolean>
fetchRoles() → Promise<Array>
fetchUsers({ role?: string }) → Promise<Array>
```

### Appointment APIs
```typescript
fetchAppointments({ 
  patientId?: string,
  doctorId?: string,
  limit?: number,
  status?: string 
}) → Promise<Array>

createAppointment(data: Object) → Promise<Object>
updateAppointment(id: string, data: Object) → Promise<Object>
cancelAppointment(id: string) → Promise<Object>
```

### Patient APIs
```typescript
fetchPatients({ 
  clinicId?: string,
  page?: number,
  limit?: number,
  search?: string 
}) → Promise<Array|Object>

fetchPatientById(id: string) → Promise<Object>
createPatient(data: Object) → Promise<Object>
updatePatient(id: string, data: Object) → Promise<Object>
deletePatient(id: string) → Promise<boolean>
```

### Portal APIs
```typescript
fetchPortalStats() → Promise<Object>
fetchMedicalRecords({ limit?: number, offset?: number }) → Promise<Array>
fetchPortalPrescriptions({ status?: string }) → Promise<Array>
fetchPortalInvoices(patientId: string) → Promise<Array>
```

### Prescription APIs
```typescript
fetchPrescriptions({ 
  patientId?: string,
  doctorId?: string,
  status?: string 
}) → Promise<Array>

createPrescription(data: Object) → Promise<Object>
downloadPrescriptionPDF(id: string) → Promise<Blob>
```

## Common Use Cases

### Use Case 1: Patient Dashboard
```javascript
import { fetchPortalStats } from '@/lib/api';

const fetchData = async () => {
  const stats = await fetchPortalStats();
  // Returns: { stats, nextAppointment, lastVisit, healthMetrics, patient }
};
```

### Use Case 2: Appointment Booking
```javascript
import { fetchServices, fetchUsers, createAppointment } from '@/lib/api';

const bookAppointment = async () => {
  // Get available services
  const services = await fetchServices({ activeOnly: true });
  
  // Get doctors
  const doctors = await fetchUsers({ role: 'DOCTOR' });
  
  // Create appointment
  const appointment = await createAppointment({
    patientId: 'patient-123',
    doctorId: 'doctor-456',
    serviceId: 'service-789',
    startTime: '2024-11-10T10:00:00Z',
    notes: 'First consultation'
  });
};
```

### Use Case 3: Admin Staff Management
```javascript
import { 
  fetchStaff, 
  fetchRoles, 
  fetchClinics, 
  createStaff 
} from '@/lib/api';

const setupStaffPage = async () => {
  // Parallel fetch for performance
  const [staff, roles, clinics] = await Promise.all([
    fetchStaff(),
    fetchRoles(),
    fetchClinics()
  ]);
  
  // Create new staff member
  const newStaff = await createStaff({
    name: 'Dr. Jane Smith',
    email: 'jane@clinic.com',
    role: 'DOCTOR',
    clinicId: clinics[0].id
  });
};
```

### Use Case 4: Medical Records Timeline
```javascript
import { fetchMedicalRecords } from '@/lib/api';

const loadRecords = async (page = 1) => {
  const limit = 10;
  const offset = (page - 1) * limit;
  
  const records = await fetchMedicalRecords({ limit, offset });
  // Returns: { consultations: [...] }
};
```

## Migration Checklist

When refactoring a page:

- [ ] Import API functions at top of file
- [ ] Replace `fetch()` calls with API helpers
- [ ] Remove manual URL construction
- [ ] Remove manual `response.ok` checks
- [ ] Remove manual `response.json()` calls
- [ ] Update error handling to use `error.message`
- [ ] Rename conflicting function names if needed
- [ ] Test all CRUD operations
- [ ] Verify error messages work
- [ ] Check loading states

## Performance Tips

### 1. Parallel Requests
```javascript
// ✅ Good - Parallel (faster)
const [patients, appointments] = await Promise.all([
  fetchPatients({ limit: 5 }),
  fetchAppointments({ limit: 5 })
]);

// ❌ Bad - Sequential (slower)
const patients = await fetchPatients({ limit: 5 });
const appointments = await fetchAppointments({ limit: 5 });
```

### 2. Pagination
```javascript
// For large datasets
const patients = await fetchPatients({ 
  page: 1, 
  limit: 20,
  search: query 
});
```

### 3. Filtering
```javascript
// Filter on server, not client
const activeRx = await fetchPrescriptions({ status: 'ACTIVE' });
// Better than: const all = await fetchPrescriptions(); const active = all.filter(...)
```

## Debugging

### Enable Detailed Logging
```javascript
const fetchData = async () => {
  try {
    console.log('Fetching appointments for patient:', patientId);
    const data = await fetchAppointments({ patientId });
    console.log('Received appointments:', data);
    return data;
  } catch (error) {
    console.error('Fetch failed:', error);
    console.error('Error stack:', error.stack);
    throw error;
  }
};
```

### Common Errors

**"Failed to fetch X"**
- Check API endpoint is running
- Verify authentication
- Check network connectivity

**"TypeError: X is not a function"**
- Verify import statement
- Check function name spelling
- Ensure API module is properly exported

**"Cannot read property of undefined"**
- Check API response structure
- Add optional chaining: `data?.consultations`
- Provide fallback: `data.consultations || []`

## Best Practices

1. ✅ **Always use try-catch** around API calls
2. ✅ **Provide user feedback** on errors
3. ✅ **Set loading states** appropriately
4. ✅ **Use TypeScript/JSDoc** for type hints
5. ✅ **Handle empty states** (no data)
6. ✅ **Add meaningful error messages**
7. ✅ **Test with invalid data**
8. ✅ **Use pagination** for large lists
9. ✅ **Batch requests** when possible
10. ✅ **Cache when appropriate**

---

**Last Updated**: November 2024
**Version**: 1.0
**Status**: Production Ready
