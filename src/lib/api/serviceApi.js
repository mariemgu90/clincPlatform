// Service API helper functions
// Centralized API calls for service management

/**
 * Fetch services
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
    // Try to parse JSON error body, otherwise fallback to text
    let errMsg = 'Failed to update service';
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
    const errorMessage = error.message || error.error || 'Failed to delete service';
    throw new Error(errorMessage);
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
