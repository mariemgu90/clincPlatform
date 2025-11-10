// Audit Log Service
// Centralized service for tracking user actions for compliance and security

import prisma from './prisma';

/**
 * Audit actions enum
 */
export const AuditAction = {
  // Authentication
  LOGIN: 'LOGIN',
  LOGOUT: 'LOGOUT',
  LOGIN_FAILED: 'LOGIN_FAILED',
  PASSWORD_RESET: 'PASSWORD_RESET',
  
  // CRUD operations
  CREATE: 'CREATE',
  READ: 'READ',
  UPDATE: 'UPDATE',
  DELETE: 'DELETE',
  
  // Specific actions
  VIEW: 'VIEW',
  DOWNLOAD: 'DOWNLOAD',
  UPLOAD: 'UPLOAD',
  EXPORT: 'EXPORT',
  IMPORT: 'IMPORT',
  
  // Payment
  PAYMENT_INITIATED: 'PAYMENT_INITIATED',
  PAYMENT_COMPLETED: 'PAYMENT_COMPLETED',
  PAYMENT_FAILED: 'PAYMENT_FAILED',
};

/**
 * Resource types
 */
export const AuditResource = {
  USER: 'USER',
  PATIENT: 'PATIENT',
  APPOINTMENT: 'APPOINTMENT',
  CONSULTATION: 'CONSULTATION',
  PRESCRIPTION: 'PRESCRIPTION',
  INVOICE: 'INVOICE',
  PAYMENT: 'PAYMENT',
  MEDICAL_RECORD: 'MEDICAL_RECORD',
  CLINIC: 'CLINIC',
  SERVICE: 'SERVICE',
  ROLE: 'ROLE',
  PERMISSION: 'PERMISSION',
};

/**
 * Create an audit log entry
 * @param {Object} data - Audit log data
 */
export async function createAuditLog({
  userId,
  userEmail,
  userRole,
  action,
  resource,
  resourceId,
  ipAddress,
  userAgent,
  method,
  endpoint,
  changes,
  metadata,
  status = 'SUCCESS',
  errorMessage,
  clinicId,
}) {
  try {
    const auditLog = await prisma.auditLog.create({
      data: {
        userId,
        userEmail,
        userRole,
        action,
        resource,
        resourceId,
        ipAddress,
        userAgent,
        method,
        endpoint,
        changes,
        metadata,
        status,
        errorMessage,
        clinicId,
      },
    });

    return auditLog;
  } catch (error) {
    // Don't fail the main operation if audit logging fails
    console.error('Error creating audit log:', error);
    return null;
  }
}

/**
 * Log user authentication
 */
export async function logAuth({ userId, userEmail, userRole, action, ipAddress, userAgent, status = 'SUCCESS', errorMessage, clinicId }) {
  return createAuditLog({
    userId,
    userEmail,
    userRole,
    action,
    resource: AuditResource.USER,
    ipAddress,
    userAgent,
    method: 'POST',
    endpoint: '/api/auth',
    status,
    errorMessage,
    clinicId,
  });
}

/**
 * Log data access
 */
export async function logDataAccess({ userId, userEmail, userRole, resource, resourceId, action = AuditAction.VIEW, ipAddress, userAgent, clinicId }) {
  return createAuditLog({
    userId,
    userEmail,
    userRole,
    action,
    resource,
    resourceId,
    ipAddress,
    userAgent,
    method: 'GET',
    clinicId,
  });
}

/**
 * Log data modification
 */
export async function logDataModification({
  userId,
  userEmail,
  userRole,
  action,
  resource,
  resourceId,
  changes,
  ipAddress,
  userAgent,
  method,
  endpoint,
  clinicId,
}) {
  return createAuditLog({
    userId,
    userEmail,
    userRole,
    action,
    resource,
    resourceId,
    changes,
    ipAddress,
    userAgent,
    method,
    endpoint,
    clinicId,
  });
}

/**
 * Log file operations
 */
export async function logFileOperation({ userId, userEmail, userRole, action, resource, resourceId, filename, ipAddress, userAgent, clinicId }) {
  return createAuditLog({
    userId,
    userEmail,
    userRole,
    action,
    resource,
    resourceId,
    metadata: { filename },
    ipAddress,
    userAgent,
    clinicId,
  });
}

/**
 * Log payment operations
 */
export async function logPayment({
  userId,
  userEmail,
  userRole,
  action,
  invoiceId,
  amount,
  paymentMethod,
  status = 'SUCCESS',
  errorMessage,
  ipAddress,
  userAgent,
  clinicId,
}) {
  return createAuditLog({
    userId,
    userEmail,
    userRole,
    action,
    resource: AuditResource.PAYMENT,
    resourceId: invoiceId,
    metadata: { amount, paymentMethod },
    status,
    errorMessage,
    ipAddress,
    userAgent,
    clinicId,
  });
}

/**
 * Get audit logs for a user
 */
export async function getUserAuditLogs(userId, { limit = 50, offset = 0, action, resource, startDate, endDate } = {}) {
  try {
    const where = {
      userId,
      ...(action && { action }),
      ...(resource && { resource }),
      ...(startDate || endDate ? {
        createdAt: {
          ...(startDate && { gte: new Date(startDate) }),
          ...(endDate && { lte: new Date(endDate) }),
        },
      } : {}),
    };

    const logs = await prisma.auditLog.findMany({
      where,
      orderBy: { createdAt: 'desc' },
      take: limit,
      skip: offset,
    });

    const total = await prisma.auditLog.count({ where });

    return { logs, total };
  } catch (error) {
    console.error('Error fetching user audit logs:', error);
    return { logs: [], total: 0 };
  }
}

/**
 * Get audit logs for a clinic
 */
export async function getClinicAuditLogs(clinicId, { limit = 100, offset = 0, action, resource, userId, startDate, endDate } = {}) {
  try {
    const where = {
      clinicId,
      ...(action && { action }),
      ...(resource && { resource }),
      ...(userId && { userId }),
      ...(startDate || endDate ? {
        createdAt: {
          ...(startDate && { gte: new Date(startDate) }),
          ...(endDate && { lte: new Date(endDate) }),
        },
      } : {}),
    };

    const logs = await prisma.auditLog.findMany({
      where,
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
            role: true,
          },
        },
      },
      orderBy: { createdAt: 'desc' },
      take: limit,
      skip: offset,
    });

    const total = await prisma.auditLog.count({ where });

    return { logs, total };
  } catch (error) {
    console.error('Error fetching clinic audit logs:', error);
    return { logs: [], total: 0 };
  }
}

/**
 * Get audit logs for a specific resource
 */
export async function getResourceAuditLogs(resource, resourceId, { limit = 50 } = {}) {
  try {
    const logs = await prisma.auditLog.findMany({
      where: {
        resource,
        resourceId,
      },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
            role: true,
          },
        },
      },
      orderBy: { createdAt: 'desc' },
      take: limit,
    });

    return logs;
  } catch (error) {
    console.error('Error fetching resource audit logs:', error);
    return [];
  }
}

/**
 * Cleanup old audit logs (for data retention policies)
 */
export async function cleanupOldAuditLogs(days = 90) {
  try {
    const cutoffDate = new Date();
    cutoffDate.setDate(cutoffDate.getDate() - days);

    const result = await prisma.auditLog.deleteMany({
      where: {
        createdAt: {
          lt: cutoffDate,
        },
      },
    });

    console.log(`Deleted ${result.count} audit logs older than ${days} days`);
    return result;
  } catch (error) {
    console.error('Error cleaning up old audit logs:', error);
    throw error;
  }
}

/**
 * Extract request metadata from Next.js request
 */
export function extractRequestMetadata(request) {
  const headers = request.headers;
  
  return {
    ipAddress: headers.get('x-forwarded-for') || headers.get('x-real-ip') || 'unknown',
    userAgent: headers.get('user-agent') || 'unknown',
    method: request.method,
    endpoint: request.url,
  };
}
