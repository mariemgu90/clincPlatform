// Notification Service
// Centralized service for creating and managing notifications

import prisma from './prisma';

/**
 * Notification types
 */
export const NotificationType = {
  APPOINTMENT: 'appointment',
  PAYMENT: 'payment',
  REMINDER: 'reminder',
  SYSTEM: 'system',
  MESSAGE: 'message',
  PRESCRIPTION: 'prescription',
  INVOICE: 'invoice',
};

/**
 * Create a notification for a user
 * @param {Object} data - Notification data
 * @param {string} data.userId - User ID to notify
 * @param {string} data.type - Notification type
 * @param {string} data.title - Notification title
 * @param {string} data.message - Notification message
 * @param {string} data.clinicId - Optional clinic ID
 * @param {string} data.icon - Optional icon
 * @returns {Promise<Object>} Created notification
 */
export async function createNotification({ userId, type, title, message, clinicId, icon }) {
  try {
    const notification = await prisma.notification.create({
      data: {
        userId,
        type,
        title,
        message,
        clinicId,
        icon,
        read: false,
      },
    });

    return notification;
  } catch (error) {
    console.error('Error creating notification:', error);
    throw error;
  }
}

/**
 * Create appointment confirmation notification
 */
export async function notifyAppointmentConfirmed({ userId, appointment, clinicId }) {
  const date = new Date(appointment.startTime).toLocaleDateString('en-US', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
  const time = new Date(appointment.startTime).toLocaleTimeString('en-US', {
    hour: '2-digit',
    minute: '2-digit',
  });

  return createNotification({
    userId,
    type: NotificationType.APPOINTMENT,
    title: 'Appointment Confirmed',
    message: `Your appointment is confirmed for ${date} at ${time}.`,
    clinicId,
    icon: '📅',
  });
}

/**
 * Create appointment reminder notification
 */
export async function notifyAppointmentReminder({ userId, appointment, clinicId, hoursUntil = 24 }) {
  const date = new Date(appointment.startTime).toLocaleDateString('en-US', {
    weekday: 'long',
    month: 'short',
    day: 'numeric',
  });
  const time = new Date(appointment.startTime).toLocaleTimeString('en-US', {
    hour: '2-digit',
    minute: '2-digit',
  });

  return createNotification({
    userId,
    type: NotificationType.REMINDER,
    title: 'Appointment Reminder',
    message: `Reminder: Your appointment is in ${hoursUntil} hours on ${date} at ${time}.`,
    clinicId,
    icon: '⏰',
  });
}

/**
 * Create appointment cancelled notification
 */
export async function notifyAppointmentCancelled({ userId, appointment, clinicId, reason }) {
  const date = new Date(appointment.startTime).toLocaleDateString('en-US', {
    weekday: 'long',
    month: 'long',
    day: 'numeric',
  });

  return createNotification({
    userId,
    type: NotificationType.APPOINTMENT,
    title: 'Appointment Cancelled',
    message: `Your appointment on ${date} has been cancelled. ${reason ? `Reason: ${reason}` : ''}`,
    clinicId,
    icon: '❌',
  });
}

/**
 * Create invoice notification
 */
export async function notifyNewInvoice({ userId, invoice, clinicId }) {
  return createNotification({
    userId,
    type: NotificationType.INVOICE,
    title: 'New Invoice',
    message: `You have a new invoice #${invoice.invoiceNumber} for $${invoice.totalAmount.toFixed(2)}.`,
    clinicId,
    icon: '💵',
  });
}

/**
 * Create payment confirmation notification
 */
export async function notifyPaymentReceived({ userId, invoice, clinicId }) {
  return createNotification({
    userId,
    type: NotificationType.PAYMENT,
    title: 'Payment Received',
    message: `Payment of $${invoice.paidAmount.toFixed(2)} received for invoice #${invoice.invoiceNumber}.`,
    clinicId,
    icon: '✅',
  });
}

/**
 * Create prescription ready notification
 */
export async function notifyPrescriptionReady({ userId, prescription, clinicId }) {
  return createNotification({
    userId,
    type: NotificationType.PRESCRIPTION,
    title: 'Prescription Ready',
    message: 'Your prescription is ready for download.',
    clinicId,
    icon: '💊',
  });
}

/**
 * Send bulk notifications to multiple users
 */
export async function sendBulkNotifications(notifications) {
  try {
    const results = await prisma.notification.createMany({
      data: notifications.map(notif => ({
        userId: notif.userId,
        type: notif.type,
        title: notif.title,
        message: notif.message,
        clinicId: notif.clinicId,
        icon: notif.icon,
        read: false,
      })),
    });

    return results;
  } catch (error) {
    console.error('Error sending bulk notifications:', error);
    throw error;
  }
}

/**
 * Get unread notification count for a user
 */
export async function getUnreadCount(userId) {
  try {
    const count = await prisma.notification.count({
      where: {
        userId,
        read: false,
      },
    });

    return count;
  } catch (error) {
    console.error('Error getting unread count:', error);
    return 0;
  }
}

/**
 * Mark notification as read
 */
export async function markAsRead(notificationId) {
  try {
    return await prisma.notification.update({
      where: { id: notificationId },
      data: { read: true },
    });
  } catch (error) {
    console.error('Error marking notification as read:', error);
    throw error;
  }
}

/**
 * Mark all notifications as read for a user
 */
export async function markAllAsRead(userId) {
  try {
    return await prisma.notification.updateMany({
      where: {
        userId,
        read: false,
      },
      data: { read: true },
    });
  } catch (error) {
    console.error('Error marking all as read:', error);
    throw error;
  }
}

/**
 * Delete old notifications (older than specified days)
 */
export async function deleteOldNotifications(days = 30) {
  try {
    const cutoffDate = new Date();
    cutoffDate.setDate(cutoffDate.getDate() - days);

    return await prisma.notification.deleteMany({
      where: {
        createdAt: {
          lt: cutoffDate,
        },
        read: true,
      },
    });
  } catch (error) {
    console.error('Error deleting old notifications:', error);
    throw error;
  }
}
