import { NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs';
import { GoogleSpreadsheet } from 'google-spreadsheet';
import { JWT } from 'google-auth-library';

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

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const { userId } = auth();
    if (!userId) {
      return new NextResponse('Unauthorized', { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const email = searchParams.get('email');

    if (!email) {
      return new NextResponse('Email is required', { status: 400 });
    }

    await initializeGoogleSheet();

    const sheet = doc.sheetsByTitle['Orders'];
    if (!sheet) {
      throw new Error('Orders sheet not found');
    }

    await sheet.loadHeaderRow();
    const rows = await sheet.getRows();
    
    const orderRow = rows.find(row => 
      row.get('orderId') === params.id && 
      row.get('email').toLowerCase() === email.toLowerCase()
    );
    
    if (!orderRow) {
      return new NextResponse('Order not found', { status: 404 });
    }

    const order = {
      orderId: orderRow.get('orderId'),
      date: orderRow.get('date'),
      customerName: orderRow.get('customerName'),
      email: orderRow.get('email'),
      contactNumber: orderRow.get('contactNumber'),
      address: orderRow.get('address'),
      paymentMethod: orderRow.get('paymentMethod'),
      totalAmount: parseFloat(orderRow.get('totalAmount')),
      items: JSON.parse(orderRow.get('items') || '[]'),
      status: orderRow.get('status'),
      receiptUrl: orderRow.get('receiptUrl'),
    };

    return NextResponse.json(order);
  } catch (error) {
    console.error('Error fetching order:', error);
    return new NextResponse('Internal Server Error', { status: 500 });
  }
}