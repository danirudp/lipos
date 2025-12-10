import { PrismaClient } from '@prisma/client';
import { NextResponse } from 'next/server';

const prisma = new PrismaClient();

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { items, totalAmount, paymentMethod } = body;

    // Validation (Senior Developer Habit)
    if (!items || items.length === 0) {
      return NextResponse.json({ error: 'Cart is empty' }, { status: 400 });
    }

    // Create the Order AND OrderItems in one transaction
    const order = await prisma.order.create({
      data: {
        totalAmount: totalAmount,
        status: 'COMPLETED',
        paymentMethod: paymentMethod || 'CASH',
        items: {
          create: items.map((item: any) => ({
            productId: item.id,
            quantity: item.quantity,
            price: item.price, // Snapshot the price!
          })),
        },
      },
      include: {
        items: true, // Return the items so we can confirm to the user
      },
    });

    return NextResponse.json({ success: true, orderId: order.id });
  } catch (error) {
    console.error('Order Error:', error);
    return NextResponse.json(
      { error: 'Failed to process order' },
      { status: 500 }
    );
  }
}
