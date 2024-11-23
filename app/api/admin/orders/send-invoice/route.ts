import { NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs';
import { GoogleSpreadsheet } from 'google-spreadsheet';
import { JWT } from 'google-auth-library';
import nodemailer from 'nodemailer';
import Handlebars from 'handlebars';
import { formatPrice } from '@/lib/utils';
import { isAdmin } from '@/lib/auth';

// ... (same initialization code as update-status)

const SCOPES = ['https://www.googleapis.com/auth/spreadsheets'];

function getPrivateKey() {
  if (process.env.GOOGLE_PRIVATE_KEY_BASE64) {
    return Buffer.from(process.env.GOOGLE_PRIVATE_KEY_BASE64, 'base64').toString();
  }
  return process.env.GOOGLE_PRIVATE_KEY?.replace(/\\n/g, '\n');
}

let jwt: JWT;
let doc: GoogleSpreadsheet;

async function initializeGoogleSheet() {
  if (!jwt) {
    const key = getPrivateKey();
    if (!key) {
      throw new Error('Private key is not set in environment variables');
    }
    jwt = new JWT({
      email: process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL,
      key: key,
      scopes: SCOPES,
    });
  }

  if (!doc) {
    const sheetId = process.env.GOOGLE_SHEETS_ID;
    if (!sheetId) {
      throw new Error('Google Sheets ID is not set in environment variables');
    }
    doc = new GoogleSpreadsheet(sheetId, jwt);
    await doc.loadInfo();
  }
}

const invoiceTemplate = `
<!DOCTYPE html>
<html>
<head>
  <style>
    body { font-family: Arial, sans-serif; line-height: 1.6; }
    .container { max-width: 600px; margin: 0 auto; padding: 20px; }
    .header { text-align: center; margin-bottom: 30px; }
    .order-details { margin-bottom: 30px; }
    .items { margin-bottom: 30px; }
    .total { text-align: right; font-weight: bold; }
    table { width: 100%; border-collapse: collapse; }
    th, td { padding: 10px; text-align: left; border-bottom: 1px solid #ddd; }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <h1>Order Invoice</h1>
      <p>Order #{{orderId}}</p>
      <p>{{date}}</p>
    </div>
    
    <div class="order-details">
      <h2>Customer Details</h2>
      <p><strong>Name:</strong> {{customerName}}</p>
      <p><strong>Email:</strong> {{email}}</p>
      <p><strong>Address:</strong> {{address}}</p>
      <p><strong>Contact:</strong> {{contactNumber}}</p>
    </div>

    <div class="items">
      <h2>Order Items</h2>
      <table>
        <thead>
          <tr>
            <th>Item</th>
            <th>Quantity</th>
            <th>Price</th>
            <th>Total</th>
          </tr>
        </thead>
        <tbody>
          {{#each items}}
          <tr>
            <td>{{name}}</td>
            <td>{{quantity}}</td>
            <td>{{price}}</td>
            <td>{{total}}</td>
          </tr>
          {{/each}}
        </tbody>
      </table>
    </div>

    <div class="total">
      <p>Subtotal: {{subtotal}}</p>
      <p>Shipping: {{shipping}}</p>
      <p>Total: {{total}}</p>
    </div>
  </div>
</body>
</html>
`;

export async function POST(request: Request) {
  try {
    const { userId } = auth();
    if (!userId || !isAdmin()) {
      return new NextResponse('Unauthorized', { status: 401 });
    }

    const { orderId } = await request.json();

    await initializeGoogleSheet();

    const sheet = doc.sheetsByTitle['Orders'];
    if (!sheet) {
      throw new Error('Orders sheet not found');
    }

    const rows = await sheet.getRows();
    const order = rows.find(row => row.get('orderId') === orderId);
    
    if (!order) {
      return new NextResponse('Order not found', { status: 404 });
    }

    const items = JSON.parse(order.get('items'));
    const subtotal = items.reduce((sum: number, item: any) => sum + (item.price * item.quantity), 0);
    const shipping = subtotal >= 500 ? 0 : 75;
    const total = subtotal + shipping;

    const template = Handlebars.compile(invoiceTemplate);
    const html = template({
      orderId: order.get('orderId'),
      date: new Date(order.get('date')).toLocaleDateString(),
      customerName: order.get('customerName'),
      email: order.get('email'),
      address: order.get('address'),
      contactNumber: order.get('contactNumber'),
      items: items.map((item: any) => ({
        ...item,
        price: formatPrice(item.price),
        total: formatPrice(item.price * item.quantity)
      })),
      subtotal: formatPrice(subtotal),
      shipping: shipping === 0 ? 'Free' : formatPrice(shipping),
      total: formatPrice(total)
    });

    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.GMAIL_EMAIL,
        pass: process.env.GMAIL_APP_PASSWORD
      }
    });

    await transporter.sendMail({
      from: process.env.GMAIL_EMAIL,
      to: order.get('email'),
      subject: `Invoice for Order #${orderId}`,
      html
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error sending invoice:', error);
    return new NextResponse('Internal Server Error', { status: 500 });
  }
}