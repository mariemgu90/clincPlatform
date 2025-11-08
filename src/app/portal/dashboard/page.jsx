'use client';

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import Header from '../../../components/Header';
import Sidebar from '../../../components/Sidebar';

export default function PatientPortal() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [patientData, setPatientData] = useState(null);
  const [upcomingAppointments, setUpcomingAppointments] = useState([]);
  const [recentConsultations, setRecentConsultations] = useState([]);
  const [pendingInvoices, setPendingInvoices] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/auth/signin');
    } else if (session?.user?.role !== 'PATIENT') {
      router.push('/dashboard');
    }
  }, [status, session, router]);

  useEffect(() => {
    if (session?.user?.patientId) {
      fetchPatientData();
    }
  }, [session]);

  const fetchPatientData = async () => {
    try {
      const [appointmentsRes, invoicesRes] = await Promise.all([
        fetch(`/api/appointments?patientId=${session.user.patientId}`),
        fetch(`/api/invoices?patientId=${session.user.patientId}`),
      ]);

      if (appointmentsRes.ok) {
        const appointmentsData = await appointmentsRes.json();
        setUpcomingAppointments(appointmentsData.appointments || []);
      }

      if (invoicesRes.ok) {
        const invoicesData = await invoicesRes.json();
        setPendingInvoices(
          invoicesData.invoices?.filter(inv => inv.status === 'PENDING') || []
        );
      }
    } catch (error) {
      console.error('Failed to fetch patient data:', error);
    } finally {
      setLoading(false);
    }
  };

  if (status === 'loading' || loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-600 via-blue-500 to-cyan-400">
        <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-white"></div>
      </div>
    );
  }

  if (session?.user?.role !== 'PATIENT') {
    return null;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-600 via-blue-500 to-cyan-400">
      <Header />
      <div className="flex">
        <Sidebar />
        <main className="flex-1 p-8">
          <div className="max-w-7xl mx-auto">
            {/* Welcome Section */}
            <div className="mb-8">
              <h1 className="text-4xl font-bold text-white mb-2">
                Welcome back, {session.user.name}!
              </h1>
              <p className="text-white/60">
                Manage your appointments and medical records
              </p>
            </div>

            {/* Quick Actions */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
              <QuickActionCard
                title="Book Appointment"
                icon="📅"
                color="from-blue-500 to-cyan-500"
                onClick={() => router.push('/portal/book-appointment')}
              />
              <QuickActionCard
                title="My Records"
                icon="📋"
                color="from-purple-500 to-pink-500"
                onClick={() => router.push('/portal/medical-records')}
              />
              <QuickActionCard
                title="My Invoices"
                icon="💰"
                color="from-green-500 to-emerald-500"
                onClick={() => router.push('/portal/invoices')}
              />
              <QuickActionCard
                title="Messages"
                icon="💬"
                color="from-orange-500 to-red-500"
                onClick={() => router.push('/portal/messages')}
              />
            </div>

            {/* Upcoming Appointments */}
            <div className="glass-card p-6 mb-8">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold text-white flex items-center">
                  <span className="mr-3">📅</span>
                  Upcoming Appointments
                </h2>
                <button
                  onClick={() => router.push('/portal/book-appointment')}
                  className="px-4 py-2 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-lg hover:scale-105 transition-transform"
                >
                  Book New
                </button>
              </div>
              <div className="space-y-4">
                {upcomingAppointments.length > 0 ? (
                  upcomingAppointments.slice(0, 3).map((apt) => (
                    <AppointmentCard key={apt.id} appointment={apt} />
                  ))
                ) : (
                  <div className="text-center py-8">
                    <p className="text-white/60 mb-4">No upcoming appointments</p>
                    <button
                      onClick={() => router.push('/portal/book-appointment')}
                      className="px-6 py-3 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-lg hover:scale-105 transition-transform"
                    >
                      Book Your First Appointment
                    </button>
                  </div>
                )}
              </div>
            </div>

            {/* Grid: Pending Invoices & Health Summary */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Pending Invoices */}
              <div className="glass-card p-6">
                <h2 className="text-2xl font-bold text-white mb-6 flex items-center">
                  <span className="mr-3">💰</span>
                  Pending Invoices
                </h2>
                <div className="space-y-3">
                  {pendingInvoices.length > 0 ? (
                    pendingInvoices.map((invoice) => (
                      <InvoiceCard key={invoice.id} invoice={invoice} />
                    ))
                  ) : (
                    <p className="text-white/60 text-center py-8">No pending invoices</p>
                  )}
                </div>
              </div>

              {/* Health Summary */}
              <div className="glass-card p-6">
                <h2 className="text-2xl font-bold text-white mb-6 flex items-center">
                  <span className="mr-3">🏥</span>
                  Health Summary
                </h2>
                <div className="space-y-4">
                  <HealthMetric label="Blood Type" value="O+" />
                  <HealthMetric label="Last Visit" value="Dec 1, 2024" />
                  <HealthMetric label="Next Checkup" value="Jan 15, 2025" />
                  <button
                    onClick={() => router.push('/portal/medical-records')}
                    className="w-full mt-4 px-4 py-3 bg-white/10 hover:bg-white/20 text-white rounded-lg transition-all"
                  >
                    View Full Medical History →
                  </button>
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>

      <style jsx>{`
        .glass-card {
          background: rgba(255, 255, 255, 0.1);
          backdrop-filter: blur(10px);
          border-radius: 20px;
          border: 1px solid rgba(255, 255, 255, 0.2);
          box-shadow: 0 8px 32px 0 rgba(0, 0, 0, 0.37);
        }
      `}</style>
    </div>
  );
}

function QuickActionCard({ title, icon, color, onClick }) {
  return (
    <div
      onClick={onClick}
      className={`glass-card p-6 cursor-pointer hover:scale-105 transition-all duration-300 group`}
    >
      <div className={`text-5xl mb-4 p-4 rounded-xl bg-gradient-to-r ${color} inline-block group-hover:scale-110 transition-transform`}>
        {icon}
      </div>
      <h3 className="text-white font-semibold">{title}</h3>
    </div>
  );
}

function AppointmentCard({ appointment }) {
  const statusColors = {
    SCHEDULED: 'bg-blue-500/20 text-blue-300',
    CONFIRMED: 'bg-green-500/20 text-green-300',
    COMPLETED: 'bg-purple-500/20 text-purple-300',
    CANCELLED: 'bg-red-500/20 text-red-300',
  };

  return (
    <div className="p-4 rounded-xl bg-white/5 hover:bg-white/10 transition-all">
      <div className="flex items-center justify-between">
        <div className="flex-1">
          <p className="text-white font-semibold">
            {new Date(appointment.startTime).toLocaleDateString('en-US', {
              weekday: 'long',
              year: 'numeric',
              month: 'long',
              day: 'numeric',
            })}
          </p>
          <p className="text-white/60 text-sm">
            {new Date(appointment.startTime).toLocaleTimeString('en-US', {
              hour: '2-digit',
              minute: '2-digit',
            })}
          </p>
          {appointment.doctor && (
            <p className="text-white/80 text-sm mt-1">
              Dr. {appointment.doctor.name}
            </p>
          )}
        </div>
        <div className="flex flex-col items-end space-y-2">
          <span className={`px-3 py-1 rounded-full text-xs font-medium ${statusColors[appointment.status]}`}>
            {appointment.status}
          </span>
          <button className="text-purple-400 hover:text-purple-300 text-sm">
            View Details →
          </button>
        </div>
      </div>
    </div>
  );
}

function InvoiceCard({ invoice }) {
  return (
    <div className="p-4 rounded-xl bg-white/5 hover:bg-white/10 transition-all">
      <div className="flex items-center justify-between">
        <div className="flex-1">
          <p className="text-white font-semibold">{invoice.invoiceNumber}</p>
          <p className="text-white/60 text-sm">
            Due: {new Date(invoice.dueDate).toLocaleDateString()}
          </p>
        </div>
        <div className="flex flex-col items-end space-y-2">
          <p className="text-white font-bold">${invoice.totalAmount}</p>
          <button className="px-4 py-1 bg-green-500 hover:bg-green-600 text-white rounded-lg text-sm transition-colors">
            Pay Now
          </button>
        </div>
      </div>
    </div>
  );
}

function HealthMetric({ label, value }) {
  return (
    <div className="flex items-center justify-between p-3 rounded-lg bg-white/5">
      <span className="text-white/60">{label}</span>
      <span className="text-white font-semibold">{value}</span>
    </div>
  );
}
