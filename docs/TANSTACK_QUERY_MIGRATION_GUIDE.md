# TanStack Query Migration Guide

## Migration Pattern

### Before (Old API Pattern)
```javascript
import { fetchServices, createService, updateService, deleteService } from '@/lib/api';

export default function Page() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const result = await fetchServices();
      setData(result);
    } catch (error) {
      console.error('Failed to fetch:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleCreate = async (formData) => {
    try {
      await createService(formData);
      loadData(); // Refetch
    } catch (error) {
      alert(error.message);
    }
  };
}
```

### After (TanStack Query Pattern)
```javascript
import { useServices, useCreateService, useUpdateService, useDeleteService } from '@/hooks';
import toast from 'react-hot-toast';

export default function Page() {
  // Query
  const servicesQuery = useServices();
  
  // Mutations
  const createMutation = useCreateService({
    onSuccess: () => {
      toast.success('Created successfully');
    },
    onError: (error) => {
      toast.error(error.message || 'Failed to create');
    },
  });

  const data = servicesQuery.data || [];
  const loading = servicesQuery.isLoading;

  const handleCreate = async (formData) => {
    await createMutation.mutateAsync(formData);
  };
}
```

## Key Changes

### 1. Remove Manual State Management
- ❌ Remove `useState([])` for data
- ❌ Remove `useState(true)` for loading
- ❌ Remove `useEffect` for initial loading
- ❌ Remove manual refetch calls

### 2. Add React Query Hooks
- ✅ Import hooks from `@/hooks`
- ✅ Use `useXXX()` for queries
- ✅ Use `useCreateXXX()`, `useUpdateXXX()`, `useDeleteXXX()` for mutations
- ✅ Access data via `query.data`
- ✅ Access loading via `query.isLoading`

### 3. Add Toast Notifications
- ✅ Import `toast` from `'react-hot-toast'`
- ✅ Add `onSuccess` callback with `toast.success()`
- ✅ Add `onError` callback with `toast.error()`
- ✅ Remove `alert()` calls

### 4. Automatic Refetching
- ✅ Mutations automatically refetch related queries
- ✅ No need to manually call `loadData()` after mutations
- ✅ Configured in hooks via `refetchUtils`

## Available Hooks

### Clinic Management
```javascript
import {
  useClinics,
  useClinicById,
  useCreateClinic,
  useUpdateClinic,
  useDeleteClinic,
  useStaffByClinic,
  useServicesByClinic,
  usePatientsByClinic,
} from '@/hooks';
```

### Patient Management
```javascript
import {
  usePatients,
  usePatientById,
  useCreatePatient,
  useUpdatePatient,
  useDeletePatient,
  usePatientsByClinic,
} from '@/hooks';
```

### Staff Management
```javascript
import {
  useStaff,
  useStaffById,
  useCreateStaff,
  useUpdateStaff,
  useDeleteStaff,
  useStaffByClinic,
  useLinkStaffToClinic,
  useUnlinkStaffFromClinic,
  useAssignStaffRole,
} from '@/hooks';
```

### Service Management
```javascript
import {
  useServices,
  useServiceById,
  useCreateService,
  useUpdateService,
  useDeleteService,
  useServicesByClinic,
  useLinkServiceToClinic,
  useUnlinkServiceFromClinic,
} from '@/hooks';
```

## Migration Checklist

### For Each Page:

- [ ] Replace `import { fetchXXX } from '@/lib/api'` with hook imports
- [ ] Remove `useState` for data and loading
- [ ] Remove `useEffect` for data loading
- [ ] Add query hooks (e.g., `const query = useServices()`)
- [ ] Add mutation hooks with callbacks
- [ ] Replace `data` with `query.data || []`
- [ ] Replace `loading` with `query.isLoading`
- [ ] Replace `alert()` with `toast.success()` / `toast.error()`
- [ ] Remove manual `loadData()` calls after mutations
- [ ] Test all CRUD operations

## Completed Migrations

### ✅ Admin Pages
1. **admin/services/page.jsx** - Migrated to useServices hooks
2. **admin/clinics/page.jsx** - Already using React Query hooks

### 🔄 In Progress
1. **admin/staff/page.jsx** - Needs migration
2. **admin/users/page.jsx** - Needs migration
3. **admin/roles/page.jsx** - Needs migration

### ⏳ Pending
1. **patients/page.jsx** - Needs migration
2. **prescriptions/page.jsx** - Needs migration
3. **billing/page.jsx** - Needs migration
4. **calendar/page.jsx** - Needs migration
5. **consultations/page.jsx** - Needs migration
6. **portal/** pages - Needs migration

## Benefits

### Performance
- ✅ Automatic caching
- ✅ Background refetching
- ✅ Deduplication of requests
- ✅ Optimistic updates

### User Experience
- ✅ Instant feedback with toast notifications
- ✅ Loading states handled automatically
- ✅ Error states handled gracefully
- ✅ Consistent UI behavior

### Developer Experience
- ✅ Less boilerplate code
- ✅ Centralized data management
- ✅ Type-safe API calls
- ✅ Easy to test and maintain
