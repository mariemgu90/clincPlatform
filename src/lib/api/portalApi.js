// Patient Portal API helper functions
// Centralized API calls for patient-facing features

/**
 * Fetch patient dashboard statistics
 * @returns {Promise<Object>} Dashboard stats including appointments, prescriptions, health metrics
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
 * Fetch patient prescriptions
 * @param {Object} options - Query options
 * @param {string} options.status - Filter by status (ACTIVE, COMPLETED, CANCELLED)
 * @returns {Promise<Array>} Array of prescriptions
 */
export async function fetchPortalPrescriptions({ status } = {}) {
  const params = new URLSearchParams();
  if (status) params.set('status', status);

  const url = '/api/portal/prescriptions' + (params.toString() ? `?${params.toString()}` : '');
  const res = await fetch(url);
  if (!res.ok) {
    throw new Error('Failed to fetch prescriptions');
  }
  return await res.json();
}

/**
 * Fetch patient invoices
 * @param {string} patientId - Patient ID
 * @returns {Promise<Array>} Array of invoices
 */
export async function fetchPortalInvoices(patientId) {
  const res = await fetch(`/api/invoices?patientId=${patientId}`);
  if (!res.ok) {
    throw new Error('Failed to fetch invoices');
  }
  const data = await res.json().catch(() => ({}));
  // Normalize response: API may return { invoices: [...] } or an array directly
  if (Array.isArray(data)) return data;
  return data?.invoices || [];
}
