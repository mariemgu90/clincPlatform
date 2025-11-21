// Dashboard API helper functions
// Centralized API calls for dashboard statistics

/**
 * Fetch general dashboard statistics
 * @returns {Promise<Object>} Dashboard statistics
 */
export async function fetchDashboardStats() {
  const res = await fetch('/api/dashboard/stats');
  if (!res.ok) {
    throw new Error('Failed to fetch dashboard statistics');
  }
  return await res.json();
}

/**
 * Fetch multiple dashboard endpoints in parallel
 * @returns {Promise<Object>} Combined dashboard data
 */
export async function fetchDashboardData() {
  try {
    const [statsRes, patientsRes, appointmentsRes] = await Promise.all([
      fetch('/api/dashboard/stats'),
      fetch('/api/patients?limit=5'),
      fetch('/api/appointments?limit=5'),
    ]);

    const stats = statsRes.ok ? await statsRes.json() : null;
    const patients = patientsRes.ok ? await patientsRes.json() : [];
    const appointments = appointmentsRes.ok ? await appointmentsRes.json() : [];

    return {
      stats,
      recentPatients: patients,
      recentAppointments: appointments,
    };
  } catch (error) {
    console.error('Error fetching dashboard data:', error);
    throw new Error('Failed to fetch dashboard data');
  }
}
