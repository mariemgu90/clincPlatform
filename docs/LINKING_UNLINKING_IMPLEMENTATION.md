# Staff and Service Linking/Unlinking Implementation

## Overview
Implemented comprehensive linking and unlinking functionality for staff and services to clinics with proper API endpoints and helper functions.

## Changes Made

### 1. Database Schema Updates
**File**: `/prisma/schema.prisma`

Made `Service.clinicId` nullable to allow services to exist without clinic assignment:
```prisma
model Service {
  id          String   @id @default(cuid())
  name        String
  description String?
  duration    Int      // in minutes
  price       Float
  active      Boolean  @default(true)
  clinicId    String?  // Changed from String to String? (nullable)
  clinic      Clinic?  @relation(fields: [clinicId], references: [id]) // Changed from Clinic to Clinic?
  
  // ... rest of fields
}
```

**Applied to database**: `npx prisma db push` (completed successfully)
**Generated client**: `npx prisma generate` (completed successfully)

---

### 2. Staff API Helper Functions
**File**: `/src/lib/api/staffApi.js`

Added two new helper functions:

#### `unlinkStaffFromClinic(staffId)`
- Removes staff member from clinic by setting `clinicId` to `null`
- Uses PATCH method to `/api/admin/staff/${staffId}`
- Returns updated staff data

#### `linkStaffToClinic(staffId, clinicId)`
- Assigns staff member to a specific clinic
- Uses PATCH method to `/api/admin/staff/${staffId}`
- Returns updated staff data

**Usage Example**:
```javascript
// Unlink staff from clinic
await unlinkStaffFromClinic('staff-id-here');

// Link staff to clinic
await linkStaffToClinic('staff-id-here', 'clinic-id-here');
```

---

### 3. Service API Helper Functions
**File**: `/src/lib/api/serviceApi.js`

Added two new helper functions:

#### `unlinkServiceFromClinic(serviceId)`
- Removes service from clinic by setting `clinicId` to `null`
- Uses PATCH method to `/api/services/${serviceId}`
- Returns updated service data

#### `linkServiceToClinic(serviceId, clinicId)`
- Assigns service to a specific clinic
- Uses PATCH method to `/api/services/${serviceId}`
- Returns updated service data

**Usage Example**:
```javascript
// Unlink service from clinic
await unlinkServiceFromClinic('service-id-here');

// Link service to clinic
await linkServiceToClinic('service-id-here', 'clinic-id-here');
```

---

### 4. Staff API Endpoint Updates
**File**: `/src/app/api/admin/staff/[id]/route.jsx`

#### Added PATCH endpoint
- **Method**: PATCH
- **Purpose**: Update staff clinic assignment
- **Authorization**: Admin only
- **Parameters**: 
  - `id` (from URL): Staff member ID
  - `clinicId` (from body): Clinic ID or `null` to unlink

**Fixed**: Added `await params` to support Next.js 15+ async params

```javascript
export async function PATCH(request, { params }) {
  const { id } = await params; // Fixed async params
  const { clinicId } = await request.json();
  
  // Updates user.clinicId in database
}
```

---

### 5. Service API Endpoint Updates
**File**: `/src/app/api/services/[id]/route.jsx`

#### Added PATCH endpoint
- **Method**: PATCH
- **Purpose**: Update service clinic assignment
- **Authorization**: Admin only
- **Parameters**: 
  - `id` (from URL): Service ID
  - `clinicId` or `clinic` (from body): Clinic ID or `null` to unlink

**Fixed**: Added `await params` to support Next.js 15+ async params in all methods (PATCH, PUT, DELETE)

```javascript
export async function PATCH(request, { params }) {
  const { id } = await params; // Fixed async params
  const { clinicId, clinic } = await request.json();
  
  // Supports both field names for flexibility
  const finalClinicId = clinicId !== undefined ? clinicId : clinic;
  
  // Updates service.clinicId in database
}
```

---

### 6. Clinic Detail Page Updates
**File**: `/src/app/(app)/admin/clinics/[id]/page.jsx`

Refactored all handler functions to use centralized API helpers:

#### Staff Handlers
```javascript
// Unlink staff from clinic
const handleUnlinkStaffFromClinic = async (staffId) => {
  const result = await unlinkStaffFromClinic(staffId);
  // Refresh data...
};

// Link staff to clinic
const handleLinkStaff = async (selectedStaffIds) => {
  for (const staffId of selectedStaffIds) {
    await linkStaffToClinic(staffId, clinic.id);
  }
  // Refresh data...
};

// Save staff list (used in modal)
const handleSaveStaffList = async (staffListIds) => {
  for (const staffId of staffListIds) {
    await linkStaffToClinic(staffId, clinic.id);
  }
  // Refresh data...
};
```

#### Service Handlers
```javascript
// Link services to clinic
const handleLinkServices = async (serviceIds) => {
  for (const serviceId of serviceIds) {
    await linkServiceToClinic(serviceId, clinic.id);
  }
  // Refresh data...
};

// Save service list (used in modal)
const handleSaveServiceList = async (serviceListIds) => {
  for (const serviceId of serviceListIds) {
    await linkServiceToClinic(serviceId, clinic.id);
  }
  // Refresh data...
};
```

**Added Imports**:
```javascript
import { 
  unlinkStaffFromClinic, 
  linkStaffToClinic 
} from '@/lib/api/staffApi';

import { 
  linkServiceToClinic, 
  unlinkServiceFromClinic 
} from '@/lib/api/serviceApi';
```

---

## Benefits

### ✅ Centralized API Logic
- All API calls now use reusable helper functions
- Consistent error handling across the application
- Easier to maintain and test

### ✅ Proper REST Architecture
- PATCH endpoints for partial updates (clinic assignment)
- PUT endpoints for full updates (all service fields)
- DELETE endpoints for removal
- GET endpoints for retrieval

### ✅ Next.js 15+ Compatibility
- Fixed async params issue (`await params`)
- All route handlers now properly handle promises

### ✅ Flexible Service Management
- Services can exist without clinic assignment
- Easy to move services between clinics
- Supports both `clinicId` and `clinic` field names

### ✅ Type Safety
- Nullable clinicId in schema prevents data integrity issues
- Proper validation in API endpoints

---

## API Reference

### Staff Endpoints

#### PATCH `/api/admin/staff/[id]`
Update staff clinic assignment
```bash
curl -X PATCH http://localhost:3000/api/admin/staff/staff-id \
  -H "Content-Type: application/json" \
  -d '{"clinicId": "clinic-id-or-null"}'
```

### Service Endpoints

#### PATCH `/api/services/[id]`
Update service clinic assignment
```bash
curl -X PATCH http://localhost:3000/api/services/service-id \
  -H "Content-Type: application/json" \
  -d '{"clinicId": "clinic-id-or-null"}'
```

#### PUT `/api/services/[id]`
Update all service fields
```bash
curl -X PUT http://localhost:3000/api/services/service-id \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Service Name",
    "description": "Description",
    "duration": 30,
    "price": 50.00,
    "active": true
  }'
```

---

## Testing Status

### ✅ Completed
- Database schema updated and applied
- Prisma client regenerated
- API endpoints created and fixed
- Helper functions implemented
- UI handlers refactored

### ⏳ Pending
- Manual testing of linking/unlinking via UI
- Integration testing for edge cases
- Performance testing with large datasets

---

## Notes

- **Integration Linking**: Currently returns 501 Not Implemented. This needs to be implemented if integrations management is required.
- **Error Handling**: All functions include try-catch blocks with proper error messages
- **Authorization**: All endpoints require ADMIN role
- **Data Refresh**: UI automatically refreshes after link/unlink operations

---

## Future Enhancements

1. **Batch Operations**: Add endpoints for bulk linking/unlinking
2. **Audit Logging**: Track all clinic assignment changes
3. **Validation**: Add business rules (e.g., max services per clinic)
4. **Notifications**: Send notifications when staff/services are reassigned
5. **History**: Keep track of previous clinic assignments

---

**Last Updated**: December 2024
**Status**: ✅ Implementation Complete - Ready for Testing
