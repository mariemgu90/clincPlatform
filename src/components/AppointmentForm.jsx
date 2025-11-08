'use client';

import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import toast from 'react-hot-toast';
import { formatDateForInput, formatTimeForInput, combineDateAndTime } from '@/lib/utils';

// Validation schema
const appointmentSchema = z.object({
  patientId: z.string().min(1, 'Please select a patient'),
  doctorId: z.string().min(1, 'Please select a doctor'),
  serviceId: z.string().optional(),
  date: z.string().min(1, 'Date is required'),
  startTime: z.string().min(1, 'Start time is required'),
  endTime: z.string().min(1, 'End time is required'),
  notes: z.string().max(500, 'Notes are too long').optional(),
  status: z.enum(['SCHEDULED', 'CONFIRMED'], {
    errorMap: () => ({ message: 'Please select a status' }),
  }).default('SCHEDULED'),
}).refine((data) => {
  // Validate that end time is after start time
  if (data.startTime && data.endTime) {
    return data.endTime > data.startTime;
  }
  return true;
}, {
  message: 'End time must be after start time',
  path: ['endTime'],
});

export default function AppointmentForm({ appointment = null, preselectedDate = null, preselectedPatient = null, onSuccess, onCancel }) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [patients, setPatients] = useState([]);
  const [doctors, setDoctors] = useState([]);
  const [services, setServices] = useState([]);
  const [loadingData, setLoadingData] = useState(true);
  const [selectedService, setSelectedService] = useState(null);

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    setValue,
    watch,
  } = useForm({
    resolver: zodResolver(appointmentSchema),
    defaultValues: appointment ? {
      patientId: appointment.patientId,
      doctorId: appointment.doctorId,
      serviceId: appointment.serviceId || '',
      date: formatDateForInput(appointment.startTime),
      startTime: formatTimeForInput(appointment.startTime),
      endTime: formatTimeForInput(appointment.endTime),
      notes: appointment.notes || '',
      status: appointment.status || 'SCHEDULED',
    } : {
      patientId: preselectedPatient || '',
      doctorId: '',
      serviceId: '',
      date: preselectedDate ? formatDateForInput(preselectedDate) : formatDateForInput(new Date()),
      startTime: '09:00',
      endTime: '09:30',
      notes: '',
      status: 'SCHEDULED',
    },
  });

  const watchedServiceId = watch('serviceId');
  const watchedStartTime = watch('startTime');

  // Fetch patients, doctors, and services
  useEffect(() => {
    const fetchData = async () => {
      try {
        const [patientsRes, doctorsRes, servicesRes] = await Promise.all([
          fetch('/api/patients'),
          fetch('/api/admin/staff'),
          fetch('/api/services'),
        ]);

        const patientsData = await patientsRes.json();
        const doctorsData = await doctorsRes.json();
        const servicesData = await servicesRes.json();

        setPatients(patientsData.patients || []);
        setDoctors((doctorsData.staff || []).filter(s => s.role === 'DOCTOR'));
        setServices(servicesData || []);
      } catch (error) {
        console.error('Failed to fetch data:', error);
        toast.error('Failed to load form data');
      } finally {
        setLoadingData(false);
      }
    };

    fetchData();
  }, []);

  // Auto-calculate end time when service or start time changes
  useEffect(() => {
    if (watchedServiceId && watchedStartTime) {
      const service = services.find(s => s.id === watchedServiceId);
      if (service && service.duration) {
        const [hours, minutes] = watchedStartTime.split(':').map(Number);
        const startMinutes = hours * 60 + minutes;
        const endMinutes = startMinutes + service.duration;
        const endHours = Math.floor(endMinutes / 60);
        const endMins = endMinutes % 60;
        const endTime = `${String(endHours).padStart(2, '0')}:${String(endMins).padStart(2, '0')}`;
        setValue('endTime', endTime);
        setSelectedService(service);
      }
    }
  }, [watchedServiceId, watchedStartTime, services, setValue]);

  const onSubmit = async (data) => {
    setIsSubmitting(true);

    try {
      // Combine date and time into ISO strings
      const startDateTime = combineDateAndTime(data.date, data.startTime);
      const endDateTime = combineDateAndTime(data.date, data.endTime);

      if (!startDateTime || !endDateTime) {
        throw new Error('Invalid date or time format');
      }

      const payload = {
        patientId: data.patientId,
        doctorId: data.doctorId,
        serviceId: data.serviceId || null,
        startTime: startDateTime,
        endTime: endDateTime,
        notes: data.notes || '',
        status: data.status,
      };

      const url = appointment ? `/api/appointments/${appointment.id}` : '/api/appointments';
      const method = appointment ? 'PUT' : 'POST';

      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || 'Failed to save appointment');
      }

      toast.success(appointment ? 'Appointment updated successfully!' : 'Appointment created successfully!');
      reset();
      if (onSuccess) onSuccess(result);
    } catch (error) {
      console.error('Error saving appointment:', error);
      toast.error(error.message || 'Failed to save appointment');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (loadingData) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="animate-spin rounded-full h-12 w-12 border-t-4 border-b-4 border-purple-500"></div>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      {/* Patient Selection */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Patient <span className="text-red-500">*</span>
        </label>
        <select
          {...register('patientId')}
          className={`w-full px-4 py-3 rounded-lg border-2 ${
            errors.patientId ? 'border-red-500' : 'border-gray-200'
          } focus:border-purple-500 focus:ring-2 focus:ring-purple-200 transition-all text-base font-semibold text-slate-900`}
        >
          <option value="">Select a patient</option>
          {patients.map(patient => (
            <option key={patient.id} value={patient.id}>
              {patient.firstName} {patient.lastName} - {patient.phone}
            </option>
          ))}
        </select>
        {errors.patientId && (
          <p className="mt-1 text-sm text-red-500">{errors.patientId.message}</p>
        )}
      </div>

      {/* Doctor Selection */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Doctor <span className="text-red-500">*</span>
        </label>
        <select
          {...register('doctorId')}
          className={`w-full px-4 py-3 rounded-lg border-2 ${
            errors.doctorId ? 'border-red-500' : 'border-gray-200'
          } focus:border-purple-500 focus:ring-2 focus:ring-purple-200 transition-all text-base font-semibold text-slate-900`}
        >
          <option value="">Select a doctor</option>
          {doctors.map(doctor => (
            <option key={doctor.id} value={doctor.id}>
              Dr. {doctor.name} - {doctor.email}
            </option>
          ))}
        </select>
        {errors.doctorId && (
          <p className="mt-1 text-sm text-red-500">{errors.doctorId.message}</p>
        )}
      </div>

      {/* Service Selection */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Service (Optional)
        </label>
        <select
          {...register('serviceId')}
          className="w-full px-4 py-3 rounded-lg border-2 border-gray-200 focus:border-purple-500 focus:ring-2 focus:ring-purple-200 transition-all text-base font-semibold text-slate-900"
        >
          <option value="">No specific service</option>
          {services.map(service => (
            <option key={service.id} value={service.id}>
              {service.name} - {service.duration} min - ${service.price}
            </option>
          ))}
        </select>
        {selectedService && (
          <p className="mt-2 text-sm text-gray-600 bg-purple-50 p-3 rounded-lg">
            📋 {selectedService.description}
          </p>
        )}
      </div>

      {/* Date and Time */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Date */}
        <div className="md:col-span-1">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Date <span className="text-red-500">*</span>
          </label>
          <input
            type="date"
            {...register('date')}
            min={new Date().toISOString().split('T')[0]}
            className={`w-full px-4 py-3 rounded-lg border-2 ${
              errors.date ? 'border-red-500' : 'border-gray-200'
            } focus:border-purple-500 focus:ring-2 focus:ring-purple-200 transition-all text-base font-semibold text-slate-900`}
          />
          {errors.date && (
            <p className="mt-1 text-sm text-red-500">{errors.date.message}</p>
          )}
        </div>

        {/* Start Time */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Start Time <span className="text-red-500">*</span>
          </label>
          <input
            type="time"
            {...register('startTime')}
            className={`w-full px-4 py-3 rounded-lg border-2 ${
              errors.startTime ? 'border-red-500' : 'border-gray-200'
            } focus:border-purple-500 focus:ring-2 focus:ring-purple-200 transition-all text-base font-semibold text-slate-900`}
          />
          {errors.startTime && (
            <p className="mt-1 text-sm text-red-500">{errors.startTime.message}</p>
          )}
        </div>

        {/* End Time */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            End Time <span className="text-red-500">*</span>
          </label>
          <input
            type="time"
            {...register('endTime')}
            className={`w-full px-4 py-3 rounded-lg border-2 ${
              errors.endTime ? 'border-red-500' : 'border-gray-200'
            } focus:border-purple-500 focus:ring-2 focus:ring-purple-200 transition-all text-base font-semibold text-slate-900`}
          />
          {errors.endTime && (
            <p className="mt-1 text-sm text-red-500">{errors.endTime.message}</p>
          )}
        </div>
      </div>

      {/* Status */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Status <span className="text-red-500">*</span>
        </label>
        <select
          {...register('status')}
          className="w-full px-4 py-3 rounded-lg border-2 border-gray-200 focus:border-purple-500 focus:ring-2 focus:ring-purple-200 transition-all text-base font-semibold text-slate-900"
        >
          <option value="SCHEDULED">Scheduled</option>
          <option value="CONFIRMED">Confirmed</option>
        </select>
      </div>

      {/* Notes */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Notes (Optional)
        </label>
        <textarea
          {...register('notes')}
          rows={3}
          className={`w-full px-4 py-3 rounded-lg border-2 ${
            errors.notes ? 'border-red-500' : 'border-gray-200'
          } focus:border-purple-500 focus:ring-2 focus:ring-purple-200 transition-all text-base font-semibold text-slate-900`}
          placeholder="Any special notes or requirements..."
        />
        {errors.notes && (
          <p className="mt-1 text-sm text-red-500">{errors.notes.message}</p>
        )}
      </div>

      {/* Form Actions */}
      <div className="flex gap-3 pt-4 border-t border-gray-200">
        {onCancel && (
          <button
            type="button"
            onClick={onCancel}
            className="flex-1 py-3 px-6 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-xl font-medium transition-all"
            disabled={isSubmitting}
          >
            Cancel
          </button>
        )}
        <button
          type="submit"
          disabled={isSubmitting}
          className="flex-1 py-3 px-6 bg-gradient-to-r from-purple-500 to-blue-500 text-white rounded-xl hover:shadow-lg transition-all font-medium disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
        >
          {isSubmitting ? (
            <>
              <svg className="animate-spin h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              {appointment ? 'Updating...' : 'Booking...'}
            </>
          ) : (
            <>
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
              {appointment ? 'Update Appointment' : 'Book Appointment'}
            </>
          )}
        </button>
      </div>
    </form>
  );
}
