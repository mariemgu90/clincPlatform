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
    const status = searchParams.get('status'); // active, completed, cancelled
    const limit = parseInt(searchParams.get('limit') || '20');
    const offset = parseInt(searchParams.get('offset') || '0');

    const where = {
      patientId,
      ...(status && { status }),
    };

    // Get prescriptions with related data
    const prescriptions = await prisma.prescription.findMany({
      where,
      include: {
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
        issuedAt: 'desc',
      },
      take: limit,
      skip: offset,
    });

    const total = await prisma.prescription.count({ where });

    return NextResponse.json({
      prescriptions,
      total,
      limit,
      offset,
    });
  } catch (error) {
    console.error('Prescriptions API Error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch prescriptions' },
      { status: 500 }
    );
  }
}
