import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import prisma from '@/lib/prisma.jsx';
import bcrypt from 'bcryptjs';
import { UserRole } from '@prisma/client';

// GET /api/staff - Get all staff
export async function GET(request) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const clinicId = searchParams.get('clinicId');

    // Build where clause based on filters
    const where = {
      role: { in: [UserRole.ADMIN, UserRole.DOCTOR, UserRole.RECEPTIONIST] },
    };

    // Filter by clinic if clinicId is provided
    if (clinicId) {
      where.clinicId = clinicId;
    } else if (session.user.clinicId) {
      // If no clinicId specified, filter by user's clinic
      where.clinicId = session.user.clinicId;
    }

    const staff = await prisma.user.findMany({
      where,
      select: {
        id: true,
        email: true,
        name: true,
        role: true,
        phone: true,
        clinicId: true,
        createdAt: true,
        updatedAt: true,
        clinic: {
          select: {
            id: true,
            name: true,
          },
        },
      },
      orderBy: { createdAt: 'desc' },
    });

    return NextResponse.json(staff);
  } catch (error) {
    console.error('Error fetching staff:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

// POST /api/staff - Create a new staff member
export async function POST(request) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session || session.user.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Unauthorized - Admin access required' }, { status: 401 });
    }

    const body = await request.json();
    const { email, name, role, phone, password, clinicId } = body;

    // Validate required fields
    if (!email || !name || !role || !password) {
      return NextResponse.json(
        { error: 'Missing required fields: email, name, role, password' },
        { status: 400 }
      );
    }

    // Validate role - accept UserRole enum values for staff
    const validStaffRoles = [UserRole.ADMIN, UserRole.DOCTOR, UserRole.RECEPTIONIST];
    if (!validStaffRoles.includes(role)) {
      return NextResponse.json(
        { error: 'Invalid role. Must be ADMIN, DOCTOR, or RECEPTIONIST' },
        { status: 400 }
      );
    }

    // Use session user's clinicId if not provided
    const targetClinicId = clinicId || session.user.clinicId;
    
    if (!targetClinicId) {
      return NextResponse.json(
        { error: 'Clinic ID is required' },
        { status: 400 }
      );
    }

    // Check if user already exists
    const existingUser = await prisma.user.findUnique({
      where: { email },
    });

    if (existingUser) {
      return NextResponse.json(
        { error: 'User with this email already exists' },
        { status: 400 }
      );
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create staff member
    const staff = await prisma.user.create({
      data: {
        email,
        name,
        role,
        phone: phone || null,
        password: hashedPassword,
        clinicId: targetClinicId,
      },
      select: {
        id: true,
        email: true,
        name: true,
        role: true,
        phone: true,
        clinicId: true,
        createdAt: true,
        updatedAt: true,
        clinic: {
          select: {
            id: true,
            name: true,
          },
        },
      },
    });

    return NextResponse.json(staff, { status: 201 });
  } catch (error) {
    console.error('Error creating staff:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}