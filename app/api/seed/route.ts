import { PrismaClient } from '@prisma/client';
import { NextResponse } from 'next/server';

const prisma = new PrismaClient();

export async function GET() {
  try {
    // 1. Clean up existing data
    await prisma.product.deleteMany();
    await prisma.customer.deleteMany();

    // 2. Create Products
    await prisma.product.createMany({
      data: [
        {
          name: 'Wireless Noise Cancelling Headphones',
          description: 'Premium over-ear headphones with 30h battery life.',
          price: 299.99,
          stock: 50,
          category: 'Electronics',
          image:
            'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=800&q=80',
        },
        {
          name: 'Mechanical Gaming Keyboard',
          description: 'RGB backlit, blue switches, compact design.',
          price: 129.5,
          stock: 30,
          category: 'Electronics',
          image:
            'https://images.unsplash.com/photo-1511467687858-23d96c32e4ae?w=800&q=80',
        },
        {
          name: 'Smart Watch Series 7',
          description: 'Health tracking, GPS, waterproof.',
          price: 399.0,
          stock: 25,
          category: 'Wearables',
          image:
            'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=800&q=80',
        },
        {
          name: '4K Monitor 27-inch',
          description: 'IPS display, 144Hz refresh rate, HDR support.',
          price: 450.0,
          stock: 15,
          category: 'Electronics',
          image:
            'https://images.unsplash.com/photo-1527443224154-c4a3942d3acf?w=800&q=80',
        },
        {
          name: 'Ergonomic Office Chair',
          description: 'Mesh back, adjustable lumbar support.',
          price: 199.99,
          stock: 10,
          category: 'Furniture',
          image:
            'https://images.unsplash.com/photo-1592078615290-033ee584e267?w=800&q=80',
        },
        {
          name: 'USB-C Hub Multiport',
          description: 'HDMI, USB 3.0, SD Card Reader.',
          price: 45.99,
          stock: 100,
          category: 'Accessories',
          image:
            'https://images.unsplash.com/photo-1611186871348-b1ce696e52c9?w=800&q=80',
        },
      ],
    });

    // 3. Create a Dummy Customer
    await prisma.customer.create({
      data: {
        name: 'John Doe (Walk-in)',
        email: 'walkin@example.com',
        phone: '0771234567',
      },
    });

    return NextResponse.json({ message: 'Database seeded successfully!' });
  } catch (error) {
    return NextResponse.json(
      { error: 'Seeding failed', details: error },
      { status: 500 }
    );
  }
}
