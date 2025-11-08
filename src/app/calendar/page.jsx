'use client';

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter, useSearchParams } from 'next/navigation';
import Header from '../../components/Header';
import Sidebar from '../../components/Sidebar';
import AppointmentForm from '../../components/AppointmentForm';

const DAYS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
const MONTHS = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];

export default function CalendarPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const searchParams = useSearchParams();
  const [currentDate, setCurrentDate] = useState(new Date());
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [view, setView] = useState('month'); // 'month' or 'week' or 'day'
  const [showBookingModal, setShowBookingModal] = useState(false);
  const [selectedDate, setSelectedDate] = useState(null);
  const [selectedAppointment, setSelectedAppointment] = useState(null);

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/auth/signin');
    }
  }, [status, router]);

  useEffect(() => {
    fetchAppointments();
  }, [currentDate]);

  const fetchAppointments = async () => {
    try {
      const res = await fetch('/api/appointments');
      const data = await res.json();
      setAppointments(data.appointments || []);
    } catch (error) {
      console.error('Failed to fetch appointments:', error);
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
    setShowBookingModal(true);
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

  const formatTime = (dateString) => {
    return new Date(dateString).toLocaleTimeString('en-US', {
      hour: 'numeric',
      minute: '2-digit',
      hour12: true
    });
  };

  if (status === 'loading' || loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-600 via-blue-500 to-cyan-400">
        <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-white"></div>
      </div>
    );
  }

  const days = getDaysInMonth(currentDate);
  const today = new Date();

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-purple-600 via-blue-500 to-cyan-400">
      <Header />
      <div className="flex flex-1">
        <Sidebar />
        <main className="flex-1 p-6 overflow-auto">
          {/* Header Section */}
          <div className="glass-card p-6 mb-6 animate-slideUp">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
              <div>
                <h1 className="text-3xl font-bold gradient-text mb-2">Appointment Calendar</h1>
                <p className="text-gray-600">Manage your appointments and schedule</p>
              </div>
              <button 
                onClick={() => {
                  setSelectedDate(new Date());
                  setSelectedAppointment(null);
                  setShowBookingModal(true);
                }}
                className="btn-primary flex items-center gap-2"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                </svg>
                New Appointment
              </button>
            </div>
          </div>

          {/* Calendar Controls */}
          <div className="glass-card p-6 mb-6 animate-slideUp" style={{animationDelay: '0.1s'}}>
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div className="flex items-center gap-4">
                <button
                  onClick={handlePrevMonth}
                  className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                  </svg>
                </button>
                <h2 className="text-2xl font-bold text-gray-800">
                  {MONTHS[currentDate.getMonth()]} {currentDate.getFullYear()}
                </h2>
                <button
                  onClick={handleNextMonth}
                  className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </button>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={handleToday}
                  className="px-4 py-2 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors text-sm font-medium"
                >
                  Today
                </button>
                <div className="flex gap-1 bg-gray-100 rounded-lg p-1">
                  <button
                    onClick={() => setView('month')}
                    className={`px-3 py-1 rounded text-sm font-medium transition-colors ${
                      view === 'month' ? 'bg-white shadow-sm text-purple-600' : 'text-gray-600 hover:text-gray-800'
                    }`}
                  >
                    Month
                  </button>
                  <button
                    onClick={() => setView('week')}
                    className={`px-3 py-1 rounded text-sm font-medium transition-colors ${
                      view === 'week' ? 'bg-white shadow-sm text-purple-600' : 'text-gray-600 hover:text-gray-800'
                    }`}
                  >
                    Week
                  </button>
                  <button
                    onClick={() => setView('day')}
                    className={`px-3 py-1 rounded text-sm font-medium transition-colors ${
                      view === 'day' ? 'bg-white shadow-sm text-purple-600' : 'text-gray-600 hover:text-gray-800'
                    }`}
                  >
                    Day
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Calendar Grid */}
          <div className="glass-card p-6 animate-slideUp" style={{animationDelay: '0.2s'}}>
            {/* Day Headers */}
            <div className="grid grid-cols-7 gap-2 mb-2">
              {DAYS.map(day => (
                <div key={day} className="text-center py-3 font-semibold text-gray-700">
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
                      ${dayInfo.isCurrentMonth ? 'bg-white hover:bg-gray-50 border-gray-200 hover:border-purple-300' : 'bg-gray-50 border-gray-100'}
                      ${isToday ? 'ring-2 ring-purple-500 border-purple-500' : ''}
                    `}
                  >
                    <div className="flex items-center justify-between mb-2">
                      <span className={`
                        text-sm font-semibold
                        ${!dayInfo.isCurrentMonth ? 'text-gray-400' : isToday ? 'text-purple-600' : 'text-gray-700'}
                      `}>
                        {dayInfo.day}
                      </span>
                      {dayAppointments.length > 0 && (
                        <span className="text-xs bg-purple-100 text-purple-700 px-2 py-0.5 rounded-full font-medium">
                          {dayAppointments.length}
                        </span>
                      )}
                    </div>

                    {/* Appointments */}
                    <div className="space-y-1">
                      {dayAppointments.slice(0, 3).map((apt, idx) => (
                        <div
                          key={apt.id}
                          onClick={(e) => {
                            e.stopPropagation();
                            setSelectedAppointment(apt);
                            setShowBookingModal(true);
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
          <div className="glass-card p-4 mt-6 animate-slideUp" style={{animationDelay: '0.3s'}}>
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
              className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
              onClick={() => setShowBookingModal(false)}
            >
              <div 
                className="glass-card max-w-2xl w-full max-h-[90vh] overflow-auto animate-scaleIn"
                onClick={(e) => e.stopPropagation()}
              >
                <div className="sticky top-0 bg-white bg-opacity-95 backdrop-blur-lg p-6 border-b border-gray-200 flex items-center justify-between">
                  <h2 className="text-2xl font-bold gradient-text">
                    {selectedAppointment ? 'Appointment Details' : 'New Appointment'}
                  </h2>
                  <button
                    onClick={() => setShowBookingModal(false)}
                    className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                  >
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>

                <div className="p-6">
                  {selectedAppointment ? (
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <h3 className="text-xl font-semibold text-gray-800">
                          {selectedAppointment.patient 
                            ? `${selectedAppointment.patient.firstName} ${selectedAppointment.patient.lastName}`
                            : 'No patient assigned'
                          }
                        </h3>
                        <span className={`px-3 py-1 ${getStatusColor(selectedAppointment.status)} text-white rounded-full text-sm font-medium`}>
                          {selectedAppointment.status}
                        </span>
                      </div>

                      <div className="grid grid-cols-2 gap-4">
                        <div className="p-4 bg-gray-50 rounded-lg">
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
                        <div className="p-4 bg-gray-50 rounded-lg">
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

                      {selectedAppointment.service && (
                        <div className="p-4 bg-purple-50 rounded-lg">
                          <p className="text-sm text-purple-600 mb-1">Service</p>
                          <p className="font-medium text-gray-800">{selectedAppointment.service.name}</p>
                          <p className="text-sm text-gray-600 mt-1">Duration: {selectedAppointment.service.duration} minutes</p>
                        </div>
                      )}

                      {selectedAppointment.notes && (
                        <div className="p-4 bg-yellow-50 rounded-lg">
                          <p className="text-sm text-yellow-800 mb-1">Notes</p>
                          <p className="text-gray-700">{selectedAppointment.notes}</p>
                        </div>
                      )}

                      <div className="flex gap-3 pt-4">
                        <button className="flex-1 py-3 px-6 bg-gradient-to-r from-purple-500 to-blue-500 text-white rounded-xl hover:shadow-lg transition-all font-medium">
                          Edit Appointment
                        </button>
                        <button className="flex-1 py-3 px-6 bg-red-500 hover:bg-red-600 text-white rounded-xl transition-all font-medium">
                          Cancel
                        </button>
                      </div>
                    </div>
                  ) : (
                    <AppointmentForm
                      preselectedDate={selectedDate}
                      preselectedPatient={searchParams.get('patient')}
                      onSuccess={(newAppointment) => {
                        setAppointments([...appointments, newAppointment]);
                        setShowBookingModal(false);
                        setSelectedDate(null);
                      }}
                      onCancel={() => {
                        setShowBookingModal(false);
                        setSelectedDate(null);
                      }}
                    />
                  )}
                </div>
              </div>
            </div>
          )}
        </main>
      </div>
    </div>
  );
}
