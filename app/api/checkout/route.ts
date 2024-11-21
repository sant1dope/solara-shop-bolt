import { NextResponse } from 'next/server';
import { createPaymentIntent, createPaymentMethod, attachPaymentIntent } from '@/lib/paymongo';
import { addOrderToSheet } from '@/lib/google-sheets';
import { sendOrderConfirmation } from '@/lib/gmail';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { amount, paymentMethod, orderData } = body;

    // Create PayMongo payment intent
    const paymentIntent = await createPaymentIntent(amount);

    // Create payment method
    const paymentMethodObj = await createPaymentMethod(paymentMethod.type, paymentMethod.details);

    // Attach payment method to payment intent
    const payment = await attachPaymentIntent(
      paymentIntent.id,
      paymentMethodObj.id
    );

    if (payment.status === 'succeeded') {
      // Record order in Google Sheets
      await addOrderToSheet({
        ...orderData,
        id: payment.id,
        status: 'paid',
        paymentMethod: paymentMethod.type,
      });

      // Send confirmation email
      await sendOrderConfirmation({
        ...orderData,
        id: payment.id,
      });

      return NextResponse.json({
        success: true,
        paymentId: payment.id,
      });
    }

    return NextResponse.json({
      success: false,
      error: 'Payment failed',
    });
  } catch (error) {
    console.error('Checkout error:', error);
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    );
  }
}