// Centralized API exports
// Import all API modules for easy access

export * from './adminApi';
export * from './appointmentApi';
export * from './clinicApi';
export * from './consultationApi';
export * from './dashboardApi';
export * from './invoiceApi';
export * from './patientApi';
export * from './portalApi';
export * from './prescriptionApi';
export * from './serviceApi';

// Re-export clinic API with different naming for backwards compatibility
export {
  fetchClinics,
  fetchClinicById,
  fetchPatients,
  fetchStaff,
  fetchAllStaff,
  fetchStaffByClinic,
  fetchServices,
  fetchServicesByClinic,
  fetchPatientsByClinic,
  fetchIntegrationsByClinic,
  fetchCountsForClinics,
  createClinic,
  updateClinic,
  deleteClinic,
} from './clinicApi';
