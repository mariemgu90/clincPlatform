import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { getCurrentUser } from '@/lib/auth';

// GET /api/appointments/[id]
export async function GET(request, { params }) {
  try {
    const user = await getCurrentUser();
    
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const appointment = await prisma.appointment.findFirst({
      where: {
        id: params.id,
        clinicId: user.clinicId,
      },
      include: {
        patient: true,
        doctor: true,
        service: true,
        consultation: {
          include: {
            prescriptions: true,
          },
        },
      },
    });

    if (!appointment) {
      return NextResponse.json(
        { error: 'Appointment not found' },
        { status: 404 }
      );
    }

    return NextResponse.json(appointment);
  } catch (error) {
    console.error('Error fetching appointment:', error);
    return NextResponse.json(
      { error: 'Failed to fetch appointment' },
      { status: 500 }
    );
  }
}

// PUT /api/appointments/[id]
export async function PUT(request, { params }) {
  try {
    const user = await getCurrentUser();
    
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Check permissions
    if (!['ADMIN', 'DOCTOR', 'RECEPTIONIST'].includes(user.role)) {
      return NextResponse.json(
        { error: 'Insufficient permissions' },
        { status: 403 }
      );
    }

    const body = await request.json();
    const { patientId, doctorId, startTime, endTime, notes, status, serviceId } = body;

    // Check if appointment exists and belongs to user's clinic
    const existingAppointment = await prisma.appointment.findFirst({
      where: { 
        id: params.id,
        clinicId: user.clinicId,
      },
    });

    if (!existingAppointment) {
      return NextResponse.json(
        { error: 'Appointment not found' },
        { status: 404 }
      );
    }

    // Prevent updating completed appointments
    if (existingAppointment.status === 'COMPLETED' && status !== 'COMPLETED') {
      return NextResponse.json(
        { error: 'Cannot modify a completed appointment' },
        { status: 400 }
      );
    }

    // If updating time or doctor, check for overlapping appointments
    if (startTime || endTime || doctorId) {
      const checkDoctorId = doctorId || existingAppointment.doctorId;
      const checkStartTime = startTime ? new Date(startTime) : existingAppointment.startTime;
      const checkEndTime = endTime ? new Date(endTime) : existingAppointment.endTime;

      const overlapping = await prisma.appointment.findFirst({
        where: {
          id: { not: params.id },
          doctorId: checkDoctorId,
          clinicId: user.clinicId,
          status: { notIn: ['CANCELLED', 'NO_SHOW'] },
          OR: [
            {
              AND: [
                { startTime: { lte: checkStartTime } },
                { endTime: { gt: checkStartTime } },
              ],
            },
            {
              AND: [
                { startTime: { lt: checkEndTime } },
                { endTime: { gte: checkEndTime } },
              ],
            },
          ],
        },
      });

      if (overlapping) {
        return NextResponse.json(
          { error: 'Doctor has an overlapping appointment at this time' },
          { status: 400 }
        );
      }
    }

    const appointment = await prisma.appointment.update({
      where: { id: params.id },
      data: {
        ...(patientId && { patientId }),
        ...(doctorId && { doctorId }),
        ...(startTime && { startTime: new Date(startTime) }),
        ...(endTime && { endTime: new Date(endTime) }),
        ...(notes !== undefined && { notes }),
        ...(status && { status }),
        ...(serviceId && { serviceId }),
      },
      include: {
        patient: true,
        doctor: true,
        service: true,
      },
    });

    return NextResponse.json(appointment);
  } catch (error) {
    console.error('Error updating appointment:', error);
    return NextResponse.json(
      { error: 'Failed to update appointment' },
      { status: 500 }
    );
  }
}

// DELETE /api/appointments/[id]
export async function DELETE(request, { params }) {
  try {
    const user = await getCurrentUser();
    
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    if (!['ADMIN', 'DOCTOR', 'RECEPTIONIST'].includes(user.role)) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    const { searchParams } = new URL(request.url);
    const hardDelete = searchParams.get('hard') === 'true';

    // Check if appointment exists and belongs to user's clinic
    const existingAppointment = await prisma.appointment.findFirst({
      where: { 
        id: params.id,
        clinicId: user.clinicId,
      },
      include: {
        consultation: true,
      },
    });

    if (!existingAppointment) {
      return NextResponse.json(
        { error: 'Appointment not found' },
        { status: 404 }
      );
    }

    // Prevent deleting appointments with consultations
    if (existingAppointment.consultation && hardDelete) {
      return NextResponse.json(
        { error: 'Cannot delete appointment with existing consultation. Cancel instead.' },
        { status: 400 }
      );
    }

    let result;

    if (hardDelete && user.role === 'ADMIN') {
      // Hard delete (only for admins)
      result = await prisma.appointment.delete({
        where: { id: params.id },
      });
      
      return NextResponse.json({ 
        message: 'Appointment deleted successfully',
        appointment: result,
      });
    } else {
      // Soft delete (mark as cancelled)
      result = await prisma.appointment.update({
        where: { id: params.id },
        data: { 
          status: 'CANCELLED',
          notes: existingAppointment.notes 
            ? `${existingAppointment.notes}\n\nCancelled by ${user.name} on ${new Date().toISOString()}`
            : `Cancelled by ${user.name} on ${new Date().toISOString()}`,
        },
      });
      
      return NextResponse.json({ 
        message: 'Appointment cancelled successfully',
        appointment: result,
      });
    }
  } catch (error) {
    console.error('Error deleting appointment:', error);
    return NextResponse.json(
      { error: 'Failed to delete appointment' },
      { status: 500 }
    );
  }
}

// PATCH /api/appointments/[id] - Quick status update
export async function PATCH(request, { params }) {
  try {
    const user = await getCurrentUser();
    
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const { status } = body;

    if (!status) {
      return NextResponse.json(
        { error: 'Status is required' },
        { status: 400 }
      );
    }

    // Validate status
    const validStatuses = ['SCHEDULED', 'CONFIRMED', 'IN_PROGRESS', 'COMPLETED', 'CANCELLED', 'NO_SHOW'];
    if (!validStatuses.includes(status)) {
      return NextResponse.json(
        { error: 'Invalid status value' },
        { status: 400 }
      );
    }

    // Check if appointment exists and belongs to user's clinic
    const existingAppointment = await prisma.appointment.findFirst({
      where: { 
        id: params.id,
        clinicId: user.clinicId,
      },
    });

    if (!existingAppointment) {
      return NextResponse.json(
        { error: 'Appointment not found' },
        { status: 404 }
      );
    }

    const updatedAppointment = await prisma.appointment.update({
      where: { id: params.id },
      data: { status },
      include: {
        patient: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
          },
        },
        doctor: {
          select: {
            id: true,
            name: true,
          },
        },
      },
    });

    return NextResponse.json(updatedAppointment);
  } catch (error) {
    console.error('Error updating appointment status:', error);
    return NextResponse.json(
      { error: 'Failed to update appointment status' },
      { status: 500 }
    );
  }
}
