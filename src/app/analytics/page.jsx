'use client';

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import Header from '../../components/Header';
import Sidebar from '../../components/Sidebar';

export default function AnalyticsPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [timeRange, setTimeRange] = useState('month'); // 'week', 'month', 'year'
  const [stats, setStats] = useState({
    totalAppointments: 0,
    totalPatients: 0,
    totalRevenue: 0,
    averageRating: 0,
  });

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/auth/signin');
    }
  }, [status, router]);

  useEffect(() => {
    // Simulate data fetching
    setTimeout(() => {
      setStats({
        totalAppointments: 245,
        totalPatients: 87,
        totalRevenue: 12450,
        averageRating: 4.8,
      });
      setLoading(false);
    }, 1000);
  }, [timeRange]);

  if (status === 'loading' || loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
        <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-emerald-500"></div>
      </div>
    );
  }

  const appointmentsByDay = [
    { day: 'Mon', count: 12 },
    { day: 'Tue', count: 19 },
    { day: 'Wed', count: 15 },
    { day: 'Thu', count: 22 },
    { day: 'Fri', count: 18 },
    { day: 'Sat', count: 8 },
    { day: 'Sun', count: 5 },
  ];

  const maxCount = Math.max(...appointmentsByDay.map(d => d.count));

  const revenueByMonth = [
    { month: 'Jan', amount: 8500 },
    { month: 'Feb', amount: 9200 },
    { month: 'Mar', amount: 11000 },
    { month: 'Apr', amount: 10500 },
    { month: 'May', amount: 12450 },
    { month: 'Jun', amount: 13800 },
  ];

  const maxRevenue = Math.max(...revenueByMonth.map(r => r.amount));

  const topServices = [
    { name: 'General Consultation', count: 85, revenue: 4250 },
    { name: 'Follow-up Visit', count: 62, revenue: 1860 },
    { name: 'Lab Tests', count: 45, revenue: 3150 },
    { name: 'Vaccination', count: 38, revenue: 1900 },
    { name: 'Health Checkup', count: 15, revenue: 1290 },
  ];

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
      <Header />
      <div className="flex flex-1">
        <Sidebar />
        <main className="flex-1 p-6 overflow-auto">
          <div className="max-w-7xl mx-auto bg-gradient-to-br from-slate-50 via-slate-100 to-slate-50 rounded-3xl p-8 shadow-2xl">
            {/* Header Section */}
            <div className="bg-gradient-to-r from-emerald-500 to-teal-500 rounded-2xl p-6 mb-6 shadow-lg shadow-emerald-500/30 animate-slideUp">
              <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                <div>
                  <h1 className="text-3xl font-bold text-white mb-2">Analytics Dashboard</h1>
                  <p className="text-white/90">Track your clinic's performance and insights</p>
                </div>
                
                {/* Time Range Selector */}
                <div className="flex gap-2 bg-white/20 backdrop-blur-sm rounded-xl p-1">
                  <button
                    onClick={() => setTimeRange('week')}
                    className={`px-4 py-2 rounded-lg text-sm font-semibold transition-all ${
                      timeRange === 'week' ? 'bg-white text-emerald-600 shadow-md' : 'text-white hover:bg-white/10'
                    }`}
                  >
                    This Week
                  </button>
                  <button
                    onClick={() => setTimeRange('month')}
                    className={`px-4 py-2 rounded-lg text-sm font-semibold transition-all ${
                      timeRange === 'month' ? 'bg-white text-emerald-600 shadow-md' : 'text-white hover:bg-white/10'
                    }`}
                  >
                    This Month
                  </button>
                  <button
                    onClick={() => setTimeRange('year')}
                    className={`px-4 py-2 rounded-lg text-sm font-semibold transition-all ${
                      timeRange === 'year' ? 'bg-white text-emerald-600 shadow-md' : 'text-white hover:bg-white/10'
                    }`}
                  >
                    This Year
                  </button>
                </div>
              </div>
            </div>

          {/* Key Metrics */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
            <div className="bg-white rounded-2xl shadow-lg p-6 border border-slate-200 animate-slideUp hover:scale-105 transition-all">
              <div className="flex items-center justify-between mb-4">
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-emerald-500 to-teal-500 flex items-center justify-center shadow-md shadow-emerald-500/30">
                  <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                </div>
                <span className="text-emerald-600 text-sm font-semibold">+12%</span>
              </div>
              <h3 className="text-3xl font-bold text-slate-900">{stats.totalAppointments}</h3>
              <p className="text-sm text-slate-600 mt-1 font-semibold">Total Appointments</p>
            </div>

            <div className="bg-white rounded-2xl shadow-lg p-6 border border-slate-200 animate-slideUp hover:scale-105 transition-all" style={{animationDelay: '0.1s'}}>
              <div className="flex items-center justify-between mb-4">
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-teal-500 to-emerald-500 flex items-center justify-center shadow-md shadow-teal-500/30">
                  <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                  </svg>
                </div>
                <span className="text-emerald-600 text-sm font-semibold">+8%</span>
              </div>
              <h3 className="text-3xl font-bold text-slate-900">{stats.totalPatients}</h3>
              <p className="text-sm text-slate-600 mt-1 font-semibold">Total Patients</p>
            </div>

            <div className="bg-white rounded-2xl shadow-lg p-6 border border-slate-200 animate-slideUp hover:scale-105 transition-all" style={{animationDelay: '0.2s'}}>
              <div className="flex items-center justify-between mb-4">
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-amber-500 to-orange-500 flex items-center justify-center shadow-md shadow-amber-500/30">
                  <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <span className="text-emerald-600 text-sm font-semibold">+15%</span>
              </div>
              <h3 className="text-3xl font-bold text-slate-900">${stats.totalRevenue.toLocaleString()}</h3>
              <p className="text-sm text-slate-600 mt-1 font-semibold">Total Revenue</p>
            </div>

            <div className="bg-white rounded-2xl shadow-lg p-6 border border-slate-200 animate-slideUp hover:scale-105 transition-all" style={{animationDelay: '0.3s'}}>
              <div className="flex items-center justify-between mb-4">
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-blue-500 to-teal-500 flex items-center justify-center shadow-md shadow-blue-500/30">
                  <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
                  </svg>
                </div>
                <span className="text-emerald-600 text-sm font-semibold">+0.2</span>
              </div>
              <h3 className="text-3xl font-bold text-slate-900">{stats.averageRating}</h3>
              <p className="text-sm text-slate-600 mt-1 font-semibold">Average Rating</p>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
            {/* Appointments Chart */}
            <div className="bg-white rounded-2xl shadow-lg p-6 border border-slate-200 animate-slideUp" style={{animationDelay: '0.4s'}}>
              <h3 className="text-xl font-bold text-slate-800 mb-6">Appointments This Week</h3>
              <div className="space-y-4">
                {appointmentsByDay.map((item, index) => (
                  <div key={item.day} className="flex items-center gap-4">
                    <span className="text-sm font-semibold text-slate-600 w-12">{item.day}</span>
                    <div className="flex-1 bg-slate-100 rounded-full h-8 relative overflow-hidden">
                      <div
                        className="absolute inset-y-0 left-0 bg-gradient-to-r from-emerald-500 to-teal-500 rounded-full flex items-center justify-end pr-3 transition-all duration-500 shadow-md shadow-emerald-500/20"
                        style={{ width: `${(item.count / maxCount) * 100}%` }}
                      >
                        <span className="text-white text-sm font-semibold">{item.count}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Revenue Chart */}
            <div className="bg-white rounded-2xl shadow-lg p-6 border border-slate-200 animate-slideUp" style={{animationDelay: '0.5s'}}>
              <h3 className="text-xl font-bold text-slate-800 mb-6">Revenue Trend</h3>
              <div className="space-y-4">
                {revenueByMonth.map((item) => (
                  <div key={item.month} className="flex items-center gap-4">
                    <span className="text-sm font-semibold text-slate-600 w-12">{item.month}</span>
                    <div className="flex-1 bg-slate-100 rounded-full h-8 relative overflow-hidden">
                      <div
                        className="absolute inset-y-0 left-0 bg-gradient-to-r from-amber-500 to-orange-500 rounded-full flex items-center justify-end pr-3 transition-all duration-500 shadow-md shadow-amber-500/20"
                        style={{ width: `${(item.amount / maxRevenue) * 100}%` }}
                      >
                        <span className="text-white text-sm font-semibold">${item.amount.toLocaleString()}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Top Services */}
          <div className="bg-white rounded-2xl shadow-lg p-6 border border-slate-200 animate-slideUp" style={{animationDelay: '0.6s'}}>
            <h3 className="text-xl font-bold text-slate-800 mb-6">Top Services</h3>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gradient-to-r from-slate-50 to-slate-100 border-b-2 border-slate-200">
                  <tr>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-slate-600 uppercase tracking-wider">
                      Service Name
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-slate-600 uppercase tracking-wider">
                      Appointments
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-slate-600 uppercase tracking-wider">
                      Revenue
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-slate-600 uppercase tracking-wider">
                      Avg. Price
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-slate-200">
                  {topServices.map((service, index) => (
                    <tr key={index} className="hover:bg-slate-50 transition-colors">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <div className={`w-2 h-2 rounded-full mr-3 ${
                            index === 0 ? 'bg-emerald-500' :
                            index === 1 ? 'bg-teal-500' :
                            index === 2 ? 'bg-amber-500' :
                            index === 3 ? 'bg-blue-500' :
                            'bg-slate-500'
                          }`}></div>
                          <span className="text-sm font-medium text-slate-900">{service.name}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-700 font-semibold">
                        {service.count}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-bold text-slate-900">
                        ${service.revenue.toLocaleString()}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-700 font-semibold">
                        ${(service.revenue / service.count).toFixed(2)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Quick Stats Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-6">
            <div className="bg-white rounded-2xl shadow-lg p-6 border border-slate-200 animate-slideUp" style={{animationDelay: '0.7s'}}>
              <div className="flex items-center justify-between mb-4">
                <h4 className="text-sm font-semibold text-slate-600 uppercase">Cancellation Rate</h4>
                <svg className="w-5 h-5 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </div>
              <p className="text-3xl font-bold text-slate-900">8.5%</p>
              <p className="text-sm text-slate-500 mt-2">Down from 12% last month</p>
            </div>

            <div className="bg-white rounded-2xl shadow-lg p-6 border border-slate-200 animate-slideUp" style={{animationDelay: '0.8s'}}>
              <div className="flex items-center justify-between mb-4">
                <h4 className="text-sm font-semibold text-slate-600 uppercase">No-Show Rate</h4>
                <svg className="w-5 h-5 text-amber-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                </svg>
              </div>
              <p className="text-3xl font-bold text-slate-900">3.2%</p>
              <p className="text-sm text-slate-500 mt-2">Same as last month</p>
            </div>

            <div className="bg-white rounded-2xl shadow-lg p-6 border border-slate-200 animate-slideUp" style={{animationDelay: '0.9s'}}>
              <div className="flex items-center justify-between mb-4">
                <h4 className="text-sm font-semibold text-slate-600 uppercase">Avg. Wait Time</h4>
                <svg className="w-5 h-5 text-teal-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <p className="text-3xl font-bold text-slate-900">12 min</p>
              <p className="text-sm text-slate-500 mt-2">Down from 18 min last month</p>
            </div>
          </div>
          </div>
        </main>
      </div>
    </div>
  );
}
