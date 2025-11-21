'use client';

import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import Header from '@/components/Header';
import Sidebar from '@/components/Sidebar';

export default function ComingSoonPage({ 
  title, 
  description, 
  icon = '🚧',
  requiredRole = 'ADMIN' 
}) {
  const { data: session, status } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/auth/signin');
    } else if (requiredRole && session?.user?.role !== requiredRole) {
      router.push('/dashboard');
    }
  }, [status, session, router, requiredRole]);

  if (status === 'loading') {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
        <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-emerald-500"></div>
      </div>
    );
  }

  if (requiredRole && session?.user?.role !== requiredRole) return null;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
      <Header />
      <div className="flex">
        <Sidebar />
        <main className="flex-1 p-8">
          <div className="mx-auto">
            {/* Header */}
            <div className="mb-8 bg-gradient-to-r from-emerald-500 to-teal-500 rounded-2xl p-8 shadow-lg">
              <h1 className="text-4xl font-bold text-white mb-2">{title}</h1>
              <p className="text-white/90">{description}</p>
            </div>

            {/* Coming Soon Content */}
            <div className="bg-white rounded-2xl shadow-lg p-12 text-center">
              <div className="text-6xl mb-6">{icon}</div>
              <h2 className="text-3xl font-bold text-slate-800 mb-4">Coming Soon</h2>
              <p className="text-slate-600 text-lg mb-8 max-w-2xl mx-auto">
                This feature is currently under development and will be available in a future update.
              </p>
              
              {/* Feature Preview */}
              <div className="bg-slate-50 rounded-xl p-6 mb-8 max-w-xl mx-auto">
                <h3 className="text-lg font-semibold text-slate-800 mb-3">Planned Features:</h3>
                <ul className="text-left text-slate-600 space-y-2">
                  <li className="flex items-center">
                    <span className="text-emerald-500 mr-2">✓</span>
                    Comprehensive management interface
                  </li>
                  <li className="flex items-center">
                    <span className="text-emerald-500 mr-2">✓</span>
                    Advanced filtering and search
                  </li>
                  <li className="flex items-center">
                    <span className="text-emerald-500 mr-2">✓</span>
                    Real-time updates and notifications
                  </li>
                  <li className="flex items-center">
                    <span className="text-emerald-500 mr-2">✓</span>
                    Export and reporting capabilities
                  </li>
                </ul>
              </div>

              <button
                onClick={() => router.push('/admin/dashboard')}
                className="px-8 py-3 bg-gradient-to-r from-emerald-500 to-teal-500 text-white rounded-xl hover:shadow-xl transition-all font-semibold flex items-center gap-2 mx-auto"
              >
                <span>←</span>
                Back to Dashboard
              </button>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
