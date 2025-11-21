import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '../auth/[...nextauth]/route';
import { prisma } from '@/lib/prisma.jsx';

export async function GET(request) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const limit = parseInt(searchParams.get('limit') || '50');
    const offset = parseInt(searchParams.get('offset') || '0');
    const patientId = searchParams.get('patientId');

    // Build where clause - Consultation doesn't have clinicId, filter through patient
    const where = {
      patient: {
        clinicId: session.user.clinicId,
      },
    };

    if (patientId) {
      where.patientId = patientId;
    }

    const consultations = await prisma.consultation.findMany({
      where,
      include: {
        patient: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            email: true,
          },
        },
        doctor: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
        prescriptions: {
          select: {
            id: true,
          },
        },
        _count: {
          select: {
            prescriptions: true,
          },
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
      take: limit,
      skip: offset,
    });

    const total = await prisma.consultation.count({ where });

    return NextResponse.json({
      consultations,
      total,
      limit,
      offset,
    });
  } catch (error) {
    console.error('Consultations API Error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch consultations' },
      { status: 500 }
    );
  }
}

export async function POST(request) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const {
      patientId,
      appointmentId,
      chiefComplaint,
      symptoms,
      diagnosis,
      treatment,
      notes,
      vitalSigns,
    } = body;

    if (!patientId) {
      return NextResponse.json(
        { error: 'Patient ID is required' },
        { status: 400 }
      );
    }

    const consultation = await prisma.consultation.create({
      data: {
        patientId,
        doctorId: session.user.id,
        appointmentId,
        chiefComplaint,
        symptoms,
        diagnosis,
        treatment,
        notes,
        vitalSigns,
      },
      include: {
        patient: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            email: true,
          },
        },
        doctor: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
      },
    });

    return NextResponse.json(consultation, { status: 201 });
  } catch (error) {
    console.error('Consultation Creation Error:', error);
    return NextResponse.json(
      { error: 'Failed to create consultation' },
      { status: 500 }
    );
  }
}
