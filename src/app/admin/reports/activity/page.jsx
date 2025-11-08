'use client';

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import Header from '@/components/Header';
import Sidebar from '@/components/Sidebar';

export default function UserActivityReport() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [activities, setActivities] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filterType, setFilterType] = useState('ALL');

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/auth/signin');
    } else if (session?.user?.role !== 'ADMIN') {
      router.push('/dashboard');
    }
  }, [status, session, router]);

  useEffect(() => {
    if (session?.user?.role === 'ADMIN') {
      fetchActivities();
    }
  }, [session]);

  const fetchActivities = async () => {
    try {
      const response = await fetch('/api/admin/stats');
      if (response.ok) {
        const data = await response.json();
        setActivities(data.recentActivity || []);
      }
    } catch (error) {
      console.error('Failed to fetch activities:', error);
    } finally {
      setLoading(false);
    }
  };

  if (status === 'loading' || loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
        <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-emerald-500"></div>
      </div>
    );
  }

  if (session?.user?.role !== 'ADMIN') {
    return null;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
      <Header />
      <div className="flex">
        <Sidebar />
        <main className="flex-1 p-8 ml-64">
          <div className="max-w-7xl mx-auto bg-gradient-to-br from-slate-50 via-slate-100 to-slate-50 rounded-3xl p-8 shadow-2xl">
            {/* Header */}
            <div className="bg-gradient-to-r from-emerald-500 to-teal-500 rounded-2xl p-6 mb-6 shadow-lg shadow-emerald-500/30 flex items-center justify-between">
              <div>
                <h1 className="text-3xl font-bold text-white mb-2">
                  📊 User Activity Report
                </h1>
                <p className="text-white/90">
                  Detailed logs of all user activities in the system
                </p>
              </div>
              <button
                onClick={() => router.push('/admin/dashboard')}
                className="px-6 py-3 bg-white text-emerald-600 rounded-xl hover:shadow-lg transition-all font-semibold"
              >
                ← Back to Dashboard
              </button>
            </div>

            {/* Stats Overview */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
              <div className="bg-white rounded-2xl shadow-lg p-6 border border-slate-200">
                <div className="flex items-center gap-3 mb-2">
                  <div className="text-3xl">👥</div>
                  <h3 className="text-slate-600 font-semibold">Total Activities</h3>
                </div>
                <p className="text-3xl font-bold text-slate-900">{activities.length}</p>
              </div>

              <div className="bg-white rounded-2xl shadow-lg p-6 border border-slate-200">
                <div className="flex items-center gap-3 mb-2">
                  <div className="text-3xl">🧑</div>
                  <h3 className="text-slate-600 font-semibold">Patient Actions</h3>
                </div>
                <p className="text-3xl font-bold text-slate-900">
                  {activities.filter(a => a.icon === '🧑').length}
                </p>
              </div>

              <div className="bg-white rounded-2xl shadow-lg p-6 border border-slate-200">
                <div className="flex items-center gap-3 mb-2">
                  <div className="text-3xl">👨‍⚕️</div>
                  <h3 className="text-slate-600 font-semibold">Doctor Actions</h3>
                </div>
                <p className="text-3xl font-bold text-slate-900">
                  {activities.filter(a => a.icon === '👨‍⚕️').length}
                </p>
              </div>

              <div className="bg-white rounded-2xl shadow-lg p-6 border border-slate-200">
                <div className="flex items-center gap-3 mb-2">
                  <div className="text-3xl">👨‍💼</div>
                  <h3 className="text-slate-600 font-semibold">Staff Actions</h3>
                </div>
                <p className="text-3xl font-bold text-slate-900">
                  {activities.filter(a => a.icon === '👨‍💼').length}
                </p>
              </div>
            </div>

            {/* Filter */}
            <div className="bg-white rounded-2xl shadow-lg p-6 mb-6 border border-slate-200">
              <label className="block text-sm font-semibold text-slate-700 mb-2">
                Filter by Type
              </label>
              <select
                value={filterType}
                onChange={(e) => setFilterType(e.target.value)}
                className="px-4 py-3 rounded-xl border-2 border-slate-200 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100 transition-all outline-none bg-white"
              >
                <option value="ALL">All Activities</option>
                <option value="PATIENT">Patient Actions</option>
                <option value="DOCTOR">Doctor Actions</option>
                <option value="STAFF">Staff Actions</option>
              </select>
            </div>

            {/* Activity Timeline */}
            <div className="bg-white rounded-2xl shadow-lg p-6 border border-slate-200">
              <h2 className="text-2xl font-bold text-slate-800 mb-6">Activity Timeline</h2>
              <div className="space-y-4">
                {activities.length > 0 ? (
                  activities.map((activity, index) => (
                    <div key={index} className="flex items-start space-x-4 p-4 rounded-xl bg-slate-50 border border-slate-200 hover:border-emerald-300 hover:bg-emerald-50/50 transition-all">
                      <div className="text-3xl">{activity.icon}</div>
                      <div className="flex-1">
                        <p className="text-slate-900 font-semibold">{activity.action}</p>
                        <p className="text-slate-600">{activity.user}</p>
                        <p className="text-slate-400 text-sm mt-1">{activity.timestamp}</p>
                      </div>
                      <button className="px-4 py-2 bg-emerald-100 text-emerald-700 rounded-lg hover:bg-emerald-200 transition-all text-sm font-medium">
                        View Details
                      </button>
                    </div>
                  ))
                ) : (
                  <div className="text-center py-12">
                    <svg className="w-16 h-16 text-slate-300 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                    </svg>
                    <h3 className="text-xl font-semibold text-slate-700 mb-2">No Activities Found</h3>
                    <p className="text-slate-500">Activity logs will appear here</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
