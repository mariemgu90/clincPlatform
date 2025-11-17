import { NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import prisma from '@/lib/prisma.jsx';

export async function POST(request) {
  try {
    const { name, email, password, phone, role } = await request.json();

    // Validation
    if (!name || !email || !password) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Check if user already exists
    const existingUser = await prisma.user.findUnique({
      where: { email },
    });

    if (existingUser) {
      return NextResponse.json(
        { error: 'User already exists with this email' },
        { status: 400 }
      );
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Get the default clinic (or create logic for multi-tenant)
    const defaultClinic = await prisma.clinic.findFirst();

    // Create user
    const user = await prisma.user.create({
      data: {
        name,
        email,
        password: hashedPassword,
        phone,
        role: role || 'PATIENT',
        clinicId: defaultClinic?.id,
      },
    });

    // If role is PATIENT, create patient profile
    if (user.role === 'PATIENT') {
      const [firstName, ...lastNameParts] = name.split(' ');
      const lastName = lastNameParts.join(' ') || firstName;

      await prisma.patient.create({
        data: {
          userId: user.id,
          firstName,
          lastName,
          phone: phone || '',
          email,
          dateOfBirth: new Date('1990-01-01'), // Default, should be updated
          clinicId: defaultClinic?.id,
        },
      });
    }

    return NextResponse.json(
      { 
        message: 'User created successfully',
        user: {
          id: user.id,
          name: user.name,
          email: user.email,
          role: user.role,
        },
      },
      { status: 201 }
    );
  } catch (error) {
    console.error('Registration error:', error);
    return NextResponse.json(
      { error: 'An error occurred during registration' },
      { status: 500 }
    );
  }
}
