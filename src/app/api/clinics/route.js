import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import prisma from '@/lib/prisma';

/**
 * @openapi
 * {
 *   "get": {
 *     "summary": "List clinics",
 *     "responses": {
 *       "200": {
 *         "description": "Array of clinics",
 *         "content": {
 *           "application/json": {
 *             "schema": { "type": "array", "items": { "type": "object" } }
 *           }
 *         }
 *       }
 *     },
 *     "security": [{ "cookieAuth": [] }]
 *   },
 *   "post": {
 *     "summary": "Create clinic",
 *     "requestBody": {
 *       "required": true,
 *       "content": {
 *         "application/json": {
 *           "schema": {
 *             "type": "object",
 *             "properties": {
 *               "name": { "type": "string" },
 *               "address": { "type": "string" },
 *               "phone": { "type": "string" },
 *               "email": { "type": "string" }
 *             },
 *             "required": ["name","address","phone","email"]
 *           }
 *         }
 *       }
 *     },
 *     "responses": { "201": { "description": "Created", "content": { "application/json": { "schema": { "type": "object" } } } } }
 *   }
 * }
 */
// GET /api/clinics - Get all clinics
export async function GET(request) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session || session.user.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const clinics = await prisma.clinic.findMany({
      include: {
        users: {
          select: {
            id: true,
            name: true,
            role: true,
          },
        },
        patients: {
          select: {
            id: true,
          },
        },
        services: {
          select: {
            id: true,
          },
        },
        _count: {
          select: {
            users: true,
            patients: true,
            services: true,
            appointments: true,
          },
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
    });

    // Transform data to match frontend structure
    const transformedClinics = clinics.map(clinic => ({
      id: clinic.id,
      name: clinic.name,
      address: clinic.address || '',
      phone: clinic.phone || '',
      email: clinic.email || '',
      logo: clinic.logo || '🏥',
      status: 'Active',
      staff: clinic._count.users,
      patients: clinic._count.patients,
      services: clinic._count.services,
      departments: 0, // Can be added to schema if needed
      settings: clinic.settings || {},
      createdAt: clinic.createdAt,
      updatedAt: clinic.updatedAt,
    }));

    return NextResponse.json(transformedClinics);
  } catch (error) {
    console.error('Error fetching clinics:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

// POST /api/clinics - Create a new clinic
export async function POST(request) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session || session.user.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const { name, address, city, state, zipCode, country, phone, email, website, logo, description, openingHours } = body;

    // Validate required fields
    if (!name || !address || !phone || !email) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    // Create full address string
    const fullAddress = [address, city, state, zipCode, country].filter(Boolean).join(', ');

    // Create clinic with settings
    const clinic = await prisma.clinic.create({
      data: {
        name,
        address: fullAddress,
        phone,
        email,
        logo: logo || '🏥',
        settings: {
          description: description || '',
          website: website || '',
          openingHours: openingHours || '',
          city: city || '',
          state: state || '',
          zipCode: zipCode || '',
          country: country || '',
        },
      },
    });

    return NextResponse.json(clinic, { status: 201 });
  } catch (error) {
    console.error('Error creating clinic:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
