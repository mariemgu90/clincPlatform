const { PrismaClient, UserRole, AppointmentStatus, InvoiceStatus } = require('@prisma/client');
const bcrypt = require('bcryptjs');

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Seeding database...');

  // Clean up existing data to avoid conflicts - delete in correct order based on foreign keys
  await prisma.auditLog.deleteMany({});
  await prisma.notification.deleteMany({});
  await prisma.prescription.deleteMany({});
  await prisma.invoiceItem.deleteMany({});
  await prisma.invoice.deleteMany({});
  await prisma.consultation.deleteMany({});
  await prisma.appointment.deleteMany({});
  await prisma.patient.deleteMany({});
  await prisma.session.deleteMany({});
  await prisma.account.deleteMany({});
  await prisma.user.deleteMany({});
  await prisma.service.deleteMany({});
  await prisma.clinic.deleteMany({});
  await prisma.rolePermission.deleteMany({});
  await prisma.role.deleteMany({});
  await prisma.permission.deleteMany({});
  await prisma.verificationToken.deleteMany({});

  console.log('🧹 Cleaned up existing data');

  // Seed permissions first
  console.log('🔐 Seeding permissions...');
  const permissions = [
    // Patient Management
    { name: 'view_patients', label: 'View Patients', category: 'Patients', description: 'View patient records and information' },
    { name: 'create_patients', label: 'Create Patients', category: 'Patients', description: 'Register new patients' },
    { name: 'edit_patients', label: 'Edit Patients', category: 'Patients', description: 'Update patient information' },
    { name: 'delete_patients', label: 'Delete Patients', category: 'Patients', description: 'Remove patient records' },
    
    // Appointment Management
    { name: 'view_appointments', label: 'View Appointments', category: 'Appointments', description: 'View appointment schedules' },
    { name: 'create_appointments', label: 'Create Appointments', category: 'Appointments', description: 'Schedule new appointments' },
    { name: 'edit_appointments', label: 'Edit Appointments', category: 'Appointments', description: 'Modify appointment details' },
    { name: 'delete_appointments', label: 'Delete Appointments', category: 'Appointments', description: 'Cancel appointments' },
    
    // Consultation Management
    { name: 'view_consultations', label: 'View Consultations', category: 'Consultations', description: 'View consultation records' },
    { name: 'create_consultations', label: 'Create Consultations', category: 'Consultations', description: 'Create consultation notes' },
    { name: 'edit_consultations', label: 'Edit Consultations', category: 'Consultations', description: 'Update consultation records' },
    { name: 'delete_consultations', label: 'Delete Consultations', category: 'Consultations', description: 'Remove consultation records' },
    
    // Prescription Management
    { name: 'view_prescriptions', label: 'View Prescriptions', category: 'Prescriptions', description: 'View prescriptions' },
    { name: 'create_prescriptions', label: 'Create Prescriptions', category: 'Prescriptions', description: 'Write new prescriptions' },
    { name: 'edit_prescriptions', label: 'Edit Prescriptions', category: 'Prescriptions', description: 'Modify prescriptions' },
    { name: 'delete_prescriptions', label: 'Delete Prescriptions', category: 'Prescriptions', description: 'Remove prescriptions' },
    
    // Invoice Management
    { name: 'view_invoices', label: 'View Invoices', category: 'Invoices', description: 'View invoices and billing' },
    { name: 'create_invoices', label: 'Create Invoices', category: 'Invoices', description: 'Generate new invoices' },
    { name: 'edit_invoices', label: 'Edit Invoices', category: 'Invoices', description: 'Update invoice details' },
    { name: 'delete_invoices', label: 'Delete Invoices', category: 'Invoices', description: 'Remove invoices' },
    
    // Staff Management
    { name: 'view_staff', label: 'View Staff', category: 'Staff', description: 'View staff members' },
    { name: 'create_staff', label: 'Create Staff', category: 'Staff', description: 'Add new staff members' },
    { name: 'edit_staff', label: 'Edit Staff', category: 'Staff', description: 'Update staff information' },
    { name: 'delete_staff', label: 'Delete Staff', category: 'Staff', description: 'Remove staff members' },
    
    // Service Management
    { name: 'view_services', label: 'View Services', category: 'Services', description: 'View clinic services' },
    { name: 'create_services', label: 'Create Services', category: 'Services', description: 'Add new services' },
    { name: 'edit_services', label: 'Edit Services', category: 'Services', description: 'Update service details' },
    { name: 'delete_services', label: 'Delete Services', category: 'Services', description: 'Remove services' },
    
    // Reports
    { name: 'view_reports', label: 'View Reports', category: 'Reports', description: 'Access reports and analytics' },
    
    // Settings
    { name: 'manage_settings', label: 'Manage Settings', category: 'Settings', description: 'Configure clinic settings' },
    { name: 'manage_roles', label: 'Manage Roles', category: 'Settings', description: 'Create and modify roles' },
    
    // Clinic Management
    { name: 'view_clinics', label: 'View Clinics', category: 'Clinics', description: 'View clinic information' },
    { name: 'create_clinics', label: 'Create Clinics', category: 'Clinics', description: 'Register new clinics' },
    { name: 'edit_clinics', label: 'Edit Clinics', category: 'Clinics', description: 'Update clinic information' },
    { name: 'delete_clinics', label: 'Delete Clinics', category: 'Clinics', description: 'Remove clinics' },
  ];

  for (const permission of permissions) {
    await prisma.permission.create({ data: permission });
  }

  console.log(`✅ Created ${permissions.length} permissions`);

  // ===== CREATE MANY ROLES WITH PERMISSIONS =====
  console.log('👥 Creating roles with permissions...');
  
  // Define roles with their permissions
  const rolesData = [
    // Core System Roles (matching UserRole enum)
    {
      name: 'ADMIN',
      description: 'System administrator with full access',
      color: 'red',
      permissions: permissions.map(p => p.name), // All permissions
    },
    {
      name: 'DOCTOR',
      description: 'Medical doctor with patient care access',
      color: 'blue',
      permissions: [
        'view_patients', 'create_patients', 'edit_patients',
        'view_appointments', 'create_appointments', 'edit_appointments',
        'view_consultations', 'create_consultations', 'edit_consultations',
        'view_prescriptions', 'create_prescriptions', 'edit_prescriptions',
        'view_invoices',
      ],
    },
    {
      name: 'RECEPTIONIST',
      description: 'Front desk staff managing appointments',
      color: 'green',
      permissions: [
        'view_patients', 'create_patients', 'edit_patients',
        'view_appointments', 'create_appointments', 'edit_appointments',
        'view_invoices', 'create_invoices',
        'view_services',
      ],
    },
    {
      name: 'PATIENT',
      description: 'Patient user with personal access only',
      color: 'gray',
      permissions: [
        'view_appointments',
        'view_invoices',
      ],
    },
    // Extended Roles
    {
      name: 'Super Admin',
      description: 'Full system access with all permissions',
      color: 'red',
      permissions: permissions.map(p => p.name), // All permissions
    },
    {
      name: 'Clinic Manager',
      description: 'Manage clinic operations, staff, and settings',
      color: 'purple',
      permissions: [
        'view_patients', 'create_patients', 'edit_patients',
        'view_appointments', 'create_appointments', 'edit_appointments', 'delete_appointments',
        'view_staff', 'create_staff', 'edit_staff',
        'view_services', 'create_services', 'edit_services',
        'view_invoices', 'create_invoices', 'edit_invoices',
        'view_reports', 'manage_settings',
      ],
    },
    {
      name: 'Senior Doctor',
      description: 'Experienced doctor with additional privileges',
      color: 'blue',
      permissions: [
        'view_patients', 'create_patients', 'edit_patients',
        'view_appointments', 'create_appointments', 'edit_appointments',
        'view_consultations', 'create_consultations', 'edit_consultations',
        'view_prescriptions', 'create_prescriptions', 'edit_prescriptions',
        'view_invoices', 'view_reports',
      ],
    },
    {
      name: 'Junior Doctor',
      description: 'Doctor with supervised access',
      color: 'cyan',
      permissions: [
        'view_patients',
        'view_appointments', 'create_appointments',
        'view_consultations', 'create_consultations',
        'view_prescriptions', 'create_prescriptions',
      ],
    },
    {
      name: 'Specialist Doctor',
      description: 'Specialized medical professional',
      color: 'indigo',
      permissions: [
        'view_patients', 'edit_patients',
        'view_appointments', 'create_appointments', 'edit_appointments',
        'view_consultations', 'create_consultations', 'edit_consultations', 'delete_consultations',
        'view_prescriptions', 'create_prescriptions', 'edit_prescriptions',
        'view_invoices',
      ],
    },
    {
      name: 'Lead Receptionist',
      description: 'Senior front desk staff with scheduling authority',
      color: 'green',
      permissions: [
        'view_patients', 'create_patients', 'edit_patients',
        'view_appointments', 'create_appointments', 'edit_appointments', 'delete_appointments',
        'view_invoices', 'create_invoices', 'edit_invoices',
        'view_services',
      ],
    },
    {
      name: 'Receptionist',
      description: 'Front desk staff for appointments and check-ins',
      color: 'teal',
      permissions: [
        'view_patients', 'create_patients',
        'view_appointments', 'create_appointments',
        'view_invoices',
      ],
    },
    {
      name: 'Billing Specialist',
      description: 'Manages invoices and payments',
      color: 'amber',
      permissions: [
        'view_patients',
        'view_appointments',
        'view_invoices', 'create_invoices', 'edit_invoices',
        'view_services',
      ],
    },
    {
      name: 'Medical Records Clerk',
      description: 'Maintains patient records and files',
      color: 'slate',
      permissions: [
        'view_patients', 'edit_patients',
        'view_consultations',
        'view_prescriptions',
      ],
    },
    {
      name: 'Nurse',
      description: 'Nursing staff with patient care access',
      color: 'pink',
      permissions: [
        'view_patients', 'edit_patients',
        'view_appointments',
        'view_consultations',
        'view_prescriptions',
      ],
    },
  ];

  // Create roles and link permissions
  const createdRoles = {};
  for (const roleData of rolesData) {
    const role = await prisma.role.create({
      data: {
        name: roleData.name,
        description: roleData.description,
        color: roleData.color,
        staffCount: 0,
      },
    });
    createdRoles[roleData.name] = role;

    // Link permissions to role
    for (const permName of roleData.permissions) {
      const permission = await prisma.permission.findFirst({
        where: { name: permName },
      });
      if (permission) {
        await prisma.rolePermission.create({
          data: {
            roleId: role.id,
            permissionId: permission.id,
          },
        });
      }
    }
  }

  console.log(`✅ Created ${rolesData.length} roles with permissions`);

  // ===== CREATE MANY CLINICS =====
  console.log('🏥 Creating clinics...');
  
  const clinic1 = await prisma.clinic.create({
    data: {
      name: 'MedFlow Clinic',
      address: '123 Medical Street, Healthcare City',
      phone: '+216 71 123 456',
      email: 'contact@medflow.clinic',
      settings: {
        workingHours: {
          monday: { start: '09:00', end: '17:00' },
          tuesday: { start: '09:00', end: '17:00' },
          wednesday: { start: '09:00', end: '17:00' },
          thursday: { start: '09:00', end: '17:00' },
          friday: { start: '09:00', end: '17:00' },
        },
      },
    },
  });

  const clinic2 = await prisma.clinic.create({
    data: {
      name: 'City Health Center',
      address: '456 Wellness Avenue, Medical District',
      phone: '+216 71 789 012',
      email: 'info@cityhealthcenter.com',
      settings: {
        workingHours: {
          monday: { start: '08:00', end: '18:00' },
          tuesday: { start: '08:00', end: '18:00' },
          wednesday: { start: '08:00', end: '18:00' },
          thursday: { start: '08:00', end: '18:00' },
          friday: { start: '08:00', end: '16:00' },
          saturday: { start: '09:00', end: '13:00' },
        },
      },
    },
  });

  const clinic3 = await prisma.clinic.create({
    data: {
      name: 'Elite Medical Center',
      address: '789 Premium Care Street, Downtown',
      phone: '+216 71 345 678',
      email: 'contact@elitemedical.com',
      settings: {
        workingHours: {
          monday: { start: '09:00', end: '20:00' },
          tuesday: { start: '09:00', end: '20:00' },
          wednesday: { start: '09:00', end: '20:00' },
          thursday: { start: '09:00', end: '20:00' },
          friday: { start: '09:00', end: '20:00' },
          saturday: { start: '10:00', end: '18:00' },
        },
      },
    },
  });

  const clinic4 = await prisma.clinic.create({
    data: {
      name: 'Specialty Care Clinic',
      address: '456 Specialist Boulevard, Medical Zone',
      phone: '+216 71 456 789',
      email: 'contact@specialty-care.clinic',
      settings: {
        workingHours: {
          monday: { start: '09:00', end: '18:00' },
          tuesday: { start: '09:00', end: '18:00' },
          wednesday: { start: '09:00', end: '18:00' },
          thursday: { start: '09:00', end: '18:00' },
          friday: { start: '09:00', end: '18:00' },
        },
      },
    },
  });

  const clinic5 = await prisma.clinic.create({
    data: {
      name: 'QuickCare Urgent Center',
      address: '321 Emergency Road, Downtown',
      phone: '+216 71 321 654',
      email: 'urgent@quickcare.clinic',
      settings: {
        workingHours: {
          monday: { start: '06:00', end: '22:00' },
          tuesday: { start: '06:00', end: '22:00' },
          wednesday: { start: '06:00', end: '22:00' },
          thursday: { start: '06:00', end: '22:00' },
          friday: { start: '06:00', end: '22:00' },
          saturday: { start: '08:00', end: '20:00' },
          sunday: { start: '08:00', end: '20:00' },
        },
      },
    },
  });

  const clinic6 = await prisma.clinic.create({
    data: {
      name: 'Wellness Diagnostic Center',
      address: '555 Laboratory Street, Science Park',
      phone: '+216 71 555 888',
      email: 'lab@wellness-diagnostic.clinic',
      settings: {
        workingHours: {
          monday: { start: '07:00', end: '19:00' },
          tuesday: { start: '07:00', end: '19:00' },
          wednesday: { start: '07:00', end: '19:00' },
          thursday: { start: '07:00', end: '19:00' },
          friday: { start: '07:00', end: '19:00' },
          saturday: { start: '08:00', end: '14:00' },
        },
      },
    },
  });

  const clinic7 = await prisma.clinic.create({
    data: {
      name: 'Sunshine Pediatric Clinic',
      address: '888 Children Avenue, Family District',
      phone: '+216 71 888 999',
      email: 'kids@sunshine-pediatric.clinic',
      settings: {
        workingHours: {
          monday: { start: '08:00', end: '17:00' },
          tuesday: { start: '08:00', end: '17:00' },
          wednesday: { start: '08:00', end: '17:00' },
          thursday: { start: '08:00', end: '17:00' },
          friday: { start: '08:00', end: '17:00' },
        },
      },
    },
  });

  console.log('✅ Created 7 clinics');

  // Use clinic1 as the main clinic for backward compatibility
  const clinic = clinic1;

  // Hash passwords
  const hashedPassword = await bcrypt.hash('password123', 10);

  // Create users
  const admin = await prisma.user.create({
    data: {
      email: 'admin@medflow.com',
      password: hashedPassword,
      name: 'Admin User',
      role: UserRole.ADMIN,
      phone: '+216 71 111 111',
      clinicId: clinic.id,
    },
  });

  const doctor1 = await prisma.user.create({
    data: {
      email: 'dr.smith@medflow.com',
      password: hashedPassword,
      name: 'Dr. Sarah Smith',
      role: UserRole.DOCTOR,
      phone: '+216 71 222 222',
      clinicId: clinic.id,
    },
  });

  const doctor2 = await prisma.user.create({
    data: {
      email: 'dr.jones@medflow.com',
      password: hashedPassword,
      name: 'Dr. John Jones',
      role: UserRole.DOCTOR,
      phone: '+216 71 333 333',
      clinicId: clinic.id,
    },
  });

  const receptionist = await prisma.user.create({
    data: {
      email: 'reception@medflow.com',
      password: hashedPassword,
      name: 'Maria Garcia',
      role: UserRole.RECEPTIONIST,
      phone: '+216 71 444 444',
      clinicId: clinic.id,
    },
  });

  // Additional staff for Clinic 2
  const doctor3 = await prisma.user.create({
    data: {
      email: 'dr.hassan@cityhc.com',
      password: hashedPassword,
      name: 'Dr. Hassan Mansour',
      role: UserRole.DOCTOR,
      phone: '+216 71 555 555',
      clinicId: clinic2.id,
    },
  });

  const doctor4 = await prisma.user.create({
    data: {
      email: 'dr.amira@cityhc.com',
      password: hashedPassword,
      name: 'Dr. Amira Khaled',
      role: UserRole.DOCTOR,
      phone: '+216 71 666 666',
      clinicId: clinic2.id,
    },
  });

  const receptionist2 = await prisma.user.create({
    data: {
      email: 'reception@cityhc.com',
      password: hashedPassword,
      name: 'Salma Najjar',
      role: UserRole.RECEPTIONIST,
      phone: '+216 71 777 777',
      clinicId: clinic2.id,
    },
  });

  // Additional staff for Clinic 3
  const doctor5 = await prisma.user.create({
    data: {
      email: 'dr.youssef@elitemc.com',
      password: hashedPassword,
      name: 'Dr. Youssef Ezzedine',
      role: UserRole.DOCTOR,
      phone: '+216 71 888 888',
      clinicId: clinic3.id,
    },
  });

  const doctor6 = await prisma.user.create({
    data: {
      email: 'dr.leila@elitemc.com',
      password: hashedPassword,
      name: 'Dr. Leila Hadded',
      role: UserRole.DOCTOR,
      phone: '+216 71 999 999',
      clinicId: clinic3.id,
    },
  });

  const admin2 = await prisma.user.create({
    data: {
      email: 'admin@elitemc.com',
      password: hashedPassword,
      name: 'Rami Abidi',
      role: UserRole.ADMIN,
      phone: '+216 71 000 000',
      clinicId: clinic3.id,
    },
  });

  // Staff for Clinic 4 - Specialty Care
  const doctor7 = await prisma.user.create({
    data: {
      email: 'dr.ahmed@specialty.clinic',
      password: hashedPassword,
      name: 'Dr. Ahmed Trabelsi',
      role: UserRole.DOCTOR,
      phone: '+216 71 101 101',
      clinicId: clinic4.id,
    },
  });

  const doctor8 = await prisma.user.create({
    data: {
      email: 'dr.nadia@specialty.clinic',
      password: hashedPassword,
      name: 'Dr. Nadia Gharbi',
      role: UserRole.DOCTOR,
      phone: '+216 71 102 102',
      clinicId: clinic4.id,
    },
  });

  const doctor9 = await prisma.user.create({
    data: {
      email: 'dr.karim@specialty.clinic',
      password: hashedPassword,
      name: 'Dr. Karim Slama',
      role: UserRole.DOCTOR,
      phone: '+216 71 103 103',
      clinicId: clinic4.id,
    },
  });

  const receptionist3 = await prisma.user.create({
    data: {
      email: 'reception@specialty.clinic',
      password: hashedPassword,
      name: 'Ines Bouazizi',
      role: UserRole.RECEPTIONIST,
      phone: '+216 71 104 104',
      clinicId: clinic4.id,
    },
  });

  // Staff for Clinic 5 - QuickCare Urgent
  const doctor10 = await prisma.user.create({
    data: {
      email: 'dr.mehdi@quickcare.clinic',
      password: hashedPassword,
      name: 'Dr. Mehdi Jemli',
      role: UserRole.DOCTOR,
      phone: '+216 71 201 201',
      clinicId: clinic5.id,
    },
  });

  const doctor11 = await prisma.user.create({
    data: {
      email: 'dr.sonia@quickcare.clinic',
      password: hashedPassword,
      name: 'Dr. Sonia Messaoudi',
      role: UserRole.DOCTOR,
      phone: '+216 71 202 202',
      clinicId: clinic5.id,
    },
  });

  const receptionist4 = await prisma.user.create({
    data: {
      email: 'reception@quickcare.clinic',
      password: hashedPassword,
      name: 'Amina Fourati',
      role: UserRole.RECEPTIONIST,
      phone: '+216 71 203 203',
      clinicId: clinic5.id,
    },
  });

  const receptionist5 = await prisma.user.create({
    data: {
      email: 'reception2@quickcare.clinic',
      password: hashedPassword,
      name: 'Hend Chaouch',
      role: UserRole.RECEPTIONIST,
      phone: '+216 71 204 204',
      clinicId: clinic5.id,
    },
  });

  // Staff for Clinic 6 - Wellness Diagnostic
  const doctor12 = await prisma.user.create({
    data: {
      email: 'dr.fares@wellness.clinic',
      password: hashedPassword,
      name: 'Dr. Fares Arfaoui',
      role: UserRole.DOCTOR,
      phone: '+216 71 301 301',
      clinicId: clinic6.id,
    },
  });

  const doctor13 = await prisma.user.create({
    data: {
      email: 'dr.marwa@wellness.clinic',
      password: hashedPassword,
      name: 'Dr. Marwa Belhadj',
      role: UserRole.DOCTOR,
      phone: '+216 71 302 302',
      clinicId: clinic6.id,
    },
  });

  const admin3 = await prisma.user.create({
    data: {
      email: 'admin@wellness.clinic',
      password: hashedPassword,
      name: 'Tarek Hamdi',
      role: UserRole.ADMIN,
      phone: '+216 71 303 303',
      clinicId: clinic6.id,
    },
  });

  const receptionist6 = await prisma.user.create({
    data: {
      email: 'reception@wellness.clinic',
      password: hashedPassword,
      name: 'Rim Bouzid',
      role: UserRole.RECEPTIONIST,
      phone: '+216 71 304 304',
      clinicId: clinic6.id,
    },
  });

  // Staff for Clinic 7 - Sunshine Pediatric
  const doctor14 = await prisma.user.create({
    data: {
      email: 'dr.sami@sunshine.clinic',
      password: hashedPassword,
      name: 'Dr. Sami Khelifi',
      role: UserRole.DOCTOR,
      phone: '+216 71 401 401',
      clinicId: clinic7.id,
    },
  });

  const doctor15 = await prisma.user.create({
    data: {
      email: 'dr.dorra@sunshine.clinic',
      password: hashedPassword,
      name: 'Dr. Dorra Mestiri',
      role: UserRole.DOCTOR,
      phone: '+216 71 402 402',
      clinicId: clinic7.id,
    },
  });

  const doctor16 = await prisma.user.create({
    data: {
      email: 'dr.olfa@sunshine.clinic',
      password: hashedPassword,
      name: 'Dr. Olfa Grissa',
      role: UserRole.DOCTOR,
      phone: '+216 71 403 403',
      clinicId: clinic7.id,
    },
  });

  const receptionist7 = await prisma.user.create({
    data: {
      email: 'reception@sunshine.clinic',
      password: hashedPassword,
      name: 'Wafa Toumi',
      role: UserRole.RECEPTIONIST,
      phone: '+216 71 404 404',
      clinicId: clinic7.id,
    },
  });

  console.log('✅ Created users: 4 Admins, 16 Doctors, 7 Receptionists across 7 clinics (Total: 27 staff)');

  // Create comprehensive services for all clinics
  const servicesClinic1 = await prisma.service.createMany({
    data: [
      {
        name: 'General Consultation',
        description: 'General medical consultation',
        clinicId: clinic1.id,
      },
      {
        name: 'Specialist Consultation',
        description: 'Consultation with a specialist',
        clinicId: clinic1.id,
      },
      {
        name: 'Follow-up Visit',
        description: 'Follow-up consultation',
        clinicId: clinic1.id,
      },
      {
        name: 'Medical Certificate',
        description: 'Medical certificate issuance',
        clinicId: clinic1.id,
      },
      {
        name: 'Vaccination',
        description: 'Vaccination service',
        clinicId: clinic1.id,
      },
    ],
  });

  const servicesClinic2 = await prisma.service.createMany({
    data: [
      {
        name: 'Cardiology Consultation',
        description: 'Heart and cardiovascular specialist consultation',
        clinicId: clinic2.id,
      },
      {
        name: 'Pediatrics Checkup',
        description: 'Child health examination',
        clinicId: clinic2.id,
      },
      {
        name: 'Dental Checkup',
        description: 'Dental examination and cleaning',
        clinicId: clinic2.id,
      },
      {
        name: 'Physical Therapy',
        description: 'Physiotherapy session',
        clinicId: clinic2.id,
      },
      {
        name: 'X-Ray Imaging',
        description: 'Radiological imaging service',
        clinicId: clinic2.id,
      },
      {
        name: 'Blood Test',
        description: 'Laboratory blood analysis',
        clinicId: clinic2.id,
      },
    ],
  });

  const servicesClinic3 = await prisma.service.createMany({
    data: [
      {
        name: 'Dermatology Consultation',
        description: 'Skin specialist consultation',
        clinicId: clinic3.id,
      },
      {
        name: 'Orthopedic Consultation',
        description: 'Bone and joint specialist',
        clinicId: clinic3.id,
      },
      {
        name: 'Neurology Consultation',
        description: 'Neurological specialist consultation',
        clinicId: clinic3.id,
      },
      {
        name: 'Ultrasound Scan',
        description: 'Medical ultrasound imaging',
        clinicId: clinic3.id,
      },
      {
        name: 'ECG Test',
        description: 'Electrocardiogram test',
        clinicId: clinic3.id,
      },
      {
        name: 'Annual Health Checkup',
        description: 'Comprehensive health examination',
        clinicId: clinic3.id,
      },
    ],
  });

  // Services for Clinic 4 - Specialty Care
  const servicesClinic4 = await prisma.service.createMany({
    data: [
      {
        name: 'Ophthalmology Consultation',
        description: 'Eye specialist consultation',
        clinicId: clinic4.id,
      },
      {
        name: 'ENT Consultation',
        description: 'Ear, Nose, and Throat specialist',
        clinicId: clinic4.id,
      },
      {
        name: 'Gastroenterology Consultation',
        description: 'Digestive system specialist',
        clinicId: clinic4.id,
      },
      {
        name: 'Urology Consultation',
        description: 'Urinary system specialist',
        clinicId: clinic4.id,
      },
      {
        name: 'Endocrinology Consultation',
        description: 'Hormone and metabolism specialist',
        clinicId: clinic4.id,
      },
      {
        name: 'Rheumatology Consultation',
        description: 'Joint and autoimmune specialist',
        clinicId: clinic4.id,
      },
      {
        name: 'Allergy Testing',
        description: 'Comprehensive allergy screening',
        clinicId: clinic4.id,
      },
      {
        name: 'Nutrition Counseling',
        description: 'Dietitian consultation',
        clinicId: clinic4.id,
      },
    ],
  });

  // Services for Clinic 5 - QuickCare Urgent
  const servicesClinic5 = await prisma.service.createMany({
    data: [
      {
        name: 'Emergency Consultation',
        description: 'Urgent medical consultation',
        clinicId: clinic5.id,
      },
      {
        name: 'Minor Injury Treatment',
        description: 'Treatment for cuts, sprains, and minor injuries',
        clinicId: clinic5.id,
      },
      {
        name: 'Rapid Flu Test',
        description: 'Quick influenza testing',
        clinicId: clinic5.id,
      },
      {
        name: 'COVID-19 Test',
        description: 'Rapid COVID-19 antigen test',
        clinicId: clinic5.id,
      },
      {
        name: 'IV Hydration Therapy',
        description: 'Intravenous fluid administration',
        clinicId: clinic5.id,
      },
      {
        name: 'Suture Removal',
        description: 'Medical suture removal service',
        clinicId: clinic5.id,
      },
      {
        name: 'Urgent Blood Work',
        description: 'Emergency laboratory tests',
        clinicId: clinic5.id,
      },
    ],
  });

  // Services for Clinic 6 - Wellness Diagnostic
  const servicesClinic6 = await prisma.service.createMany({
    data: [
      {
        name: 'Complete Blood Count (CBC)',
        description: 'Comprehensive blood analysis',
        clinicId: clinic6.id,
      },
      {
        name: 'Lipid Profile',
        description: 'Cholesterol and triglyceride testing',
        clinicId: clinic6.id,
      },
      {
        name: 'Thyroid Function Test',
        description: 'TSH, T3, T4 hormone testing',
        clinicId: clinic6.id,
      },
      {
        name: 'Liver Function Test',
        description: 'Comprehensive liver enzyme panel',
        clinicId: clinic6.id,
      },
      {
        name: 'Kidney Function Test',
        description: 'Creatinine and BUN testing',
        clinicId: clinic6.id,
      },
      {
        name: 'Diabetes Screening (HbA1c)',
        description: 'Blood sugar control testing',
        clinicId: clinic6.id,
      },
      {
        name: 'CT Scan',
        description: 'Computed tomography imaging',
        clinicId: clinic6.id,
      },
      {
        name: 'MRI Scan',
        description: 'Magnetic resonance imaging',
        clinicId: clinic6.id,
      },
      {
        name: 'Mammography',
        description: 'Breast cancer screening',
        clinicId: clinic6.id,
      },
      {
        name: 'Bone Density Scan',
        description: 'DEXA scan for osteoporosis',
        clinicId: clinic6.id,
      },
    ],
  });

  // Services for Clinic 7 - Sunshine Pediatric
  const servicesClinic7 = await prisma.service.createMany({
    data: [
      {
        name: 'Pediatric Consultation',
        description: 'General child health consultation',
        clinicId: clinic7.id,
      },
      {
        name: 'Well-Baby Checkup',
        description: 'Routine infant examination',
        clinicId: clinic7.id,
      },
      {
        name: 'Child Vaccination',
        description: 'Childhood immunizations',
        clinicId: clinic7.id,
      },
      {
        name: 'Growth & Development Assessment',
        description: 'Pediatric developmental evaluation',
        clinicId: clinic7.id,
      },
      {
        name: 'Newborn Screening',
        description: 'Comprehensive newborn health check',
        clinicId: clinic7.id,
      },
      {
        name: 'Adolescent Health Consultation',
        description: 'Teen health and wellness consultation',
        clinicId: clinic7.id,
      },
      {
        name: 'Pediatric Nutrition Counseling',
        description: 'Child nutrition and feeding guidance',
        clinicId: clinic7.id,
      },
      {
        name: 'Allergy Testing - Pediatric',
        description: 'Child allergy screening',
        clinicId: clinic7.id,
      },
    ],
  });

  console.log('✅ Created 56 services across 7 clinics:');
  console.log('  - Clinic 1: 5 services (General Practice)');
  console.log('  - Clinic 2: 6 services (Multi-specialty)');
  console.log('  - Clinic 3: 6 services (Premium Care)');
  console.log('  - Clinic 4: 8 services (Specialty Care)');
  console.log('  - Clinic 5: 7 services (Urgent Care)');
  console.log('  - Clinic 6: 10 services (Diagnostics & Imaging)');
  console.log('  - Clinic 7: 8 services (Pediatrics)');

  // Create patients with user accounts
  const patient1User = await prisma.user.create({
    data: {
      email: 'lina.benali@email.com',
      password: hashedPassword,
      name: 'Lina Ben Ali',
      role: UserRole.PATIENT,
      phone: '+216 98 765 432',
      clinicId: clinic.id,
      patient: {
        create: {
          firstName: 'Lina',
          lastName: 'Ben Ali',
          dateOfBirth: new Date('1991-02-14'),
          gender: 'Female',
          bloodType: 'A+',
          phone: '+216 98 765 432',
          email: 'lina.benali@email.com',
          address: '45 Avenue Habib Bourguiba, Tunis',
          allergies: 'Penicillin',
          medicalHistory: 'Diabetes Type 2 (controlled)',
          clinicId: clinic.id,
        },
      },
    },
    include: { patient: true },
  });

  const patient2User = await prisma.user.create({
    data: {
      email: 'ahmed.mohamed@email.com',
      password: hashedPassword,
      name: 'Ahmed Mohamed',
      role: UserRole.PATIENT,
      phone: '+216 98 123 456',
      clinicId: clinic.id,
      patient: {
        create: {
          firstName: 'Ahmed',
          lastName: 'Mohamed',
          dateOfBirth: new Date('1985-07-22'),
          gender: 'Male',
          bloodType: 'O+',
          phone: '+216 98 123 456',
          email: 'ahmed.mohamed@email.com',
          address: '12 Rue de la Liberté, Sfax',
          allergies: 'None',
          medicalHistory: 'Hypertension',
          clinicId: clinic.id,
        },
      },
    },
    include: { patient: true },
  });

  // Create patients without user accounts for Clinic 1
  const patient3 = await prisma.patient.create({
    data: {
      firstName: 'Fatima',
      lastName: 'Karim',
      dateOfBirth: new Date('2000-03-15'),
      gender: 'Female',
      phone: '+216 97 555 666',
      email: 'fatima.karim@email.com',
      address: '78 Avenue Mohamed V, Sousse',
      clinicId: clinic.id,
    },
  });

  const patient4 = await prisma.patient.create({
    data: {
      firstName: 'Omar',
      lastName: 'Trabelsi',
      dateOfBirth: new Date('1978-11-30'),
      gender: 'Male',
      bloodType: 'B+',
      phone: '+216 99 888 777',
      address: '23 Rue de Carthage, Tunis',
      allergies: 'Aspirin',
      medicalHistory: 'Asthma',
      clinicId: clinic.id,
    },
  });

  const patient5 = await prisma.patient.create({
    data: {
      firstName: 'Samir',
      lastName: 'Bouzid',
      dateOfBirth: new Date('1995-06-20'),
      gender: 'Male',
      bloodType: 'AB+',
      phone: '+216 98 111 222',
      email: 'samir.bouzid@email.com',
      address: '15 Rue des Fleurs, Tunis',
      allergies: 'None',
      clinicId: clinic.id,
    },
  });

  const patient6 = await prisma.patient.create({
    data: {
      firstName: 'Nadia',
      lastName: 'Slimani',
      dateOfBirth: new Date('1988-09-12'),
      gender: 'Female',
      bloodType: 'O-',
      phone: '+216 97 333 444',
      email: 'nadia.slimani@email.com',
      address: '32 Boulevard du 7 Novembre, Tunis',
      allergies: 'Pollen',
      medicalHistory: 'Seasonal allergies',
      clinicId: clinic.id,
    },
  });

  // Patients for Clinic 2
  const patient7 = await prisma.patient.create({
    data: {
      firstName: 'Karim',
      lastName: 'Jaziri',
      dateOfBirth: new Date('1982-04-08'),
      gender: 'Male',
      bloodType: 'A-',
      phone: '+216 99 555 666',
      email: 'karim.jaziri@email.com',
      address: '89 Avenue de la République, Sfax',
      medicalHistory: 'Heart disease',
      allergies: 'None',
      clinicId: clinic2.id,
    },
  });

  const patient8 = await prisma.patient.create({
    data: {
      firstName: 'Samia',
      lastName: 'Hamdi',
      dateOfBirth: new Date('1993-12-25'),
      gender: 'Female',
      bloodType: 'B-',
      phone: '+216 98 777 888',
      email: 'samia.hamdi@email.com',
      address: '56 Rue de la Paix, Sousse',
      allergies: 'Latex',
      clinicId: clinic2.id,
    },
  });

  const patient9 = await prisma.patient.create({
    data: {
      firstName: 'Yassine',
      lastName: 'Maalej',
      dateOfBirth: new Date('2005-01-10'),
      gender: 'Male',
      phone: '+216 97 999 000',
      address: '10 Rue Ibn Khaldoun, Monastir',
      clinicId: clinic2.id,
    },
  });

  // Patients for Clinic 3
  const patient10 = await prisma.patient.create({
    data: {
      firstName: 'Sana',
      lastName: 'Gharbi',
      dateOfBirth: new Date('1990-07-18'),
      gender: 'Female',
      bloodType: 'A+',
      phone: '+216 99 111 222',
      email: 'sana.gharbi@email.com',
      address: '44 Avenue Bourguiba, La Marsa',
      allergies: 'Shellfish',
      medicalHistory: 'Eczema',
      clinicId: clinic3.id,
    },
  });

  const patient11 = await prisma.patient.create({
    data: {
      firstName: 'Mehdi',
      lastName: 'Souissi',
      dateOfBirth: new Date('1975-11-03'),
      gender: 'Male',
      bloodType: 'O+',
      phone: '+216 98 222 333',
      email: 'mehdi.souissi@email.com',
      address: '67 Rue de Marseille, Tunis',
      medicalHistory: 'Diabetes, High cholesterol',
      allergies: 'Sulfa drugs',
      clinicId: clinic3.id,
    },
  });

  const patient12 = await prisma.patient.create({
    data: {
      firstName: 'Rim',
      lastName: 'Chaabane',
      dateOfBirth: new Date('1998-03-28'),
      gender: 'Female',
      bloodType: 'AB-',
      phone: '+216 97 444 555',
      email: 'rim.chaabane@email.com',
      address: '21 Avenue de France, Tunis',
      allergies: 'None',
      clinicId: clinic3.id,
    },
  });

  console.log('✅ Created 12 patients (2 with user accounts) across 3 clinics');

  // Get services for appointments
  const servicesData = await prisma.service.findMany({ where: { clinicId: clinic.id } });
  const generalConsultation = servicesData.find(s => s.name === 'General Consultation');
  const specialistConsultation = servicesData.find(s => s.name === 'Specialist Consultation');
  const followUpVisit = servicesData.find(s => s.name === 'Follow-up Visit');

  const servicesDataClinic2 = await prisma.service.findMany({ where: { clinicId: clinic2.id } });
  const cardiologyConsult = servicesDataClinic2.find(s => s.name === 'Cardiology Consultation');
  const pediatricsCheckup = servicesDataClinic2.find(s => s.name === 'Pediatrics Checkup');
  const bloodTest = servicesDataClinic2.find(s => s.name === 'Blood Test');

  const servicesDataClinic3 = await prisma.service.findMany({ where: { clinicId: clinic3.id } });
  const dermatologyConsult = servicesDataClinic3.find(s => s.name === 'Dermatology Consultation');
  const orthopedicConsult = servicesDataClinic3.find(s => s.name === 'Orthopedic Consultation');
  const annualCheckup = servicesDataClinic3.find(s => s.name === 'Annual Health Checkup');

  // Create appointments for different time periods
  const today = new Date();
  const tomorrow = new Date(today);
  tomorrow.setDate(tomorrow.getDate() + 1);
  const nextWeek = new Date(today);
  nextWeek.setDate(nextWeek.getDate() + 7);
  const yesterday = new Date(today);
  yesterday.setDate(yesterday.getDate() - 1);
  const lastWeek = new Date(today);
  lastWeek.setDate(lastWeek.getDate() - 7);

  // CLINIC 1 APPOINTMENTS
  // Tomorrow's appointments
  await prisma.appointment.create({
    data: {
      startTime: new Date(tomorrow.setHours(9, 0, 0, 0)),
      endTime: new Date(tomorrow.setHours(9, 30, 0, 0)),
      status: AppointmentStatus.CONFIRMED,
      notes: 'Annual checkup - first visit',
      patientId: patient1User.patient.id,
      doctorId: doctor1.id,
      serviceId: generalConsultation.id,
      clinicId: clinic.id,
    },
  });

  await prisma.appointment.create({
    data: {
      startTime: new Date(tomorrow.setHours(10, 0, 0, 0)),
      endTime: new Date(tomorrow.setHours(10, 30, 0, 0)),
      status: AppointmentStatus.SCHEDULED,
      notes: 'Follow-up diabetes checkup',
      patientId: patient3.id,
      doctorId: doctor1.id,
      serviceId: followUpVisit.id,
      clinicId: clinic.id,
    },
  });

  await prisma.appointment.create({
    data: {
      startTime: new Date(tomorrow.setHours(11, 0, 0, 0)),
      endTime: new Date(tomorrow.setHours(11, 30, 0, 0)),
      status: AppointmentStatus.CONFIRMED,
      patientId: patient5.id,
      doctorId: doctor2.id,
      serviceId: generalConsultation.id,
      clinicId: clinic.id,
    },
  });

  await prisma.appointment.create({
    data: {
      startTime: new Date(tomorrow.setHours(14, 0, 0, 0)),
      endTime: new Date(tomorrow.setHours(14, 45, 0, 0)),
      status: AppointmentStatus.SCHEDULED,
      notes: 'Follow-up for hypertension',
      patientId: patient2User.patient.id,
      doctorId: doctor2.id,
      serviceId: specialistConsultation.id,
      clinicId: clinic.id,
    },
  });

  await prisma.appointment.create({
    data: {
      startTime: new Date(tomorrow.setHours(15, 30, 0, 0)),
      endTime: new Date(tomorrow.setHours(16, 0, 0, 0)),
      status: AppointmentStatus.CONFIRMED,
      notes: 'Asthma follow-up',
      patientId: patient4.id,
      doctorId: doctor1.id,
      serviceId: followUpVisit.id,
      clinicId: clinic.id,
    },
  });

  // Next week appointments
  await prisma.appointment.create({
    data: {
      startTime: new Date(nextWeek.setHours(10, 0, 0, 0)),
      endTime: new Date(nextWeek.setHours(10, 30, 0, 0)),
      status: AppointmentStatus.SCHEDULED,
      patientId: patient6.id,
      doctorId: doctor1.id,
      serviceId: generalConsultation.id,
      clinicId: clinic.id,
    },
  });

  // Past completed appointment with consultation
  await prisma.appointment.create({
    data: {
      startTime: new Date(yesterday.setHours(11, 0, 0, 0)),
      endTime: new Date(yesterday.setHours(11, 30, 0, 0)),
      status: AppointmentStatus.COMPLETED,
      notes: 'Flu symptoms',
      patientId: patient3.id,
      doctorId: doctor1.id,
      serviceId: generalConsultation.id,
      clinicId: clinic.id,
      consultation: {
        create: {
          chiefComplaint: 'Headache and fever',
          symptoms: 'Persistent headache for 2 days, mild fever (38.2°C)',
          diagnosis: 'Viral infection',
          treatment: 'Rest, hydration, antipyretics',
          notes: 'Follow up if symptoms persist for more than 3 days',
          vitalSigns: {
            temperature: 38.2,
            bloodPressure: '120/80',
            heartRate: 78,
            weight: 65,
          },
          patientId: patient3.id,
          doctorId: doctor1.id,
          prescriptions: {
            create: {
              medications: [
                {
                  name: 'Paracetamol',
                  dosage: '500mg',
                  frequency: 'Every 6 hours',
                  instructions: 'Take with food',
                },
                {
                  name: 'Vitamin C',
                  dosage: '1000mg',
                  frequency: 'Once daily',
                  instructions: 'Take in the morning',
                },
              ],
              patientId: patient3.id,
              doctorId: doctor1.id,
            },
          },
        },
      },
    },
  });

  // Last week completed appointment
  await prisma.appointment.create({
    data: {
      startTime: new Date(lastWeek.setHours(9, 30, 0, 0)),
      endTime: new Date(lastWeek.setHours(10, 0, 0, 0)),
      status: AppointmentStatus.COMPLETED,
      notes: 'Routine checkup',
      patientId: patient5.id,
      doctorId: doctor2.id,
      serviceId: generalConsultation.id,
      clinicId: clinic.id,
    },
  });

  // CLINIC 2 APPOINTMENTS
  await prisma.appointment.create({
    data: {
      startTime: new Date(tomorrow.setHours(9, 0, 0, 0)),
      endTime: new Date(tomorrow.setHours(9, 45, 0, 0)),
      status: AppointmentStatus.CONFIRMED,
      notes: 'Heart checkup - irregular heartbeat',
      patientId: patient7.id,
      doctorId: doctor3.id,
      serviceId: cardiologyConsult.id,
      clinicId: clinic2.id,
    },
  });

  await prisma.appointment.create({
    data: {
      startTime: new Date(tomorrow.setHours(10, 30, 0, 0)),
      endTime: new Date(tomorrow.setHours(11, 0, 0, 0)),
      status: AppointmentStatus.SCHEDULED,
      notes: 'Child vaccination',
      patientId: patient9.id,
      doctorId: doctor4.id,
      serviceId: pediatricsCheckup.id,
      clinicId: clinic2.id,
    },
  });

  await prisma.appointment.create({
    data: {
      startTime: new Date(tomorrow.setHours(14, 0, 0, 0)),
      endTime: new Date(tomorrow.setHours(14, 15, 0, 0)),
      status: AppointmentStatus.CONFIRMED,
      notes: 'Routine blood work',
      patientId: patient8.id,
      doctorId: doctor3.id,
      serviceId: bloodTest.id,
      clinicId: clinic2.id,
    },
  });

  await prisma.appointment.create({
    data: {
      startTime: new Date(nextWeek.setHours(11, 0, 0, 0)),
      endTime: new Date(nextWeek.setHours(11, 45, 0, 0)),
      status: AppointmentStatus.SCHEDULED,
      patientId: patient7.id,
      doctorId: doctor3.id,
      serviceId: cardiologyConsult.id,
      clinicId: clinic2.id,
    },
  });

  // CLINIC 3 APPOINTMENTS
  await prisma.appointment.create({
    data: {
      startTime: new Date(tomorrow.setHours(9, 0, 0, 0)),
      endTime: new Date(tomorrow.setHours(9, 40, 0, 0)),
      status: AppointmentStatus.CONFIRMED,
      notes: 'Skin rash evaluation',
      patientId: patient10.id,
      doctorId: doctor5.id,
      serviceId: dermatologyConsult.id,
      clinicId: clinic3.id,
    },
  });

  await prisma.appointment.create({
    data: {
      startTime: new Date(tomorrow.setHours(11, 0, 0, 0)),
      endTime: new Date(tomorrow.setHours(11, 45, 0, 0)),
      status: AppointmentStatus.SCHEDULED,
      notes: 'Knee pain - possible arthritis',
      patientId: patient11.id,
      doctorId: doctor6.id,
      serviceId: orthopedicConsult.id,
      clinicId: clinic3.id,
    },
  });

  await prisma.appointment.create({
    data: {
      startTime: new Date(tomorrow.setHours(14, 30, 0, 0)),
      endTime: new Date(tomorrow.setHours(16, 0, 0, 0)),
      status: AppointmentStatus.CONFIRMED,
      notes: 'Comprehensive health screening',
      patientId: patient12.id,
      doctorId: doctor5.id,
      serviceId: annualCheckup.id,
      clinicId: clinic3.id,
    },
  });

  await prisma.appointment.create({
    data: {
      startTime: new Date(nextWeek.setHours(10, 0, 0, 0)),
      endTime: new Date(nextWeek.setHours(10, 40, 0, 0)),
      status: AppointmentStatus.SCHEDULED,
      patientId: patient10.id,
      doctorId: doctor5.id,
      serviceId: dermatologyConsult.id,
      clinicId: clinic3.id,
    },
  });

  // Past cancelled appointment
  await prisma.appointment.create({
    data: {
      startTime: new Date(lastWeek.setHours(15, 0, 0, 0)),
      endTime: new Date(lastWeek.setHours(15, 45, 0, 0)),
      status: AppointmentStatus.CANCELLED,
      notes: 'Patient requested cancellation',
      patientId: patient12.id,
      doctorId: doctor6.id,
      serviceId: orthopedicConsult.id,
      clinicId: clinic3.id,
    },
  });

  console.log('✅ Created 18 appointments across 3 clinics with various statuses');

  // Create invoices for different clinics and statuses
  await prisma.invoice.create({
    data: {
      invoiceNumber: 'INV-2025-001',
      status: InvoiceStatus.PAID,
      totalAmount: 50,
      paidAmount: 50,
      paymentMethod: 'Credit Card',
      paymentDate: yesterday,
      patientId: patient3.id,
      clinicId: clinic.id,
      items: {
        create: {
          description: 'General Consultation',
          quantity: 1,
          unitPrice: 50,
          totalPrice: 50,
          serviceId: generalConsultation.id,
        },
      },
    },
  });

  await prisma.invoice.create({
    data: {
      invoiceNumber: 'INV-2025-002',
      status: InvoiceStatus.PENDING,
      totalAmount: 80,
      paidAmount: 0,
      dueDate: new Date(new Date().setDate(new Date().getDate() + 7)),
      patientId: patient2User.patient.id,
      clinicId: clinic.id,
      items: {
        create: {
          description: 'Specialist Consultation',
          quantity: 1,
          unitPrice: 80,
          totalPrice: 80,
          serviceId: specialistConsultation.id,
        },
      },
    },
  });

  await prisma.invoice.create({
    data: {
      invoiceNumber: 'INV-2025-003',
      status: InvoiceStatus.PAID,
      totalAmount: 50,
      paidAmount: 50,
      paymentMethod: 'Cash',
      paymentDate: lastWeek,
      patientId: patient5.id,
      clinicId: clinic.id,
      items: {
        create: {
          description: 'General Consultation',
          quantity: 1,
          unitPrice: 50,
          totalPrice: 50,
          serviceId: generalConsultation.id,
        },
      },
    },
  });

  // Clinic 2 invoices
  await prisma.invoice.create({
    data: {
      invoiceNumber: 'INV-C2-2025-001',
      status: InvoiceStatus.PAID,
      totalAmount: 120,
      paidAmount: 120,
      paymentMethod: 'Bank Transfer',
      paymentDate: yesterday,
      patientId: patient7.id,
      clinicId: clinic2.id,
      items: {
        create: {
          description: 'Cardiology Consultation',
          quantity: 1,
          unitPrice: 120,
          totalPrice: 120,
          serviceId: cardiologyConsult.id,
        },
      },
    },
  });

  await prisma.invoice.create({
    data: {
      invoiceNumber: 'INV-C2-2025-002',
      status: InvoiceStatus.PENDING,
      totalAmount: 40,
      paidAmount: 0,
      dueDate: new Date(new Date().setDate(new Date().getDate() + 5)),
      patientId: patient8.id,
      clinicId: clinic2.id,
      items: {
        create: {
          description: 'Blood Test',
          quantity: 1,
          unitPrice: 40,
          totalPrice: 40,
          serviceId: bloodTest.id,
        },
      },
    },
  });

  // Clinic 3 invoices
  await prisma.invoice.create({
    data: {
      invoiceNumber: 'INV-C3-2025-001',
      status: InvoiceStatus.PAID,
      totalAmount: 200,
      paidAmount: 200,
      paymentMethod: 'Credit Card',
      paymentDate: new Date(new Date().setDate(new Date().getDate() - 3)),
      patientId: patient12.id,
      clinicId: clinic3.id,
      items: {
        create: {
          description: 'Annual Health Checkup',
          quantity: 1,
          unitPrice: 200,
          totalPrice: 200,
          serviceId: annualCheckup.id,
        },
      },
    },
  });

  await prisma.invoice.create({
    data: {
      invoiceNumber: 'INV-C3-2025-002',
      status: InvoiceStatus.OVERDUE,
      totalAmount: 110,
      paidAmount: 0,
      dueDate: new Date(new Date().setDate(new Date().getDate() - 2)),
      patientId: patient10.id,
      clinicId: clinic3.id,
      items: {
        create: {
          description: 'Dermatology Consultation',
          quantity: 1,
          unitPrice: 110,
          totalPrice: 110,
          serviceId: dermatologyConsult.id,
        },
      },
    },
  });

  await prisma.invoice.create({
    data: {
      invoiceNumber: 'INV-C3-2025-003',
      status: InvoiceStatus.PENDING,
      totalAmount: 130,
      paidAmount: 0,
      dueDate: new Date(new Date().setDate(new Date().getDate() + 10)),
      patientId: patient11.id,
      clinicId: clinic3.id,
      items: {
        create: {
          description: 'Orthopedic Consultation',
          quantity: 1,
          unitPrice: 130,
          totalPrice: 130,
          serviceId: orthopedicConsult.id,
        },
      },
    },
  });

  console.log('✅ Created 8 invoices across 3 clinics (PAID, PENDING, OVERDUE)');

  // Add notifications for users
  const notifications = [
    // Clinic 1 notifications
    {
      type: 'appointment',
      title: 'Upcoming Appointment Reminder',
      message: 'You have an appointment scheduled for tomorrow at 9:00 AM with Dr. Sarah Smith.',
      userId: patient1User.id,
      clinicId: clinic.id,
    },
    {
      type: 'payment',
      title: 'Invoice Due Reminder',
      message: 'Your invoice INV-2025-002 for $80 is due in 7 days.',
      userId: patient2User.id,
      clinicId: clinic.id,
    },
    {
      type: 'system',
      title: 'System Maintenance Scheduled',
      message: 'The system will undergo maintenance on Saturday from 1:00 AM to 3:00 AM.',
      userId: admin.id,
      clinicId: clinic.id,
    },
    {
      type: 'appointment',
      title: 'Appointment Confirmed',
      message: 'Your appointment for tomorrow at 10:00 AM has been confirmed.',
      userId: patient1User.id,
      clinicId: clinic.id,
      read: true,
    },
    // Clinic 2 notifications
    {
      type: 'appointment',
      title: 'Upcoming Cardiology Appointment',
      message: 'Reminder: Heart checkup scheduled for tomorrow at 9:00 AM.',
      userId: admin.id, // Would be patient7 user if they had an account
      clinicId: clinic2.id,
    },
    {
      type: 'payment',
      title: 'Payment Received',
      message: 'Thank you! Payment of $120 has been received for invoice INV-C2-2025-001.',
      userId: admin.id,
      clinicId: clinic2.id,
      read: true,
    },
    // Clinic 3 notifications
    {
      type: 'payment',
      title: 'Overdue Invoice',
      message: 'Invoice INV-C3-2025-002 for $110 is now overdue. Please make payment as soon as possible.',
      userId: admin2.id,
      clinicId: clinic3.id,
    },
    {
      type: 'appointment',
      title: 'New Appointment Scheduled',
      message: 'A new appointment has been scheduled for tomorrow at 2:30 PM.',
      userId: admin2.id,
      clinicId: clinic3.id,
    },
  ];

  await prisma.notification.createMany({ data: notifications });
  console.log('✅ Created 8 notifications across 3 clinics');
  // =====================================
  // SEED ACCOUNTS (NextAuth OAuth)
  // =====================================
  console.log('\n🔐 Seeding OAuth accounts...');
  
  const accounts = [
    {
      userId: admin.id,
      type: 'oauth',
      provider: 'google',
      providerAccountId: 'google_123456789',
      access_token: 'ya29.a0AfH6SMBx...',
      token_type: 'Bearer',
      scope: 'openid profile email',
      id_token: 'eyJhbGciOiJSUzI1NiIsImtpZCI6...',
    },
    {
      userId: doctor1.id,
      type: 'oauth',
      provider: 'github',
      providerAccountId: 'github_987654321',
      access_token: 'gho_16C7e42F292c6912E7710c838347Ae178B4a',
      token_type: 'bearer',
      scope: 'read:user,user:email',
    },
    {
      userId: doctor2.id,
      type: 'oauth',
      provider: 'google',
      providerAccountId: 'google_111222333',
      access_token: 'ya29.a0AfH6SMCy...',
      token_type: 'Bearer',
      scope: 'openid profile email',
      id_token: 'eyJhbGciOiJSUzI1NiIsImtpZCI6...',
    },
    {
      userId: doctor3.id,
      type: 'oauth',
      provider: 'github',
      providerAccountId: 'github_555666777',
      access_token: 'gho_24D8f53G403d7923F8821d949458Bf289C5b',
      token_type: 'bearer',
      scope: 'read:user,user:email',
    },
  ];

  await prisma.account.createMany({ data: accounts });
  console.log('✅ Created 4 OAuth accounts (Google & GitHub)');

  // =====================================
  // SEED SESSIONS (Active user sessions)
  // =====================================
  console.log('\n🔑 Seeding active sessions...');
  
  const sessions = [
    {
      sessionToken: 'session_token_admin_' + Date.now(),
      userId: admin.id,
      expires: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 days
    },
    {
      sessionToken: 'session_token_doctor1_' + Date.now(),
      userId: doctor1.id,
      expires: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 days
    },
    {
      sessionToken: 'session_token_doctor2_' + Date.now(),
      userId: doctor2.id,
      expires: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000), // 14 days
    },
    {
      sessionToken: 'session_token_doctor3_' + Date.now(),
      userId: doctor3.id,
      expires: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000), // 3 days
    },
    {
      sessionToken: 'session_token_dramira_' + Date.now(),
      userId: doctor4.id,
      expires: new Date(Date.now() + 1 * 24 * 60 * 60 * 1000), // 1 day
    },
    {
      sessionToken: 'session_token_patient1_' + Date.now(),
      userId: patient1User.id,
      expires: new Date(Date.now() + 60 * 24 * 60 * 60 * 1000), // 60 days
    },
  ];

  await prisma.session.createMany({ data: sessions });
  console.log('✅ Created 6 active sessions');

  // =====================================
  // SEED VERIFICATION TOKENS
  // =====================================
  console.log('\n📧 Seeding verification tokens...');
  
  const verificationTokens = [
    {
      identifier: 'newuser@medflow.com',
      token: 'verify_token_' + Math.random().toString(36).substring(2, 15),
      expires: new Date(Date.now() + 24 * 60 * 60 * 1000), // Valid - expires in 24 hours
    },
    {
      identifier: 'pending@cityhc.com',
      token: 'verify_token_' + Math.random().toString(36).substring(2, 15),
      expires: new Date(Date.now() + 48 * 60 * 60 * 1000), // Valid - expires in 48 hours
    },
    {
      identifier: 'expired@elitemc.com',
      token: 'verify_token_expired_' + Math.random().toString(36).substring(2, 15),
      expires: new Date(Date.now() - 48 * 60 * 60 * 1000), // Expired - 2 days ago
    },
    {
      identifier: 'old@medflow.com',
      token: 'verify_token_old_' + Math.random().toString(36).substring(2, 15),
      expires: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000), // Expired - 7 days ago
    },
  ];

  await prisma.verificationToken.createMany({ data: verificationTokens });
  console.log('✅ Created 4 verification tokens (2 valid, 2 expired)');

  // =====================================
  // SEED AUDIT LOGS
  // =====================================
  console.log('\n📋 Seeding audit logs...');
  
  const auditLogs = [
    // Login events
    {
      userId: admin.id,
      userEmail: admin.email,
      userRole: 'ADMIN',
      action: 'LOGIN',
      resource: 'AUTH',
      ipAddress: '192.168.1.100',
      userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
      method: 'POST',
      endpoint: '/api/auth/signin',
      status: 'SUCCESS',
      clinicId: clinic1.id,
      createdAt: new Date(Date.now() - 2 * 60 * 60 * 1000), // 2 hours ago
    },
    {
      userId: doctor1.id,
      userEmail: doctor1.email,
      userRole: 'DOCTOR',
      action: 'LOGIN',
      resource: 'AUTH',
      ipAddress: '192.168.1.105',
      userAgent: 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7)',
      method: 'POST',
      endpoint: '/api/auth/signin',
      status: 'SUCCESS',
      clinicId: clinic1.id,
      createdAt: new Date(Date.now() - 3 * 60 * 60 * 1000), // 3 hours ago
    },
    {
      userId: null,
      userEmail: 'failed@login.com',
      userRole: null,
      action: 'LOGIN',
      resource: 'AUTH',
      ipAddress: '203.45.67.89',
      userAgent: 'Mozilla/5.0 (X11; Linux x86_64)',
      method: 'POST',
      endpoint: '/api/auth/signin',
      status: 'FAILURE',
      errorMessage: 'Invalid credentials',
      createdAt: new Date(Date.now() - 5 * 60 * 60 * 1000), // 5 hours ago
    },
    
    // Patient operations
    {
      userId: doctor1.id,
      userEmail: doctor1.email,
      userRole: 'DOCTOR',
      action: 'VIEW',
      resource: 'PATIENT',
      resourceId: patient3.id,
      ipAddress: '192.168.1.105',
      userAgent: 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7)',
      method: 'GET',
      endpoint: '/api/patients/' + patient3.id,
      status: 'SUCCESS',
      clinicId: clinic1.id,
      createdAt: new Date(Date.now() - 1 * 60 * 60 * 1000), // 1 hour ago
    },
    {
      userId: doctor1.id,
      userEmail: doctor1.email,
      userRole: 'DOCTOR',
      action: 'UPDATE',
      resource: 'PATIENT',
      resourceId: patient3.id,
      ipAddress: '192.168.1.105',
      userAgent: 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7)',
      method: 'PUT',
      endpoint: '/api/patients/' + patient3.id,
      changes: {
        before: { phone: '0661234567' },
        after: { phone: '0661234568' },
      },
      status: 'SUCCESS',
      clinicId: clinic1.id,
      createdAt: new Date(Date.now() - 1 * 60 * 60 * 1000), // 1 hour ago
    },
    
    // Appointment operations
    {
      userId: doctor2.id,
      userEmail: doctor2.email,
      userRole: 'DOCTOR',
      action: 'CREATE',
      resource: 'APPOINTMENT',
      resourceId: 'appt_new_123',
      ipAddress: '192.168.1.110',
      userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)',
      method: 'POST',
      endpoint: '/api/appointments',
      metadata: {
        patientName: 'New Patient',
        startTime: new Date(Date.now() + 24 * 60 * 60 * 1000),
      },
      status: 'SUCCESS',
      clinicId: clinic1.id,
      createdAt: new Date(Date.now() - 4 * 60 * 60 * 1000), // 4 hours ago
    },
    {
      userId: doctor3.id,
      userEmail: doctor3.email,
      userRole: 'DOCTOR',
      action: 'UPDATE',
      resource: 'APPOINTMENT',
      resourceId: 'appt_existing_456',
      ipAddress: '192.168.2.20',
      userAgent: 'Mozilla/5.0 (iPad; CPU OS 15_0 like Mac OS X)',
      method: 'PUT',
      endpoint: '/api/appointments/appt_existing_456',
      changes: {
        before: { status: 'SCHEDULED' },
        after: { status: 'CONFIRMED' },
      },
      status: 'SUCCESS',
      clinicId: clinic2.id,
      createdAt: new Date(Date.now() - 6 * 60 * 60 * 1000), // 6 hours ago
    },
    {
      userId: doctor4.id,
      userEmail: doctor4.email,
      userRole: 'DOCTOR',
      action: 'DELETE',
      resource: 'APPOINTMENT',
      resourceId: 'appt_cancelled_789',
      ipAddress: '192.168.2.25',
      userAgent: 'Mozilla/5.0 (iPhone; CPU iPhone OS 15_0 like Mac OS X)',
      method: 'DELETE',
      endpoint: '/api/appointments/appt_cancelled_789',
      metadata: {
        reason: 'Patient requested cancellation',
      },
      status: 'SUCCESS',
      clinicId: clinic2.id,
      createdAt: new Date(Date.now() - 8 * 60 * 60 * 1000), // 8 hours ago
    },
    
    // Prescription operations
    {
      userId: doctor5.id,
      userEmail: doctor5.email,
      userRole: 'DOCTOR',
      action: 'CREATE',
      resource: 'PRESCRIPTION',
      resourceId: 'rx_new_001',
      ipAddress: '192.168.3.50',
      userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)',
      method: 'POST',
      endpoint: '/api/prescriptions',
      metadata: {
        medications: ['Amoxicillin 500mg', 'Paracetamol 500mg'],
        patientId: 'patient_xyz',
      },
      status: 'SUCCESS',
      clinicId: clinic3.id,
      createdAt: new Date(Date.now() - 12 * 60 * 60 * 1000), // 12 hours ago
    },
    {
      userId: doctor6.id,
      userEmail: doctor6.email,
      userRole: 'DOCTOR',
      action: 'DOWNLOAD',
      resource: 'PRESCRIPTION',
      resourceId: 'rx_existing_002',
      ipAddress: '192.168.3.55',
      userAgent: 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7)',
      method: 'GET',
      endpoint: '/api/prescriptions/rx_existing_002/pdf',
      status: 'SUCCESS',
      clinicId: clinic3.id,
      createdAt: new Date(Date.now() - 10 * 60 * 60 * 1000), // 10 hours ago
    },
    
    // Invoice operations
    {
      userId: admin.id,
      userEmail: admin.email,
      userRole: 'ADMIN',
      action: 'CREATE',
      resource: 'INVOICE',
      resourceId: 'inv_new_001',
      ipAddress: '192.168.1.100',
      userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)',
      method: 'POST',
      endpoint: '/api/invoices',
      metadata: {
        totalAmount: 250.00,
        patientName: 'Ahmed Hassan',
      },
      status: 'SUCCESS',
      clinicId: clinic1.id,
      createdAt: new Date(Date.now() - 24 * 60 * 60 * 1000), // 1 day ago
    },
    {
      userId: admin.id,
      userEmail: admin.email,
      userRole: 'ADMIN',
      action: 'UPDATE',
      resource: 'INVOICE',
      resourceId: 'inv_existing_002',
      ipAddress: '192.168.1.100',
      userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)',
      method: 'PUT',
      endpoint: '/api/invoices/inv_existing_002',
      changes: {
        before: { status: 'PENDING' },
        after: { status: 'PAID' },
      },
      status: 'SUCCESS',
      clinicId: clinic1.id,
      createdAt: new Date(Date.now() - 18 * 60 * 60 * 1000), // 18 hours ago
    },
    
    // Report access
    {
      userId: admin2.id,
      userEmail: admin2.email,
      userRole: 'ADMIN',
      action: 'VIEW',
      resource: 'REPORT',
      ipAddress: '192.168.3.45',
      userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)',
      method: 'GET',
      endpoint: '/api/reports/monthly',
      metadata: {
        reportType: 'monthly_revenue',
        month: '2024-01',
      },
      status: 'SUCCESS',
      clinicId: clinic3.id,
      createdAt: new Date(Date.now() - 48 * 60 * 60 * 1000), // 2 days ago
    },
    {
      userId: admin2.id,
      userEmail: admin2.email,
      userRole: 'ADMIN',
      action: 'EXPORT',
      resource: 'REPORT',
      ipAddress: '192.168.3.45',
      userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)',
      method: 'GET',
      endpoint: '/api/reports/export',
      metadata: {
        format: 'PDF',
        dateRange: '2024-01-01 to 2024-01-31',
      },
      status: 'SUCCESS',
      clinicId: clinic3.id,
      createdAt: new Date(Date.now() - 48 * 60 * 60 * 1000), // 2 days ago
    },
    
    // Unauthorized access attempts
    {
      userId: patient1User.id,
      userEmail: patient1User.email,
      userRole: 'PATIENT',
      action: 'VIEW',
      resource: 'PATIENT',
      resourceId: patient5.id, // Trying to access another clinic's patient
      ipAddress: '192.168.1.200',
      userAgent: 'Mozilla/5.0 (Android 11; Mobile)',
      method: 'GET',
      endpoint: '/api/patients/' + patient5.id,
      status: 'UNAUTHORIZED',
      errorMessage: 'Access denied: Cannot view patient from different clinic',
      clinicId: clinic1.id,
      createdAt: new Date(Date.now() - 36 * 60 * 60 * 1000), // 1.5 days ago
    },
    {
      userId: doctor1.id,
      userEmail: doctor1.email,
      userRole: 'DOCTOR',
      action: 'DELETE',
      resource: 'PATIENT',
      resourceId: patient4.id,
      ipAddress: '192.168.1.105',
      userAgent: 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7)',
      method: 'DELETE',
      endpoint: '/api/patients/' + patient4.id,
      status: 'UNAUTHORIZED',
      errorMessage: 'Access denied: Insufficient permissions to delete patients',
      clinicId: clinic1.id,
      createdAt: new Date(Date.now() - 20 * 60 * 60 * 1000), // 20 hours ago
    },
    
    // System operations
    {
      userId: admin.id,
      userEmail: admin.email,
      userRole: 'ADMIN',
      action: 'UPDATE',
      resource: 'SETTINGS',
      ipAddress: '192.168.1.100',
      userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)',
      method: 'PUT',
      endpoint: '/api/settings',
      changes: {
        before: { appointmentDuration: 30 },
        after: { appointmentDuration: 45 },
      },
      status: 'SUCCESS',
      clinicId: clinic1.id,
      createdAt: new Date(Date.now() - 72 * 60 * 60 * 1000), // 3 days ago
    },
    {
      userId: admin2.id,
      userEmail: admin2.email,
      userRole: 'ADMIN',
      action: 'LOGOUT',
      resource: 'AUTH',
      ipAddress: '192.168.3.45',
      userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)',
      method: 'POST',
      endpoint: '/api/auth/signout',
      status: 'SUCCESS',
      clinicId: clinic3.id,
      createdAt: new Date(Date.now() - 30 * 60 * 1000), // 30 minutes ago
    },
  ];

  await prisma.auditLog.createMany({ data: auditLogs });
  console.log('✅ Created 18 audit log entries (logins, operations, unauthorized attempts)');

  console.log('\n🎉 Seeding completed successfully!');
  console.log('\n📊 Database Summary:');
  console.log('   • 7 Clinics (MedFlow, City Health, Elite Medical, Specialty Care, QuickCare Urgent, Wellness Diagnostic, Sunshine Pediatric)');
  console.log('   • 27 Staff Members (4 Admins, 16 Doctors, 7 Receptionists)');
  console.log('   • 35 Permissions across 8 categories');
  console.log('   • 10 Roles with permissions mapped');
  console.log('   • 12 Patients (2 with user accounts)');
  console.log('   • 56 Services across all clinics');
  console.log('   • 18 Appointments (scheduled, confirmed, completed, cancelled)');
  console.log('   • 8 Invoices (paid, pending, overdue)');
  console.log('   • 8 Notifications');
  console.log('   • 4 OAuth Accounts (Google & GitHub)');
  console.log('   • 6 Active Sessions');
  console.log('   • 4 Verification Tokens (2 valid, 2 expired)');
  console.log('   • 18 Audit Log entries');
  console.log('\n📋 Login Credentials (password: password123):');
  console.log('\n   CLINIC 1 - MedFlow Clinic:');
  console.log('   • Admin: admin@medflow.com');
  console.log('   • Doctor: dr.smith@medflow.com');
  console.log('   • Doctor: dr.jones@medflow.com');
  console.log('   • Receptionist: reception@medflow.com');
  console.log('   • Patient: lina.benali@email.com');
  console.log('   • Patient: ahmed.mohamed@email.com');
  console.log('\n   CLINIC 2 - City Health Center:');
  console.log('   • Doctor: dr.hassan@cityhc.com');
  console.log('   • Doctor: dr.amira@cityhc.com');
  console.log('   • Receptionist: reception@cityhc.com');
  console.log('\n   CLINIC 3 - Elite Medical Center:');
  console.log('   • Admin: admin@elitemc.com');
  console.log('   • Doctor: dr.youssef@elitemc.com');
  console.log('   • Doctor: dr.leila@elitemc.com');
}

main()
  .catch((e) => {
    console.error('❌ Error seeding database:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
