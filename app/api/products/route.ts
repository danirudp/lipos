import { PrismaClient } from '@prisma/client';
import { NextResponse } from 'next/server';

const prisma = new PrismaClient();

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { name, price, stock, category, image } = body;

    const product = await prisma.product.create({
      data: {
        name,
        price: parseFloat(price), // Ensure it's a number for Decimal
        stock: parseInt(stock),
        category,
        image: image || null, // Optional
      },
    });

    return NextResponse.json(product);
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to create product' },
      { status: 500 }
    );
  }
}
