import { NextResponse } from 'next/server';
import { GoogleSpreadsheet } from 'google-spreadsheet';
import { JWT } from 'google-auth-library';
import nodemailer from 'nodemailer';
import { formatPrice } from '@/lib/utils';

const SCOPES = ['https://www.googleapis.com/auth/spreadsheets'];

function getPrivateKey() {
  if (process.env.GOOGLE_PRIVATE_KEY_BASE64) {
    return Buffer.from(process.env.GOOGLE_PRIVATE_KEY_BASE64, 'base64').toString();
  }
  return process.env.GOOGLE_PRIVATE_KEY?.replace(/\\n/g, '\n');
}

async function sendAdminNotification(orderData: any) {
  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.GMAIL_EMAIL,
      pass: process.env.GMAIL_APP_PASSWORD,
    },
  });

  const adminEmails = process.env.ADMIN_EMAILS?.split(',').map(email => email.trim()) || [];
  
  if (adminEmails.length === 0) {
    console.warn('No admin emails configured');
    return;
  }

  const itemsList = orderData.items
    .map((item: any) => 
      `${item.name} x ${item.quantity} - ${formatPrice(item.price * item.quantity)}`
    )
    .join('\n');

  const emailContent = `
    <h2>New Order Notification</h2>
    <p><strong>Order ID:</strong> ${orderData.orderId}</p>
    <p><strong>Customer:</strong> ${orderData.customerName}</p>
    <p><strong>Email:</strong> ${orderData.email}</p>
    <p><strong>Contact:</strong> ${orderData.contactNumber}</p>
    <p><strong>Address:</strong> ${orderData.address}</p>
    <p><strong>Payment Method:</strong> ${orderData.paymentMethod}</p>
    
    <h3>Order Items:</h3>
    <pre>${itemsList}</pre>
    
    <p><strong>Total Amount:</strong> ${formatPrice(orderData.totalAmount)}</p>
    
    <p>Please check the admin dashboard for more details.</p>
  `;

  const mailOptions = {
    from: process.env.GMAIL_EMAIL,
    to: adminEmails.join(','),
    subject: `New Order Notification - ${orderData.orderId}`,
    html: emailContent,
  };

  await transporter.sendMail(mailOptions);
}

export async function POST(request: Request) {
  try {
    const orderData = await request.json();

    if (!orderData.orderId || !orderData.customerName || !orderData.items) {
      return NextResponse.json(
        { success: false, error: 'Missing required order data' },
        { status: 400 }
      );
    }

    await sendAdminNotification(orderData);

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error sending admin notification:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to send notification' },
      { status: 500 }
    );
  }
}