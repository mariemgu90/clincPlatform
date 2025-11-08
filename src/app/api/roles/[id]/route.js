import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '../../auth/[...nextauth]/route';
import { prisma } from '@/lib/prisma';

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
        permissions: {
          create: permissions.map(permissionName => ({
            permission: {
              connect: { name: permissionName },
            },
          })),
        },
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
