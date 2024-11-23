import { NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs';
import { GoogleSpreadsheet } from 'google-spreadsheet';
import { JWT } from 'google-auth-library';
import nodemailer from 'nodemailer';
import Handlebars from 'handlebars';
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

const thankYouTemplate = `
<!DOCTYPE html>
<html>
<head>
  <style>
    body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
    .container { max-width: 600px; margin: 0 auto; padding: 20px; }
    .header { text-align: center; margin-bottom: 30px; }
    .content { margin-bottom: 30px; }
    .footer { text-align: center; color: #666; font-size: 0.9em; }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <h1>Thank You for Your Purchase!</h1>
    </div>
    
    <div class="content">
      <p>Dear {{customerName}},</p>
      
      <p>Thank you for shopping with Solara! We truly appreciate your business and trust in our products.</p>
      
      <p>Your order (#{{orderId}}) has been received and is being processed. We'll make sure to keep you updated on its status.</p>
      
      <p>If you have any questions about your order, feel free to contact us:</p>
      <ul>
        <li>Email: support@solara.com</li>
        <li>Phone: +63 (2) 8123 4567</li>
      </ul>
      
      <p>We hope you'll love your new items!</p>
    </div>
    
    <div class="footer">
      <p>Best regards,<br>The Solara Team</p>
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

    const template = Handlebars.compile(thankYouTemplate);
    const html = template({
      customerName: order.get('customerName'),
      orderId: order.get('orderId')
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
      subject: 'Thank You for Your Solara Purchase!',
      html
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error sending thank you email:', error);
    return new NextResponse('Internal Server Error', { status: 500 });
  }
}