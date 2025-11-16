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

    if (session.user.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Forbidden - Admin access required' }, { status: 403 });
    }

    // Get total users count
    const totalUsers = await prisma.user.count();

    // Get total clinics count
    const totalClinics = await prisma.clinic.count();

    // Get total patients count
    const totalPatients = await prisma.patient.count();

    // Get total revenue
    const revenueData = await prisma.invoice.aggregate({
      _sum: {
        paidAmount: true,
      },
      where: {
        status: 'PAID',
      },
    });

    // Get active appointments count (scheduled, confirmed)
    const activeAppointments = await prisma.appointment.count({
      where: {
        status: {
          in: ['SCHEDULED', 'CONFIRMED'],
        },
      },
    });

    // Get total staff count (doctors + receptionists)
    const totalStaff = await prisma.user.count({
      where: {
        role: {
          in: ['DOCTOR', 'RECEPTIONIST'],
        },
      },
    });

    // Get active services count
    const activeServices = await prisma.service.count({
      where: {
        active: true,
      },
    });

    // Get pending invoices count
    const pendingInvoices = await prisma.invoice.count({
      where: {
        status: 'PENDING',
      },
    });

    // Get pending notifications count (placeholder - implement based on your notification system)
    const pendingNotifications = await prisma.notification?.count({
      where: {
        read: false,
      },
    }).catch(() => 0); // Return 0 if notification model doesn't exist yet

    // Get recent activity (last 10 actions)
    const recentUsers = await prisma.user.findMany({
      take: 1000,
      orderBy: {
        createdAt: 'desc',
      },
      select: {
        name: true,
        email: true,
        role: true,
        createdAt: true,
      },
    });

    const recentActivity = recentUsers.map(user => ({
      icon: getRoleIcon(user.role),  
      role: user.role ? user.role : 'Unknown',
      user: user.name || user.email,
      action: `New ${user.role.toLowerCase()} registered`,
      timestamp: new Date(user.createdAt).toLocaleString(),
    }));

    return NextResponse.json({
      stats: {
        totalUsers,
        totalClinics,
        totalPatients,
        totalRevenue: revenueData._sum.paidAmount || 0,
        activeAppointments,
        totalStaff,
        activeServices,
        pendingInvoices,
        pendingNotifications,
        systemHealth: 'Good',
      },
      recentActivity,
    });
  } catch (error) {
    console.error('Admin Stats API Error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch admin stats' },
      { status: 500 }
    );
  }
}

function getRoleIcon(role) {
  switch (role) {
    case 'ADMIN':
      return '👑';
    case 'DOCTOR':
      return '👨‍⚕️';
    case 'RECEPTIONIST':
      return '👨‍💼';
    case 'PATIENT':
      return '🧑';
    default:
      return '👤';
  }
}
