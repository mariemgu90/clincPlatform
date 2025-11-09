// Consultation API helper functions
// Centralized API calls for consultation management

/**
 * Fetch consultations
 * @param {Object} options - Query options
 * @param {string} options.patientId - Filter by patient ID
 * @param {string} options.doctorId - Filter by doctor ID
 * @param {number} options.limit - Number of consultations to fetch
 * @returns {Promise<Array>} Array of consultations
 */
export async function fetchConsultations({ patientId, doctorId, limit } = {}) {
  const params = new URLSearchParams();
  if (patientId) params.set('patientId', patientId);
  if (doctorId) params.set('doctorId', doctorId);
  if (limit) params.set('limit', limit);

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
