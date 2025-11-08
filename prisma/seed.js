const { PrismaClient, UserRole, AppointmentStatus, InvoiceStatus } = require('@prisma/client');
const bcrypt = require('bcryptjs');

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Seeding database...');

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

  console.log('✅ Created users: Admin, 2 Doctors, Receptionist');

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

  // Create patients without user accounts
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

  console.log('✅ Created 4 patients (2 with user accounts)');

  // Get services for appointments
  const servicesData = await prisma.service.findMany({ where: { clinicId: clinic.id } });
  const generalConsultation = servicesData.find(s => s.name === 'General Consultation');
  const specialistConsultation = servicesData.find(s => s.name === 'Specialist Consultation');

  // Create appointments
  const today = new Date();
  const tomorrow = new Date(today);
  tomorrow.setDate(tomorrow.getDate() + 1);

  const appointment1 = await prisma.appointment.create({
    data: {
      startTime: new Date(tomorrow.setHours(10, 0, 0, 0)),
      endTime: new Date(tomorrow.setHours(10, 30, 0, 0)),
      status: AppointmentStatus.CONFIRMED,
      notes: 'Annual checkup',
      patientId: patient1User.patient.id,
      doctorId: doctor1.id,
      serviceId: generalConsultation.id,
      clinicId: clinic.id,
    },
  });

  const appointment2 = await prisma.appointment.create({
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

  // Create a completed appointment with consultation
  const yesterday = new Date(today);
  yesterday.setDate(yesterday.getDate() - 1);

  const appointment3 = await prisma.appointment.create({
    data: {
      startTime: new Date(yesterday.setHours(11, 0, 0, 0)),
      endTime: new Date(yesterday.setHours(11, 30, 0, 0)),
      status: AppointmentStatus.COMPLETED,
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

  console.log('✅ Created 3 appointments (1 with consultation and prescription)');

  // Create invoices
  const invoice1 = await prisma.invoice.create({
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

  const invoice2 = await prisma.invoice.create({
    data: {
      invoiceNumber: 'INV-2025-002',
      status: InvoiceStatus.PENDING,
      totalAmount: 80,
      paidAmount: 0,
      dueDate: new Date(tomorrow.setDate(tomorrow.getDate() + 7)),
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

  console.log('✅ Created 2 invoices');

  console.log('\n🎉 Seeding completed successfully!');
  console.log('\n📋 Login credentials:');
  console.log('   Admin: admin@medflow.com / password123');
  console.log('   Doctor 1: dr.smith@medflow.com / password123');
  console.log('   Doctor 2: dr.jones@medflow.com / password123');
  console.log('   Receptionist: reception@medflow.com / password123');
  console.log('   Patient 1: lina.benali@email.com / password123');
  console.log('   Patient 2: ahmed.mohamed@email.com / password123');
}

main()
  .catch((e) => {
    console.error('❌ Error seeding database:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
