// Patient API helper functions
// Centralized API calls for patient management

/**
 * Fetch patients
 * @param {Object} options - Query options
 * @param {string} options.clinicId - Filter by clinic ID
 * @param {number} options.page - Page number
 * @param {number} options.limit - Number of patients per page
 * @param {string} options.search - Search query
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
    const error = await res.json().catch(() => ({}));
    throw new Error(error.error || 'Failed to fetch patients');
  }
  const data = await res.json();
  // Normalize response - handle both array and object with patients property
  return Array.isArray(data) ? data : data?.patients || [];
}

/**
 * Fetch single patient by ID
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
 * Create a new patient
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
 * Update a patient
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
    // Try to parse JSON error body, otherwise fallback to text
    let errMsg = 'Failed to update patient';
    try {
      const body = await res.json();
      errMsg = body?.message || body?.error || JSON.stringify(body) || errMsg;
    } catch {
      try {
        const text = await res.text();
        if (text) errMsg = text;
      } catch {
        // ignore
      }
    }
    throw new Error(errMsg);
  }
  return await res.json();
}


/**
 * Delete a patient
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
