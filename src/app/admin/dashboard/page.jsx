'use client';

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { fetchAdminStats as getAdminStats } from '@/lib/api';
import Header from '@/components/Header';
import Sidebar from '@/components/Sidebar';
import StatCard from '@/components/StatCard';

export default function AdminDashboard() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [stats, setStats] = useState({
    totalUsers: 0,
    totalClinics: 0,
    totalPatients: 0,
    totalRevenue: 0,
    activeAppointments: 0,
    totalStaff: 0,
    activeServices: 0,
    pendingInvoices: 0,
    pendingNotifications: 0,
    systemHealth: 'Good',
  });
  const [recentActivity, setRecentActivity] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/auth/signin');
    } else if (session?.user?.role !== 'ADMIN') {
      router.push('/dashboard');
    }
  }, [status, session, router]);

  useEffect(() => {
    if (session?.user?.role === 'ADMIN') {
      fetchAdminStats();
    }
  }, [session]);

  const fetchAdminStats = async () => {
    try {
      const data = await getAdminStats();
      setStats(data.stats);
      setRecentActivity(data.recentActivity || []);
    } catch (error) {
      console.error('Failed to fetch admin stats:', error);
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
  
  const cardDashboardStats = [
                    {
                      title: "Total Users",
                      value: stats.totalUsers,
                      icon: "👥",
                      color: "from-emerald-500 to-teal-500",
                      link: "/admin/users"
                    },
                    {
                      title: "Total Clinics",
                      value: stats.totalClinics,
                      icon: "🏥",
                      color: "from-teal-500 to-emerald-500",
                      link: "/admin/clinics"
                    },
                    {
                      title: "Total Patients",
                      value: stats.totalPatients,
                      icon: "🩺",
                      color: "from-emerald-500 to-emerald-600",
                      link: "/patients"
                    },
                    {
                      title: "Total Staff",
                      value: stats.totalStaff,
                      icon: "👨‍⚕️",
                      color: "from-purple-500 to-indigo-500",
                      link: "/admin/staff"
                    },
                    {
                      title: "Total Revenue",
                      value: `$${stats.totalRevenue.toLocaleString()}`,
                      icon: "💰",
                      color: "from-amber-500 to-orange-500",
                      link: "/billing"
                    },
                    {
                      title: "Active Appointments",
                      value: stats.activeAppointments,
                      icon: "📅",
                      color: "from-blue-500 to-teal-500",
                      link: "/calendar"
                    },
                    {
                      title: "Active Services",
                      value: stats.activeServices,
                      icon: "🔧",
                      color: "from-cyan-500 to-blue-500",
                      link: "/admin/services"
                    },
                    {
                      title: "Pending Invoices",
                      value: stats.pendingInvoices,
                      icon: "📄",
                      color: "from-rose-500 to-pink-500",
                      link: "/billing"
                    },
                    {
                      title: "Notifications",
                      value: stats.pendingNotifications,
                      icon: "🔔",
                      color: "from-orange-500 to-amber-500",
                      link: "/notifications"
                    },
                    {
                      title: "System Health",
                      value: stats.systemHealth,
                      icon: "⚡",
                      color: "from-teal-500 to-teal-600"
                    }
                    ]

  return (
    <div className="min-h-screen bg-slate-100">
      <Header user={session?.user} clinicName="MedFlow Admin" />
      <div className="flex">
        <Sidebar />
        <main className="flex-1 p-8 ml-64">
          <div className="max-w-7xl mx-auto bg-gradient-to-br from-slate-50 via-slate-100 to-slate-50 rounded-3xl p-8 shadow-2xl">
            {/* Welcome Section */}
            <div className="mb-8 bg-gradient-to-r from-emerald-500 to-teal-500 rounded-2xl p-8 shadow-lg shadow-emerald-500/30">
              <h1 className="text-4xl font-bold text-white mb-2">
                Admin Dashboard
              </h1>
              <p className="text-white/90">
                System overview and management
              </p>
            </div>

            {/* Stats Grid */}
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                    {cardDashboardStats.map((stat, index) => (
                    <StatCard
                      key={index}
                      title={stat.title}
                      value={stat.value}
                      icon={stat.icon}
                      color={stat.color}
                      link={stat.link}
                    />
                    ))}
                  </div>

                  {/* Quick Actions */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
              {/* Management Actions */}
              <div className="bg-white rounded-2xl shadow-lg p-6 border border-slate-200">
                <h2 className="text-2xl font-bold text-slate-800 mb-6 flex items-center">
                  <span className="mr-3">⚙️</span>
                  Quick Actions
                </h2>
                <div className="space-y-3">
                  <ActionButton
                    onClick={() => router.push('/admin/clinics')}
                    icon="🏥"
                    label="Manage Clinics"
                    description="Create and configure clinic profiles"
                  />
                  <ActionButton
                    onClick={() => router.push('/admin/users')}
                    icon="👤"
                    label="Manage Users"
                    description="Add, edit, or remove system users"
                  />
                  <ActionButton
                    onClick={() => router.push('/admin/staff')}
                    icon="👨‍⚕️"
                    label="Manage Staff"
                    description="Manage doctors and receptionists"
                  />
                  <ActionButton
                    onClick={() => router.push('/admin/services')}
                    icon="🔧"
                    label="Manage Services"
                    description="Configure medical services and pricing"
                  />
                  <ActionButton
                    onClick={() => router.push('/admin/settings')}
                    icon="⚙️"
                    label="System Settings"
                    description="Configure clinic and system settings"
                  />
                </div>
              </div>

              {/* Supervision & Oversight */}
              <div className="bg-white rounded-2xl shadow-lg p-6 border border-slate-200">
                <h2 className="text-2xl font-bold text-slate-800 mb-6 flex items-center">
                  <span className="mr-3">👁️</span>
                  Supervision & Oversight
                </h2>
                <div className="space-y-3">
                  <ActionButton
                    onClick={() => router.push('/patients')}
                    icon="🩺"
                    label="View All Patients"
                    description="Access complete patient registry"
                  />
                  <ActionButton
                    onClick={() => router.push('/calendar')}
                    icon="📅"
                    label="Appointment Calendar"
                    description="View and manage all appointments"
                  />
                  <ActionButton
                    onClick={() => router.push('/billing')}
                    icon="💰"
                    label="Billing & Payments"
                    description="Transaction history and invoices"
                  />
                  <ActionButton
                    onClick={() => router.push('/notifications')}
                    icon="🔔"
                    label="Notifications"
                    description="Manage system notifications"
                  />
                  <ActionButton
                    onClick={() => router.push('/admin/clinic-settings')}
                    icon="🔧"
                    label="Clinic Configuration"
                    description="Opening hours and contact settings"
                  />
                </div>
              </div>
            </div>

            {/* Activity & Advanced Management Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
              {/* Recent Activity */}
              <div className="bg-white rounded-2xl shadow-lg p-6 border border-slate-200">
                <h2 className="text-2xl font-bold text-slate-800 mb-6 flex items-center">
                  <span className="mr-3">📊</span>
                  Recent Activity
                </h2>
                <div className="space-y-4">
                  {recentActivity.length > 0 ? (
                    recentActivity.map((activity, index) => (
                      <div key={index} className="flex items-start space-x-3 p-3 rounded-lg bg-slate-50 border border-slate-200">
                        <div className="text-2xl">{activity.icon}</div>
                        <div className="flex-1">
                          <p className="text-slate-900 font-medium">{activity.action}</p>
                          <p className="text-slate-600 text-sm">{activity.user}</p>
                          <p className="text-slate-400 text-xs mt-1">{activity.timestamp}</p>
                        </div>
                      </div>
                    ))
                  ) : (
                    <p className="text-slate-500 text-center py-8">No recent activity</p>
                  )}
                </div>
              </div>

              {/* Advanced Management */}
              <div className="bg-white rounded-2xl shadow-lg p-6 border border-slate-200">
                <h2 className="text-2xl font-bold text-slate-800 mb-6 flex items-center">
                  <span className="mr-3">🔧</span>
                  Advanced Management
                </h2>
                <div className="space-y-3">
                  <ActionButton
                    onClick={() => router.push('/admin/roles')}
                    icon="🔐"
                    label="Roles & Permissions"
                    description="Manage RBAC and access control"
                  />
                  <ActionButton
                    onClick={() => router.push('/admin/integrations')}
                    icon="🔗"
                    label="Integrations"
                    description="Labs, pharmacies, and external systems"
                  />
                  <ActionButton
                    onClick={() => router.push('/admin/templates')}
                    icon="📧"
                    label="Communication Templates"
                    description="Email/SMS templates and automation"
                  />
                  <ActionButton
                    onClick={() => router.push('/admin/exports')}
                    icon="📥"
                    label="Export Data"
                    description="Generate PDF/CSV reports"
                  />
                </div>
              </div>
            </div>

            {/* Reports Section */}
            <div className="bg-white rounded-2xl shadow-lg p-6 border border-slate-200 mb-8">
              <h2 className="text-2xl font-bold text-slate-800 mb-6 flex items-center">
                <span className="mr-3">📈</span>
                Reports & Analytics
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <ReportCard
                  title="User Activity"
                  description="View detailed user activity logs"
                  link="/admin/reports/activity"
                  icon="👥"
                />
                <ReportCard
                  title="Financial Report"
                  description="Revenue and expense analysis"
                  link="/admin/reports/financial"
                  icon="💰"
                />
                <ReportCard
                  title="System Audit"
                  description="Security and compliance logs"
                  link="/admin/reports/audit"
                  icon="🔐"
                />
                <ReportCard
                  title="Doctor Activity"
                  description="Staff performance metrics"
                  link="/analytics"
                  icon="📊"
                />
              </div>
            </div>

            {/* Quick Access Tools */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* Payment Management */}
              <div className="bg-white rounded-2xl shadow-lg p-6 border border-slate-200">
                <h3 className="text-lg font-bold text-slate-800 mb-4 flex items-center">
                  <span className="mr-2">💳</span>
                  Payment Management
                </h3>
                <div className="space-y-2">
                  <QuickLink
                    onClick={() => router.push('/billing')}
                    label="View All Invoices"
                  />
                  <QuickLink
                    onClick={() => router.push('/billing?status=pending')}
                    label="Pending Payments"
                  />
                  <QuickLink
                    onClick={() => router.push('/billing/refunds')}
                    label="Manage Refunds"
                  />
                  <QuickLink
                    onClick={() => router.push('/billing/settings')}
                    label="Payment Settings"
                  />
                </div>
              </div>

              {/* Staff Tools */}
              <div className="bg-white rounded-2xl shadow-lg p-6 border border-slate-200">
                <h3 className="text-lg font-bold text-slate-800 mb-4 flex items-center">
                  <span className="mr-2">👨‍⚕️</span>
                  Staff Tools
                </h3>
                <div className="space-y-2">
                  <QuickLink
                    onClick={() => router.push('/admin/staff')}
                    label="View All Staff"
                  />
                  <QuickLink
                    onClick={() => router.push('/admin/staff?action=add')}
                    label="Add New Staff"
                  />
                  <QuickLink
                    onClick={() => router.push('/admin/staff/schedules')}
                    label="Staff Schedules"
                  />
                  <QuickLink
                    onClick={() => router.push('/admin/staff/performance')}
                    label="Performance Review"
                  />
                </div>
              </div>

              {/* System Tools */}
              <div className="bg-white rounded-2xl shadow-lg p-6 border border-slate-200">
                <h3 className="text-lg font-bold text-slate-800 mb-4 flex items-center">
                  <span className="mr-2">⚙️</span>
                  System Tools
                </h3>
                <div className="space-y-2">
                  <QuickLink
                    onClick={() => router.push('/admin/backup')}
                    label="Backup & Restore"
                  />
                  <QuickLink
                    onClick={() => router.push('/admin/logs')}
                    label="System Logs"
                  />
                  <QuickLink
                    onClick={() => router.push('/admin/maintenance')}
                    label="Maintenance Mode"
                  />
                  <QuickLink
                    onClick={() => router.push('/admin/api-keys')}
                    label="API Keys"
                  />
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}

// function StatCard({ title, value, icon, color, link }) {
//   const router = useRouter();
  
//   return (
//     <div 
//       onClick={() => link && router.push(link)}
//       className={`bg-white rounded-2xl shadow-lg p-6 border border-slate-200 ${link ? 'cursor-pointer hover:scale-105' : ''} transition-all duration-300`}
//     >
//       <div className="flex items-center justify-between mb-4">
//         <div className={`text-4xl p-3 rounded-xl bg-gradient-to-r ${color} shadow-md shadow-emerald-500/30`}>
//           {icon}
//         </div>
//       </div>
//       <h3 className="text-slate-600 text-sm mb-2 font-semibold">{title}</h3>
//       <p className="text-3xl font-bold text-slate-900">{value}</p>
//     </div>
//   );
// }

function ActionButton({ onClick, icon, label, description }) {
  return (
    <button
      onClick={onClick}
      className="w-full p-4 rounded-xl bg-slate-50 hover:bg-gradient-to-r hover:from-emerald-50 hover:to-teal-50 border border-slate-200 hover:border-emerald-300 transition-all duration-200 text-left group"
    >
      <div className="flex items-center space-x-4">
        <div className="text-3xl group-hover:scale-110 transition-transform">{icon}</div>
        <div className="flex-1">
          <p className="text-slate-900 font-semibold">{label}</p>
          <p className="text-slate-600 text-sm">{description}</p>
        </div>
        <div className="text-slate-400 group-hover:text-emerald-600 transition-colors text-xl">→</div>
      </div>
    </button>
  );
}

function ReportCard({ title, description, link, icon }) {
  const router = useRouter();
  
  return (
    <div
      onClick={() => router.push(link)}
      className="p-4 rounded-xl bg-slate-50 hover:bg-gradient-to-r hover:from-emerald-50 hover:to-teal-50 border border-slate-200 hover:border-emerald-300 cursor-pointer transition-all duration-200 group"
    >
      <div className="text-3xl mb-3 group-hover:scale-110 transition-transform">{icon}</div>
      <h3 className="text-slate-900 font-semibold mb-2">{title}</h3>
      <p className="text-slate-600 text-sm">{description}</p>
    </div>
  );
}

function QuickLink({ onClick, label }) {
  return (
    <button
      onClick={onClick}
      className="w-full text-left px-3 py-2 rounded-lg text-slate-700 hover:bg-emerald-50 hover:text-emerald-700 transition-colors text-sm flex items-center justify-between group"
    >
      <span>{label}</span>
      <span className="text-slate-400 group-hover:text-emerald-600 transition-colors">→</span>
    </button>
  );
}
