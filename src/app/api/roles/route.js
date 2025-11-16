import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '../auth/[...nextauth]/route';
import { prisma } from '@/lib/prisma';

// GET - Fetch all roles
export async function GET(request) {
  try {
    const session = await getServerSession(authOptions);

    if (!session || session.user.role !== 'ADMIN') {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const roles = await prisma.role.findMany({
      include: {
        permissions: {
          include: {
            permission: true,
          },
        },
      },
      orderBy: {
        createdAt: 'asc',
      },
    });

    // Transform data for frontend
    const formattedRoles = roles.map(role => ({
      id: role.id,
      name: role.name,
      description: role.description,
      color: role.color,
      staffCount: role.staffCount,
      permissions: role.permissions.map(rp => rp.permission.name),
      createdAt: role.createdAt,
      updatedAt: role.updatedAt,
    }));

    return NextResponse.json(formattedRoles);
  } catch (error) {
    console.error('Failed to fetch roles:', error);
    return NextResponse.json(
      { error: 'Failed to fetch roles' },
      { status: 500 }
    );
  }
}

// POST - Create new role
export async function POST(request) {
  try {
    const session = await getServerSession(authOptions);

    if (!session || session.user.role !== 'ADMIN') {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const { name, description, permissions, color } = await request.json();

    if (!name) {
      return NextResponse.json(
        { error: 'Role name is required' },
        { status: 400 }
      );
    }

    // Validate permissions exist if provided
    if (permissions && Array.isArray(permissions) && permissions.length > 0) {
      const existingPermissions = await prisma.permission.findMany({
        where: {
          name: {
            in: permissions,
          },
        },
      });

      const existingPermissionNames = existingPermissions.map(p => p.name);
      const missingPermissions = permissions.filter(p => !existingPermissionNames.includes(p));

      if (missingPermissions.length > 0) {
        return NextResponse.json(
          { error: `Permissions not found: ${missingPermissions.join(', ')}. Please seed the database with permissions first.` },
          { status: 400 }
        );
      }
    }

    // Create role with permissions
    const role = await prisma.role.create({
      data: {
        name,
        description,
        color: color || 'indigo',
        permissions: permissions && Array.isArray(permissions) && permissions.length > 0 ? {
          create: permissions.map(permissionName => ({
            permission: {
              connect: { name: permissionName },
            },
          })),
        } : undefined,
      },
      include: {
        permissions: {
          include: {
            permission: true,
          },
        },
      },
    });

    // Format response
    const formattedRole = {
      id: role.id,
      name: role.name,
      description: role.description,
      color: role.color,
      staffCount: role.staffCount,
      permissions: role.permissions.map(rp => rp.permission.name),
    };

    return NextResponse.json(formattedRole, { status: 201 });
  } catch (error) {
    console.error('Failed to create role:', error);
    
    // Return detailed error message
    const errorMessage = error.message || 'Failed to create role';
    return NextResponse.json(
      { error: errorMessage, message: errorMessage },
      { status: 500 }
    );
  }
}
