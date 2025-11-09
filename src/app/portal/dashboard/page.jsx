"use client";

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { fetchPortalStats } from '@/lib/api';
import Header from '@/components/Header';
import Sidebar from '@/components/Sidebar';
import StatsCard from '@/components/StatsCard';

export default function PatientPortal() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    upcomingAppointments: 0,
    totalAppointments: 0,
    pendingInvoices: 0,
    pendingAmount: 0,
    totalPaid: 0,
    activePrescriptions: 0,
    recentConsultations: 0,
  });
  const [nextAppointment, setNextAppointment] = useState(null);
  const [lastVisit, setLastVisit] = useState(null);
  const [healthMetrics, setHealthMetrics] = useState({
    bloodType: 'Not specified',
    allergies: [],
    currentMedications: [],
  });
  const [patientInfo, setPatientInfo] = useState(null);

  // Dashboard card definitions - keep JSX DRY by mapping arrays
  const statCards = [
    {
      title: 'Upcoming Appointments',
      value: stats.upcomingAppointments,
      icon: '📅',
      color: 'from-emerald-500 to-teal-500',
      link: '/portal/appointments',
    },
    {
      title: 'Total Visits',
      value: stats.totalAppointments,
      icon: '🏥',
      color: 'from-teal-500 to-cyan-500',
      link: '/portal/appointments',
    },
    {
      title: 'Active Prescriptions',
      value: stats.activePrescriptions,
      icon: '💊',
      color: 'from-cyan-500 to-blue-500',
      link: 'portal/prescriptions',
    },
    {
      title: 'Pending Bills',
      value: `$${(stats.pendingAmount || 0).toFixed(2)}`,
      icon: '💰',
      color: 'from-amber-500 to-orange-500',
      link: '/portal/invoices',
    },
  ];

  const quickActions = [
    {
      title: 'Book Appointment',
      icon: '📅',
      color: 'from-emerald-500 to-teal-500',
      link: '/portal/book-appointment',
    },
    {
      title: 'My Records',
      icon: '📋',
      color: 'from-teal-500 to-cyan-500',
      link: '/portal/medical-records',
    },
    {
      title: 'My Invoices',
      icon: '💰',
      color: 'from-cyan-500 to-blue-500',
      link: '/portal/invoices',
    },
    {
      title: 'Prescriptions',
      icon: '💊',
      color: 'from-blue-500 to-indigo-500',
      link: '/portal/prescriptions',
    },
  ];

  








  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/auth/signin');
    } else if (session?.user?.role !== 'PATIENT') {
      router.push('/dashboard');
    }
  }, [status, session, router]);

  useEffect(() => {
    if (session?.user?.role === 'PATIENT' && session?.user?.patientId) {
      fetchPatientData();
    }
  }, [session]);

  const fetchPatientData = async () => {
    try {
      const data = await fetchPortalStats();
      setStats(data?.stats || {});
      setNextAppointment(data?.nextAppointment || null);
      setLastVisit(data?.lastVisit || null);
      setHealthMetrics(
        data?.healthMetrics || { bloodType: 'Not specified', allergies: [], currentMedications: [] }
      );
      setPatientInfo(data?.patient || null);
    } catch (error) {
      console.error('Failed to fetch patient data:', error);
    } finally {
      setLoading(false);
    }
  };

  if (status === 'loading' || loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 via-emerald-50 to-teal-50">
        <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-emerald-500"></div>
      </div>
    );
  }

  if (session?.user?.role !== 'PATIENT') {
    return null;
  }
 const HealthMetric = ({ label, value }) => {
  return (
    <div className="flex items-center justify-between p-3 rounded-lg bg-emerald-50 border border-emerald-200">
      <span className="text-gray-600 text-sm">{label}</span>
      <span className="text-gray-800 font-semibold text-sm">{value}</span>
    </div>
  );
}
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-emerald-50 to-teal-50">
      <Header />
      <div className="flex">
        <Sidebar />
        <main className="flex-1 p-8">
          <div className="max-w-7xl mx-auto">
            {/* Welcome Section */}
            <div className="mb-8">
              <h1 className="text-4xl font-bold bg-gradient-to-r from-emerald-600 to-teal-600 bg-clip-text text-transparent mb-2">
                Welcome back, {patientInfo?.firstName || session.user.name}!
              </h1>
              <p className="text-gray-600">Manage your appointments and medical records</p>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
              {statCards.map((card) => (
                <StatsCard
                  key={card.title}
                  title={card.title}
                  value={card.value}
                  icon={card.icon}
                  color={card.color}
                  onClick={card.onClick}
                />
              ))}
            </div>

            {/* Quick Actions */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
              {quickActions.map((action) => (
                <StatsCard
                  key={action.title}
                  title={action.title}
                  icon={action.icon}
                  color={action.color}
                  onClick={action.onClick}
                />
              ))}
            </div>

            {/* Main Content Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
              {/* Next Appointment - Larger Card */}
              <div className="lg:col-span-2 glass-card p-6">
                <h2 className="text-2xl font-bold text-gray-800 mb-6 flex items-center">
                  <span className="mr-3">📅</span>
                  Next Appointment
                </h2>
                {nextAppointment ? (
                  <div className="bg-gradient-to-br from-emerald-50 to-teal-50 rounded-xl p-6 border-2 border-emerald-200">
                    <div className="flex items-start justify-between mb-4">
                      <div>
                        <h3 className="text-xl font-bold text-gray-800 mb-2">
                          {nextAppointment.serviceName || 'Consultation'}
                        </h3>
                        <p className="text-gray-700 text-lg">Dr. {nextAppointment.doctorName}</p>
                      </div>
                      <span className="px-3 py-1 bg-emerald-500 text-white rounded-full text-sm font-medium">
                        {nextAppointment.status}
                      </span>
                    </div>
                    <div className="space-y-3 mb-6">
                      <div className="flex items-center text-gray-700">
                        <span className="font-semibold mr-2">📅 Date:</span>
                        <span>
                          {new Date(nextAppointment.date).toLocaleDateString('en-US', {
                            weekday: 'long',
                            year: 'numeric',
                            month: 'long',
                            day: 'numeric',
                          })}
                        </span>
                      </div>
                      <div className="flex items-center text-gray-700">
                        <span className="font-semibold mr-2">🕐 Time:</span>
                        <span>
                          {new Date(nextAppointment.date).toLocaleTimeString('en-US', {
                            hour: '2-digit',
                            minute: '2-digit',
                          })}
                        </span>
                      </div>
                    </div>
                    <button
                      onClick={() => router.push('/portal/appointments')}
                      className="w-full px-4 py-3 bg-gradient-to-r from-emerald-500 to-teal-500 text-white rounded-lg hover:shadow-lg transition-all font-medium"
                    >
                      View Details
                    </button>
                  </div>
                ) : (
                  <div className="text-center py-12">
                    <div className="text-6xl mb-4">📅</div>
                    <p className="text-gray-600 mb-6 text-lg">No upcoming appointments</p>
                    <button
                      onClick={() => router.push('/portal/book-appointment')}
                      className="px-6 py-3 bg-gradient-to-r from-emerald-500 to-teal-500 text-white rounded-lg hover:shadow-lg transition-all font-medium"
                    >
                      Book Your Next Appointment
                    </button>
                  </div>
                )}
              </div>

              {/* Health Summary */}
              <div className="glass-card p-6">
                <h2 className="text-2xl font-bold text-gray-800 mb-6 flex items-center">
                  <span className="mr-3">🏥</span>
                  Health Summary
                </h2>
                <div className="space-y-4">
                  <HealthMetric label="Blood Type" value={healthMetrics.bloodType} />
                  <HealthMetric
                    label="Last Visit"
                    value={lastVisit ? new Date(lastVisit.date).toLocaleDateString('en-US', {
                      month: 'short',
                      day: 'numeric',
                      year: 'numeric',
                    }) : 'No visits yet'}
                  />
                  {lastVisit && <HealthMetric label="Last Doctor" value={`Dr. ${lastVisit.doctorName}`} />}
                  <HealthMetric label="Total Consultations" value={stats.recentConsultations} />
                  <HealthMetric
                    label="Allergies"
                    value={healthMetrics.allergies.length > 0 ? healthMetrics.allergies.join(', ') : 'None reported'}
                  />
                  <button
                    onClick={() => router.push('/portal/medical-records')}
                    className="w-full mt-4 px-4 py-3 bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-600 rounded-lg transition-all border border-emerald-500/30 font-medium"
                  >
                    View Full Medical History →
                  </button>
                </div>
              </div>
            </div>

            {/* Additional Info Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Current Medications */}
              <div className="glass-card p-6">
                <h2 className="text-2xl font-bold text-gray-800 mb-6 flex items-center">
                  <span className="mr-3">💊</span>
                  Current Medications
                </h2>
                {healthMetrics.currentMedications.length > 0 ? (
                  <div className="space-y-3">
                    {healthMetrics.currentMedications.map((medication, index) => (
                      <div key={index} className="p-3 rounded-lg bg-blue-50 border border-blue-200">
                        <p className="text-gray-800 font-medium">{medication}</p>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <p className="text-gray-500">No current medications</p>
                  </div>
                )}
                <button
                  onClick={() => router.push('/portal/prescriptions')}
                  className="w-full mt-4 px-4 py-3 bg-blue-500/10 hover:bg-blue-500/20 text-blue-600 rounded-lg transition-all border border-blue-500/30 font-medium"
                >
                  View All Prescriptions →
                </button>
              </div>

              {/* Billing Summary */}
              <div className="glass-card p-6">
                <h2 className="text-2xl font-bold text-gray-800 mb-6 flex items-center">
                  <span className="mr-3">💳</span>
                  Billing Summary
                </h2>
                <div className="space-y-4">
                  <div className="p-4 rounded-lg bg-amber-50 border border-amber-200">
                    <p className="text-gray-600 text-sm mb-1">Pending Bills</p>
                    <p className="text-3xl font-bold text-gray-800">${(stats.pendingAmount || 0).toFixed(2)}</p>
                    <p className="text-gray-600 text-sm mt-1">{stats.pendingInvoices} invoice(s)</p>
                  </div>
                  <div className="p-4 rounded-lg bg-emerald-50 border border-emerald-200">
                    <p className="text-gray-600 text-sm mb-1">Total Paid</p>
                    <p className="text-3xl font-bold text-emerald-600">${(stats.totalPaid || 0).toFixed(2)}</p>
                  </div>
                </div>
                <button
                  onClick={() => router.push('/portal/invoices')}
                  className="w-full mt-4 px-4 py-3 bg-gradient-to-r from-emerald-500 to-teal-500 text-white rounded-lg hover:shadow-lg transition-all font-medium"
                >
                  {stats.pendingInvoices > 0 ? 'Pay Now' : 'View Invoices'} →
                </button>
              </div>
            </div>
          </div>
        </main>
      </div>

      <style jsx>{`
        .glass-card {
          background: rgba(255, 255, 255, 0.8);
          backdrop-filter: blur(10px);
          border-radius: 20px;
          border: 1px solid rgba(16, 185, 129, 0.2);
          box-shadow: 0 8px 32px 0 rgba(16, 185, 129, 0.1);
        }
      `}</style>
    </div>
  );
}





