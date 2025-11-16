// Admin API helper functions
// Centralized API calls for admin features

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
 * Fetch staff members
 * @param {Object} options - Query options
 * @param {string} options.clinicId - Filter by clinic ID
 * @returns {Promise<Array>} Array of staff members
 */
export async function fetchStaff({ clinicId } = {}) {
  const url = clinicId ? `/api/admin/staff?clinicId=${clinicId}` : '/api/admin/staff';
  const res = await fetch(url);
  if (!res.ok) {
    throw new Error('Failed to fetch staff');
  }
  const data = await res.json();
  return data?.staff || data;
}

/**
 * Create a new staff member
 * @param {Object} data - Staff member data
 * @returns {Promise<Object>} Created staff member
 */
export async function createStaff(data) {
  const res = await fetch('/api/admin/staff', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
  if (!res.ok) {
    const error = await res.json().catch(() => ({}));
    throw new Error(error.error || 'Failed to create staff member');
  }
  return await res.json();
}

/**
 * Update a staff member
 * @param {string} id - Staff member ID
 * @param {Object} data - Update data
 * @returns {Promise<Object>} Updated staff member
 */
export async function updateStaff(id, data) {
  const res = await fetch(`/api/admin/staff/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });

  if (!res.ok) {
    // Try to parse JSON error body, otherwise fallback to text
    let errMsg = 'Failed to update staff member';
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
 * Delete a staff member
 * @param {string} id - Staff member ID
 * @returns {Promise<boolean>} Success status
 */
export async function deleteStaff(id) {
  const res = await fetch(`/api/admin/staff/${id}`, {
    method: 'DELETE',
  });
  if (!res.ok) {
    const error = await res.json().catch(() => ({}));
    throw new Error(error.error || 'Failed to delete staff member');
  }
  return true;
}

/**
 * Fetch all users
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
        

  return Array.isArray(data?.users) ? data?.users : [];
}

/**
 * Fetch roles
 * @returns {Promise<Array>} Array of roles
 */
export async function fetchRoles() {
  const res = await fetch('/api/roles');
  if (res.ok !== true) {
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
    // Try to parse JSON error body, otherwise fallback to text
    let errMsg = 'Failed to create role';
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
    // Try to parse JSON error body, otherwise fallback to text
    let errMsg = 'Failed to update role';
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
 * Fetch permissions
 * @returns {Promise<Array>} Array of permissions
 */
export async function fetchPermissions() {
  const res = await fetch('/api/permissions');
  if (!res.ok) {
    throw new Error('Failed to fetch permissions');
  }
  return await res.json();
}
