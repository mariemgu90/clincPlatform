/**
 * Test data and fixtures for admin tests
 */

export const TEST_CREDENTIALS = {
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
};

export const TEST_CLINIC_DATA = {
  valid: {
    name: 'Test Clinic General',
    address: '123 Main Street',
    city: 'New York',
    state: 'NY',
    zipCode: '10001',
    country: 'United States',
    phone: '+1 212 555 1234',
    email: 'clinic@test.com',
    website: 'www.testclinic.com',
    description: 'A comprehensive test clinic',
    logo: '🏥',
    openingHours: '9:00 AM - 6:00 PM',
  },
  minimal: {
    name: 'Minimal Clinic',
    address: '456 Oak Ave',
    city: 'Boston',
    state: 'MA',
    country: 'United States',
    phone: '+1 617 555 0123',
    email: 'minimal@test.com',
  },
  update: {
    name: 'Updated Clinic Name',
    phone: '+1 718 555 9999',
    email: 'updated@test.com',
  },
};

export const TEST_USER_DATA = {
  valid: {
    name: 'Dr. John Doe',
    email: 'john.doe@test.com',
    phone: '+1 555 123 4567',
    role: 'DOCTOR',
    department: 'General Practice',
  },
  staff: {
    name: 'Jane Smith',
    email: 'jane.smith@test.com',
    phone: '+1 555 234 5678',
    role: 'RECEPTIONIST',
  },
};

export const TEST_SERVICE_DATA = {
  valid: {
    name: 'General Consultation',
    description: 'Standard medical consultation',
    duration: 30,
    price: 50,
    category: 'Consultation',
  },
  specialized: {
    name: 'Dental Cleaning',
    description: 'Professional teeth cleaning',
    duration: 60,
    price: 150,
    category: 'Dental',
  },
};

export const API_ENDPOINTS = {
  // Auth
  auth: {
    login: '/api/auth/login',
    logout: '/api/auth/logout',
    session: '/api/auth/session',
  },

  // Admin
  admin: {
    stats: '/api/admin/stats',
    dashboard: '/api/admin/dashboard',
  },

  // Clinics
  clinics: {
    list: '/api/clinics',
    create: '/api/clinics',
    get: (id) => `/api/clinics/${id}`,
    update: (id) => `/api/clinics/${id}`,
    delete: (id) => `/api/clinics/${id}`,
  },

  // Users
  users: {
    list: '/api/users',
    create: '/api/users',
    get: (id) => `/api/users/${id}`,
    update: (id) => `/api/users/${id}`,
    delete: (id) => `/api/users/${id}`,
  },

  // Staff
  staff: {
    list: '/api/staff',
    create: '/api/staff',
    get: (id) => `/api/staff/${id}`,
    update: (id) => `/api/staff/${id}`,
    delete: (id) => `/api/staff/${id}`,
  },

  // Services
  services: {
    list: '/api/services',
    create: '/api/services',
    get: (id) => `/api/services/${id}`,
    update: (id) => `/api/services/${id}`,
    delete: (id) => `/api/services/${id}`,
  },

  // Roles
  roles: {
    list: '/api/roles',
    permissions: '/api/roles/permissions',
  },
};

export const SELECTORS = {
  // Common
  header: {
    title: 'h1',
    subtitle: 'p',
  },

  // Forms
  form: {
    submit: 'button[type="submit"]',
    cancel: 'button:has-text("Cancel")',
    close: 'button[aria-label="Close"]',
  },

  // Modals
  modal: {
    container: '[role="dialog"]',
    backdrop: '[class*="backdrop"]',
  },

  // Tables
  table: {
    row: 'tr',
    cell: 'td',
    header: 'th',
  },

  // Cards
  card: {
    container: '[class*="card"]',
    title: '[class*="card"] h3',
  },

  // Buttons
  buttons: {
    primary: 'button[class*="primary"]',
    danger: 'button[class*="danger"], button[class*="red"]',
    add: 'button:has-text("Add"), button:has-text("New"), button:has-text("Create")',
    delete: 'button:has-text("Delete"), button:has-text("Remove")',
  },

  // Loading
  loading: {
    spinner: '[class*="animate-spin"]',
    skeleton: '[class*="skeleton"]',
  },

  // Messages
  messages: {
    toast: '[role="status"]',
    alert: '[role="alert"]',
    error: '[class*="error"]',
    success: '[class*="success"]',
  },

  // Navigation
  navigation: {
    sidebar: '[class*="sidebar"]',
    navLink: 'a[class*="nav"], [role="navigation"] a',
  },

  // Admin specific
  admin: {
    dashboard: {
      statCard: '[class*="StatCard"]',
      actionButton: 'button:has-text("Manage")',
      quickLink: 'a:has-text("→")',
    },

    clinics: {
      clinicCard: '[class*="CardClinicInfo"]',
      addButton: 'button:has-text("Register New Clinic")',
      modal: {
        nameInput: 'input[placeholder="Enter clinic name"]',
        addressInput: 'input[placeholder="Street address"]',
        submitButton: 'button:has-text("Register Clinic")',
      },
    },

    users: {
      userCard: '[class*="StaffCard"]',
      searchInput: 'input[placeholder*="search"]',
      filterSelect: 'select',
    },

    staff: {
      staffCard: '[class*="StaffCard"]',
      addButton: 'button:has-text("Add Staff")',
    },

    services: {
      serviceCard: '[class*="card"]',
      addButton: 'button:has-text("Add Service")',
    },
  },
};

export const VALIDATION_ERRORS = {
  required: 'This field is required',
  email: 'Please enter a valid email',
  phone: 'Please enter a valid phone number',
  password: 'Password must be at least 8 characters',
  unique: 'This value already exists',
};

export const MESSAGES = {
  success: {
    create: 'created successfully',
    update: 'updated successfully',
    delete: 'deleted successfully',
    login: 'Logged in successfully',
  },
  error: {
    failed: 'Failed to',
    network: 'Network error',
    unauthorized: 'Unauthorized',
    notFound: 'Not found',
  },
};

export const WAIT_TIMES = {
  short: 500,
  medium: 1000,
  long: 2000,
  navigation: 3000,
  api: 5000,
};

export const ACCESSIBILITY_CHECKS = {
  headingHierarchy: ['H1', 'H2', 'H3', 'H4'],
  ariaLabels: ['aria-label', 'aria-labelledby'],
  formLabels: ['label'],
  buttons: {
    minHeight: 40,
    minWidth: 40,
  },
  fonts: {
    minSize: 12,
  },
};

export const RESPONSIVE_BREAKPOINTS = {
  mobile: {
    width: 375,
    height: 667,
    name: 'iPhone 12',
  },
  mobileLarge: {
    width: 430,
    height: 932,
    name: 'Pixel 5',
  },
  tablet: {
    width: 768,
    height: 1024,
    name: 'iPad',
  },
  desktop: {
    width: 1920,
    height: 1080,
    name: 'Desktop',
  },
  ultrawide: {
    width: 2560,
    height: 1440,
    name: '4K Display',
  },
};

export const PERFORMANCE_THRESHOLDS = {
  pageLoad: 5000, // ms
  navigationTime: 3000, // ms
  interactionTime: 1000, // ms
};

export const TEST_URLS = {
  login: '/auth/login',
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

export const MOCK_RESPONSES = {
  clinicList: {
    data: [
      {
        id: '1',
        name: 'Test Clinic 1',
        status: 'Active',
        staff: 5,
        patients: 150,
      },
      {
        id: '2',
        name: 'Test Clinic 2',
        status: 'Active',
        staff: 3,
        patients: 80,
      },
    ],
  },

  userList: {
    data: [
      {
        id: '1',
        name: 'Dr. John',
        email: 'john@test.com',
        role: 'DOCTOR',
      },
      {
        id: '2',
        name: 'Jane Smith',
        email: 'jane@test.com',
        role: 'RECEPTIONIST',
      },
    ],
  },

  adminStats: {
    stats: {
      totalUsers: 45,
      totalClinics: 3,
      totalPatients: 250,
      totalRevenue: 15000,
      activeAppointments: 12,
      totalStaff: 20,
      activeServices: 8,
      pendingInvoices: 5,
    },
    recentActivity: [
      {
        action: 'New patient registered',
        user: 'Admin',
        timestamp: '2 hours ago',
        icon: '👤',
      },
    ],
  },
};
