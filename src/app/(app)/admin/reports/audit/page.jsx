'use client';

import { useState, useEffect } from 'react';
import RoleGuard from '@/components/RoleGuard';

export default function SystemAudit() {
  const [loading, setLoading] = useState(false);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-emerald-500"></div>
      </div>
    );
  }

  const auditLogs = [
    { time: '10:45 AM', user: 'Admin User', action: 'User login', ip: '192.168.1.100', status: 'Success' },
    { time: '10:30 AM', user: 'Dr. Sarah Smith', action: 'Patient record updated', ip: '192.168.1.105', status: 'Success' },
    { time: '10:15 AM', user: 'Maria Garcia', action: 'Appointment scheduled', ip: '192.168.1.110', status: 'Success' },
    { time: '10:00 AM', user: 'Unknown', action: 'Failed login attempt', ip: '45.123.45.67', status: 'Failed' },
    { time: '09:45 AM', user: 'Admin User', action: 'Staff member added', ip: '192.168.1.100', status: 'Success' },
  ];

  return (
    <RoleGuard allowedRoles={['ADMIN']}>
      <div className="mx-auto bg-gradient-to-br from-slate-50 via-slate-100 to-slate-50 rounded-3xl p-8 shadow-2xl">
        {/* Header */}
        <div className="bg-gradient-to-r from-emerald-500 to-teal-500 rounded-2xl p-6 mb-6 shadow-lg shadow-emerald-500/30 flex items-center justify-between">
              <div>
                <h1 className="text-3xl font-bold text-white mb-2">
                  🔐 System Audit Log
                </h1>
                <p className="text-white/90">
                  Security and compliance monitoring
                </p>
              </div>
              <button
                onClick={() => router.push('/admin/dashboard')}
                className="px-6 py-3 bg-white text-emerald-600 rounded-xl hover:shadow-lg transition-all font-semibold"
              >
                ← Back to Dashboard
              </button>
            </div>

            {/* Security Overview */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
              <div className="bg-white rounded-2xl shadow-lg p-6 border-2 border-emerald-200">
                <div className="text-4xl mb-3">✅</div>
                <h3 className="text-slate-600 font-semibold mb-2">Total Events</h3>
                <p className="text-3xl font-bold text-emerald-600">{auditLogs.length}</p>
              </div>

              <div className="bg-white rounded-2xl shadow-lg p-6 border-2 border-blue-200">
                <div className="text-4xl mb-3">👤</div>
                <h3 className="text-slate-600 font-semibold mb-2">Active Users</h3>
                <p className="text-3xl font-bold text-blue-600">7</p>
              </div>

              <div className="bg-white rounded-2xl shadow-lg p-6 border-2 border-amber-200">
                <div className="text-4xl mb-3">⚠️</div>
                <h3 className="text-slate-600 font-semibold mb-2">Warnings</h3>
                <p className="text-3xl font-bold text-amber-600">1</p>
              </div>

              <div className="bg-white rounded-2xl shadow-lg p-6 border-2 border-red-200">
                <div className="text-4xl mb-3">🚫</div>
                <h3 className="text-slate-600 font-semibold mb-2">Failed Attempts</h3>
                <p className="text-3xl font-bold text-red-600">1</p>
              </div>
            </div>

            {/* Security Status */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
              <div className="bg-white rounded-2xl shadow-lg p-6 border border-slate-200">
                <h2 className="text-xl font-bold text-slate-800 mb-4 flex items-center gap-2">
                  <span>🛡️</span>
                  Security Status
                </h2>
                <div className="space-y-4">
                  {[
                    { label: 'Firewall Status', value: 'Active', color: 'emerald' },
                    { label: 'SSL Certificate', value: 'Valid', color: 'emerald' },
                    { label: 'Data Encryption', value: 'Enabled', color: 'emerald' },
                    { label: 'Backup Status', value: 'Up to date', color: 'emerald' }
                  ].map((item) => (
                    <div key={item.label} className="flex items-center justify-between p-3 bg-slate-50 rounded-xl border border-slate-200">
                      <span className="text-slate-700 font-medium">{item.label}</span>
                      <span className={`px-3 py-1 bg-${item.color}-100 text-${item.color}-700 rounded-full text-sm font-semibold`}>
                        {item.value}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="bg-white rounded-2xl shadow-lg p-6 border border-slate-200">
                <h2 className="text-xl font-bold text-slate-800 mb-4 flex items-center gap-2">
                  <span>📋</span>
                  Compliance Check
                </h2>
                <div className="space-y-4">
                  {[
                    { label: 'HIPAA Compliance', value: '100%', progress: 100 },
                    { label: 'GDPR Compliance', value: '100%', progress: 100 },
                    { label: 'Data Retention', value: '100%', progress: 100 },
                    { label: 'Access Control', value: '95%', progress: 95 }
                  ].map((item) => (
                    <div key={item.label}>
                      <div className="flex justify-between mb-2">
                        <span className="text-slate-700 font-medium">{item.label}</span>
                        <span className="text-emerald-600 font-semibold">{item.value}</span>
                      </div>
                      <div className="w-full bg-slate-200 rounded-full h-2">
                        <div 
                          className="bg-gradient-to-r from-emerald-500 to-teal-500 h-2 rounded-full transition-all"
                          style={{ width: `${item.progress}%` }}
                        ></div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Audit Log Table */}
            <div className="bg-white rounded-2xl shadow-lg p-6 border border-slate-200">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold text-slate-800 flex items-center gap-2">
                  <span>📜</span>
                  Recent Audit Events
                </h2>
                <button className="px-4 py-2 bg-gradient-to-r from-emerald-500 to-teal-500 text-white rounded-xl font-semibold hover:shadow-lg transition-all">
                  Export Log
                </button>
              </div>
              
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b-2 border-slate-200">
                      <th className="text-left py-3 px-4 text-slate-700 font-semibold">Time</th>
                      <th className="text-left py-3 px-4 text-slate-700 font-semibold">User</th>
                      <th className="text-left py-3 px-4 text-slate-700 font-semibold">Action</th>
                      <th className="text-left py-3 px-4 text-slate-700 font-semibold">IP Address</th>
                      <th className="text-left py-3 px-4 text-slate-700 font-semibold">Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {auditLogs.map((log, index) => (
                      <tr key={index} className="border-b border-slate-100 hover:bg-slate-50">
                        <td className="py-4 px-4 text-slate-600">{log.time}</td>
                        <td className="py-4 px-4 text-slate-900 font-medium">{log.user}</td>
                        <td className="py-4 px-4 text-slate-700">{log.action}</td>
                        <td className="py-4 px-4 text-slate-600 font-mono text-sm">{log.ip}</td>
                        <td className="py-4 px-4">
                          <span className={`px-3 py-1 rounded-full text-sm font-semibold ${
                            log.status === 'Success' 
                              ? 'bg-emerald-100 text-emerald-700' 
                              : 'bg-red-100 text-red-700'
                          }`}>
                            {log.status}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
      </div>
    </RoleGuard>
  );
}
