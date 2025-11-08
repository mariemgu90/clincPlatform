// Seed script for roles and permissions
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

const permissions = [
  // Patients
  { name: 'view_patients', label: 'View Patients', category: 'Patients', description: 'View patient records and information' },
  { name: 'edit_patients', label: 'Edit Patients', category: 'Patients', description: 'Edit and update patient information' },
  { name: 'delete_patients', label: 'Delete Patients', category: 'Patients', description: 'Delete patient records' },
  
  // Appointments
  { name: 'view_appointments', label: 'View Appointments', category: 'Appointments', description: 'View appointment schedule' },
  { name: 'create_appointments', label: 'Create Appointments', category: 'Appointments', description: 'Book new appointments' },
  { name: 'edit_appointments', label: 'Edit Appointments', category: 'Appointments', description: 'Modify appointment details' },
  { name: 'delete_appointments', label: 'Delete Appointments', category: 'Appointments', description: 'Cancel appointments' },
  
  // Consultations
  { name: 'view_consultations', label: 'View Consultations', category: 'Consultations', description: 'View consultation records' },
  { name: 'create_consultations', label: 'Create Consultations', category: 'Consultations', description: 'Create new consultations' },
  { name: 'edit_consultations', label: 'Edit Consultations', category: 'Consultations', description: 'Edit consultation notes' },
  
  // Prescriptions
  { name: 'view_prescriptions', label: 'View Prescriptions', category: 'Prescriptions', description: 'View prescription records' },
  { name: 'create_prescriptions', label: 'Create Prescriptions', category: 'Prescriptions', description: 'Write new prescriptions' },
  { name: 'edit_prescriptions', label: 'Edit Prescriptions', category: 'Prescriptions', description: 'Modify prescriptions' },
  
  // Staff
  { name: 'view_staff', label: 'View Staff', category: 'Staff', description: 'View staff members' },
  { name: 'manage_staff', label: 'Manage Staff', category: 'Staff', description: 'Add, edit, and remove staff' },
  
  // Reports
  { name: 'view_reports', label: 'View Reports', category: 'Reports', description: 'View analytics and reports' },
  
  // Settings
  { name: 'manage_settings', label: 'Manage Settings', category: 'Settings', description: 'Manage system settings' },
  { name: 'manage_roles', label: 'Manage Roles', category: 'Settings', description: 'Manage roles and permissions' },
];

const defaultRoles = [
  {
    name: 'Doctor',
    description: 'Full access to patient care and medical records',
    color: 'blue',
    staffCount: 0,
    permissions: [
      'view_patients', 'edit_patients', 
      'view_appointments', 'create_appointments', 'edit_appointments',
      'view_consultations', 'create_consultations', 'edit_consultations',
      'view_prescriptions', 'create_prescriptions', 'edit_prescriptions'
    ],
  },
  {
    name: 'Receptionist',
    description: 'Manage appointments and patient registration',
    color: 'emerald',
    staffCount: 0,
    permissions: [
      'view_patients', 'edit_patients',
      'view_appointments', 'create_appointments', 'edit_appointments', 'delete_appointments'
    ],
  },
  {
    name: 'Nurse',
    description: 'Patient care and assistance',
    color: 'purple',
    staffCount: 0,
    permissions: [
      'view_patients', 
      'view_appointments', 
      'view_consultations', 
      'view_prescriptions'
    ],
  },
];

async function seedPermissions() {
  console.log('🌱 Seeding permissions...');
  
  for (const perm of permissions) {
    await prisma.permission.upsert({
      where: { name: perm.name },
      update: perm,
      create: perm,
    });
  }
  
  console.log('✅ Permissions seeded successfully!');
}

async function seedRoles() {
  console.log('🌱 Seeding default roles...');
  
  for (const roleData of defaultRoles) {
    const { permissions: permNames, ...roleInfo } = roleData;
    
    // Check if role exists
    const existingRole = await prisma.role.findFirst({
      where: { name: roleInfo.name },
    });
    
    if (!existingRole) {
      await prisma.role.create({
        data: {
          ...roleInfo,
          permissions: {
            create: permNames.map(permName => ({
              permission: {
                connect: { name: permName },
              },
            })),
          },
        },
      });
      console.log(`✅ Created role: ${roleInfo.name}`);
    } else {
      console.log(`⏭️  Role ${roleInfo.name} already exists, skipping...`);
    }
  }
  
  console.log('✅ Roles seeded successfully!');
}

async function main() {
  try {
    await seedPermissions();
    await seedRoles();
    console.log('🎉 Database seeded successfully!');
  } catch (error) {
    console.error('❌ Error seeding database:', error);
    throw error;
  }
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
