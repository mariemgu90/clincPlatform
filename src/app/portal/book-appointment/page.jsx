'use client';

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import Header from '@/components/Header';
import Sidebar from '@/components/Sidebar';

export default function BookAppointmentPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  
  // Form state
  const [services, setServices] = useState([]);
  const [doctors, setDoctors] = useState([]);
  const [selectedService, setSelectedService] = useState('');
  const [selectedDoctor, setSelectedDoctor] = useState('');
  const [selectedDate, setSelectedDate] = useState('');
  const [selectedTime, setSelectedTime] = useState('');
  const [reason, setReason] = useState('');
  const [availableSlots, setAvailableSlots] = useState([]);
  
  // Step management
  const [currentStep, setCurrentStep] = useState(1);
  const [alert, setAlert] = useState({ show: false, type: '', message: '' });

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/auth/login');
    } else if (status === 'authenticated') {
      if (session?.user?.role !== 'PATIENT') {
        router.push('/dashboard');
      } else {
        fetchData();
      }
    }
  }, [status, session, router]);

  const fetchData = async () => {
    try {
      // Fetch services
      const servicesRes = await fetch('/api/services?activeOnly=true');
      if (servicesRes.ok) {
        const servicesData = await servicesRes.json();
        setServices(servicesData.services || []);
      }

      // Fetch doctors
      const doctorsRes = await fetch('/api/users?role=DOCTOR');
      if (doctorsRes.ok) {
        const doctorsData = await doctorsRes.json();
        setDoctors(doctorsData.users || []);
      }

      setLoading(false);
    } catch (error) {
      console.error('Error fetching data:', error);
      setLoading(false);
    }
  };

  const generateTimeSlots = () => {
    const slots = [];
    for (let hour = 8; hour < 18; hour++) {
      slots.push(`${hour.toString().padStart(2, '0')}:00`);
      slots.push(`${hour.toString().padStart(2, '0')}:30`);
    }
    return slots;
  };

  useEffect(() => {
    if (selectedDate && selectedDoctor) {
      // Generate available time slots
      const slots = generateTimeSlots();
      setAvailableSlots(slots);
    }
  }, [selectedDate, selectedDoctor]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);

    try {
      const appointmentData = {
        patientId: session?.user?.patientId,
        doctorId: selectedDoctor,
        serviceId: selectedService || null,
        startTime: new Date(`${selectedDate}T${selectedTime}`).toISOString(),
        reason: reason || 'General consultation',
        status: 'SCHEDULED',
        clinicId: session?.user?.clinicId,
      };

      const response = await fetch('/api/appointments', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(appointmentData),
      });

      if (response.ok) {
        setAlert({
          show: true,
          type: 'success',
          message: 'Appointment booked successfully! Redirecting...',
        });
        setTimeout(() => {
          router.push('/portal/appointments');
        }, 2000);
      } else {
        throw new Error('Failed to book appointment');
      }
    } catch (error) {
      console.error('Error booking appointment:', error);
      setAlert({
        show: true,
        type: 'error',
        message: 'Failed to book appointment. Please try again.',
      });
    } finally {
      setSubmitting(false);
    }
  };

  const handleNext = () => {
    if (currentStep === 1 && !selectedService) {
      setAlert({ show: true, type: 'error', message: 'Please select a service' });
      return;
    }
    if (currentStep === 2 && !selectedDoctor) {
      setAlert({ show: true, type: 'error', message: 'Please select a doctor' });
      return;
    }
    if (currentStep === 3 && !selectedDate) {
      setAlert({ show: true, type: 'error', message: 'Please select a date' });
      return;
    }
    if (currentStep === 4 && !selectedTime) {
      setAlert({ show: true, type: 'error', message: 'Please select a time slot' });
      return;
    }
    setAlert({ show: false, type: '', message: '' });
    setCurrentStep(currentStep + 1);
  };

  const handleBack = () => {
    setCurrentStep(currentStep - 1);
    setAlert({ show: false, type: '', message: '' });
  };

  if (status === 'loading' || loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-50 via-blue-50 to-cyan-50">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-blue-50 to-cyan-50">
      <Header />
      <div className="flex">
        <Sidebar />
        <main className="flex-1 p-8 ml-64">
          <div className="max-w-4xl mx-auto">
            {/* Header */}
            <div className="mb-8">
              <h1 className="text-4xl font-bold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent mb-2">
                Book Appointment
              </h1>
              <p className="text-gray-600">Schedule your consultation in a few easy steps</p>
            </div>

            {/* Alert */}
            {alert.show && (
              <div
                className={`mb-6 p-4 rounded-lg ${
                  alert.type === 'success'
                    ? 'bg-green-100 text-green-700 border border-green-300'
                    : 'bg-red-100 text-red-700 border border-red-300'
                }`}
              >
                {alert.message}
              </div>
            )}

            {/* Progress Steps */}
            <div className="mb-8">
              <div className="flex items-center justify-between">
                {[
                  { num: 1, label: 'Service' },
                  { num: 2, label: 'Doctor' },
                  { num: 3, label: 'Date' },
                  { num: 4, label: 'Time' },
                  { num: 5, label: 'Confirm' },
                ].map((step, index) => (
                  <div key={step.num} className="flex items-center flex-1">
                    <div className="flex flex-col items-center flex-1">
                      <div
                        className={`w-10 h-10 rounded-full flex items-center justify-center font-bold transition-all ${
                          currentStep >= step.num
                            ? 'bg-gradient-to-r from-purple-600 to-blue-600 text-white'
                            : 'bg-gray-300 text-gray-600'
                        }`}
                      >
                        {step.num}
                      </div>
                      <span className="text-xs mt-2 text-gray-600">{step.label}</span>
                    </div>
                    {index < 4 && (
                      <div
                        className={`h-1 flex-1 mx-2 ${
                          currentStep > step.num ? 'bg-gradient-to-r from-purple-600 to-blue-600' : 'bg-gray-300'
                        }`}
                      ></div>
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* Booking Form Card */}
            <div className="bg-white/70 backdrop-blur-xl rounded-2xl shadow-xl border border-white/20 p-8">
              <form onSubmit={handleSubmit}>
                {/* Step 1: Select Service */}
                {currentStep === 1 && (
                  <div>
                    <h2 className="text-2xl font-bold text-gray-800 mb-6">Select Service</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {services.map((service) => (
                        <div
                          key={service.id}
                          onClick={() => setSelectedService(service.id)}
                          className={`p-6 rounded-xl border-2 cursor-pointer transition-all hover:shadow-lg ${
                            selectedService === service.id
                              ? 'border-purple-600 bg-purple-50'
                              : 'border-gray-200 hover:border-purple-300'
                          }`}
                        >
                          <h3 className="text-lg font-bold text-gray-800 mb-2">{service.name}</h3>
                          <p className="text-sm text-gray-600 mb-3">{service.description}</p>
                          <div className="flex justify-between items-center">
                            <span className="text-purple-600 font-bold">${service.price}</span>
                            <span className="text-gray-500 text-sm">{service.duration} min</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Step 2: Select Doctor */}
                {currentStep === 2 && (
                  <div>
                    <h2 className="text-2xl font-bold text-gray-800 mb-6">Select Doctor</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {doctors.map((doctor) => (
                        <div
                          key={doctor.id}
                          onClick={() => setSelectedDoctor(doctor.id)}
                          className={`p-6 rounded-xl border-2 cursor-pointer transition-all hover:shadow-lg ${
                            selectedDoctor === doctor.id
                              ? 'border-blue-600 bg-blue-50'
                              : 'border-gray-200 hover:border-blue-300'
                          }`}
                        >
                          <div className="flex items-center gap-4">
                            <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-500 rounded-full flex items-center justify-center text-white text-2xl font-bold">
                              {doctor.name?.charAt(0) || 'D'}
                            </div>
                            <div>
                              <h3 className="text-lg font-bold text-gray-800">Dr. {doctor.name}</h3>
                              <p className="text-sm text-gray-600">{doctor.email}</p>
                              <span className="inline-block mt-2 px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-xs font-medium">
                                {doctor.role}
                              </span>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Step 3: Select Date */}
                {currentStep === 3 && (
                  <div>
                    <h2 className="text-2xl font-bold text-gray-800 mb-6">Select Date</h2>
                    <input
                      type="date"
                      value={selectedDate}
                      onChange={(e) => setSelectedDate(e.target.value)}
                      min={new Date().toISOString().split('T')[0]}
                      className="w-full p-4 border-2 border-gray-300 rounded-xl focus:border-purple-600 focus:outline-none text-lg"
                    />
                  </div>
                )}

                {/* Step 4: Select Time */}
                {currentStep === 4 && (
                  <div>
                    <h2 className="text-2xl font-bold text-gray-800 mb-6">Select Time Slot</h2>
                    <div className="grid grid-cols-3 md:grid-cols-4 gap-3">
                      {availableSlots.map((slot) => (
                        <button
                          key={slot}
                          type="button"
                          onClick={() => setSelectedTime(slot)}
                          className={`p-4 rounded-xl border-2 font-medium transition-all hover:shadow-lg ${
                            selectedTime === slot
                              ? 'border-green-600 bg-green-50 text-green-700'
                              : 'border-gray-200 hover:border-green-300'
                          }`}
                        >
                          {slot}
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                {/* Step 5: Confirm */}
                {currentStep === 5 && (
                  <div>
                    <h2 className="text-2xl font-bold text-gray-800 mb-6">Confirm Booking</h2>
                    <div className="bg-gradient-to-br from-purple-50 to-blue-50 rounded-xl p-6 space-y-4">
                      <div className="flex justify-between">
                        <span className="text-gray-600 font-medium">Service:</span>
                        <span className="text-gray-800 font-bold">
                          {services.find((s) => s.id === selectedService)?.name || 'N/A'}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600 font-medium">Doctor:</span>
                        <span className="text-gray-800 font-bold">
                          Dr. {doctors.find((d) => d.id === selectedDoctor)?.name || 'N/A'}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600 font-medium">Date:</span>
                        <span className="text-gray-800 font-bold">{selectedDate}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600 font-medium">Time:</span>
                        <span className="text-gray-800 font-bold">{selectedTime}</span>
                      </div>
                      <div className="border-t pt-4">
                        <label className="block text-gray-700 font-medium mb-2">Reason for visit (optional):</label>
                        <textarea
                          value={reason}
                          onChange={(e) => setReason(e.target.value)}
                          placeholder="Describe your symptoms or reason for consultation..."
                          className="w-full p-3 border-2 border-gray-300 rounded-xl focus:border-purple-600 focus:outline-none"
                          rows="3"
                        />
                      </div>
                    </div>
                  </div>
                )}

                {/* Navigation Buttons */}
                <div className="flex justify-between mt-8">
                  <button
                    type="button"
                    onClick={handleBack}
                    disabled={currentStep === 1}
                    className={`px-6 py-3 rounded-xl font-medium transition-all ${
                      currentStep === 1
                        ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                        : 'bg-gray-500 text-white hover:bg-gray-600 hover:shadow-lg'
                    }`}
                  >
                    Back
                  </button>

                  {currentStep < 5 ? (
                    <button
                      type="button"
                      onClick={handleNext}
                      className="px-6 py-3 bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-xl font-medium hover:shadow-lg transition-all"
                    >
                      Next
                    </button>
                  ) : (
                    <button
                      type="submit"
                      disabled={submitting}
                      className="px-6 py-3 bg-gradient-to-r from-green-600 to-teal-600 text-white rounded-xl font-medium hover:shadow-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {submitting ? 'Booking...' : 'Confirm Booking'}
                    </button>
                  )}
                </div>
              </form>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
