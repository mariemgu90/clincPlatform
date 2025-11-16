import { NextResponse } from 'next/server';
/**
 * @openapi
 * {
 *   "get": {
 *     "summary": "List patients",
 *     "parameters": [
 *       { "name": "search", "in": "query", "schema": { "type": "string" } },
 *       { "name": "page", "in": "query", "schema": { "type": "integer" } },
 *       { "name": "limit", "in": "query", "schema": { "type": "integer" } },
 *       { "name": "clinicId", "in": "query", "schema": { "type": "string" } }
 *     ],
 *     "responses": { "200": { "description": "Paginated patients" } }
 *   },
 *   "post": {
 *     "summary": "Create patient",
 *     "requestBody": { "required": true, "content": { "application/json": { "schema": { "type": "object", "properties": { "firstName": { "type": "string" }, "lastName": { "type": "string" }, "dateOfBirth": { "type": "string" }, "phone": { "type": "string" } }, "required": ["firstName","lastName","dateOfBirth","phone"] } } } },
 *     "responses": { "201": { "description": "Created" }, "400": { "description": "Validation error" } }
 *   }
 * }
 */
import prisma from '@/lib/prisma';
import { getCurrentUser } from '@/lib/auth';

// GET /api/patients - Get all patients
export async function GET(request) {
  try {
    const user = await getCurrentUser();
    
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const search = searchParams.get('search') || '';
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '10');
    const skip = (page - 1) * limit;

    // Allow admin to request patients for a specific clinic via ?clinicId=...
    // For non-admin users we keep using the user's clinicId for scoping
    const requestedClinicId = searchParams.get('clinicId');

    const clinicFilter = (() => {
      if (requestedClinicId && user.role === 'ADMIN') return requestedClinicId;
      // if user is not admin, default to their own clinicId
      return user.clinicId || undefined;
    })();

    const where = {
      ...(clinicFilter ? { clinicId: clinicFilter } : {}),
      ...(search && {
        OR: [
          { firstName: { contains: search, mode: 'insensitive' } },
          { lastName: { contains: search, mode: 'insensitive' } },
          { email: { contains: search, mode: 'insensitive' } },
          { phone: { contains: search, mode: 'insensitive' } },
        ],
      }),
    };

    const [patients, total] = await Promise.all([
      prisma.patient.findMany({
        where,
        include: {
          user: {
            select: { email: true, name: true },
          },
          _count: {
            select: { appointments: true, invoices: true },
          },
        },
        orderBy: { createdAt: 'desc' },
        skip,
        take: limit,
      }),
      prisma.patient.count({ where }),
    ]);

    return NextResponse.json({
      patients,
      pagination: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    console.error('Error fetching patients:', error);
    return NextResponse.json(
      { error: 'Failed to fetch patients' },
      { status: 500 }
    );
  }
}

// POST /api/patients - Create a new patient
export async function POST(request) {
  try {
    const user = await getCurrentUser();
    
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    if (!['ADMIN', 'DOCTOR', 'RECEPTIONIST'].includes(user.role)) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
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

    // Validation
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

    const patient = await prisma.patient.create({
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
        clinicId: user.clinicId,
      },
    });

    return NextResponse.json(patient, { status: 201 });
  } catch (error) {
    console.error('Error creating patient:', error);
    return NextResponse.json(
      { error: 'Failed to create patient' },
      { status: 500 }
    );
  }
}
