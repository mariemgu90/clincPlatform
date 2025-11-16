import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

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

async function seedPermissions() {
  console.log('🔐 Seeding permissions...');

  try {
    // Delete existing permissions
    await prisma.rolePermission.deleteMany({});
    await prisma.permission.deleteMany({});

    console.log('🧹 Cleaned up existing permissions');

    // Create permissions
    for (const permission of permissions) {
      await prisma.permission.create({
        data: permission,
      });
    }

    console.log(`✅ Created ${permissions.length} permissions`);

    // Verify
    const count = await prisma.permission.count();
    console.log(`📊 Total permissions in database: ${count}`);

  } catch (error) {
    console.error('❌ Error seeding permissions:', error);
    throw error;
  } finally {
    await prisma.$disconnect();
  }
}

seedPermissions()
  .then(() => {
    console.log('🎉 Permissions seeding completed!');
    process.exit(0);
  })
  .catch((error) => {
    console.error('💥 Permissions seeding failed:', error);
    process.exit(1);
  });
