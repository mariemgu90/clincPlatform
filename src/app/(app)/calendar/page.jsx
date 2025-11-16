'use client';

import { useState, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import { useSession } from 'next-auth/react';
import toast from 'react-hot-toast';
import AppointmentForm from '@/components/AppointmentForm';
import { fetchAppointments, updateAppointment, deleteAppointment } from '@/lib/api';

const DAYS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
const MONTHS = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];

export default function CalendarPage() {
  const searchParams = useSearchParams();
  const { data: session } = useSession();
  const [currentDate, setCurrentDate] = useState(new Date());
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [view, setView] = useState('month');
  const [showBookingModal, setShowBookingModal] = useState(false);
  const [selectedDate, setSelectedDate] = useState(null);
  const [selectedAppointment, setSelectedAppointment] = useState(null);
  const [showEditMode, setShowEditMode] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    loadAppointments();
  }, [currentDate]);

  const loadAppointments = async () => {
    try {
      const data = await fetchAppointments();
      setAppointments(data);
    } catch (error) {
      console.error('Failed to fetch appointments:', error);
      toast.error('Failed to load appointments');
    } finally {
      setLoading(false);
    }
  };

  const getDaysInMonth = (date) => {
    const year = date.getFullYear();
    const month = date.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const daysInMonth = lastDay.getDate();
    const startingDayOfWeek = firstDay.getDay();
    
    const days = [];
    
    // Previous month's days
    const prevMonthLastDay = new Date(year, month, 0).getDate();
    for (let i = startingDayOfWeek - 1; i >= 0; i--) {
      days.push({
        day: prevMonthLastDay - i,
        isCurrentMonth: false,
        date: new Date(year, month - 1, prevMonthLastDay - i)
      });
    }
    
    // Current month's days
    for (let i = 1; i <= daysInMonth; i++) {
      days.push({
        day: i,
        isCurrentMonth: true,
        date: new Date(year, month, i)
      });
    }
    
    // Next month's days
    const remainingDays = 42 - days.length; // 6 rows * 7 days
    for (let i = 1; i <= remainingDays; i++) {
      days.push({
        day: i,
        isCurrentMonth: false,
        date: new Date(year, month + 1, i)
      });
    }
    
    return days;
  };

  const getAppointmentsForDate = (date) => {
    return appointments.filter(apt => {
      const aptDate = new Date(apt.startTime);
      return aptDate.toDateString() === date.toDateString();
    });
  };

  const handlePrevMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1));
  };

  const handleNextMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1));
  };

  const handleToday = () => {
    setCurrentDate(new Date());
  };

  const handleDateClick = (date) => {
    setSelectedDate(date);
    setSelectedAppointment(null);
    setShowEditMode(false);
    setShowBookingModal(true);
  };

  const handleAppointmentClick = (apt) => {
    setSelectedAppointment(apt);
    setShowEditMode(false);
    setShowBookingModal(true);
  };

  const handleEditAppointment = () => {
    setShowEditMode(true);
  };

  const handleCancelAppointment = async () => {
    if (!selectedAppointment) return;
    
    if (!confirm('Are you sure you want to cancel this appointment?')) return;

    try {
      await updateAppointment(selectedAppointment.id, { status: 'CANCELLED' });
      toast.success('Appointment cancelled successfully');
      loadAppointments();
      setShowBookingModal(false);
      setSelectedAppointment(null);
    } catch (error) {
      console.error('Failed to cancel appointment:', error);
      toast.error('Failed to cancel appointment');
    }
  };

  const handleDeleteAppointment = async () => {
    if (!selectedAppointment) return;
    
    if (!confirm('Are you sure you want to delete this appointment? This action cannot be undone.')) return;

    setIsDeleting(true);
    try {
      await deleteAppointment(selectedAppointment.id);
      toast.success('Appointment deleted successfully');
      loadAppointments();
      setShowBookingModal(false);
      setSelectedAppointment(null);
    } catch (error) {
      console.error('Failed to delete appointment:', error);
      toast.error('Failed to delete appointment');
    } finally {
      setIsDeleting(false);
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'SCHEDULED':
        return 'bg-blue-500';
      case 'CONFIRMED':
        return 'bg-green-500';
      case 'COMPLETED':
        return 'bg-purple-500';
      case 'CANCELLED':
        return 'bg-red-500';
      case 'NO_SHOW':
        return 'bg-gray-500';
      default:
        return 'bg-gray-400';
    }
  };

  const getStatusBadgeColor = (status) => {
    switch (status) {
      case 'SCHEDULED':
        return 'bg-blue-100 text-blue-700';
      case 'CONFIRMED':
        return 'bg-green-100 text-green-700';
      case 'COMPLETED':
        return 'bg-purple-100 text-purple-700';
      case 'CANCELLED':
        return 'bg-red-100 text-red-700';
      case 'NO_SHOW':
        return 'bg-gray-100 text-gray-700';
      default:
        return 'bg-gray-100 text-gray-700';
    }
  };

  const formatTime = (dateString) => {
    return new Date(dateString).toLocaleTimeString('en-US', {
      hour: 'numeric',
      minute: '2-digit',
      hour12: true
    });
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-emerald-500 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading calendar...</p>
        </div>
      </div>
    );
  }

  const days = getDaysInMonth(currentDate);
  const today = new Date();

  return (
    <div className="max-w-7xl mx-auto">
      {/* Header Section */}
      <div className="bg-gradient-to-r from-emerald-500 to-teal-500 rounded-2xl p-8 mb-6 shadow-xl shadow-emerald-500/20 animate-slide-up">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <h1 className="text-4xl font-bold text-white mb-2">📅 Appointment Calendar</h1>
            <p className="text-white/90">Manage your appointments and schedule</p>
          </div>
          <button 
            onClick={() => {
              setSelectedDate(new Date());
              setSelectedAppointment(null);
              setShowEditMode(false);
              setShowBookingModal(true);
            }}
            className="px-6 py-3 bg-white text-emerald-600 rounded-xl font-semibold hover:shadow-lg transition-all flex items-center gap-2"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
            New Appointment
          </button>
        </div>
      </div>

      {/* Calendar Controls */}
      <div className="bg-white rounded-2xl shadow-lg border border-slate-200 p-6 mb-6 animate-slide-up" style={{animationDelay: '0.1s'}}>
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <button
              onClick={handlePrevMonth}
              className="p-2 hover:bg-emerald-50 rounded-lg transition-colors"
            >
              <svg className="w-5 h-5 text-gray-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
            </button>
            <h2 className="text-2xl font-bold bg-gradient-to-r from-emerald-600 to-teal-600 bg-clip-text text-transparent">
              {MONTHS[currentDate.getMonth()]} {currentDate.getFullYear()}
            </h2>
            <button
              onClick={handleNextMonth}
              className="p-2 hover:bg-emerald-50 rounded-lg transition-colors"
            >
              <svg className="w-5 h-5 text-gray-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </button>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleToday}
              className="px-4 py-2 bg-emerald-50 hover:bg-emerald-100 text-emerald-700 rounded-lg transition-colors text-sm font-medium"
            >
              Today
            </button>
            <div className="flex gap-1 bg-slate-100 rounded-lg p-1">
              <button
                onClick={() => setView('month')}
                className={`px-3 py-1 rounded text-sm font-medium transition-colors ${
                  view === 'month' ? 'bg-white shadow-sm text-emerald-600' : 'text-gray-600 hover:text-gray-800'
                }`}
              >
                Month
              </button>
              <button
                onClick={() => setView('week')}
                className={`px-3 py-1 rounded text-sm font-medium transition-colors ${
                  view === 'week' ? 'bg-white shadow-sm text-emerald-600' : 'text-gray-600 hover:text-gray-800'
                }`}
                disabled
              >
                Week
              </button>
              <button
                onClick={() => setView('day')}
                className={`px-3 py-1 rounded text-sm font-medium transition-colors ${
                  view === 'day' ? 'bg-white shadow-sm text-emerald-600' : 'text-gray-600 hover:text-gray-800'
                }`}
                disabled
              >
                Day
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Calendar Grid */}
      <div className="bg-white rounded-2xl shadow-lg border border-slate-200 p-6 animate-slide-up" style={{animationDelay: '0.2s'}}>
        {/* Day Headers */}
        <div className="grid grid-cols-7 gap-2 mb-2">
          {DAYS.map(day => (
            <div key={day} className="text-center py-3 font-semibold text-gray-700 bg-slate-50 rounded-lg">
              {day}
            </div>
          ))}
        </div>

        {/* Calendar Days */}
        <div className="grid grid-cols-7 gap-2">
          {days.map((dayInfo, index) => {
            const dayAppointments = getAppointmentsForDate(dayInfo.date);
            const isToday = dayInfo.date.toDateString() === today.toDateString();
            
            return (
              <div
                key={index}
                onClick={() => dayInfo.isCurrentMonth && handleDateClick(dayInfo.date)}
                className={`
                  min-h-[120px] p-2 rounded-lg border-2 transition-all cursor-pointer
                  ${dayInfo.isCurrentMonth ? 'bg-white hover:bg-emerald-50 border-slate-200 hover:border-emerald-300' : 'bg-slate-50 border-slate-100'}
                  ${isToday ? 'ring-2 ring-emerald-500 border-emerald-500 bg-emerald-50/30' : ''}
                `}
              >
                <div className="flex items-center justify-between mb-2">
                  <span className={`
                    text-sm font-semibold
                    ${!dayInfo.isCurrentMonth ? 'text-gray-400' : isToday ? 'text-emerald-600' : 'text-gray-700'}
                  `}>
                    {dayInfo.day}
                  </span>
                  {dayAppointments.length > 0 && (
                    <span className="text-xs bg-emerald-100 text-emerald-700 px-2 py-0.5 rounded-full font-medium">
                      {dayAppointments.length}
                    </span>
                  )}
                </div>

                {/* Appointments */}
                <div className="space-y-1">
                  {dayAppointments.slice(0, 3).map((apt) => (
                    <div
                      key={apt.id}
                      onClick={(e) => {
                        e.stopPropagation();
                        handleAppointmentClick(apt);
                      }}
                      className={`text-xs p-2 rounded ${getStatusColor(apt.status)} text-white truncate hover:shadow-md transition-shadow`}
                    >
                      <div className="font-medium truncate">
                        {formatTime(apt.startTime)}
                      </div>
                      <div className="truncate opacity-90">
                        {apt.patient ? `${apt.patient.firstName} ${apt.patient.lastName}` : 'No patient'}
                      </div>
                    </div>
                  ))}
                  {dayAppointments.length > 3 && (
                    <div className="text-xs text-center text-gray-500 font-medium py-1">
                      +{dayAppointments.length - 3} more
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Legend */}
      <div className="bg-white rounded-2xl shadow-lg border border-slate-200 p-4 mt-6 animate-slide-up" style={{animationDelay: '0.3s'}}>
        <div className="flex flex-wrap gap-4 items-center justify-center">
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 bg-blue-500 rounded"></div>
            <span className="text-sm text-gray-700">Scheduled</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 bg-green-500 rounded"></div>
            <span className="text-sm text-gray-700">Confirmed</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 bg-purple-500 rounded"></div>
            <span className="text-sm text-gray-700">Completed</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 bg-red-500 rounded"></div>
            <span className="text-sm text-gray-700">Cancelled</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 bg-gray-500 rounded"></div>
            <span className="text-sm text-gray-700">No Show</span>
          </div>
        </div>
      </div>

      {/* Booking Modal */}
      {showBookingModal && (
        <div 
          className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-fade-in"
          onClick={() => {
            setShowBookingModal(false);
            setSelectedAppointment(null);
            setShowEditMode(false);
          }}
        >
          <div 
            className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-auto animate-scale-in"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="sticky top-0 bg-white bg-opacity-95 backdrop-blur-lg p-6 border-b border-gray-200 flex items-center justify-between rounded-t-2xl">
              <h2 className="text-2xl font-bold bg-gradient-to-r from-emerald-600 to-teal-600 bg-clip-text text-transparent">
                {selectedAppointment && !showEditMode ? 'Appointment Details' : selectedAppointment && showEditMode ? 'Edit Appointment' : 'New Appointment'}
              </h2>
              <button
                onClick={() => {
                  setShowBookingModal(false);
                  setSelectedAppointment(null);
                  setShowEditMode(false);
                }}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            <div className="p-6">
              {selectedAppointment && !showEditMode ? (
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <h3 className="text-xl font-semibold text-gray-800">
                      {selectedAppointment.patient 
                        ? `${selectedAppointment.patient.firstName} ${selectedAppointment.patient.lastName}`
                        : 'No patient assigned'
                      }
                    </h3>
                    <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusBadgeColor(selectedAppointment.status)}`}>
                      {selectedAppointment.status}
                    </span>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="p-4 bg-slate-50 rounded-lg">
                      <p className="text-sm text-gray-500 mb-1">Date</p>
                      <p className="font-medium text-gray-800">
                        {new Date(selectedAppointment.startTime).toLocaleDateString('en-US', {
                          weekday: 'long',
                          year: 'numeric',
                          month: 'long',
                          day: 'numeric'
                        })}
                      </p>
                    </div>
                    <div className="p-4 bg-slate-50 rounded-lg">
                      <p className="text-sm text-gray-500 mb-1">Time</p>
                      <p className="font-medium text-gray-800">
                        {formatTime(selectedAppointment.startTime)} - {formatTime(selectedAppointment.endTime)}
                      </p>
                    </div>
                  </div>

                  {selectedAppointment.doctor && (
                    <div className="p-4 bg-blue-50 rounded-lg">
                      <p className="text-sm text-blue-600 mb-1">Doctor</p>
                      <p className="font-medium text-gray-800">{selectedAppointment.doctor.name}</p>
                    </div>
                  )}

                  {selectedAppointment.service ? (
                    <div className="p-4 bg-purple-50 rounded-lg">
                      <p className="text-sm text-purple-600 mb-1">Service</p>
                      <p className="font-medium text-gray-800">{selectedAppointment.service.name}</p>
                      <p className="text-sm text-gray-600 mt-1">Duration: {selectedAppointment.service.duration} minutes</p>
                    </div>
                  ) : (
                    <div className="p-4 bg-purple-50 rounded-lg">
                      <p className="text-sm text-purple-600 mb-1">Service</p>
                      <p className="font-medium text-gray-800">General Consultation</p>
                    </div>
                  )}

                  {selectedAppointment.notes && (
                    <div className="p-4 bg-yellow-50 rounded-lg">
                      <p className="text-sm text-yellow-800 mb-1">Notes</p>
                      <p className="text-gray-700">{selectedAppointment.notes}</p>
                    </div>
                  )}

                  {/* Action Buttons */}
                  {session?.user?.role !== 'PATIENT' && selectedAppointment.status !== 'CANCELLED' && selectedAppointment.status !== 'COMPLETED' && (
                    <div className="flex gap-3 pt-4 border-t border-gray-200">
                      <button 
                        onClick={handleEditAppointment}
                        className="flex-1 py-3 px-6 bg-gradient-to-r from-emerald-500 to-teal-500 text-white rounded-xl hover:shadow-lg transition-all font-medium"
                      >
                        Edit Appointment
                      </button>
                      <button 
                        onClick={handleCancelAppointment}
                        className="flex-1 py-3 px-6 bg-yellow-500 hover:bg-yellow-600 text-white rounded-xl transition-all font-medium"
                      >
                        Cancel
                      </button>
                      <button 
                        onClick={handleDeleteAppointment}
                        disabled={isDeleting}
                        className="flex-1 py-3 px-6 bg-red-500 hover:bg-red-600 text-white rounded-xl transition-all font-medium disabled:opacity-50"
                      >
                        {isDeleting ? 'Deleting...' : 'Delete'}
                      </button>
                    </div>
                  )}
                </div>
              ) : (
                <AppointmentForm
                  appointment={showEditMode ? selectedAppointment : null}
                  preselectedDate={selectedDate}
                  preselectedPatient={searchParams.get('patient')}
                  onSuccess={() => {
                    if (showEditMode) {
                      toast.success('Appointment updated successfully');
                    } else {
                      toast.success('Appointment created successfully');
                    }
                    loadAppointments();
                    setShowBookingModal(false);
                    setSelectedDate(null);
                    setSelectedAppointment(null);
                    setShowEditMode(false);
                  }}
                  onCancel={() => {
                    setShowBookingModal(false);
                    setSelectedDate(null);
                    setSelectedAppointment(null);
                    setShowEditMode(false);
                  }}
                />
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
