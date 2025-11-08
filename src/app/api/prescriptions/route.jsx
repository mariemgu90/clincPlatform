import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '../auth/[...nextauth]/route';
import { prisma } from '@/lib/prisma';

export async function GET(request) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const patientId = searchParams.get('patientId');
    const consultationId = searchParams.get('consultationId');

    const where = {};

    // Filter based on user role
    if (session.user.role === 'PATIENT') {
      where.patientId = session.user.id;
    } else if (session.user.role === 'DOCTOR') {
      where.doctorId = session.user.id;
    }

    if (patientId) {
      where.patientId = patientId;
    }

    if (consultationId) {
      where.consultationId = consultationId;
    }

    const prescriptions = await prisma.prescription.findMany({
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
        consultation: {
          select: {
            id: true,
            diagnosis: true,
            createdAt: true,
          },
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
    });

    // Format the response with patient name
    const formattedPrescriptions = prescriptions.map(rx => ({
      ...rx,
      patient: {
        ...rx.patient,
        name: `${rx.patient?.firstName || ''} ${rx.patient?.lastName || ''}`.trim() || 'Unknown Patient'
      }
    }));

    return NextResponse.json({ prescriptions: formattedPrescriptions });
  } catch (error) {
    console.error('Prescriptions API Error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch prescriptions' },
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

    // Only doctors can create prescriptions
    if (session.user.role !== 'DOCTOR' && session.user.role !== 'ADMIN') {
      return NextResponse.json(
        { error: 'Only doctors can create prescriptions' },
        { status: 403 }
      );
    }

    const body = await request.json();
    const {
      patientId,
      consultationId,
      diagnosis,
      medications,
      notes,
    } = body;

    if (!patientId) {
      return NextResponse.json(
        { error: 'Patient ID is required' },
        { status: 400 }
      );
    }

    if (!medications || medications.length === 0) {
      return NextResponse.json(
        { error: 'At least one medication is required' },
        { status: 400 }
      );
    }

    // Validate medications
    for (const med of medications) {
      if (!med.name || !med.dosage || !med.frequency || !med.duration) {
        return NextResponse.json(
          { error: 'All medication fields are required' },
          { status: 400 }
        );
      }
    }

    const prescription = await prisma.prescription.create({
      data: {
        patientId,
        doctorId: session.user.id,
        consultationId: consultationId || null,
        diagnosis,
        medications,
        notes,
        status: 'active',
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

    return NextResponse.json(prescription, { status: 201 });
  } catch (error) {
    console.error('Prescription Creation Error:', error);
    return NextResponse.json(
      { error: 'Failed to create prescription' },
      { status: 500 }
    );
  }
}
