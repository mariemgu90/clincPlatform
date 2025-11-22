/**
 * Test data fixtures for admin tests
 */

export const testClinic = {
  name: 'Test Clinic',
  address: '123 Medical Ave',
  city: 'Test City',
  state: 'Test State',
  zipCode: '12345',
  country: 'Test Country',
  phone: '+216 12 345 678',
  email: 'test@clinic.com',
  website: 'www.testclinic.com',
  logo: '🏥',
  description: 'A test clinic for automated testing',
  openingHours: '9:00 AM - 6:00 PM',
};

export const testUser = {
  name: 'Test User',
  email: 'testuser@example.com',
  password: 'TestPassword123!',
  role: 'USER',
  phone: '+216 12 345 678',
  address: '123 Test Street',
  city: 'Test City',
};

export const testAdmin = {
  name: 'Test Admin',
  email: 'admin@test.com',
  password: 'password123',
  role: 'ADMIN',
  phone: '+216 98 765 432',
};

export const testStaff = {
  name: 'Test Doctor',
  email: 'doctor@test.com',
  role: 'DOCTOR',
  specialization: 'General Practice',
  phone: '+216 12 345 678',
  license: 'MD123456',
};

export const testService = {
  name: 'General Checkup',
  description: 'Routine medical examination',
  price: 50,
  duration: 30,
  category: 'Consultation',
};

export const testAppointment = {
  patientName: 'John Doe',
  patientEmail: 'john@example.com',
  date: '2025-12-25',
  time: '10:00',
  service: 'General Checkup',
  notes: 'Initial consultation',
};

export const invalidEmail = 'not-an-email';
export const invalidPhone = 'not-a-phone';
export const validEmail = 'test@example.com';
export const validPhone = '+216 12 345 678';

export const credentials = {
  admin: {
    email: 'admin@test.com',
    password: 'password123',
  },
  doctor: {
    email: 'doctor@test.com',
    password: 'password123',
  },
  receptionist: {
    email: 'receptionist@test.com',
    password: 'password123',
  },
  patient: {
    email: 'patient@test.com',
    password: 'password123',
  },
};

export const urls = {
  dashboard: '/admin/dashboard',
  clinics: '/admin/clinics',
  users: '/admin/users',
  staff: '/admin/staff',
  services: '/admin/services',
  roles: '/admin/roles',
  settings: '/admin/settings',
  clinicSettings: '/admin/clinic-settings',
  templates: '/admin/templates',
  integrations: '/admin/integrations',
  exports: '/admin/exports',
  logs: '/admin/logs',
  backup: '/admin/backup',
  maintenance: '/admin/maintenance',
  apiKeys: '/admin/api-keys',
};

export const selectors = {
  // Common selectors
  loadingSpinner: '[class*="animate-spin"]',
  toast: 'div[role="status"]',
  modal: '[class*="modal"], dialog',
  button: 'button',
  input: 'input',
  label: 'label',
  
  // Dashboard selectors
  dashboardTitle: 'h1:has-text("Admin Dashboard")',
  statCard: '[class*="StatCard"]',
  actionButton: 'button:has-text("Manage")',
  
  // Clinic selectors
  clinicsTitle: 'h1:has-text("Clinic Management")',
  addClinicButton: 'button:has-text("Register New Clinic")',
  clinicCard: '[class*="CardClinicInfo"]',
  clinicForm: 'form',
  
  // User selectors
  usersTitle: 'h1:has-text("User Management")',
  userCard: '[class*="StaffCard"]',
  searchInput: 'input[placeholder*="search"], input[placeholder*="Search"]',
  filterSelect: 'select, [role="listbox"]',
};

/**
 * Generate random test data
 */
export function generateRandomClinic() {
  const uuid = Math.random().toString(36).substring(7);
  return {
    ...testClinic,
    name: `Clinic ${uuid}`,
    email: `clinic${uuid}@test.com`,
  };
}

export function generateRandomUser() {
  const uuid = Math.random().toString(36).substring(7);
  return {
    ...testUser,
    name: `User ${uuid}`,
    email: `user${uuid}@test.com`,
  };
}

export function generateRandomService() {
  const uuid = Math.random().toString(36).substring(7);
  return {
    ...testService,
    name: `Service ${uuid}`,
  };
}

/**
 * Test data validators
 */
export function isValidEmail(email) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

export function isValidPhone(phone) {
  return /^\+?[\d\s\-()]+$/.test(phone);
}

export function isValidURL(url) {
  try {
    new URL(url);
    return true;
  } catch {
    return false;
  }
}
