import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '../../auth/[...nextauth]/route';
import { prisma } from '@/lib/prisma.jsx';

// PUT - Update role
export async function PUT(request, { params }) {
  try {
    const session = await getServerSession(authOptions);

    if (!session || session.user.role !== 'ADMIN') {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const { id } = params;
    const { name, description, permissions, color } = await request.json();

    // Validate permissions exist if provided
    if (permissions && permissions.length > 0) {
      const existingPermissions = await prisma.permission.findMany({
        where: {
          name: {
            in: permissions,
          },
        },
      });

      if (existingPermissions.length !== permissions.length) {
        const foundNames = existingPermissions.map(p => p.name);
        const missingPermissions = permissions.filter(p => !foundNames.includes(p));
        return NextResponse.json(
          { 
            error: 'Some permissions do not exist in the database',
            message: `Missing permissions: ${missingPermissions.join(', ')}. Please seed the database with permissions first.`,
            missingPermissions 
          },
          { status: 400 }
        );
      }
    }

    // Delete existing permissions
    await prisma.rolePermission.deleteMany({
      where: { roleId: id },
    });

    // Update role with new permissions
    const role = await prisma.role.update({
      where: { id },
      data: {
        name,
        description,
        color,
        permissions: permissions && permissions.length > 0 ? {
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

    return NextResponse.json(formattedRole);
  } catch (error) {
    console.error('Failed to update role:', error);
    return NextResponse.json(
      { error: 'Failed to update role' },
      { status: 500 }
    );
  }
}

// DELETE - Delete role
export async function DELETE(request, { params }) {
  try {
    const session = await getServerSession(authOptions);

    if (!session || session.user.role !== 'ADMIN') {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const { id } = params;

    // Check if role is in use
    // You would need to add a roleId field to User model to fully implement this
    // For now, we'll just delete

    await prisma.role.delete({
      where: { id },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Failed to delete role:', error);
    return NextResponse.json(
      { error: 'Failed to delete role' },
      { status: 500 }
    );
  }
}
