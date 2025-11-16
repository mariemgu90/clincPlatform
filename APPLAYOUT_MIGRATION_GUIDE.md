# AppLayout Migration Guide

## Overview
All pages inside `src/app/(app)/` now automatically use the **AppLayout** component, which includes Header and Sidebar. This eliminates repetitive code and provides a consistent layout across all authenticated pages.

## ✅ Already Updated Pages (20 total)
- ✓ src/app/(app)/dashboard/page.jsx
- ✓ src/app/(app)/patients/page.jsx
- ✓ src/app/(app)/admin/staff/page.jsx
- ✓ src/app/(app)/admin/roles/page.jsx
- ✓ And 16 more...

## ❌ Pages That Need Updating (19 remaining)

### Quick Reference: Update Pattern

#### BEFORE (Old Structure):
```javascript
'use client';

import { useState } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import Header from '@/components/Header';
import Sidebar from '@/components/Sidebar';

export default function MyPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [data, setData] = useState([]);

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/auth/signin');
    }
  }, [status, router]);

  if (status === 'loading') {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
        <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-emerald-500"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
      <Header />
      <div className="flex">
        <Sidebar />
        <main className="flex-1 p-8">
          {/* Your content here */}
        </main>
      </div>
    </div>
  );
}
```

#### AFTER (New Structure):
```javascript
'use client';

import { useState } from 'react';
// Remove: useSession, useRouter, Header, Sidebar imports (unless needed for other purposes)

export default function MyPage() {
  // Remove: session, status, router state
  const [data, setData] = useState([]);

  // Remove: authentication useEffect

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-emerald-500"></div>
      </div>
    );
  }

  return (
    <>
      {/* Your content here - no Header, Sidebar, or wrapper divs */}
    </>
  );
}
```

#### FOR ROLE-PROTECTED PAGES (e.g., ADMIN only):
```javascript
'use client';

import { useState } from 'react';
import RoleGuard from '@/components/RoleGuard';

export default function AdminPage() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);

  return (
    <RoleGuard allowedRoles={['ADMIN']}>
      {loading ? (
        <div className="flex items-center justify-center min-h-[60vh]">
          <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-emerald-500"></div>
        </div>
      ) : (
        <>
          {/* Your content here */}
        </>
      )}
    </RoleGuard>
  );
}
```

## Step-by-Step Migration Process

### Step 1: Remove Imports
Remove these lines:
```javascript
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import Header from '@/components/Header';
import Sidebar from '@/components/Sidebar';
```

**Note:** Keep `useSession` and `useRouter` if you use them for other purposes besides authentication.

### Step 2: Remove State Variables
Remove:
```javascript
const { data: session, status } = useSession();
const router = useRouter();
```

### Step 3: Remove Authentication useEffect
Remove:
```javascript
useEffect(() => {
  if (status === 'unauthenticated') {
    router.push('/auth/signin');
  }
}, [status, router]);
```

### Step 4: Update Loading State
Change from:
```javascript
if (status === 'loading' || loading) {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
      <div className="animate-spin..."></div>
    </div>
  );
}
```

To:
```javascript
if (loading) {
  return (
    <div className="flex items-center justify-center min-h-[60vh]">
      <div className="animate-spin..."></div>
    </div>
  );
}
```

### Step 5: Remove Layout Wrapper
Change from:
```javascript
return (
  <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
    <Header />
    <div className="flex">
      <Sidebar />
      <main className="flex-1 p-8">
        {/* Content */}
      </main>
    </div>
  </div>
);
```

To:
```javascript
return (
  <>
    {/* Content */}
  </>
);
```

### Step 6: (Optional) Add RoleGuard
For admin-only or role-specific pages:
```javascript
import RoleGuard from '@/components/RoleGuard';

return (
  <RoleGuard allowedRoles={['ADMIN']}>
    {/* Content */}
  </RoleGuard>
);
```

## Common Patterns

### Pattern 1: Simple Authenticated Page
```javascript
'use client';
import { useState } from 'react';

export default function MyPage() {
  const [data, setData] = useState([]);
  return <>{/* Content */}</>;
}
```

### Pattern 2: Admin-Only Page
```javascript
'use client';
import RoleGuard from '@/components/RoleGuard';

export default function AdminPage() {
  return (
    <RoleGuard allowedRoles={['ADMIN']}>
      {/* Content */}
    </RoleGuard>
  );
}
```

### Pattern 3: Multi-Role Page
```javascript
'use client';
import RoleGuard from '@/components/RoleGuard';

export default function StaffPage() {
  return (
    <RoleGuard allowedRoles={['ADMIN', 'DOCTOR', 'RECEPTIONIST']}>
      {/* Content */}
    </RoleGuard>
  );
}
```

## Benefits

✅ **No Repetitive Code** - Header and Sidebar declared once  
✅ **Centralized Auth** - Authentication handled by AppLayout  
✅ **Consistent UI** - All pages look uniform  
✅ **Easy Maintenance** - Update layout in one place  
✅ **Cleaner Pages** - Focus on page-specific logic  
✅ **Automatic Routing** - Sidebar adapts to user role  

## Pages That Still Need Update

Run this command to check status:
```bash
./update-pages.sh
```

### Remaining Pages:
1. src/app/(app)/billing/page.jsx
2. src/app/(app)/notifications/page.jsx
3. src/app/(app)/analytics/page.jsx
4. src/app/(app)/portal/invoices/page.jsx
5. src/app/(app)/portal/dashboard/page.jsx
6. src/app/(app)/portal/appointments/page.jsx
7. src/app/(app)/portal/prescriptions/page.jsx
8. src/app/(app)/portal/medical-records/page.jsx
9. src/app/(app)/portal/book-appointment/page.jsx
10. src/app/(app)/calendar/page.jsx
11. src/app/(app)/profile/page.jsx
12. src/app/(app)/consultations/page.jsx
13. src/app/(app)/admin/dashboard/page.jsx
14. src/app/(app)/admin/clinics/page.jsx
15. src/app/(app)/admin/clinics/[id]/page.jsx
16. src/app/(app)/admin/reports/audit/page.jsx
17. src/app/(app)/admin/reports/activity/page.jsx
18. src/app/(app)/admin/reports/financial/page.jsx
19. src/app/(app)/admin/services/page.jsx
20. src/app/(app)/admin/users/page.jsx

## Troubleshooting

### Issue: "Cannot find RoleGuard"
**Solution:** Make sure you've created `/src/components/RoleGuard.jsx`

### Issue: "Page content is misaligned"
**Solution:** Remove all wrapper divs (min-h-screen, flex, etc.) - AppLayout handles this

### Issue: "Authentication not working"
**Solution:** AppLayout handles authentication automatically. Check `/src/app/(app)/layout.jsx`

### Issue: "Sidebar not showing correct items"
**Solution:** Sidebar reads user role from session automatically

## Testing Checklist

After updating a page, verify:
- [ ] Page loads without errors
- [ ] Header and Sidebar appear correctly
- [ ] Content displays properly
- [ ] Role-based access works (if using RoleGuard)
- [ ] Loading state shows correctly
- [ ] Navigation works
- [ ] Responsive design intact

## Need Help?

Refer to these updated examples:
- ✅ `/src/app/(app)/admin/staff/page.jsx` - Admin page with RoleGuard
- ✅ `/src/app/(app)/admin/roles/page.jsx` - Admin page with RoleGuard
- ✅ `/src/app/(app)/dashboard/page.jsx` - Multi-role dashboard
- ✅ `/src/app/(app)/patients/page.jsx` - Standard authenticated page
