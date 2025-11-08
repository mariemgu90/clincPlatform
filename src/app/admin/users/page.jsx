'use client';

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import Header from '@/components/Header';
import Sidebar from '@/components/Sidebar';

export default function UsersManagement() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterRole, setFilterRole] = useState('ALL');

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/auth/signin');
    } else if (session?.user?.role !== 'ADMIN') {
      router.push('/dashboard');
    }
  }, [status, session, router]);

  useEffect(() => {
    if (session?.user?.role === 'ADMIN') {
      fetchUsers();
    }
  }, [session]);

  const fetchUsers = async () => {
    try {
      const response = await fetch('/api/users');
      if (response.ok) {
        const data = await response.json();
        setUsers(data.users || []);
      }
    } catch (error) {
      console.error('Failed to fetch users:', error);
    } finally {
      setLoading(false);
    }
  };

  const filteredUsers = users.filter(user => {
    const matchesSearch = user.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         user.email?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesRole = filterRole === 'ALL' || user.role === filterRole;
    return matchesSearch && matchesRole;
  });

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
            <div className="bg-gradient-to-r from-emerald-500 to-teal-500 rounded-2xl p-6 mb-6 shadow-lg shadow-emerald-500/30">
              <h1 className="text-3xl font-bold text-white mb-2">
                User Management
              </h1>
              <p className="text-white/90">
                Manage all system users, patients, doctors, and staff
              </p>
            </div>

            {/* Filters */}
            <div className="bg-white rounded-2xl shadow-lg p-6 mb-6 border border-slate-200">
              <div className="flex flex-col md:flex-row gap-4">
                <div className="flex-1">
                  <label className="block text-sm font-semibold text-slate-700 mb-2">
                    Search Users
                  </label>
                  <div className="relative">
                    <input
                      type="text"
                      placeholder="Search by name or email..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="w-full px-4 py-3 pl-12 rounded-xl border-2 border-slate-200 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100 transition-all outline-none"
                    />
                    <svg className="w-5 h-5 text-slate-400 absolute left-4 top-1/2 transform -translate-y-1/2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                    </svg>
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-2">
                    Filter by Role
                  </label>
                  <select
                    value={filterRole}
                    onChange={(e) => setFilterRole(e.target.value)}
                    className="px-4 py-3 rounded-xl border-2 border-slate-200 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100 transition-all outline-none bg-white"
                  >
                    <option value="ALL">All Roles</option>
                    <option value="ADMIN">Admin</option>
                    <option value="DOCTOR">Doctors</option>
                    <option value="RECEPTIONIST">Receptionists</option>
                    <option value="PATIENT">Patients</option>
                  </select>
                </div>
              </div>
              <div className="mt-4">
                <p className="text-sm text-slate-600">
                  Showing <span className="font-semibold text-emerald-600">{filteredUsers.length}</span> of <span className="font-semibold">{users.length}</span> users
                </p>
              </div>
            </div>

            {/* Users List */}
            <div className="space-y-4">
              {filteredUsers.length > 0 ? (
                filteredUsers.map((user, index) => (
                  <UserCard key={user.id} user={user} index={index} />
                ))
              ) : (
                <div className="bg-white rounded-2xl shadow-lg p-12 text-center border border-slate-200">
                  <svg className="w-16 h-16 text-slate-300 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
                  </svg>
                  <h3 className="text-xl font-semibold text-slate-700 mb-2">No Users Found</h3>
                  <p className="text-slate-500">
                    Try adjusting your search criteria
                  </p>
                </div>
              )}
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}

function UserCard({ user, index }) {
  const roleColors = {
    ADMIN: 'bg-purple-100 text-purple-700 border-purple-200',
    DOCTOR: 'bg-blue-100 text-blue-700 border-blue-200',
    RECEPTIONIST: 'bg-emerald-100 text-emerald-700 border-emerald-200',
    PATIENT: 'bg-amber-100 text-amber-700 border-amber-200',
  };

  const roleIcons = {
    ADMIN: '👑',
    DOCTOR: '👨‍⚕️',
    RECEPTIONIST: '👨‍💼',
    PATIENT: '🧑',
  };

  return (
    <div 
      className="p-6 rounded-2xl bg-white shadow-lg hover:shadow-xl transition-all border border-slate-200 hover:scale-[1.01] animate-slideUp"
      style={{ animationDelay: `${index * 0.05}s` }}
    >
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <div className="w-16 h-16 rounded-xl bg-gradient-to-br from-emerald-500 to-teal-500 flex items-center justify-center text-4xl shadow-md shadow-emerald-500/30">
            {roleIcons[user.role] || '👤'}
          </div>
          <div>
            <h3 className="text-slate-900 font-bold text-lg">{user.name}</h3>
            <p className="text-slate-600 text-sm flex items-center gap-2">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
              </svg>
              {user.email}
            </p>
            {user.phone && (
              <p className="text-slate-500 text-sm flex items-center gap-2">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                </svg>
                {user.phone}
              </p>
            )}
          </div>
        </div>
        <div className="flex items-center space-x-3">
          <span className={`px-4 py-2 rounded-xl text-sm font-semibold border-2 ${roleColors[user.role]}`}>
            {user.role}
          </span>
        </div>
      </div>
    </div>
  );
}
