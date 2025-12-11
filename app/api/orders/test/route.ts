// app/api/orders/test/route.ts (temporary)
import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  try {
    const data = await request.json();
    console.log('Test endpoint received:', data);

    return NextResponse.json({
      success: true,
      message: 'Test successful',
      receivedData: data,
      orderId: 'TEST-12345',
    });
  } catch (error) {
    console.error('Test endpoint error:', error);
    return NextResponse.json(
      { error: 'Test failed', details: String(error) },
      { status: 500 }
    );
  }
}
