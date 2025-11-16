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

  // Create multiple clinics
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

  console.log('✅ Created 3 clinics');

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

  console.log('✅ Created users: 3 Admins, 6 Doctors, 2 Receptionists across 3 clinics');

  // Create comprehensive services for all clinics
  const servicesClinic1 = await prisma.service.createMany({
    data: [
      {
        name: 'General Consultation',
        description: 'General medical consultation',
        duration: 30,
        price: 50,
        clinicId: clinic1.id,
      },
      {
        name: 'Specialist Consultation',
        description: 'Consultation with a specialist',
        duration: 45,
        price: 80,
        clinicId: clinic1.id,
      },
      {
        name: 'Follow-up Visit',
        description: 'Follow-up consultation',
        duration: 20,
        price: 30,
        clinicId: clinic1.id,
      },
      {
        name: 'Medical Certificate',
        description: 'Medical certificate issuance',
        duration: 15,
        price: 20,
        clinicId: clinic1.id,
      },
      {
        name: 'Vaccination',
        description: 'Vaccination service',
        duration: 15,
        price: 25,
        clinicId: clinic1.id,
      },
    ],
  });

  const servicesClinic2 = await prisma.service.createMany({
    data: [
      {
        name: 'Cardiology Consultation',
        description: 'Heart and cardiovascular specialist consultation',
        duration: 45,
        price: 120,
        clinicId: clinic2.id,
      },
      {
        name: 'Pediatrics Checkup',
        description: 'Child health examination',
        duration: 30,
        price: 60,
        clinicId: clinic2.id,
      },
      {
        name: 'Dental Checkup',
        description: 'Dental examination and cleaning',
        duration: 30,
        price: 80,
        clinicId: clinic2.id,
      },
      {
        name: 'Physical Therapy',
        description: 'Physiotherapy session',
        duration: 60,
        price: 100,
        clinicId: clinic2.id,
      },
      {
        name: 'X-Ray Imaging',
        description: 'Radiological imaging service',
        duration: 20,
        price: 150,
        clinicId: clinic2.id,
      },
      {
        name: 'Blood Test',
        description: 'Laboratory blood analysis',
        duration: 15,
        price: 40,
        clinicId: clinic2.id,
      },
    ],
  });

  const servicesClinic3 = await prisma.service.createMany({
    data: [
      {
        name: 'Dermatology Consultation',
        description: 'Skin specialist consultation',
        duration: 40,
        price: 110,
        clinicId: clinic3.id,
      },
      {
        name: 'Orthopedic Consultation',
        description: 'Bone and joint specialist',
        duration: 45,
        price: 130,
        clinicId: clinic3.id,
      },
      {
        name: 'Neurology Consultation',
        description: 'Neurological specialist consultation',
        duration: 50,
        price: 140,
        clinicId: clinic3.id,
      },
      {
        name: 'Ultrasound Scan',
        description: 'Medical ultrasound imaging',
        duration: 30,
        price: 120,
        clinicId: clinic3.id,
      },
      {
        name: 'ECG Test',
        description: 'Electrocardiogram test',
        duration: 20,
        price: 60,
        clinicId: clinic3.id,
      },
      {
        name: 'Annual Health Checkup',
        description: 'Comprehensive health examination',
        duration: 90,
        price: 200,
        clinicId: clinic3.id,
      },
    ],
  });

  console.log('✅ Created 17 services across 3 clinics (5 for Clinic 1, 6 for Clinic 2, 6 for Clinic 3)');

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
                  duration: '3 days',
                  instructions: 'Take with food',
                },
                {
                  name: 'Vitamin C',
                  dosage: '1000mg',
                  frequency: 'Once daily',
                  duration: '7 days',
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

  console.log('\n🎉 Seeding completed successfully!');
  console.log('\n� Database Summary:');
