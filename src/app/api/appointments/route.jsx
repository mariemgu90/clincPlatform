import { NextResponse } from 'next/server';
/**
 * @openapi
 * {
 *   "get": {
 *     "summary": "List appointments",
 *     "parameters": [
 *       { "name": "startDate", "in": "query", "schema": { "type": "string" } },
 *       { "name": "endDate", "in": "query", "schema": { "type": "string" } },
 *       { "name": "doctorId", "in": "query", "schema": { "type": "string" } },
 *       { "name": "patientId", "in": "query", "schema": { "type": "string" } },
 *       { "name": "status", "in": "query", "schema": { "type": "string" } }
 *     ],
 *     "responses": { "200": { "description": "List of appointments" } }
 *   },
 *   "post": {
 *     "summary": "Create appointment",
 *     "requestBody": { "required": true, "content": { "application/json": { "schema": { "type": "object", "properties": { "patientId": { "type": "string" }, "doctorId": { "type": "string" }, "serviceId": { "type": "string" }, "startTime": { "type": "string" }, "endTime": { "type": "string" }, "notes": { "type": "string" } }, "required": ["patientId","doctorId","startTime","endTime"] } } } },
 *     "responses": { "201": { "description": "Created" }, "400": { "description": "Validation error" } }
 *   },
 *   "patch": {
 *     "summary": "Update appointment status",
 *     "requestBody": { "required": true, "content": { "application/json": { "schema": { "type": "object", "properties": { "id": { "type": "string" }, "status": { "type": "string" }, "notes": { "type": "string" } }, "required": ["id","status"] } } } },
 *     "responses": { "200": { "description": "Updated" }, "404": { "description": "Not found" } }
 *   }
 * }
 */
import prisma from '@/lib/prisma';
import { getCurrentUser } from '@/lib/auth';
import { notifyAppointmentConfirmed, notifyAppointmentCancelled } from '@/lib/notificationService';

// GET /api/appointments - Get all appointments
export async function GET(request) {
  try {
    const user = await getCurrentUser();
    
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const startDate = searchParams.get('startDate');
    const endDate = searchParams.get('endDate');
    const doctorId = searchParams.get('doctorId');
    const patientId = searchParams.get('patientId');
    const status = searchParams.get('status');

    const where = {
      clinicId: user.clinicId,
      ...(startDate && endDate && {
        startTime: {
          gte: new Date(startDate),
          lte: new Date(endDate),
        },
      }),
      ...(doctorId && { doctorId }),
      ...(patientId && { patientId }),
      ...(status && { status }),
    };

    const appointments = await prisma.appointment.findMany({
      where,
      include: {
        patient: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            phone: true,
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
        service: true,
        consultation: true,
      },
      orderBy: { startTime: 'asc' },
    });

    return NextResponse.json(appointments);
  } catch (error) {
    console.error('Error fetching appointments:', error);
    return NextResponse.json(
      { error: 'Failed to fetch appointments' },
      { status: 500 }
    );
  }
}

// POST /api/appointments - Create a new appointment
export async function POST(request) {
  try {
    const user = await getCurrentUser();
    
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const {
      patientId,
      doctorId,
      serviceId,
      startTime,
      endTime,
      notes,
      status,
    } = body;

    // Validation
    if (!patientId || !doctorId || !startTime || !endTime) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Check for overlapping appointments
    const overlapping = await prisma.appointment.findFirst({
      where: {
        doctorId,
        status: { not: 'CANCELLED' },
        OR: [
          {
            AND: [
              { startTime: { lte: new Date(startTime) } },
              { endTime: { gt: new Date(startTime) } },
            ],
          },
          {
            AND: [
              { startTime: { lt: new Date(endTime) } },
              { endTime: { gte: new Date(endTime) } },
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

    const appointment = await prisma.appointment.create({
      data: {
        patientId,
        doctorId,
        serviceId,
        startTime: new Date(startTime),
        endTime: new Date(endTime),
        notes,
        status: status || 'SCHEDULED',
        clinicId: user.clinicId,
      },
      include: {
        patient: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            phone: true,
            email: true,
            userId: true,
          },
        },
        doctor: true,
        service: true,
      },
    });

    // Send notification to patient if they have a user account
    if (appointment.patient.userId) {
      try {
        await notifyAppointmentConfirmed({
          userId: appointment.patient.userId,
          appointment,
          clinicId: user.clinicId,
        });
      } catch (error) {
        console.error('Error sending appointment notification:', error);
        // Don't fail the request if notification fails
      }
    }

    return NextResponse.json(appointment, { status: 201 });
  } catch (error) {
    console.error('Error creating appointment:', error);
    return NextResponse.json(
      { error: 'Failed to create appointment' },
      { status: 500 }
    );
  }
}

// PATCH /api/appointments - Update appointment status
export async function PATCH(request) {
  try {
    const user = await getCurrentUser();
    
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const { id, status, notes } = body;

    if (!id || !status) {
      return NextResponse.json(
        { error: 'Appointment ID and status are required' },
        { status: 400 }
      );
    }

    // Get the appointment to verify ownership/permissions
    const appointment = await prisma.appointment.findUnique({
      where: { id },
      include: {
        patient: true,
      },
    });

    if (!appointment) {
      return NextResponse.json(
        { error: 'Appointment not found' },
        { status: 404 }
      );
    }

    // Verify permissions
    // Patients can only cancel their own appointments
    // Doctors and staff can update any appointment in their clinic
    if (user.role === 'PATIENT') {
      if (appointment.patient.userId !== user.id) {
        return NextResponse.json(
          { error: 'You can only modify your own appointments' },
          { status: 403 }
        );
      }
      
      // Patients can only cancel appointments
      if (status !== 'CANCELLED') {
        return NextResponse.json(
          { error: 'Patients can only cancel appointments' },
          { status: 403 }
        );
      }

      // Check if appointment is too soon to cancel (e.g., within 24 hours)
      const hoursTillAppointment = (new Date(appointment.startTime) - new Date()) / (1000 * 60 * 60);
      if (hoursTillAppointment < 24) {
        return NextResponse.json(
          { error: 'Cannot cancel appointment less than 24 hours before scheduled time. Please contact the clinic.' },
          { status: 400 }
        );
      }
    } else if (!['ADMIN', 'DOCTOR', 'RECEPTIONIST'].includes(user.role)) {
      return NextResponse.json(
        { error: 'Insufficient permissions' },
        { status: 403 }
      );
    }

    // Update the appointment
    const updatedAppointment = await prisma.appointment.update({
      where: { id },
      data: {
        status,
        ...(notes && { notes }),
      },
      include: {
        patient: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            phone: true,
            email: true,
            userId: true,
          },
        },
        doctor: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
        service: true,
      },
    });

    // Send notification for cancelled appointments
    if (status === 'CANCELLED' && updatedAppointment.patient.userId) {
      try {
        await notifyAppointmentCancelled({
          userId: updatedAppointment.patient.userId,
          appointment: updatedAppointment,
          clinicId: user.clinicId,
          reason: notes || '',
        });
      } catch (error) {
        console.error('Error sending cancellation notification:', error);
      }
    }

    return NextResponse.json(updatedAppointment);
  } catch (error) {
    console.error('Error updating appointment:', error);
    return NextResponse.json(
      { error: 'Failed to update appointment' },
      { status: 500 }
    );
  }
}
