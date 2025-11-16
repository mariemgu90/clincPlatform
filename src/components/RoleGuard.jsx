'use client';

import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

export default function RoleGuard({ children, allowedRoles }) {
  const { data: session, status } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (status === 'authenticated' && allowedRoles && !allowedRoles.includes(session?.user?.role)) {
      router.push('/dashboard');
    }
  }, [status, session, router, allowedRoles]);

  if (status === 'loading') {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-emerald-500"></div>
      </div>
    );
  }

  if (allowedRoles && !allowedRoles.includes(session?.user?.role)) {
    return null;
  }

  return <>{children}</>;
}
