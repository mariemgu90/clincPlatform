'use client';

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { fetchAppointments, cancelAppointment } from '@/lib/api';
import Header from '@/components/Header';
import Sidebar from '@/components/Sidebar';

export default function PatientAppointmentsPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [appointments, setAppointments] = useState([]);
  const [filter, setFilter] = useState('ALL'); // ALL, UPCOMING, PAST, CANCELLED
  const [showCancelModal, setShowCancelModal] = useState(false);
  const [selectedAppointment, setSelectedAppointment] = useState(null);

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/auth/login');
    } else if (status === 'authenticated') {
      if (session?.user?.role !== 'PATIENT') {
        router.push('/dashboard');
      } else {
        fetchAppointmentsData();
      }
    }
  }, [status, session, router]);

  const fetchAppointmentsData = async () => {
    try {
      const data = await fetchAppointments({ patientId: session?.user?.patientId });
      setAppointments(data || []);
    } catch (error) {
      console.error('Error fetching appointments:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleCancelAppointment = async () => {
    if (!selectedAppointment) return;

    try {
      await cancelAppointment(selectedAppointment.id);
      fetchAppointmentsData();
      setShowCancelModal(false);
      setSelectedAppointment(null);
    } catch (error) {
      console.error('Error cancelling appointment:', error);
      alert(error.message || 'Failed to cancel appointment. Please try again.');
    }
  };

  const getFilteredAppointments = () => {
    const now = new Date();
    return appointments.filter((apt) => {
      const aptDate = new Date(apt.startTime);
      
      switch (filter) {
        case 'UPCOMING':
          return aptDate >= now && apt.status !== 'CANCELLED' && apt.status !== 'COMPLETED';
        case 'PAST':
          return aptDate < now || apt.status === 'COMPLETED';
        case 'CANCELLED':
          return apt.status === 'CANCELLED';
        default:
          return true;
      }
    });
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'SCHEDULED':
        return 'bg-blue-100 text-blue-700';
      case 'CONFIRMED':
        return 'bg-green-100 text-green-700';
      case 'CANCELLED':
        return 'bg-red-100 text-red-700';
      case 'COMPLETED':
        return 'bg-gray-100 text-gray-700';
      default:
        return 'bg-gray-100 text-gray-700';
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  const formatTime = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  if (status === 'loading' || loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 via-emerald-50 to-teal-50">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600"></div>
      </div>
    );
  }

  const filteredAppointments = getFilteredAppointments();

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-emerald-50 to-teal-50">
      <Header />
      <div className="flex">
        <Sidebar />
        <main className="flex-1 p-8 ml-64">
          <div className="max-w-6xl mx-auto">
            {/* Header */}
            <div className="mb-8">
              <h1 className="text-4xl font-bold bg-gradient-to-r from-emerald-600 to-teal-600 bg-clip-text text-transparent mb-2">
                My Appointments
              </h1>
              <p className="text-gray-600">View and manage your scheduled appointments</p>
            </div>

            {/* Filter Buttons */}
            <div className="mb-6 flex flex-wrap gap-3">
              {['ALL', 'UPCOMING', 'PAST', 'CANCELLED'].map((filterOption) => (
                <button
                  key={filterOption}
                  onClick={() => setFilter(filterOption)}
                  className={`px-6 py-2 rounded-lg font-medium transition-all ${
                    filter === filterOption
                      ? 'bg-gradient-to-r from-emerald-600 to-teal-600 text-white shadow-lg'
                      : 'bg-white/70 backdrop-blur-xl text-gray-700 hover:shadow-lg'
                  }`}
                >
                  {filterOption.charAt(0) + filterOption.slice(1).toLowerCase()}
                </button>
              ))}
            </div>

            {/* Book New Appointment Button */}
            <div className="mb-6">
              <button
                onClick={() => router.push('/portal/book-appointment')}
                className="px-6 py-3 bg-gradient-to-r from-emerald-600 to-teal-600 text-white rounded-xl font-medium hover:shadow-lg transition-all"
              >
                📅 Book New Appointment
              </button>
            </div>

            {/* Appointments List */}
            {filteredAppointments.length === 0 ? (
              <div className="bg-white/70 backdrop-blur-xl rounded-2xl shadow-xl border border-white/20 p-12 text-center">
                <div className="text-6xl mb-4">📅</div>
                <h3 className="text-2xl font-bold text-gray-800 mb-2">No Appointments Found</h3>
                <p className="text-gray-600 mb-6">
                  {filter === 'ALL'
                    ? "You don't have any appointments yet."
                    : `You don't have any ${filter.toLowerCase()} appointments.`}
                </p>
                <button
                  onClick={() => router.push('/portal/book-appointment')}
                  className="px-6 py-3 bg-gradient-to-r from-emerald-600 to-teal-600 text-white rounded-xl font-medium hover:shadow-lg transition-all"
                >
                  Book Your First Appointment
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 gap-6">
                {filteredAppointments.map((appointment) => (
                  <div
                    key={appointment.id}
                    className="bg-white/70 backdrop-blur-xl rounded-2xl shadow-xl border border-white/20 p-6 hover:shadow-2xl transition-all"
                  >
                    <div className="flex flex-col md:flex-row justify-between">
                      {/* Appointment Details */}
                      <div className="flex-1">
                        <div className="flex items-start gap-4 mb-4">
                          {/* Doctor Avatar */}
                          <div className="w-16 h-16 bg-gradient-to-br from-emerald-500 to-teal-500 rounded-full flex items-center justify-center text-white text-2xl font-bold flex-shrink-0">
                            {appointment.doctor?.name?.charAt(0) || 'D'}
                          </div>
                          
                          <div className="flex-1">
                            <h3 className="text-xl font-bold text-gray-800 mb-1">
                              Dr. {appointment.doctor?.name || 'Unknown Doctor'}
                            </h3>
                            <p className="text-gray-600 mb-2">
                              {appointment.service?.name || 'General Consultation'}
                            </p>
                            <span
                              className={`inline-block px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(
                                appointment.status
                              )}`}
                            >
                              {appointment.status}
                            </span>
                          </div>
                        </div>

                        {/* Date and Time */}
                        <div className="space-y-2 ml-20">
                          <div className="flex items-center gap-2 text-gray-700">
                            <span className="font-semibold">📅 Date:</span>
                            <span>{formatDate(appointment.startTime)}</span>
                          </div>
                          <div className="flex items-center gap-2 text-gray-700">
                            <span className="font-semibold">🕐 Time:</span>
                            <span>{formatTime(appointment.startTime)}</span>
                          </div>
                          {appointment.reason && (
                            <div className="flex items-start gap-2 text-gray-700">
                              <span className="font-semibold">📋 Reason:</span>
                              <span>{appointment.reason}</span>
                            </div>
                          )}
                        </div>
                      </div>

                      {/* Actions */}
                      <div className="flex flex-col gap-3 mt-4 md:mt-0 md:ml-4">
                        {appointment.status === 'SCHEDULED' || appointment.status === 'CONFIRMED' ? (
                          <>
                            {new Date(appointment.startTime) > new Date() && (
                              <button
                                onClick={() => {
                                  setSelectedAppointment(appointment);
                                  setShowCancelModal(true);
                                }}
                                className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-all font-medium"
                              >
                                Cancel
                              </button>
                            )}
                          </>
                        ) : null}
                        
                        {appointment.status === 'COMPLETED' && (
                          <button
                            onClick={() => router.push(`/portal/medical-records?appointmentId=${appointment.id}`)}
                            className="px-4 py-2 bg-gradient-to-r from-emerald-600 to-teal-600 text-white rounded-lg hover:shadow-lg transition-all font-medium"
                          >
                            View Record
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </main>
      </div>

      {/* Cancel Confirmation Modal */}
      {showCancelModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-8">
            <h2 className="text-2xl font-bold text-gray-800 mb-4">Cancel Appointment?</h2>
            <p className="text-gray-600 mb-6">
              Are you sure you want to cancel your appointment with Dr.{' '}
              {selectedAppointment?.doctor?.name} on {formatDate(selectedAppointment?.startTime)}?
            </p>
            <div className="flex gap-4">
              <button
                onClick={() => {
                  setShowCancelModal(false);
                  setSelectedAppointment(null);
                }}
                className="flex-1 px-4 py-3 bg-gray-200 text-gray-800 rounded-xl font-medium hover:bg-gray-300 transition-all"
              >
                Keep Appointment
              </button>
              <button
                onClick={handleCancelAppointment}
                className="flex-1 px-4 py-3 bg-red-500 text-white rounded-xl font-medium hover:bg-red-600 transition-all"
              >
                Yes, Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
