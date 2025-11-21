// Seed script for roles and permissions
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// Define role permissions mapping
const rolePermissions = {
  ADMIN: [
    // Full access to everything
    'view_patients', 'create_patients', 'edit_patients', 'delete_patients',
    'view_appointments', 'create_appointments', 'edit_appointments', 'delete_appointments',
    'view_consultations', 'create_consultations', 'edit_consultations', 'delete_consultations',
    'view_prescriptions', 'create_prescriptions', 'edit_prescriptions', 'delete_prescriptions',
    'view_invoices', 'create_invoices', 'edit_invoices', 'delete_invoices',
    'view_staff', 'create_staff', 'edit_staff', 'delete_staff',
    'view_services', 'create_services', 'edit_services', 'delete_services',
    'view_clinics', 'create_clinics', 'edit_clinics', 'delete_clinics',
    'view_reports', 'manage_settings', 'manage_roles'
  ],
  DOCTOR: [
    // Patient and clinical access
    'view_patients', 'create_patients', 'edit_patients',
    'view_appointments', 'create_appointments', 'edit_appointments',
    'view_consultations', 'create_consultations', 'edit_consultations',
    'view_prescriptions', 'create_prescriptions', 'edit_prescriptions',
    'view_invoices',
    'view_services',
    'view_reports'
  ],
  RECEPTIONIST: [
    // Front desk and administrative access
    'view_patients', 'create_patients', 'edit_patients',
    'view_appointments', 'create_appointments', 'edit_appointments', 'delete_appointments',
    'view_consultations',
    'view_invoices', 'create_invoices', 'edit_invoices',
    'view_services',
    'view_staff'
  ],
  PATIENT: [
    // Limited self-service access
    'view_appointments',
    'view_consultations',
    'view_prescriptions',
    'view_invoices'
  ]
};

// Role descriptions and colors
const defaultRoles = [
  {
    name: 'Admin',
    description: 'Full system access with all permissions',
    color: '#EF4444',
    staffCount: 0,
    roleKey: 'ADMIN'
  },
  {
    name: 'Doctor',
    description: 'Medical professional with patient care permissions',
    color: '#3B82F6',
    staffCount: 0,
    roleKey: 'DOCTOR'
  },
  {
    name: 'Receptionist',
    description: 'Front desk staff with appointment and billing access',
    color: '#10B981',
    staffCount: 0,
    roleKey: 'RECEPTIONIST'
  },
  {
    name: 'Patient',
    description: 'Patient portal access with view-only permissions',
    color: '#8B5CF6',
    staffCount: 0,
    roleKey: 'PATIENT'
  }
];

async function seedRoles() {
  console.log('👥 Seeding roles...');

  try {
    // Check if permissions exist
    const permissionCount = await prisma.permission.count();
    if (permissionCount === 0) {
      console.log('⚠️  No permissions found in database. Please run seed-permissions.mjs first.');
      console.log('Run: node prisma/seed-permissions.mjs');
      process.exit(1);
    }

    console.log(`✅ Found ${permissionCount} permissions in database`);

    // Delete existing role permissions (but keep roles if they exist)
    await prisma.rolePermission.deleteMany({});
    console.log('🧹 Cleaned up existing role permissions');

    // Create or update each role
    for (const roleData of defaultRoles) {
      const { roleKey, ...roleInfo } = roleData;
      console.log(`\n📝 Processing role: ${roleInfo.name}`);

      // Get permission IDs for this role
      const permissionNames = rolePermissions[roleKey];
      const permissions = await prisma.permission.findMany({
        where: {
          name: {
            in: permissionNames
          }
        }
      });

      if (permissions.length !== permissionNames.length) {
        const foundNames = permissions.map(p => p.name);
        const missing = permissionNames.filter(p => !foundNames.includes(p));
        console.log(`⚠️  Warning: Missing permissions for ${roleInfo.name}:`, missing);
      }

      // Create or update the role
      let role = await prisma.role.findFirst({
        where: { name: roleInfo.name }
      });

      if (role) {
        // Update existing role
        role = await prisma.role.update({
          where: { id: role.id },
          data: {
            description: roleInfo.description,
            color: roleInfo.color,
          },
        });
        console.log(`✅ Updated existing role: ${role.name} (${role.id})`);
      } else {
        // Create new role
        role = await prisma.role.create({
          data: {
            name: roleInfo.name,
            description: roleInfo.description,
            color: roleInfo.color,
            staffCount: roleInfo.staffCount || 0,
          },
        });
        console.log(`✅ Created new role: ${role.name} (${role.id})`);
      }

      // Assign permissions to the role
      for (const permission of permissions) {
        await prisma.rolePermission.create({
          data: {
            roleId: role.id,
            permissionId: permission.id,
          },
        });
      }

      console.log(`   ✓ Assigned ${permissions.length} permissions to ${role.name}`);
    }

    // Summary
    console.log('\n📊 Seeding Summary:');
    const roles = await prisma.role.findMany({
      include: {
        permissions: {
          include: {
            permission: true,
          },
        },
      },
    });

    for (const role of roles) {
      console.log(`   • ${role.name}: ${role.permissions.length} permissions`);
    }

  } catch (error) {
    console.error('❌ Error seeding roles:', error);
    throw error;
  }
}

async function main() {
  try {
    await seedRoles();
    console.log('\n🎉 Roles seeding completed successfully!');
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
