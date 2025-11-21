// Staff API functions

/**
 * Fetch all staff members
 * @param {Object} options - Query options
 * @param {string} options.clinicId - Filter by clinic ID
 * @param {string} options.role - Filter by role
 * @returns {Promise<Array>} Array of staff members
 */
export async function fetchStaff({ clinicId, role } = {}) {
  const params = new URLSearchParams();
  if (clinicId) params.append('clinicId', clinicId);
  if (role) params.append('role', role);

  const response = await fetch(`/api/admin/staff?${params.toString()}`);
  if (!response.ok) {
    throw new Error('Failed to fetch staff');
  }
  const data = await response.json();
  // Normalize response - handle both array and object with staff property
  return Array.isArray(data) ? data : data.staff || [];
}

/**
 * Fetch a single staff member by ID
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
  const response = await fetch('/api/staff', {
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
  const response = await fetch(`/api/staff/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
  
  if (!response.ok) {
    // Try to parse JSON error body, otherwise fallback to text
    let errMsg = 'Failed to update staff member';
    try {
      const body = await response.json();
      errMsg = body?.message || body?.error || JSON.stringify(body) || errMsg;
    } catch (jsonErr) {
      try {
        const text = await response.text();
        if (text) errMsg = text;
      } catch (_e) {
        // ignore
      }
    }
    throw new Error(errMsg);
  }
  
  return response.json();
}

/**
 * Delete a staff member
 * @param {string} id - Staff member ID
 * @returns {Promise<Object>} Response message
 */
export async function deleteStaff(id) {
  const response = await fetch(`/api/staff/${id}`, {
    method: 'DELETE',
  });
  
  if (!response.ok) {
    throw new Error('Failed to delete staff member');
  }
  
  return response.json();
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
 * Fetch doctor schedule
 * @param {string} doctorId - Doctor ID
 * @param {string} date - Date in YYYY-MM-DD format
 * @returns {Promise<Object>} Doctor schedule
 */
export async function fetchDoctorSchedule(doctorId, date) {
  const params = new URLSearchParams({ doctorId, date });
  const response = await fetch(`/api/doctor-schedule?${params.toString()}`);
  
  if (!response.ok) {
    throw new Error('Failed to fetch doctor schedule');
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
