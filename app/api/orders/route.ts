import { PrismaClient } from '@prisma/client';
import { NextResponse } from 'next/server';

const prisma = new PrismaClient();

export async function POST(request: Request) {
  try {
    const body = await request.json();

    // Log the received data for debugging
    console.log('=== API /orders RECEIVED ===');
    console.log('Items count:', body.items?.length);
    console.log('Total amount:', body.totalAmount);
    console.log('============================');

    const { items, totalAmount, customerId } = body;

    if (!items || items.length === 0 || totalAmount === undefined) {
      return NextResponse.json(
        { error: 'Invalid order data: Missing items or total amount' },
        { status: 400 }
      );
    }

    // --- 1. PRE-TRANSACTION VALIDATION ---
    // We check stock BEFORE starting the transaction to save resources.
    for (const item of items) {
      if (!item.id || !item.quantity || !item.price) {
        return NextResponse.json(
          { error: `Invalid item data: ${JSON.stringify(item)}` },
          { status: 400 }
        );
      }

      const product = await prisma.product.findUnique({
        where: { id: item.id },
        select: { id: true, stock: true, name: true },
      });

      if (!product) {
        return NextResponse.json(
          { error: `Product not found: ${item.id}` },
          { status: 404 }
        );
      }

      if (product.stock < item.quantity) {
        return NextResponse.json(
          { error: `Insufficient stock for ${product.name}` },
          { status: 400 }
        );
      }
    }

    // --- 2. THE TRANSACTION ---
    const result = await prisma.$transaction(async (tx) => {
      // Step A: Create the Main Order
      const order = await tx.order.create({
        data: {
          totalAmount: parseFloat(totalAmount),
          customerId: customerId || null,
          status: 'COMPLETED',
        },
      });

      console.log('Order created:', order.id);

      // Step B: Bulk Create Order Items (OPTIMIZED FIX)
      // This runs ONE query instead of looping N times
      await tx.orderItem.createMany({
        data: items.map((item: any) => ({
          orderId: order.id,
          productId: item.id,
          quantity: parseInt(item.quantity),
          price: parseFloat(item.price),
        })),
      });

      // Step C: Update Stock (Decrement inventory)
      // We still map these because each update is unique to a product ID
      const stockUpdateActions = items.map((item: any) =>
        tx.product.update({
          where: { id: item.id },
          data: {
            stock: {
              decrement: parseInt(item.quantity),
            },
          },
        })
      );

      // Execute all stock updates in parallel
      await Promise.all(stockUpdateActions);

      return order;
    });

    // --- 3. SUCCESS RESPONSE ---
    return NextResponse.json({
      success: true,
      orderId: result.id,
      message: 'Order placed successfully!',
    });
  } catch (error: any) {
    console.error('=== CHECKOUT TRANSACTION FAILED ===');
    console.error('Error message:', error.message);

    // Check if it's still a timeout (unlikely now, but good to handle)
    if (error.message.includes('Transaction already closed')) {
      return NextResponse.json(
        { error: 'System busy. Please try processing the order again.' },
        { status: 504 }
      );
    }

    return NextResponse.json(
      {
        error: 'Failed to process checkout transaction.',
        details: error.message,
      },
      { status: 500 }
    );
  }
}
