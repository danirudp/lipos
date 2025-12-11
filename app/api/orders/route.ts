import { PrismaClient } from '@prisma/client';
import { NextResponse } from 'next/server';

const prisma = new PrismaClient();

export async function POST(request: Request) {
  try {
    const body = await request.json();

    // Log the received data for debugging
    console.log('=== API /orders RECEIVED ===');
    console.log('Full body:', JSON.stringify(body, null, 2));
    console.log('Items count:', body.items?.length);
    console.log('Total amount:', body.totalAmount);
    console.log('Customer ID:', body.customerId);
    console.log('============================');

    const { items, totalAmount, customerId } = body;

    if (!items || items.length === 0 || totalAmount === undefined) {
      console.error('Validation failed: Missing items or totalAmount');
      return NextResponse.json(
        { error: 'Invalid order data: Missing items or total amount' },
        { status: 400 }
      );
    }

    // Validate each item
    for (const item of items) {
      if (!item.id || !item.quantity || !item.price) {
        console.error('Invalid item:', item);
        return NextResponse.json(
          { error: `Invalid item data: ${JSON.stringify(item)}` },
          { status: 400 }
        );
      }

      // Check if product exists
      const product = await prisma.product.findUnique({
        where: { id: item.id },
        select: { id: true, stock: true, name: true },
      });

      if (!product) {
        console.error(`Product not found: ${item.id}`);
        return NextResponse.json(
          { error: `Product not found: ${item.id}` },
          { status: 404 }
        );
      }

      if (product.stock < item.quantity) {
        console.error(
          `Insufficient stock for ${product.name}: ${product.stock} available, ${item.quantity} requested`
        );
        return NextResponse.json(
          { error: `Insufficient stock for ${product.name}` },
          { status: 400 }
        );
      }

      console.log(
        `Product ${product.name}: Stock ${product.stock}, Requested ${item.quantity}`
      );
    }

    // Using a transaction ensures that all database operations succeed or fail together.
    const result = await prisma.$transaction(async (tx) => {
      // 1. Create the main Order record
      const order = await tx.order.create({
        data: {
          totalAmount: parseFloat(totalAmount),
          customerId: customerId || null,
          status: 'COMPLETED',
        },
      });

      console.log('Order created:', order.id);

      // 2. Prepare Order Items (linking products to the new order)
      const orderItemActions = items.map((item: any) =>
        tx.orderItem.create({
          data: {
            orderId: order.id,
            productId: item.id,
            quantity: parseInt(item.quantity),
            price: parseFloat(item.price),
          },
        })
      );

      // 3. Prepare Stock Update actions (Decrementing product inventory)
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

      // Execute all OrderItem creations and Stock updates concurrently
      await Promise.all([...orderItemActions, ...stockUpdateActions]);

      console.log('Order items and stock updates completed');

      return order;
    });

    // Success response to client-side
    return NextResponse.json({
      success: true,
      orderId: result.id,
      message: 'Order placed successfully!',
    });
  } catch (error: any) {
    console.error('=== CHECKOUT TRANSACTION FAILED ===');
    console.error('Error:', error);
    console.error('Error message:', error.message);
    console.error('Error stack:', error.stack);
    console.error('===============================');

    // Return a more specific error message
    return NextResponse.json(
      {
        error: 'Failed to process checkout transaction.',
        details: error.message,
      },
      { status: 500 }
    );
  }
}
