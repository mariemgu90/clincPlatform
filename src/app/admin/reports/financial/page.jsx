'use client';

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import Header from '@/components/Header';
import Sidebar from '@/components/Sidebar';

export default function FinancialReport() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [stats, setStats] = useState({
    totalRevenue: 0,
    totalExpenses: 0,
    netProfit: 0,
    pendingPayments: 0,
  });
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
      fetchFinancialData();
    }
  }, [session]);

  const fetchFinancialData = async () => {
    try {
      const response = await fetch('/api/admin/stats');
      if (response.ok) {
        const data = await response.json();
        setStats({
          totalRevenue: data.stats?.totalRevenue || 0,
          totalExpenses: 0,
          netProfit: data.stats?.totalRevenue || 0,
          pendingPayments: 1,
        });
      }
    } catch (error) {
      console.error('Failed to fetch financial data:', error);
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
                  💰 Financial Report
                </h1>
                <p className="text-white/90">
                  Comprehensive revenue and expense analysis
                </p>
              </div>
              <button
                onClick={() => router.push('/admin/dashboard')}
                className="px-6 py-3 bg-white text-emerald-600 rounded-xl hover:shadow-lg transition-all font-semibold"
              >
                ← Back to Dashboard
              </button>
            </div>

            {/* Financial Overview */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
              <div className="bg-white rounded-2xl shadow-lg p-6 border-2 border-emerald-200">
                <div className="flex items-center justify-between mb-4">
                  <div className="text-4xl">💵</div>
                  <div className="px-3 py-1 bg-emerald-100 text-emerald-700 rounded-full text-sm font-semibold">
                    ↑ 15%
                  </div>
                </div>
                <h3 className="text-slate-600 font-semibold mb-2">Total Revenue</h3>
                <p className="text-3xl font-bold text-emerald-600">${stats.totalRevenue.toLocaleString()}</p>
              </div>

              <div className="bg-white rounded-2xl shadow-lg p-6 border-2 border-red-200">
                <div className="flex items-center justify-between mb-4">
                  <div className="text-4xl">💸</div>
                  <div className="px-3 py-1 bg-red-100 text-red-700 rounded-full text-sm font-semibold">
                    ↑ 5%
                  </div>
                </div>
                <h3 className="text-slate-600 font-semibold mb-2">Total Expenses</h3>
                <p className="text-3xl font-bold text-red-600">${stats.totalExpenses.toLocaleString()}</p>
              </div>

              <div className="bg-white rounded-2xl shadow-lg p-6 border-2 border-blue-200">
                <div className="flex items-center justify-between mb-4">
                  <div className="text-4xl">📈</div>
                  <div className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm font-semibold">
                    ↑ 20%
                  </div>
                </div>
                <h3 className="text-slate-600 font-semibold mb-2">Net Profit</h3>
                <p className="text-3xl font-bold text-blue-600">${stats.netProfit.toLocaleString()}</p>
              </div>

              <div className="bg-white rounded-2xl shadow-lg p-6 border-2 border-amber-200">
                <div className="flex items-center justify-between mb-4">
                  <div className="text-4xl">⏳</div>
                  <div className="px-3 py-1 bg-amber-100 text-amber-700 rounded-full text-sm font-semibold">
                    {stats.pendingPayments}
                  </div>
                </div>
                <h3 className="text-slate-600 font-semibold mb-2">Pending Payments</h3>
                <p className="text-3xl font-bold text-amber-600">${stats.totalRevenue.toLocaleString()}</p>
              </div>
            </div>

            {/* Charts Section */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
              {/* Revenue Chart */}
              <div className="bg-white rounded-2xl shadow-lg p-6 border border-slate-200">
                <h2 className="text-xl font-bold text-slate-800 mb-4 flex items-center gap-2">
                  <span>📊</span>
                  Monthly Revenue Trend
                </h2>
                <div className="h-64 flex items-end justify-around gap-2">
                  {['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'].map((month, i) => (
                    <div key={month} className="flex-1 flex flex-col items-center">
                      <div 
                        className="w-full bg-gradient-to-t from-emerald-500 to-teal-500 rounded-t-lg hover:scale-105 transition-all cursor-pointer"
                        style={{ height: `${50 + i * 10}%` }}
                      ></div>
                      <p className="text-sm text-slate-600 mt-2 font-medium">{month}</p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Expense Breakdown */}
              <div className="bg-white rounded-2xl shadow-lg p-6 border border-slate-200">
                <h2 className="text-xl font-bold text-slate-800 mb-4 flex items-center gap-2">
                  <span>🥧</span>
                  Expense Breakdown
                </h2>
                <div className="space-y-4">
                  {[
                    { label: 'Staff Salaries', value: 45, color: 'emerald' },
                    { label: 'Medical Supplies', value: 25, color: 'blue' },
                    { label: 'Facility Costs', value: 20, color: 'amber' },
                    { label: 'Other Expenses', value: 10, color: 'slate' }
                  ].map((item) => (
                    <div key={item.label}>
                      <div className="flex justify-between mb-2">
                        <span className="text-slate-700 font-medium">{item.label}</span>
                        <span className="text-slate-600 font-semibold">{item.value}%</span>
                      </div>
                      <div className="w-full bg-slate-200 rounded-full h-3">
                        <div 
                          className={`bg-gradient-to-r from-${item.color}-500 to-${item.color}-600 h-3 rounded-full transition-all`}
                          style={{ width: `${item.value}%` }}
                        ></div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Recent Transactions */}
            <div className="bg-white rounded-2xl shadow-lg p-6 border border-slate-200">
              <h2 className="text-2xl font-bold text-slate-800 mb-6 flex items-center gap-2">
                <span>💳</span>
                Recent Transactions
              </h2>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b-2 border-slate-200">
                      <th className="text-left py-3 px-4 text-slate-700 font-semibold">Date</th>
                      <th className="text-left py-3 px-4 text-slate-700 font-semibold">Description</th>
                      <th className="text-left py-3 px-4 text-slate-700 font-semibold">Type</th>
                      <th className="text-right py-3 px-4 text-slate-700 font-semibold">Amount</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr className="border-b border-slate-100 hover:bg-slate-50">
                      <td className="py-4 px-4 text-slate-600">Nov 7, 2025</td>
                      <td className="py-4 px-4 text-slate-900 font-medium">Patient Consultation</td>
                      <td className="py-4 px-4">
                        <span className="px-3 py-1 bg-emerald-100 text-emerald-700 rounded-full text-sm font-semibold">
                          Income
                        </span>
                      </td>
                      <td className="py-4 px-4 text-right text-emerald-600 font-bold">+$50</td>
                    </tr>
                    <tr className="border-b border-slate-100 hover:bg-slate-50">
                      <td className="py-4 px-4 text-slate-600">Nov 6, 2025</td>
                      <td className="py-4 px-4 text-slate-900 font-medium">Medical Supplies</td>
                      <td className="py-4 px-4">
                        <span className="px-3 py-1 bg-red-100 text-red-700 rounded-full text-sm font-semibold">
                          Expense
                        </span>
                      </td>
                      <td className="py-4 px-4 text-right text-red-600 font-bold">-$0</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
