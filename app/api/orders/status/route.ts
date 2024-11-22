import { NextResponse } from 'next/server';
import { GoogleSpreadsheet } from 'google-spreadsheet';
import { JWT } from 'google-auth-library';

const SCOPES = [
  'https://www.googleapis.com/auth/spreadsheets',
];

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

async function getOrderStatus(orderId: string, email: string) {
  await initializeGoogleSheet();

  const sheet = doc.sheetsByTitle['Orders'];
  if (!sheet) {
    throw new Error('Orders sheet not found');
  }

  await sheet.loadHeaderRow();
  const rows = await sheet.getRows();

  const order = rows.find(
    row => row.get('orderId') === orderId && row.get('email').toLowerCase() === email.toLowerCase()
  );

  if (!order) {
    throw new Error('Order not found');
  }

  return {
    orderId: order.get('orderId'),
    status: order.get('status'),
    date: order.get('date'),
    totalAmount: order.get('totalAmount'),
    items: JSON.parse(order.get('items') || '[]'),
  };
}

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const orderId = searchParams.get('orderId');
    const email = searchParams.get('email');

    if (!orderId || !email) {
      return NextResponse.json(
        { error: 'Order ID and email are required' },
        { status: 400 }
      );
    }

    const orderStatus = await getOrderStatus(orderId, email);
    return NextResponse.json(orderStatus);
  } catch (error) {
    console.error('Error fetching order status:', error);
    const message = error instanceof Error ? error.message : 'An unknown error occurred';
    return NextResponse.json({ error: message }, { status: 404 });
  }
}