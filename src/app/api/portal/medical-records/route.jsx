import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '../../auth/[...nextauth]/route';
import { prisma } from '@/lib/prisma';

export async function GET(request) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    if (session.user.role !== 'PATIENT') {
      return NextResponse.json({ error: 'Forbidden - Patient access required' }, { status: 403 });
    }

    const patientId = session.user.patientId;

    if (!patientId) {
      return NextResponse.json({ error: 'Patient profile not found' }, { status: 404 });
    }

    const { searchParams } = new URL(request.url);
    const limit = parseInt(searchParams.get('limit') || '20');
    const offset = parseInt(searchParams.get('offset') || '0');

    // Get consultations with related data
    const consultations = await prisma.consultation.findMany({
      where: { patientId },
      include: {
        appointment: {
          include: {
            service: {
              select: {
                name: true,
              },
            },
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
            medications: true,
            status: true,
            issuedAt: true,
          },
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
      take: limit,
      skip: offset,
    });

    const total = await prisma.consultation.count({
      where: { patientId },
    });

    return NextResponse.json({
      consultations,
      total,
      limit,
      offset,
    });
  } catch (error) {
    console.error('Medical Records API Error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch medical records' },
      { status: 500 }
    );
  }
}
