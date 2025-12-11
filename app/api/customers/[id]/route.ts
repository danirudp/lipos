import { PrismaClient } from '@prisma/client';
import { NextResponse } from 'next/server';

const prisma = new PrismaClient();

// PATCH: Update a specific customer
export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> } // Updated for Next.js 15
) {
  try {
    const { id } = await params;
    const body = await request.json();
    const { name, email, phone } = body;

    const customer = await prisma.customer.update({
      where: { id },
      data: { name, email, phone },
    });

    return NextResponse.json(customer);
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to update customer' },
      { status: 500 }
    );
  }
}

// DELETE: Remove a specific customer
export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    // Check if they have orders first (Senior logic: Don't break data integrity)
    const existingOrders = await prisma.order.findFirst({
      where: { customerId: id },
    });

    if (existingOrders) {
      return NextResponse.json(
        {
          error:
            'Cannot delete customer with existing orders. Archive them instead.',
        },
        { status: 400 }
      );
    }

    await prisma.customer.delete({
      where: { id },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to delete customer' },
      { status: 500 }
    );
  }
}
