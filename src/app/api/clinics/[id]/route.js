import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import prisma from '@/lib/prisma';

// GET /api/clinics/[id] - Get a specific clinic
export async function GET(request, { params }) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session || session.user.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { id } = params;

    const clinic = await prisma.clinic.findUnique({
      where: { id },
      include: {
        users: {
          select: {
            id: true,
            name: true,
            role: true,
            email: true,
          },
        },
        patients: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
          },
        },
        services: {
          select: {
            id: true,
            name: true,
            description: true,
            price: true,
            duration: true,
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
    });

    if (!clinic) {
      return NextResponse.json({ error: 'Clinic not found' }, { status: 404 });
    }

    return NextResponse.json(clinic);
  } catch (error) {
    console.error('Error fetching clinic:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

// PUT /api/clinics/[id] - Update a clinic
export async function PUT(request, { params }) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session || session.user.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { id } = params;
    const body = await request.json();
    const { name, address, city, state, zipCode, country, phone, email, website, logo, description, openingHours } = body;

    // Check if clinic exists
    const existingClinic = await prisma.clinic.findUnique({
      where: { id },
    });

    if (!existingClinic) {
      return NextResponse.json({ error: 'Clinic not found' }, { status: 404 });
    }

    // Create full address string if address components provided
    const fullAddress = address || [city, state, zipCode, country].filter(Boolean).join(', ');

    // Update clinic
    const updatedClinic = await prisma.clinic.update({
      where: { id },
      data: {
        ...(name && { name }),
        ...(fullAddress && { address: fullAddress }),
        ...(phone && { phone }),
        ...(email && { email }),
        ...(logo && { logo }),
        settings: {
          ...(existingClinic.settings || {}),
          ...(description && { description }),
          ...(website && { website }),
          ...(openingHours && { openingHours }),
          ...(city && { city }),
          ...(state && { state }),
          ...(zipCode && { zipCode }),
          ...(country && { country }),
        },
      },
    });

    return NextResponse.json(updatedClinic);
  } catch (error) {
    console.error('Error updating clinic:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

// DELETE /api/clinics/[id] - Delete a clinic
export async function DELETE(request, { params }) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session || session.user.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { id } = params;

    // Check if clinic exists
    const existingClinic = await prisma.clinic.findUnique({
      where: { id },
      include: {
        _count: {
          select: {
            users: true,
            patients: true,
            appointments: true,
          },
        },
      },
    });

    if (!existingClinic) {
      return NextResponse.json({ error: 'Clinic not found' }, { status: 404 });
    }

    // Check if clinic has related data
    if (existingClinic._count.users > 0 || existingClinic._count.patients > 0 || existingClinic._count.appointments > 0) {
      return NextResponse.json(
        { error: 'Cannot delete clinic with existing users, patients, or appointments' },
        { status: 400 }
      );
    }

    // Delete clinic
    await prisma.clinic.delete({
      where: { id },
    });

    return NextResponse.json({ message: 'Clinic deleted successfully' });
  } catch (error) {
    console.error('Error deleting clinic:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
