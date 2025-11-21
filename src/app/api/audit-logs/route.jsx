import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import { getUserAuditLogs, getClinicAuditLogs } from '@/lib/auditService';

// GET /api/audit-logs - Get audit logs
export async function GET(request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const { searchParams } = new URL(request.url);
    const scope = searchParams.get('scope') || 'user'; // 'user' or 'clinic'
    const limit = parseInt(searchParams.get('limit') || '50');
    const offset = parseInt(searchParams.get('offset') || '0');
    const action = searchParams.get('action');
    const resource = searchParams.get('resource');
    const startDate = searchParams.get('startDate');
    const endDate = searchParams.get('endDate');

    let logs, total;

    if (scope === 'clinic') {
      // Only admins can view clinic-wide audit logs
      if (session.user.role !== 'ADMIN') {
        return NextResponse.json(
          { error: 'Insufficient permissions' },
          { status: 403 }
        );
      }

      const result = await getClinicAuditLogs(session.user.clinicId, {
        limit,
        offset,
        action,
        resource,
        startDate,
        endDate,
      });
      
      logs = result.logs;
      total = result.total;
    } else {
      // Users can view their own audit logs
      const result = await getUserAuditLogs(session.user.id, {
        limit,
        offset,
        action,
        resource,
        startDate,
        endDate,
      });
      
      logs = result.logs;
      total = result.total;
    }

    return NextResponse.json({
      logs,
      total,
      limit,
      offset,
    });
  } catch (error) {
    console.error('Error fetching audit logs:', error);
    return NextResponse.json(
      { error: 'Failed to fetch audit logs' },
      { status: 500 }
    );
  }
}
