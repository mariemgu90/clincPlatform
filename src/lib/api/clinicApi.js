// Centralized clinic-related API helper functions
// Each function returns the parsed JSON (or arrays/objects as returned by the API)

export async function fetchClinics() {
  const res = await fetch('/api/clinics');
  if (!res.ok) {
    throw new Error('Failed to fetch clinics');
  }
  const data = await res.json();
  // Normalize response - handle both array and object with clinics property
  return Array.isArray(data) ? data : data.clinics || [];
}

export async function fetchClinicById(id) {
  const res = await fetch(`/api/clinics/${id}`);
  if (!res.ok) {
    const error = await res.json().catch(() => ({}));
    throw new Error(error.error || 'Failed to fetch clinic');
  }
  return await res.json();
}

export async function fetchPatients({ clinicId, page, limit, search } = {}) {
  const params = new URLSearchParams();
  if (clinicId) params.set('clinicId', clinicId);
  if (page) params.set('page', page);
  if (limit) params.set('limit', limit);
  if (search) params.set('search', search);

  const url = '/api/patients' + (params.toString() ? `?${params.toString()}` : '');
  const res = await fetch(url);
  if (!res.ok) {
    throw new Error('Failed to fetch patients');
  }
  const data = await res.json();
  // normalize to return array of patients when possible
  return data?.patients || data;
}

export async function fetchStaff({ clinicId } = {}) {
  const url = clinicId ? `/api/admin/staff?clinicId=${clinicId}` : '/api/admin/staff';
  const res = await fetch(url);
  if (!res.ok) {
    throw new Error('Failed to fetch staff');
  }
  const data = await res.json();
  return Array.isArray(data) ? data : data.staff || [];
}

export async function fetchAllStaff() {
  const res = await fetch('/api/admin/staff');
  if (!res.ok) {
    throw new Error('Failed to fetch all staff');
  }
  const data = await res.json();
  return Array.isArray(data) ? data : data.staff || [];
}

export async function fetchStaffByClinic(clinicId) {
  const res = await fetch(`/api/admin/staff?clinicId=${clinicId}`);
  if (!res.ok) {
    throw new Error('Failed to fetch staff by clinic');
  }
  const data = await res.json();
  return data.staff || [];
}

export async function fetchServices({ clinicId } = {}) {
  const url = clinicId ? `/api/services?clinicId=${clinicId}` : '/api/services';
  const res = await fetch(url);
  if (!res.ok) {
    throw new Error('Failed to fetch services');
  }
  const data = await res.json();
  // normalize to return array of services when possible
  return Array.isArray(data) ? data : data?.services || data;
}

export async function fetchServicesByClinic(clinicId) {
  const res = await fetch(`/api/services?clinicId=${clinicId}`);
  if (!res.ok) {
    throw new Error('Failed to fetch services by clinic');
  }
  const data = await res.json();
  // API sometimes returns array directly
  return Array.isArray(data) ? data : data.services || data || [];
}

export async function fetchPatientsByClinic(clinicId) {
  const res = await fetch(`/api/patients?clinicId=${clinicId}`);
  if (!res.ok) {
    throw new Error('Failed to fetch patients by clinic');
  }
  const data = await res.json();
  return Array.isArray(data) ? data : data.patients || data || [];
}

export async function fetchIntegrationsByClinic(clinicId) {
  const res = await fetch(`/api/integrations?clinicId=${clinicId}`);
  if (!res.ok) {
    throw new Error('Failed to fetch integrations by clinic');
  }
  const data = await res.json();
  return Array.isArray(data) ? data : data.integrations || data || [];
}

export async function fetchCountsForClinics(clinicList = []) {
  const counts = {};
  if (!Array.isArray(clinicList) || clinicList.length === 0) return counts;

  await Promise.all(clinicList.map(async (c) => {
    try {
      const [staffRes, servicesRes, patientsRes] = await Promise.all([
        fetch(`/api/admin/staff?clinicId=${c.id}`),
        fetch(`/api/services?clinicId=${c.id}`),
        fetch(`/api/patients?clinicId=${c.id}`),
      ]);

      const staffData = staffRes.ok ? await staffRes.json() : { staff: [] };
      const servicesData = servicesRes.ok ? await servicesRes.json() : [];
      const patientsData = patientsRes.ok ? await patientsRes.json() : { patients: [] };

      const staffArray = staffData.staff || [];
      const servicesArray = Array.isArray(servicesData) ? servicesData : servicesData.services || [];
      const patientsArray = patientsData.patients || [];

      counts[c.id] = {
        staff: staffArray.length,
        services: servicesArray.length,
        patients: patientsArray.length,
      };
    } catch (err) {
      counts[c.id] = { staff: 0, services: 0, patients: 0 };
      console.error('Error fetching counts for clinic', c.id, err);
    }
  }));

  return counts;
}

export async function createClinic(data) {
  const res = await fetch('/api/clinics', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
  if (!res.ok) throw new Error('Failed to create clinic');
  return await res.json();
}

export async function updateClinic(id, data) {
  const res = await fetch(`/api/clinics/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });

  if (!res.ok) {
    // Try to parse JSON error body, otherwise fallback to text
    let errMsg = 'Failed to update clinic';
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

export async function deleteClinic(id) {
  const res = await fetch(`/api/clinics/${id}`, {
    method: 'DELETE',
  });
  
  if (res.ok !== true) {
    const error = await res.json().catch(() => ({}));

    // throw new Error(error.error || 'Failed to delete clinic');
  }
  return true;
}
