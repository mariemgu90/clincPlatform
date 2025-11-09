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
