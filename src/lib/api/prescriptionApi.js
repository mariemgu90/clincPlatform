// Prescription API helper functions
// Centralized API calls for prescription management

/**
 * Fetch prescriptions
 * @param {Object} options - Query options
 * @param {string} options.patientId - Filter by patient ID
 * @param {string} options.doctorId - Filter by doctor ID
 * @param {string} options.status - Filter by status
 * @returns {Promise<Array>} Array of prescriptions
 */
export async function fetchPrescriptions({ patientId, doctorId, status } = {}) {
  const params = new URLSearchParams();
  if (patientId) params.set('patientId', patientId);
  if (doctorId) params.set('doctorId', doctorId);
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
    // Try to parse JSON error body, otherwise fallback to text
    let errMsg = 'Failed to update prescription';
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
 * Download prescription PDF
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
