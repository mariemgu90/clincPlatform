import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '../auth/[...nextauth]/route';
import { prisma } from '@/lib/prisma.jsx';
import { notifyNewInvoice, notifyPaymentReceived } from '@/lib/notificationService';

export async function GET(request) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const limit = parseInt(searchParams.get('limit') || '50');
    const offset = parseInt(searchParams.get('offset') || '0');
    const status = searchParams.get('status');
    const patientId = searchParams.get('patientId');

    const where = {
      clinicId: session.user.clinicId,
    };

    if (status) {
      where.status = status;
    }

    if (patientId) {
      where.patientId = patientId;
    }

    const invoices = await prisma.invoice.findMany({
      where,
      include: {
        patient: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            email: true,
            phone: true,
          },
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
      take: limit,
      skip: offset,
    });

    const total = await prisma.invoice.count({ where });

    return NextResponse.json({
      invoices,
      total,
      limit,
      offset,
    });
  } catch (error) {
    console.error('Invoices API Error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch invoices' },
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
      items,
      totalAmount,
      dueDate,
      notes,
      status = 'PENDING',
    } = body;

    if (!patientId || !totalAmount) {
      return NextResponse.json(
        { error: 'Patient ID and total amount are required' },
        { status: 400 }
      );
    }

    // Generate invoice number
    const invoiceCount = await prisma.invoice.count({
      where: { clinicId: session.user.clinicId },
    });
    const invoiceNumber = `INV-${String(invoiceCount + 1).padStart(6, '0')}`;

    const invoice = await prisma.invoice.create({
      data: {
        invoiceNumber,
        patientId,
        clinicId: session.user.clinicId,
        items,
        totalAmount,
        paidAmount: 0,
        dueDate: dueDate ? new Date(dueDate) : null,
        notes,
        status,
      },
      include: {
        patient: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            email: true,
            phone: true,
            userId: true,
          },
        },
      },
    });

    // Send notification to patient about new invoice
    if (invoice.patient.userId) {
      try {
        await notifyNewInvoice({
          userId: invoice.patient.userId,
          invoice,
          clinicId: session.user.clinicId,
        });
      } catch (error) {
        console.error('Error sending invoice notification:', error);
      }
    }

    return NextResponse.json(invoice, { status: 201 });
  } catch (error) {
    console.error('Invoice Creation Error:', error);
    return NextResponse.json(
      { error: 'Failed to create invoice' },
      { status: 500 }
    );
  }
}

export async function PATCH(request) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const { id, status, paidAmount, paymentMethod } = body;

    if (!id) {
      return NextResponse.json(
        { error: 'Invoice ID is required' },
        { status: 400 }
      );
    }

    const updateData = {};
    
    if (status) {
      updateData.status = status;
    }
    
    if (paidAmount !== undefined) {
      updateData.paidAmount = paidAmount;
    }
    
    if (paymentMethod) {
      updateData.paymentMethod = paymentMethod;
    }

    const invoice = await prisma.invoice.update({
      where: { id },
      data: updateData,
      include: {
        patient: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            email: true,
            phone: true,
            userId: true,
          },
        },
      },
    });

    // Send notification for paid invoices
    if (status === 'PAID' && invoice.patient.userId) {
      try {
        await notifyPaymentReceived({
          userId: invoice.patient.userId,
          invoice,
          clinicId: session.user.clinicId,
        });
      } catch (error) {
        console.error('Error sending payment notification:', error);
      }
    }

    return NextResponse.json(invoice);
  } catch (error) {
    console.error('Invoice Update Error:', error);
    return NextResponse.json(
      { error: 'Failed to update invoice' },
      { status: 500 }
    );
  }
}
