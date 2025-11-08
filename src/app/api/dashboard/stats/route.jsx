import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { getCurrentUser } from '@/lib/auth';

export async function GET() {
  try {
    const user = await getCurrentUser();
    
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const now = new Date();
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
    const startOfToday = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const endOfToday = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 23, 59, 59);

    // Get statistics in parallel
    const [
      totalPatients,
      todayAppointments,
      pendingInvoices,
      monthlyRevenue,
    ] = await Promise.all([
      // Total patients
      prisma.patient.count({
        where: { clinicId: user.clinicId },
      }),

      // Today's appointments
      prisma.appointment.count({
        where: {
          clinicId: user.clinicId,
          startTime: {
            gte: startOfToday,
            lte: endOfToday,
          },
          status: { not: 'CANCELLED' },
        },
      }),

      // Pending invoices
      prisma.invoice.count({
        where: {
          clinicId: user.clinicId,
          status: 'PENDING',
        },
      }),

      // Monthly revenue (paid invoices)
      prisma.invoice.aggregate({
        where: {
          clinicId: user.clinicId,
          status: 'PAID',
          createdAt: {
            gte: startOfMonth,
          },
        },
        _sum: {
          paidAmount: true,
        },
      }),
    ]);

    return NextResponse.json({
      totalPatients,
      todayAppointments,
      pendingInvoices,
      monthlyRevenue: monthlyRevenue._sum.paidAmount || 0,
    });
  } catch (error) {
    console.error('Error fetching dashboard stats:', error);
    return NextResponse.json(
      { error: 'Failed to fetch dashboard statistics' },
      { status: 500 }
    );
  }
}
