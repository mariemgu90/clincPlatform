# React Query Hooks - Complete Usage Guide

## Overview

All React Query hooks now support automatic refetching and local `onSuccess`/`onError` callbacks. They include:
- ✅ Automatic toast notifications
- ✅ Query invalidation for automatic data refresh
- ✅ Local callback support for component-specific logic
- ✅ Full TypeScript support

---

## Pattern: onSuccess & onError Callbacks

### Standard Hook Pattern

```javascript
const mutation = useCreateClinic({
  onSuccess: (data) => {
    // Your custom logic after success
    console.log('Created:', data);
    // Modal will close, form will reset, etc.
  },
  onError: (error) => {
    // Your custom error handling
    console.log('Error:', error.message);
  },
});

// Use it
await mutation.mutateAsync(formData);
```

### What Happens Automatically

When you call any mutation:
1. ✅ Toast notification is shown (success or error)
2. ✅ Queries are invalidated and refetched
3. ✅ Local callbacks (`onSuccess`/`onError`) are called
4. ✅ Data is updated in React Query cache

---

## Clinic Hooks

### Create Clinic

```javascript
'use client';

import { useState } from 'react';
import { useCreateClinic } from '@/hooks';

export function CreateClinicForm() {
  const [formData, setFormData] = useState({ name: '', email: '' });
  const [showModal, setShowModal] = useState(false);
  
  const createMutation = useCreateClinic({
    onSuccess: (newClinic) => {
      // Your custom logic
      setShowModal(false);
      setFormData({ name: '', email: '' });
      console.log('Clinic created:', newClinic);
    },
    onError: (error) => {
      // Custom error handling
      console.log('Creation failed:', error.message);
    },
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await createMutation.mutateAsync(formData);
      // Success toast shown automatically
      // onSuccess callback called automatically
    } catch (error) {
      // Error already handled by hook
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <input
        value={formData.name}
        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
        placeholder="Clinic name"
      />
      <button disabled={createMutation.isPending}>
        {createMutation.isPending ? 'Creating...' : 'Create'}
      </button>
    </form>
  );
}
```

### Update Clinic

```javascript
const updateMutation = useUpdateClinic({
  onSuccess: (updatedClinic) => {
    // Refetch complete
    // Toast shown automatically
    setEditMode(false);
  },
  onError: (error) => {
    console.error(error.message);
  },
});

// Use it
await updateMutation.mutateAsync({
  id: clinicId,
  data: { name: 'New Name', email: 'new@email.com' }
});
```

### Delete Clinic

```javascript
const deleteMutation = useDeleteClinic({
  onSuccess: () => {
    // Queries refetched automatically
    // Toast shown automatically
    setShowConfirmDialog(false);
    router.push('/admin/clinics'); // Optional navigation
  },
  onError: (error) => {
    console.error(error.message);
  },
});

// Use it
await deleteMutation.mutateAsync(clinicId);
```

---

## Patient Hooks

### Create Patient

```javascript
const createPatientMutation = useCreatePatient({
  onSuccess: (newPatient) => {
    setShowAddModal(false);
    // Patient list automatically refetched
    // Clinic patient list automatically refetched
  },
  onError: (error) => {
    // Handle error
  },
});

await createPatientMutation.mutateAsync({
  firstName: 'John',
  lastName: 'Doe',
  email: 'john@example.com',
  clinicId: '123'
});
```

### Update Patient

```javascript
const updatePatientMutation = useUpdatePatient({
  onSuccess: (updatedPatient) => {
    setEditMode(false);
  },
});

await updatePatientMutation.mutateAsync({
  id: patientId,
  data: { firstName: 'Jane', lastName: 'Doe' }
});
```

### Delete Patient

```javascript
const deletePatientMutation = useDeletePatient({
  onSuccess: () => {
    setSelectedPatient(null);
  },
});

await deletePatientMutation.mutateAsync(patientId);
```

---

## Staff Hooks

### Create Staff

```javascript
const createStaffMutation = useCreateStaff({
  onSuccess: (newStaff) => {
    setShowStaffModal(false);
    // All staff queries refetched
    // Clinic staff queries refetched
  },
});

await createStaffMutation.mutateAsync({
  name: 'Dr. Smith',
  role: 'DOCTOR',
  clinicId: '123'
});
```

### Update Staff

```javascript
const updateStaffMutation = useUpdateStaff({
  onSuccess: (updatedStaff) => {
    setEditingStaff(null);
  },
});

await updateStaffMutation.mutateAsync({
  id: staffId,
  data: { name: 'Dr. Jane Smith', role: 'DOCTOR' }
});
```

### Delete Staff

```javascript
const deleteStaffMutation = useDeleteStaff({
  onSuccess: () => {
    setShowDeleteConfirm(false);
  },
});

await deleteStaffMutation.mutateAsync(staffId);
```

### Assign Role

```javascript
const assignRoleMutation = useAssignStaffRole({
  onSuccess: (updatedStaff) => {
    console.log('Role assigned:', updatedStaff.role);
  },
});

await assignRoleMutation.mutateAsync({
  id: staffId,
  role: 'ADMIN'
});
```

### Link Staff to Clinic

```javascript
const linkStaffMutation = useLinkStaffToClinic({
  onSuccess: (staffMember) => {
    // Automatically refetches:
    // - All staff
    // - Staff by clinic
    // - Clinic data
    setShowLinkModal(false);
  },
});

await linkStaffMutation.mutateAsync({
  staffId: '123',
  clinicId: '456'
});
```

### Unlink Staff from Clinic

```javascript
const unlinkStaffMutation = useUnlinkStaffFromClinic({
  onSuccess: () => {
    // Queries refetched
  },
});

await unlinkStaffMutation.mutateAsync(staffId);
```

---

## Service Hooks

### Create Service

```javascript
const createServiceMutation = useCreateService({
  onSuccess: (newService) => {
    setShowServiceModal(false);
    // All service queries refetched
    // Clinic service queries refetched
  },
});

await createServiceMutation.mutateAsync({
  name: 'Consultation',
  category: 'General',
  duration: '30',
  price: '50',
  clinicId: '123'
});
```

### Update Service

```javascript
const updateServiceMutation = useUpdateService({
  onSuccess: (updatedService) => {
    setEditingService(null);
  },
});

await updateServiceMutation.mutateAsync({
  id: serviceId,
  data: { name: 'Consultation', price: '60' }
});
```

### Delete Service

```javascript
const deleteServiceMutation = useDeleteService({
  onSuccess: () => {
    setShowDeleteConfirm(false);
  },
});

await deleteServiceMutation.mutateAsync(serviceId);
```

### Link Service to Clinic

```javascript
const linkServiceMutation = useLinkServiceToClinic({
  onSuccess: () => {
    setShowLinkModal(false);
  },
});

await linkServiceMutation.mutateAsync({
  serviceId: '123',
  clinicId: '456'
});
```

### Unlink Service from Clinic

```javascript
const unlinkServiceMutation = useUnlinkServiceFromClinic({
  onSuccess: () => {
    // Queries refetched
  },
});

await unlinkServiceMutation.mutateAsync(serviceId);
```

---

## Complete Component Example

```javascript
'use client';

import { useState } from 'react';
import { useCreateClinic, useClinics, useDeleteClinic } from '@/hooks';

export default function ClinicsPage() {
  const [formData, setFormData] = useState({ name: '', email: '' });
  const [showAddModal, setShowAddModal] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [selectedClinic, setSelectedClinic] = useState(null);

  // Queries
  const { data: clinics = [], isLoading } = useClinics();

  // Mutations with callbacks
  const createMutation = useCreateClinic({
    onSuccess: (newClinic) => {
      setShowAddModal(false);
      setFormData({ name: '', email: '' });
    },
  });

  const deleteMutation = useDeleteClinic({
    onSuccess: () => {
      setShowDeleteConfirm(false);
      setSelectedClinic(null);
    },
  });

  const handleAddClinic = async (e) => {
    e.preventDefault();
    await createMutation.mutateAsync(formData);
    // Toast shown automatically
    // Data refetched automatically
    // Modal closed via onSuccess
  };

  const handleDeleteClinic = async (clinic) => {
    await deleteMutation.mutateAsync(clinic.id);
    // Toast shown automatically
    // Data refetched automatically
    // Dialog closed via onSuccess
  };

  if (isLoading) return <div>Loading...</div>;

  return (
    <div>
      <button onClick={() => setShowAddModal(true)}>Add Clinic</button>

      {showAddModal && (
        <div>
          <form onSubmit={handleAddClinic}>
            <input
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              placeholder="Name"
            />
            <button disabled={createMutation.isPending}>
              {createMutation.isPending ? 'Adding...' : 'Add'}
            </button>
          </form>
        </div>
      )}

      <div>
        {clinics.map((clinic) => (
          <div key={clinic.id}>
            <h3>{clinic.name}</h3>
            <button
              onClick={() => {
                setSelectedClinic(clinic);
                setShowDeleteConfirm(true);
              }}
            >
              Delete
            </button>
          </div>
        ))}
      </div>

      {showDeleteConfirm && selectedClinic && (
        <div>
          <p>Delete {selectedClinic.name}?</p>
          <button
            onClick={() => {
              setShowDeleteConfirm(false);
              setSelectedClinic(null);
            }}
          >
            Cancel
          </button>
          <button
            onClick={() => handleDeleteClinic(selectedClinic)}
            disabled={deleteMutation.isPending}
          >
            {deleteMutation.isPending ? 'Deleting...' : 'Delete'}
          </button>
        </div>
      )}
    </div>
  );
}
```

---

## Key Features

### Automatic Query Invalidation

After any mutation, these queries are automatically invalidated:

**Create Operation:**
- Lists (auto-refetch)
- Related clinic/clinic-specific lists

**Update Operation:**
- Lists (auto-refetch)
- Specific detail query
- Related queries

**Delete Operation:**
- Lists (auto-refetch)
- Detail query (removed)
- Related queries

**Link/Unlink Operations:**
- All affected resource lists
- Clinic queries
- Related resource lists

### Automatic Toast Notifications

- ✅ Success toasts on successful mutations
- ❌ Error toasts on failed mutations
- 📝 Customizable messages

### Local Callbacks

Pass `onSuccess` and `onError` to mutations:

```javascript
const mutation = useMutation({
  onSuccess: (data) => {
    // Your logic here
  },
  onError: (error) => {
    // Your error handling
  },
});
```

---

## Error Handling

```javascript
const mutation = useCreateClinic({
  onError: (error) => {
    // Error object with message property
    console.log('Error:', error.message);
    
    // Toast is already shown with error message
    // You can add custom error handling here
  },
});
```

---

## Checking Mutation Status

```javascript
const mutation = useCreateClinic();

return (
  <button disabled={mutation.isPending}>
    {mutation.isPending ? 'Creating...' : 'Create'}
  </button>
);
```

Status properties:
- `isPending` - Mutation is in progress
- `isError` - Mutation failed
- `isSuccess` - Mutation succeeded

---

## Summary

✅ All mutations automatically:
- Show toast notifications
- Invalidate necessary queries
- Call local callbacks
- Update cache

✅ Components can:
- Show loading state with `isPending`
- Add custom logic with `onSuccess`
- Add error handling with `onError`
- Close modals/forms via callbacks

✅ Data is always fresh:
- After any operation, queries are refetched
- UI updates automatically
- No manual refresh needed
