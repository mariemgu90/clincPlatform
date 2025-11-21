import { NextResponse } from 'next/server';
/**
 * @openapi
 * {
 *   "get": { "summary": "Get patient by id", "responses": { "200": { "description": "Patient object" }, "404": { "description": "Not found" } } },
 *   "put": { "summary": "Update patient", "requestBody": { "required": true, "content": { "application/json": { "schema": { "type": "object" } } } }, "responses": { "200": { "description": "Updated" } } },
 *   "delete": { "summary": "Delete patient", "responses": { "200": { "description": "Deleted" } } }
 * }
 */
import prisma from '@/lib/prisma.jsx';
import { getCurrentUser } from '@/lib/auth';

// GET /api/patients/[id] - Get a single patient
export async function GET(request, context) {
  try {
    const params = await context.params;
    const user = await getCurrentUser();
    
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const patient = await prisma.patient.findFirst({
      where: {
        id: params.id,
        clinicId: user.clinicId,
      },
      include: {
        user: {
          select: { email: true, name: true, phone: true },
        },
        appointments: {
          include: {
            doctor: {
              select: { name: true },
            },
            service: true,
          },
          orderBy: { startTime: 'desc' },
          take: 10,
        },
        consultations: {
          include: {
            doctor: {
              select: { name: true },
            },
            prescriptions: true,
          },
          orderBy: { createdAt: 'desc' },
          take: 5,
        },
        invoices: {
          orderBy: { createdAt: 'desc' },
          take: 10,
        },
      },
    });

    if (!patient) {
      return NextResponse.json(
        { error: 'Patient not found' },
        { status: 404 }
      );
    }

    return NextResponse.json(patient);
  } catch (error) {
    console.error('Error fetching patient:', error);
    return NextResponse.json(
      { error: 'Failed to fetch patient' },
      { status: 500 }
    );
  }
}

// PUT /api/patients/[id] - Update a patient
export async function PUT(request, context) {
  try {
    const params = await context.params;
    console.info('PUT request received for patient ID:', params.id);
    
    const user = await getCurrentUser();
    
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    console.info('User authenticated:', { userId: user.id, role: user.role, clinicId: user.clinicId });

    if (!['ADMIN', 'DOCTOR', 'RECEPTIONIST'].includes(user.role)) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    // Verify patient belongs to the user's clinic
    const existingPatient = await prisma.patient.findFirst({
      where: {
        id: params.id,
        clinicId: user.clinicId,
      },
    });

    if (!existingPatient) {
      return NextResponse.json(
        { error: 'Patient not found or access denied' },
        { status: 404 }
      );
    }

    const body = await request.json();
    const {
      firstName,
      lastName,
      dateOfBirth,
      gender,
      email,
      phone,
      address,
      bloodType,
      allergies,
      currentMedications,
      medicalHistory,
      emergencyContact,
      emergencyPhone,
      insuranceProvider,
      insuranceNumber,
    } = body;

    // Validate required fields
    if (!firstName || !lastName || !phone || !dateOfBirth) {
      return NextResponse.json(
        { error: 'Missing required fields: firstName, lastName, phone, dateOfBirth' },
        { status: 400 }
      );
    }

    // Parse dateOfBirth to ensure proper timezone handling
    let parsedDateOfBirth = null;
    if (dateOfBirth) {
      const dateStr = String(dateOfBirth).trim();
      // Handle both ISO format (YYYY-MM-DD) and datetime format
      const dateObj = new Date(`${dateStr}T00:00:00Z`);
      if (isNaN(dateObj.getTime())) {
        return NextResponse.json(
          { error: 'Invalid date of birth format' },
          { status: 400 }
        );
      }
      parsedDateOfBirth = dateObj;
    }

    console.info('Updating patient with data:', {
      id: params.id,
      firstName: firstName?.trim(),
      lastName: lastName?.trim(),
      dateOfBirth: parsedDateOfBirth,
      gender: gender?.toUpperCase(),
      phone: phone?.trim()
    });

    const updatedPatient = await prisma.patient.update({
      where: { id: params.id },
      data: {
        firstName: firstName.trim(),
        lastName: lastName.trim(),
        dateOfBirth: parsedDateOfBirth,
        gender: gender?.toUpperCase() || null,
        email: email ? email.trim() : null,
        phone: phone.trim(),
        address: address ? address.trim() : null,
        bloodType: bloodType || null,
        allergies: allergies ? allergies.trim() : null,
        currentMedications: currentMedications ? currentMedications.trim() : null,
        medicalHistory: medicalHistory ? medicalHistory.trim() : null,
        emergencyContact: emergencyContact ? emergencyContact.trim() : null,
        emergencyPhone: emergencyPhone ? emergencyPhone.trim() : null,
        insuranceProvider: insuranceProvider ? insuranceProvider.trim() : null,
        insuranceNumber: insuranceNumber ? insuranceNumber.trim() : null,
      },
    });

    return NextResponse.json(updatedPatient);
  } catch (error) {
    console.error('Error updating patient:', error);
    console.error('Error details:', {
      code: error.code,
      message: error.message,
      meta: error.meta,
      stack: process.env.NODE_ENV === 'development' ? error.stack : undefined
    });
    
    // Return specific error message based on error type
    if (error.code === 'P2025') {
      return NextResponse.json(
        { error: 'Patient not found' },
        { status: 404 }
      );
    }
    
    if (error.code === 'P2002') {
      return NextResponse.json(
        { error: 'Email or phone already exists' },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { 
        error: error.message || 'Failed to update patient',
        details: process.env.NODE_ENV === 'development' ? error.toString() : undefined
      },
      { status: 500 }
    );
  }
}

// DELETE /api/patients/[id] - Delete a patient
export async function DELETE(request, context) {
  try {
    const params = await context.params;
    const user = await getCurrentUser();
    
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    if (!['ADMIN'].includes(user.role)) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    await prisma.patient.delete({
      where: { id: params.id },
    });

    return NextResponse.json({ message: 'Patient deleted successfully' });
  } catch (error) {
    console.error('Error deleting patient:', error);
    return NextResponse.json(
      { error: 'Failed to delete patient' },
      { status: 500 }
    );
  }
}
