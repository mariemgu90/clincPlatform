/**
 * =====================================================
 * ALL API ENDPOINTS - CENTRALIZED API MANAGEMENT
 * =====================================================
 * This file contains all API fetch functions organized by domain
 * Each function includes proper error handling and documentation
 */

// =====================================================
// AUTHENTICATION API
// =====================================================

/**
 * Register a new user account
 * @param {Object} userData - User registration data
 * @param {string} userData.email - User email address
 * @param {string} userData.password - User password
 * @param {string} userData.name - Full name
 * @param {string} userData.role - User role (PATIENT, DOCTOR, ADMIN, etc.)
 * @returns {Promise<Object>} Registration response with user data
 */
export async function registerUser(userData) {
  const response = await fetch('/api/auth/register', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(userData),
  });
  
  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || 'Registration failed');
  }
  
  return response.json();
}

/**
 * Request password reset - Send reset email
 * @param {string} email - User email address
 * @returns {Promise<Object>} Success message
 */
export async function requestPasswordReset(email) {
  const response = await fetch('/api/auth/reset-password', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email }),
  });
  
  if (!response.ok) {
    throw new Error('Failed to request password reset');
  }
  
  return response.json();
}

/**
 * Reset password using token from email
 * @param {string} token - Reset token from email
 * @param {string} newPassword - New password
 * @returns {Promise<Object>} Success message
 */
export async function resetPassword(token, newPassword) {
  const response = await fetch('/api/auth/reset-password', {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ token, newPassword }),
  });
  
  if (!response.ok) {
    throw new Error('Failed to reset password');
  }
  
  return response.json();
}

/**
 * Change user password (authenticated)
 * @param {string} currentPassword - Current password
 * @param {string} newPassword - New password
 * @returns {Promise<Object>} Success message
 */
export async function changePassword(currentPassword, newPassword) {
  const response = await fetch('/api/auth/change-password', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ currentPassword, newPassword }),
  });
  
  if (!response.ok) {
    throw new Error('Failed to change password');
  }
  
  return response.json();
}

// =====================================================
// PATIENT MANAGEMENT API
// =====================================================

/**
 * Fetch all patients with optional filters
 * @param {Object} options - Query options
 * @param {string} options.clinicId - Filter by clinic ID
 * @param {number} options.page - Page number for pagination
 * @param {number} options.limit - Results per page
 * @param {string} options.search - Search query (name, email, phone)
 * @returns {Promise<Array|Object>} Array of patients or paginated result
 */
export async function fetchPatients({ clinicId, page, limit, search } = {}) {
  const params = new URLSearchParams();
  if (clinicId) params.set('clinicId', clinicId);
  if (page) params.set('page', page);
  if (limit) params.set('limit', limit);
  if (search) params.set('search', search);

  const url = '/api/patients' + (params.toString() ? `?${params.toString()}` : '');
  const res = await fetch(url);
  if (!res.ok) {
    throw new Error('Failed to fetch patients');
  }
  const data = await res.json();
  return data?.patients || data;
}

/**
 * Fetch single patient by ID with full details
 * @param {string} id - Patient ID
 * @returns {Promise<Object>} Patient details
 */
export async function fetchPatientById(id) {
  const res = await fetch(`/api/patients/${id}`);
  if (!res.ok) {
    throw new Error('Failed to fetch patient');
  }
  return await res.json();
}

/**
 * Create a new patient record
 * @param {Object} data - Patient data
 * @returns {Promise<Object>} Created patient
 */
export async function createPatient(data) {
  const res = await fetch('/api/patients', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
  if (!res.ok) {
    const error = await res.json().catch(() => ({}));
    throw new Error(error.error || 'Failed to create patient');
  }
  return await res.json();
}

/**
 * Update patient information
 * @param {string} id - Patient ID
 * @param {Object} data - Update data
 * @returns {Promise<Object>} Updated patient
 */
export async function updatePatient(id, data) {
  const res = await fetch(`/api/patients/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
  if (!res.ok) {
    const error = await res.json().catch(() => ({}));
    throw new Error(error.error || 'Failed to update patient');
  }
  return await res.json();
}

/**
 * Delete patient record
 * @param {string} id - Patient ID
 * @returns {Promise<boolean>} Success status
 */
export async function deletePatient(id) {
  const res = await fetch(`/api/patients/${id}`, {
    method: 'DELETE',
  });
  if (!res.ok) {
    const error = await res.json().catch(() => ({}));
    throw new Error(error.error || 'Failed to delete patient');
  }
  return true;
}

/**
 * Fetch patients by clinic
 * @param {string} clinicId - Clinic ID
 * @returns {Promise<Array>} Array of patients
 */
export async function fetchPatientsByClinic(clinicId) {
  const res = await fetch(`/api/patients?clinicId=${clinicId}`);
  if (!res.ok) {
    throw new Error('Failed to fetch patients by clinic');
  }
  const data = await res.json();
  return Array.isArray(data) ? data : data.patients || data || [];
}

// =====================================================
// APPOINTMENT MANAGEMENT API
// =====================================================

/**
 * Fetch appointments with filters
 * @param {Object} options - Query options
 * @param {string} options.patientId - Filter by patient ID
 * @param {string} options.doctorId - Filter by doctor ID
 * @param {number} options.limit - Number of appointments to fetch
 * @param {string} options.status - Filter by status (PENDING, CONFIRMED, CANCELLED, COMPLETED)
 * @param {string} options.startDate - Filter by start date
 * @param {string} options.endDate - Filter by end date
 * @returns {Promise<Array>} Array of appointments
 */
export async function fetchAppointments({ patientId, doctorId, limit, status, startDate, endDate } = {}) {
  const params = new URLSearchParams();
  if (patientId) params.set('patientId', patientId);
  if (doctorId) params.set('doctorId', doctorId);
  if (limit) params.set('limit', limit);
  if (status) params.set('status', status);
  if (startDate) params.set('startDate', startDate);
  if (endDate) params.set('endDate', endDate);

  const url = '/api/appointments' + (params.toString() ? `?${params.toString()}` : '');
  const res = await fetch(url);
  if (!res.ok) {
    throw new Error('Failed to fetch appointments');
  }
  const data = await res.json();
  return Array.isArray(data) ? data : data?.appointments || [];
}

/**
 * Fetch single appointment by ID
 * @param {string} id - Appointment ID
 * @returns {Promise<Object>} Appointment details
 */
export async function fetchAppointmentById(id) {
  const res = await fetch(`/api/appointments/${id}`);
  if (!res.ok) {
    throw new Error('Failed to fetch appointment');
  }
  return await res.json();
}

/**
 * Create a new appointment
 * @param {Object} data - Appointment data
 * @returns {Promise<Object>} Created appointment
 */
export async function createAppointment(data) {
  const res = await fetch('/api/appointments', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
  if (!res.ok) {
    const error = await res.json().catch(() => ({}));
    const message =
      error?.error || error?.message || (Array.isArray(error?.errors) ? error.errors.join(', ') : null) ||
      (typeof error === 'string' ? error : null) || res.statusText || 'Failed to create appointment';
    throw new Error(message);
  }
  return await res.json();
}

/**
 * Update an appointment
 * @param {string} id - Appointment ID
 * @param {Object} data - Update data (status, notes, etc.)
 * @returns {Promise<Object>} Updated appointment
 */
export async function updateAppointment(id, data) {
  const res = await fetch('/api/appointments', {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ id, ...data }),
  });
  if (!res.ok) {
    const error = await res.json().catch(() => ({}));
    const message =
      error?.error || error?.message || (Array.isArray(error?.errors) ? error.errors.join(', ') : null) ||
      (typeof error === 'string' ? error : null) || res.statusText || 'Failed to update appointment';
    throw new Error(message);
  }
  return await res.json();
}

/**
 * Cancel an appointment
 * @param {string} id - Appointment ID
 * @returns {Promise<Object>} Updated appointment
 */
export async function cancelAppointment(id) {
  return updateAppointment(id, { status: 'CANCELLED' });
}

/**
 * Delete an appointment
 * @param {string} id - Appointment ID
 * @returns {Promise<boolean>} Success status
 */
export async function deleteAppointment(id) {
  const res = await fetch(`/api/appointments/${id}`, {
    method: 'DELETE',
  });
  if (!res.ok) {
    const error = await res.json().catch(() => ({}));
    const message =
      error?.error || error?.message || (Array.isArray(error?.errors) ? error.errors.join(', ') : null) ||
      (typeof error === 'string' ? error : null) || res.statusText || 'Failed to delete appointment';
    throw new Error(message);
  }
  return true;
}

// =====================================================
// CONSULTATION MANAGEMENT API
// =====================================================

/**
 * Fetch consultations with filters
 * @param {Object} options - Query options
 * @param {string} options.patientId - Filter by patient ID
 * @param {string} options.doctorId - Filter by doctor ID
 * @param {number} options.limit - Number of consultations to fetch
 * @param {number} options.offset - Offset for pagination
 * @returns {Promise<Array>} Array of consultations
 */
export async function fetchConsultations({ patientId, doctorId, limit, offset } = {}) {
  const params = new URLSearchParams();
  if (patientId) params.set('patientId', patientId);
  if (doctorId) params.set('doctorId', doctorId);
  if (limit) params.set('limit', limit);
  if (offset) params.set('offset', offset);

  const url = '/api/consultations' + (params.toString() ? `?${params.toString()}` : '');
  const res = await fetch(url);
  if (!res.ok) {
    throw new Error('Failed to fetch consultations');
  }
  const data = await res.json();
  return data?.consultations || [];
}

/**
 * Fetch single consultation by ID
 * @param {string} id - Consultation ID
 * @returns {Promise<Object>} Consultation details
 */
export async function fetchConsultationById(id) {
  const res = await fetch(`/api/consultations/${id}`);
  if (!res.ok) {
    throw new Error('Failed to fetch consultation');
  }
  return await res.json();
}

/**
 * Create a new consultation
 * @param {Object} data - Consultation data
 * @returns {Promise<Object>} Created consultation
 */
export async function createConsultation(data) {
  const res = await fetch('/api/consultations', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
  if (!res.ok) {
    const error = await res.json().catch(() => ({}));
    throw new Error(error.error || 'Failed to create consultation');
  }
  return await res.json();
}

/**
 * Update a consultation
 * @param {string} id - Consultation ID
 * @param {Object} data - Update data
 * @returns {Promise<Object>} Updated consultation
 */
export async function updateConsultation(id, data) {
  const res = await fetch(`/api/consultations/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
  if (!res.ok) {
    const error = await res.json().catch(() => ({}));
    throw new Error(error.error || 'Failed to update consultation');
  }
  return await res.json();
}

/**
 * Delete a consultation
 * @param {string} id - Consultation ID
 * @returns {Promise<boolean>} Success status
 */
export async function deleteConsultation(id) {
  const res = await fetch(`/api/consultations/${id}`, {
    method: 'DELETE',
  });
  if (!res.ok) {
    const error = await res.json().catch(() => ({}));
    throw new Error(error.error || 'Failed to delete consultation');
  }
  return true;
}

// =====================================================
// PRESCRIPTION MANAGEMENT API
// =====================================================

/**
 * Fetch prescriptions with filters
 * @param {Object} options - Query options
 * @param {string} options.patientId - Filter by patient ID
 * @param {string} options.doctorId - Filter by doctor ID
 * @param {string} options.consultationId - Filter by consultation ID
 * @param {string} options.status - Filter by status (ACTIVE, COMPLETED, CANCELLED)
 * @returns {Promise<Array>} Array of prescriptions
 */
export async function fetchPrescriptions({ patientId, doctorId, consultationId, status } = {}) {
  const params = new URLSearchParams();
  if (patientId) params.set('patientId', patientId);
  if (doctorId) params.set('doctorId', doctorId);
  if (consultationId) params.set('consultationId', consultationId);
  if (status) params.set('status', status);

  const url = '/api/prescriptions' + (params.toString() ? `?${params.toString()}` : '');
  const res = await fetch(url);
  if (!res.ok) {
    throw new Error('Failed to fetch prescriptions');
  }
  const data = await res.json();
  return data?.prescriptions || [];
}

/**
 * Fetch single prescription by ID
 * @param {string} id - Prescription ID
 * @returns {Promise<Object>} Prescription details
 */
export async function fetchPrescriptionById(id) {
  const res = await fetch(`/api/prescriptions/${id}`);
  if (!res.ok) {
    throw new Error('Failed to fetch prescription');
  }
  return await res.json();
}

/**
 * Create a new prescription
 * @param {Object} data - Prescription data
 * @returns {Promise<Object>} Created prescription
 */
export async function createPrescription(data) {
  const res = await fetch('/api/prescriptions', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
  if (!res.ok) {
    const error = await res.json().catch(() => ({}));
    throw new Error(error.error || 'Failed to create prescription');
  }
  return await res.json();
}

/**
 * Update a prescription
 * @param {string} id - Prescription ID
 * @param {Object} data - Update data
 * @returns {Promise<Object>} Updated prescription
 */
export async function updatePrescription(id, data) {
  const res = await fetch(`/api/prescriptions/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
  if (!res.ok) {
    const error = await res.json().catch(() => ({}));
    throw new Error(error.error || 'Failed to update prescription');
  }
  return await res.json();
}

/**
 * Delete a prescription
 * @param {string} id - Prescription ID
 * @returns {Promise<boolean>} Success status
 */
export async function deletePrescription(id) {
  const res = await fetch(`/api/prescriptions/${id}`, {
    method: 'DELETE',
  });
  if (!res.ok) {
    const error = await res.json().catch(() => ({}));
    throw new Error(error.error || 'Failed to delete prescription');
  }
  return true;
}

/**
 * Download prescription as PDF
 * @param {string} id - Prescription ID
 * @returns {Promise<Blob>} PDF blob
 */
export async function downloadPrescriptionPDF(id) {
  const res = await fetch(`/api/prescriptions/${id}/pdf`);
  if (!res.ok) {
    throw new Error('Failed to download prescription PDF');
  }
  return await res.blob();
}

// =====================================================
// INVOICE/BILLING MANAGEMENT API
// =====================================================

/**
 * Fetch invoices with filters
 * @param {Object} options - Query options
 * @param {string} options.patientId - Filter by patient ID
 * @param {string} options.status - Filter by status (PENDING, PAID, CANCELLED)
 * @param {number} options.limit - Number of invoices to fetch
 * @param {number} options.offset - Offset for pagination
 * @returns {Promise<Array>} Array of invoices
 */
export async function fetchInvoices({ patientId, status, limit, offset } = {}) {
  const params = new URLSearchParams();
  if (patientId) params.set('patientId', patientId);
  if (status) params.set('status', status);
  if (limit) params.set('limit', limit);
  if (offset) params.set('offset', offset);

  const url = '/api/invoices' + (params.toString() ? `?${params.toString()}` : '');
  const res = await fetch(url);
  if (!res.ok) {
    throw new Error('Failed to fetch invoices');
  }
  const data = await res.json();
  return data?.invoices || [];
}

/**
 * Fetch single invoice by ID
 * @param {string} id - Invoice ID
 * @returns {Promise<Object>} Invoice details
 */
export async function fetchInvoiceById(id) {
  const res = await fetch(`/api/invoices/${id}`);
  if (!res.ok) {
    throw new Error('Failed to fetch invoice');
  }
  return await res.json();
}

/**
 * Create a new invoice
 * @param {Object} data - Invoice data
 * @returns {Promise<Object>} Created invoice
 */
export async function createInvoice(data) {
  const res = await fetch('/api/invoices', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
  if (!res.ok) {
    const error = await res.json().catch(() => ({}));
    throw new Error(error.error || 'Failed to create invoice');
  }
  return await res.json();
}

/**
 * Update an invoice
 * @param {string} id - Invoice ID
 * @param {Object} data - Update data
 * @returns {Promise<Object>} Updated invoice
 */
export async function updateInvoice(id, data) {
  const res = await fetch(`/api/invoices/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
  if (!res.ok) {
    const error = await res.json().catch(() => ({}));
    throw new Error(error.error || 'Failed to update invoice');
  }
  return await res.json();
}

/**
 * Delete an invoice
 * @param {string} id - Invoice ID
 * @returns {Promise<boolean>} Success status
 */
export async function deleteInvoice(id) {
  const res = await fetch(`/api/invoices/${id}`, {
    method: 'DELETE',
  });
  if (!res.ok) {
    const error = await res.json().catch(() => ({}));
    throw new Error(error.error || 'Failed to delete invoice');
  }
  return true;
}

// =====================================================
// CLINIC MANAGEMENT API
// =====================================================

/**
 * Fetch all clinics
 * @returns {Promise<Array>} Array of clinics
 */
export async function fetchClinics() {
  const res = await fetch('/api/clinics');
  if (!res.ok) {
    throw new Error('Failed to fetch clinics');
  }
  return await res.json();
}

/**
 * Fetch single clinic by ID
 * @param {string} id - Clinic ID
 * @returns {Promise<Object>} Clinic details
 */
export async function fetchClinicById(id) {
  const res = await fetch(`/api/clinics/${id}`);
  if (!res.ok) {
    const error = await res.json().catch(() => ({}));
    throw new Error(error.error || 'Failed to fetch clinic');
  }
  return await res.json();
}

/**
 * Create a new clinic
 * @param {Object} data - Clinic data
 * @returns {Promise<Object>} Created clinic
 */
export async function createClinic(data) {
  const res = await fetch('/api/clinics', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
  if (!res.ok) throw new Error('Failed to create clinic');
  return await res.json();
}

/**
 * Update clinic information
 * @param {string} id - Clinic ID
 * @param {Object} data - Update data
 * @returns {Promise<Object>} Updated clinic
 */
export async function updateClinic(id, data) {
  const res = await fetch(`/api/clinics/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
  if (!res.ok) throw new Error('Failed to update clinic');
  return await res.json();
}

/**
 * Delete clinic
 * @param {string} id - Clinic ID
 * @returns {Promise<boolean>} Success status
 */
export async function deleteClinic(id) {
  const res = await fetch(`/api/clinics/${id}`, {
    method: 'DELETE',
  });
  if (!res.ok) {
    const error = await res.json().catch(() => ({}));
    throw new Error(error.error || 'Failed to delete clinic');
  }
  return true;
}

/**
 * Fetch clinic statistics and counts
 * @param {Array} clinicList - Array of clinic objects
 * @returns {Promise<Object>} Object with clinic IDs as keys and counts as values
 */
export async function fetchCountsForClinics(clinicList = []) {
  const counts = {};
  if (!Array.isArray(clinicList) || clinicList.length === 0) return counts;

  await Promise.all(clinicList.map(async (c) => {
    try {
      const [staffRes, servicesRes, patientsRes] = await Promise.all([
        fetch(`/api/admin/staff?clinicId=${c.id}`),
        fetch(`/api/services?clinicId=${c.id}`),
        fetch(`/api/patients?clinicId=${c.id}`),
      ]);

      const staffData = staffRes.ok ? await staffRes.json() : { staff: [] };
      const servicesData = servicesRes.ok ? await servicesRes.json() : [];
      const patientsData = patientsRes.ok ? await patientsRes.json() : { patients: [] };

      const staffArray = staffData.staff || [];
      const servicesArray = Array.isArray(servicesData) ? servicesData : servicesData.services || [];
      const patientsArray = patientsData.patients || [];

      counts[c.id] = {
        staff: staffArray.length,
        services: servicesArray.length,
        patients: patientsArray.length,
      };
    } catch (err) {
      counts[c.id] = { staff: 0, services: 0, patients: 0 };
      console.error('Error fetching counts for clinic', c.id, err);
    }
  }));

  return counts;
}

// =====================================================
// SERVICE MANAGEMENT API
// =====================================================

/**
 * Fetch services with filters
 * @param {Object} options - Query options
 * @param {string} options.clinicId - Filter by clinic ID
 * @param {boolean} options.activeOnly - Fetch only active services
 * @returns {Promise<Array>} Array of services
 */
export async function fetchServices({ clinicId, activeOnly } = {}) {
  const params = new URLSearchParams();
  if (clinicId) params.set('clinicId', clinicId);
  if (activeOnly) params.set('activeOnly', 'true');

  const url = '/api/services' + (params.toString() ? `?${params.toString()}` : '');
  const res = await fetch(url);
  if (!res.ok) {
    throw new Error('Failed to fetch services');
  }
  const data = await res.json();
  return Array.isArray(data) ? data : data?.services || data;
}

/**
 * Fetch single service by ID
 * @param {string} id - Service ID
 * @returns {Promise<Object>} Service details
 */
export async function fetchServiceById(id) {
  const res = await fetch(`/api/services/${id}`);
  if (!res.ok) {
    throw new Error('Failed to fetch service');
  }
  return await res.json();
}

/**
 * Create a new service
 * @param {Object} data - Service data
 * @returns {Promise<Object>} Created service
 */
export async function createService(data) {
  const res = await fetch('/api/services', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
  if (!res.ok) {
    const error = await res.json().catch(() => ({}));
    throw new Error(error.error || 'Failed to create service');
  }
  return await res.json();
}

/**
 * Update a service
 * @param {string} id - Service ID
 * @param {Object} data - Update data
 * @returns {Promise<Object>} Updated service
 */
export async function updateService(id, data) {
  const res = await fetch(`/api/services/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
  if (!res.ok) {
    const error = await res.json().catch(() => ({}));
    throw new Error(error.error || 'Failed to update service');
  }
  return await res.json();
}

/**
 * Delete a service
 * @param {string} id - Service ID
 * @returns {Promise<boolean>} Success status
 */
export async function deleteService(id) {
  const res = await fetch(`/api/services/${id}`, {
    method: 'DELETE',
  });
  if (!res.ok) {
    const error = await res.json().catch(() => ({}));
    throw new Error(error.error || 'Failed to delete service');
  }
  return true;
}

/**
 * Link service to clinic
 * @param {string} serviceId - Service ID
 * @param {string} clinicId - Clinic ID
 * @returns {Promise<Object>} Updated service
 */
export async function linkServiceToClinic(serviceId, clinicId) {
  const res = await fetch(`/api/services/${serviceId}`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ clinicId }),
  });
  if (!res.ok) {
    const error = await res.json().catch(() => ({}));
    throw new Error(error.error || 'Failed to link service to clinic');
  }
  return await res.json();
}

/**
 * Unlink service from clinic
 * @param {string} serviceId - Service ID
 * @returns {Promise<Object>} Updated service
 */
export async function unlinkServiceFromClinic(serviceId) {
  const res = await fetch(`/api/services/${serviceId}`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ clinicId: null }),
  });
  if (!res.ok) {
    const error = await res.json().catch(() => ({}));
    throw new Error(error.error || 'Failed to unlink service from clinic');
  }
  return await res.json();
}

/**
 * Fetch services by clinic
 * @param {string} clinicId - Clinic ID
 * @returns {Promise<Array>} Array of services
 */
export async function fetchServicesByClinic(clinicId) {
  const res = await fetch(`/api/services?clinicId=${clinicId}`);
  if (!res.ok) {
    throw new Error('Failed to fetch services by clinic');
  }
  const data = await res.json();
  return Array.isArray(data) ? data : data.services || data || [];
}

// =====================================================
// STAFF MANAGEMENT API
// =====================================================

/**
 * Fetch all staff members with filters
 * @param {Object} options - Query options
 * @param {string} options.clinicId - Filter by clinic ID
 * @param {string} options.role - Filter by role
 * @returns {Promise<Array>} Array of staff members
 */
export async function fetchStaff({ clinicId, role } = {}) {
  const params = new URLSearchParams();
  if (clinicId) params.append('clinicId', clinicId);
  if (role) params.append('role', role);

  const url = `/api/admin/staff?${params.toString()}`;
  const response = await fetch(url);
  if (!response.ok) {
    throw new Error('Failed to fetch staff');
  }
  const data = await response.json();
  return Array.isArray(data) ? data : data.staff || [];
}

/**
 * Fetch single staff member by ID
 * @param {string} id - Staff member ID
 * @returns {Promise<Object>} Staff member data
 */
export async function fetchStaffById(id) {
  const response = await fetch(`/api/staff/${id}`);
  if (!response.ok) {
    throw new Error('Failed to fetch staff member');
  }
  return response.json();
}

/**
 * Create a new staff member
 * @param {Object} data - Staff member data
 * @returns {Promise<Object>} Created staff member
 */
export async function createStaff(data) {
  const response = await fetch('/api/admin/staff', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
  
  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || 'Failed to create staff member');
  }
  
  return response.json();
}

/**
 * Update a staff member
 * @param {string} id - Staff member ID
 * @param {Object} data - Updated staff member data
 * @returns {Promise<Object>} Updated staff member
 */
export async function updateStaff(id, data) {
  const response = await fetch(`/api/admin/staff/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
  
  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || 'Failed to update staff member');
  }
  
  return response.json();
}

/**
 * Delete a staff member
 * @param {string} id - Staff member ID
 * @returns {Promise<boolean>} Success status
 */
export async function deleteStaff(id) {
  const response = await fetch(`/api/admin/staff/${id}`, {
    method: 'DELETE',
  });
  
  if (!response.ok) {
    throw new Error('Failed to delete staff member');
  }
  
  return true;
}

/**
 * Assign role to staff member
 * @param {string} id - Staff member ID
 * @param {string} role - Role to assign
 * @returns {Promise<Object>} Updated staff member
 */
export async function assignStaffRole(id, role) {
  const response = await fetch(`/api/staff/${id}/role`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ role }),
  });
  
  if (!response.ok) {
    throw new Error('Failed to assign role');
  }
  
  return response.json();
}

/**
 * Link staff member to clinic
 * @param {string} staffId - Staff member ID
 * @param {string} clinicId - Clinic ID
 * @returns {Promise<Object>} Updated staff member
 */
export async function linkStaffToClinic(staffId, clinicId) {
  const response = await fetch(`/api/admin/staff/${staffId}`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ clinicId }),
  });
  
  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || 'Failed to link staff to clinic');
  }
  
  return response.json();
}

/**
 * Unlink staff member from clinic
 * @param {string} staffId - Staff member ID
 * @returns {Promise<Object>} Updated staff member
 */
export async function unlinkStaffFromClinic(staffId) {
  const response = await fetch(`/api/admin/staff/${staffId}`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ clinicId: null }),
  });
  
  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || 'Failed to unlink staff from clinic');
  }
  
  return response.json();
}

/**
 * Fetch all staff (no filters)
 * @returns {Promise<Array>} Array of all staff members
 */
export async function fetchAllStaff() {
  const res = await fetch('/api/admin/staff');
  if (!res.ok) {
    throw new Error('Failed to fetch all staff');
  }
  const data = await res.json();
  return Array.isArray(data) ? data : data.staff || [];
}

/**
 * Fetch staff by clinic
 * @param {string} clinicId - Clinic ID
 * @returns {Promise<Array>} Array of staff members
 */
export async function fetchStaffByClinic(clinicId) {
  const res = await fetch(`/api/admin/staff?clinicId=${clinicId}`);
  if (!res.ok) {
    throw new Error('Failed to fetch staff by clinic');
  }
  const data = await res.json();
  return data.staff || [];
}

/**
 * Fetch doctor schedule
 * @param {string} doctorId - Doctor ID
 * @param {string} date - Date in YYYY-MM-DD format
 * @returns {Promise<Object>} Doctor schedule with available time slots
 */
export async function fetchDoctorSchedule(doctorId, date) {
  const params = new URLSearchParams({ doctorId, date });
  const response = await fetch(`/api/doctor-schedule?${params.toString()}`);
  
  if (!response.ok) {
    throw new Error('Failed to fetch doctor schedule');
  }
  
  return response.json();
}

// =====================================================
// ADMIN/DASHBOARD API
// =====================================================

/**
 * Fetch admin dashboard statistics
 * @returns {Promise<Object>} Dashboard statistics
 */
export async function fetchAdminStats() {
  const res = await fetch('/api/admin/stats');
  if (!res.ok) {
    throw new Error('Failed to fetch admin statistics');
  }
  return await res.json();
}

/**
 * Fetch general dashboard statistics
 * @returns {Promise<Object>} Dashboard statistics
 */
export async function fetchDashboardStats() {
  const res = await fetch('/api/dashboard/stats');
  if (!res.ok) {
    throw new Error('Failed to fetch dashboard statistics');
  }
  return await res.json();
}

/**
 * Fetch multiple dashboard endpoints in parallel
 * @returns {Promise<Object>} Combined dashboard data
 */
export async function fetchDashboardData() {
  try {
    const [statsRes, patientsRes, appointmentsRes] = await Promise.all([
      fetch('/api/dashboard/stats'),
      fetch('/api/patients?limit=5'),
      fetch('/api/appointments?limit=5'),
    ]);

    const stats = statsRes.ok ? await statsRes.json() : null;
    const patients = patientsRes.ok ? await patientsRes.json() : [];
    const appointments = appointmentsRes.ok ? await appointmentsRes.json() : [];

    return {
      stats,
      recentPatients: patients,
      recentAppointments: appointments,
    };
  } catch (error) {
    console.error('Error fetching dashboard data:', error);
    throw new Error('Failed to fetch dashboard data');
  }
}

// =====================================================
// USER & ROLE MANAGEMENT API
// =====================================================

/**
 * Fetch all users with optional role filter
 * @param {Object} options - Query options
 * @param {string} options.role - Filter by role
 * @returns {Promise<Array>} Array of users
 */
export async function fetchUsers({ role } = {}) {
  const url = role ? `/api/users?role=${role}` : '/api/users';
  const res = await fetch(url);
  if (!res.ok) {
    throw new Error('Failed to fetch users');
  }
  const data = await res.json();
  return data.users || [];
}

/**
 * Fetch all roles
 * @returns {Promise<Array>} Array of roles
 */
export async function fetchRoles() {
  const res = await fetch('/api/roles');
  if (!res.ok) {
    throw new Error('Failed to fetch roles');
  }
  const data = await res.json();
  return Array.isArray(data) ? data : data.roles || [];
}

/**
 * Create a new role
 * @param {Object} data - Role data
 * @returns {Promise<Object>} Created role
 */
export async function createRole(data) {
  const res = await fetch('/api/roles', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
  if (!res.ok) {
    const error = await res.json().catch(() => ({}));
    throw new Error(error.error || 'Failed to create role');
  }
  return await res.json();
}

/**
 * Update a role
 * @param {string} id - Role ID
 * @param {Object} data - Update data
 * @returns {Promise<Object>} Updated role
 */
export async function updateRole(id, data) {
  const res = await fetch(`/api/roles/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
  if (!res.ok) {
    const error = await res.json().catch(() => ({}));
    throw new Error(error.error || 'Failed to update role');
  }
  return await res.json();
}

/**
 * Delete a role
 * @param {string} id - Role ID
 * @returns {Promise<boolean>} Success status
 */
export async function deleteRole(id) {
  const res = await fetch(`/api/roles/${id}`, {
    method: 'DELETE',
  });
  if (!res.ok) {
    const error = await res.json().catch(() => ({}));
    throw new Error(error.error || 'Failed to delete role');
  }
  return true;
}

/**
 * Fetch all permissions
 * @returns {Promise<Array>} Array of permissions
 */
export async function fetchPermissions() {
  const res = await fetch('/api/permissions');
  if (!res.ok) {
    throw new Error('Failed to fetch permissions');
  }
  return await res.json();
}

// =====================================================
// NOTIFICATION API
// =====================================================

/**
 * Fetch all notifications for current user
 * @param {Object} options - Query options
 * @param {boolean} options.unreadOnly - Fetch only unread notifications
 * @param {number} options.limit - Maximum number of notifications to fetch
 * @returns {Promise<Array>} Array of notifications
 */
export async function fetchNotifications({ unreadOnly = false, limit = 50 } = {}) {
  const params = new URLSearchParams();
  if (unreadOnly) params.append('unreadOnly', 'true');
  if (limit) params.append('limit', limit.toString());

  const response = await fetch(`/api/notifications?${params.toString()}`);
  if (!response.ok) {
    throw new Error('Failed to fetch notifications');
  }
  return response.json();
}

/**
 * Mark notification as read
 * @param {string} id - Notification ID
 * @returns {Promise<Object>} Updated notification
 */
export async function markNotificationAsRead(id) {
  const response = await fetch(`/api/notifications/${id}`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ read: true }),
  });
  
  if (!response.ok) {
    throw new Error('Failed to mark notification as read');
  }
  return response.json();
}

/**
 * Mark all notifications as read
 * @returns {Promise<Object>} Response message
 */
export async function markAllNotificationsAsRead() {
  const response = await fetch('/api/notifications', {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
  });
  
  if (!response.ok) {
    throw new Error('Failed to mark all notifications as read');
  }
  return response.json();
}

/**
 * Delete a notification
 * @param {string} id - Notification ID
 * @returns {Promise<Object>} Response message
 */
export async function deleteNotification(id) {
  const response = await fetch(`/api/notifications/${id}`, {
    method: 'DELETE',
  });
  
  if (!response.ok) {
    throw new Error('Failed to delete notification');
  }
  return response.json();
}

/**
 * Create a new notification
 * @param {Object} data - Notification data
 * @returns {Promise<Object>} Created notification
 */
export async function createNotification(data) {
  const response = await fetch('/api/notifications', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
  
  if (!response.ok) {
    throw new Error('Failed to create notification');
  }
  return response.json();
}

/**
 * Get unread notification count
 * @returns {Promise<number>} Count of unread notifications
 */
export async function getUnreadNotificationCount() {
  const notifications = await fetchNotifications({ unreadOnly: true });
  return notifications.length;
}

// =====================================================
// PATIENT PORTAL API
// =====================================================

/**
 * Fetch patient portal dashboard statistics
 * @returns {Promise<Object>} Dashboard stats for patient
 */
export async function fetchPortalStats() {
  const res = await fetch('/api/portal/stats');
  if (!res.ok) {
    throw new Error('Failed to fetch portal statistics');
  }
  return await res.json();
}

/**
 * Fetch patient medical records (consultations)
 * @param {Object} options - Query options
 * @param {number} options.limit - Number of records to fetch
 * @param {number} options.offset - Offset for pagination
 * @returns {Promise<Array>} Array of consultation records
 */
export async function fetchMedicalRecords({ limit, offset } = {}) {
  const params = new URLSearchParams();
  if (limit) params.set('limit', limit);
  if (offset) params.set('offset', offset);

  const url = '/api/portal/medical-records' + (params.toString() ? `?${params.toString()}` : '');
  const res = await fetch(url);
  if (!res.ok) {
    throw new Error('Failed to fetch medical records');
  }
  return await res.json();
}

/**
 * Fetch patient prescriptions from portal
 * @param {Object} options - Query options
 * @param {string} options.status - Filter by status (ACTIVE, COMPLETED, CANCELLED)
 * @param {number} options.limit - Number of prescriptions to fetch
 * @param {number} options.offset - Offset for pagination
 * @returns {Promise<Array>} Array of prescriptions
 */
export async function fetchPortalPrescriptions({ status, limit, offset } = {}) {
  const params = new URLSearchParams();
  if (status) params.set('status', status);
  if (limit) params.set('limit', limit);
  if (offset) params.set('offset', offset);

  const url = '/api/portal/prescriptions' + (params.toString() ? `?${params.toString()}` : '');
  const res = await fetch(url);
  if (!res.ok) {
    throw new Error('Failed to fetch prescriptions');
  }
  return await res.json();
}

/**
 * Fetch patient invoices from portal
 * @param {string} patientId - Patient ID
 * @returns {Promise<Array>} Array of invoices
 */
export async function fetchPortalInvoices(patientId) {
  const res = await fetch(`/api/invoices?patientId=${patientId}`);
  if (!res.ok) {
    throw new Error('Failed to fetch invoices');
  }
  const data = await res.json().catch(() => ({}));
  if (Array.isArray(data)) return data;
  return data?.invoices || [];
}

// =====================================================
// INTEGRATION API
// =====================================================

/**
 * Fetch integrations by clinic
 * @param {string} clinicId - Clinic ID
 * @returns {Promise<Array>} Array of integrations
 */
export async function fetchIntegrationsByClinic(clinicId) {
  const res = await fetch(`/api/integrations?clinicId=${clinicId}`);
  if (!res.ok) {
    throw new Error('Failed to fetch integrations by clinic');
  }
  const data = await res.json();
  return Array.isArray(data) ? data : data.integrations || data || [];
}

/**
 * Create a new integration
 * @param {Object} data - Integration data
 * @returns {Promise<Object>} Created integration
 */
export async function createIntegration(data) {
  const res = await fetch('/api/integrations', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
  if (!res.ok) {
    const error = await res.json().catch(() => ({}));
    throw new Error(error.error || 'Failed to create integration');
  }
  return await res.json();
}

// =====================================================
// AUDIT LOGS API
// =====================================================

/**
 * Fetch audit logs with filters
 * @param {Object} options - Query options
 * @param {string} options.scope - Scope of logs ('user' or 'clinic')
 * @param {number} options.limit - Number of logs to fetch
 * @param {number} options.offset - Offset for pagination
 * @param {string} options.action - Filter by action type
 * @param {string} options.resource - Filter by resource type
 * @param {string} options.startDate - Filter by start date
 * @param {string} options.endDate - Filter by end date
 * @returns {Promise<Array>} Array of audit logs
 */
export async function fetchAuditLogs({ scope = 'user', limit = 50, offset = 0, action, resource, startDate, endDate } = {}) {
  const params = new URLSearchParams();
  params.set('scope', scope);
  params.set('limit', limit.toString());
  params.set('offset', offset.toString());
  if (action) params.set('action', action);
  if (resource) params.set('resource', resource);
  if (startDate) params.set('startDate', startDate);
  if (endDate) params.set('endDate', endDate);

  const url = `/api/audit-logs?${params.toString()}`;
  const res = await fetch(url);
  if (!res.ok) {
    throw new Error('Failed to fetch audit logs');
  }
  return await res.json();
}


    