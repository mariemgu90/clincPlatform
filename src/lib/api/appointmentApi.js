// Appointment API helper functions
// Centralized API calls for appointment management

/**
 * Fetch appointments
 * @param {Object} options - Query options
 * @param {string} options.patientId - Filter by patient ID
 * @param {string} options.doctorId - Filter by doctor ID
 * @param {number} options.limit - Number of appointments to fetch
 * @param {string} options.status - Filter by status
 * @returns {Promise<Array>} Array of appointments
 */
export async function fetchAppointments({ patientId, doctorId, limit, status } = {}) {
  const params = new URLSearchParams();
  if (patientId) params.set('patientId', patientId);
  if (doctorId) params.set('doctorId', doctorId);
  if (limit) params.set('limit', limit);
  if (status) params.set('status', status);

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
    // Normalize different possible error shapes from the API
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
    // Try to parse JSON error body, otherwise fallback to text
    let errMsg = 'Failed to update appointment';
    try {
      const body = await res.json();
      errMsg = body?.message || body?.error || JSON.stringify(body) || errMsg;
    } catch (jsonErr) {
      try {
        const text = await res.text();
        if (text) errMsg = text;
      } catch (_e) {
        // ignore
      }
    }
    throw new Error(errMsg);
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
