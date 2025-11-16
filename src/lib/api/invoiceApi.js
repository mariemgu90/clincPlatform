// Invoice API helper functions
// Centralized API calls for invoice/billing management

/**
 * Fetch invoices
 * @param {Object} options - Query options
 * @param {string} options.patientId - Filter by patient ID
 * @param {string} options.status - Filter by status (PENDING, PAID, CANCELLED)
 * @returns {Promise<Array>} Array of invoices
 */
export async function fetchInvoices({ patientId, status } = {}) {
  const params = new URLSearchParams();
  if (patientId) params.set('patientId', patientId);
  if (status) params.set('status', status);

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
    // Try to parse JSON error body, otherwise fallback to text
    let errMsg = 'Failed to update invoice';
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
