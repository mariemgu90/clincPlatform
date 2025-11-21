import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '../../auth/[...nextauth]/route';
import { prisma } from '@/lib/prisma.jsx';

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

    // Get patient profile with health metrics
    const patient = await prisma.patient.findUnique({
      where: { id: patientId },
      select: {
        id: true,
        firstName: true,
        lastName: true,
        dateOfBirth: true,
        bloodType: true,
        allergies: true,
        currentMedications: true,
        medicalHistory: true,
      },
    });

    // Get total appointments count
    const totalAppointments = await prisma.appointment.count({
      where: { patientId },
    });

    // Get upcoming appointments count
    const upcomingAppointments = await prisma.appointment.count({
      where: {
        patientId,
        startTime: {
          gte: new Date(),
        },
        status: {
          in: ['SCHEDULED', 'CONFIRMED'],
        },
      },
    });

    // Get next appointment
    const nextAppointment = await prisma.appointment.findFirst({
      where: {
        patientId,
        startTime: {
          gte: new Date(),
        },
        status: {
          in: ['SCHEDULED', 'CONFIRMED'],
        },
      },
      orderBy: {
        startTime: 'asc',
      },
      include: {
        doctor: {
          select: {
            name: true,
          },
        },
        service: {
          select: {
            name: true,
          },
        },
      },
    });

    // Get last completed appointment
    const lastVisit = await prisma.appointment.findFirst({
      where: {
        patientId,
        status: 'COMPLETED',
      },
      orderBy: {
        startTime: 'desc',
      },
      include: {
        doctor: {
          select: {
            name: true,
          },
        },
      },
    });

    // Get pending invoices count and total amount
    const pendingInvoices = await prisma.invoice.findMany({
      where: {
        patientId,
        status: {
          in: ['PENDING', 'OVERDUE'],
        },
      },
      select: {
        totalAmount: true,
        paidAmount: true,
      },
    });

    const pendingInvoicesCount = pendingInvoices.length;
    const pendingAmount = pendingInvoices.reduce(
      (sum, inv) => sum + (inv.totalAmount - inv.paidAmount),
      0
    );

    // Get total paid amount
    const paidInvoices = await prisma.invoice.aggregate({
      where: {
        patientId,
        status: 'PAID',
      },
      _sum: {
        paidAmount: true,
      },
    });

    // Get active prescriptions count
    const activePrescriptions = await prisma.prescription.count({
      where: {
        patientId,
        status: 'active',
      },
    });

    // Get recent consultations count
    const recentConsultations = await prisma.consultation.count({
      where: {
        patientId,
      },
    });

    // Parse allergies and medications (stored as strings)
    const allergiesList = patient?.allergies
      ? patient.allergies.split(',').map((a) => a.trim()).filter(Boolean)
      : [];
    const medicationsList = patient?.currentMedications
      ? patient.currentMedications.split(',').map((m) => m.trim()).filter(Boolean)
      : [];

    return NextResponse.json({
      patient: {
        firstName: patient?.firstName,
        lastName: patient?.lastName,
        age: patient?.dateOfBirth
          ? Math.floor((new Date() - new Date(patient.dateOfBirth)) / 31557600000)
          : null,
      },
      stats: {
        upcomingAppointments,
        totalAppointments,
        pendingInvoices: pendingInvoicesCount,
        pendingAmount,
        totalPaid: paidInvoices._sum.paidAmount || 0,
        activePrescriptions,
        recentConsultations,
      },
      nextAppointment: nextAppointment
        ? {
            id: nextAppointment.id,
            date: nextAppointment.startTime,
            doctorName: nextAppointment.doctor?.name,
            serviceName: nextAppointment.service?.name,
            status: nextAppointment.status,
          }
        : null,
      lastVisit: lastVisit
        ? {
            date: lastVisit.startTime,
            doctorName: lastVisit.doctor?.name,
          }
        : null,
      healthMetrics: {
        bloodType: patient?.bloodType || 'Not specified',
        allergies: allergiesList,
        currentMedications: medicationsList,
      },
    });
  } catch (error) {
    console.error('Patient Stats API Error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch patient stats' },
      { status: 500 }
    );
  }
}
