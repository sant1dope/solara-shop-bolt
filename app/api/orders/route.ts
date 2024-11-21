import { NextResponse } from 'next/server';
import { GoogleSpreadsheet } from 'google-spreadsheet';
import { JWT } from 'google-auth-library';

const SCOPES = [
  'https://www.googleapis.com/auth/spreadsheets',
  'https://www.googleapis.com/auth/drive.file',
];

function getPrivateKey() {
  if (process.env.GOOGLE_PRIVATE_KEY_BASE64) {
    return Buffer.from(process.env.GOOGLE_PRIVATE_KEY_BASE64, 'base64').toString();
  }
  throw new Error('GOOGLE_PRIVATE_KEY_BASE64 is not set');
}

let jwt: JWT;
let doc: GoogleSpreadsheet;

async function initializeGoogleSheet() {
  if (!jwt) {
    const key = getPrivateKey();
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

  return doc;
}

async function addOrder(orderData: any) {
  try {
    const doc = await initializeGoogleSheet();
    const sheet = doc.sheetsByTitle['Orders'];
    
    if (!sheet) {
      throw new Error('Orders sheet not found');
    }

    // Load header row first
    await sheet.loadHeaderRow();

    // Create order row
    const orderId = `ORD${Date.now()}`;
    const row = {
      orderId,
      date: new Date().toISOString(),
      customerName: orderData.name,
      email: orderData.email || 'N/A',
      contactNumber: orderData.contactNumber,
      address: orderData.address,
      paymentMethod: orderData.paymentMethod,
      totalAmount: orderData.amount.toFixed(2),
      items: JSON.stringify(orderData.items),
      status: 'Pending',
      receiptUrl: ''
    };

    // Add row to sheet
    await sheet.addRow(row);
    return orderId;
  } catch (error) {
    console.error('Error adding order:', error);
    throw error;
  }
}

export async function POST(request: Request) {
  try {
    const orderData = await request.json();
    
    // Validate required fields
    const requiredFields = ['name', 'contactNumber', 'address', 'paymentMethod', 'amount', 'items'];
    const missingFields = requiredFields.filter(field => !orderData[field]);

    if (missingFields.length > 0) {
      return NextResponse.json(
        { 
          success: false, 
          error: `Missing required fields: ${missingFields.join(', ')}` 
        },
        { status: 400 }
      );
    }

    // Validate items array
    if (!Array.isArray(orderData.items) || orderData.items.length === 0) {
      return NextResponse.json(
        { 
          success: false, 
          error: 'Order must contain at least one item' 
        },
        { status: 400 }
      );
    }

    const orderId = await addOrder(orderData);
    
    return NextResponse.json({
      success: true,
      orderId
    });
  } catch (error) {
    console.error('Error in orders API:', error);
    const message = error instanceof Error ? error.message : 'Failed to create order';
    return NextResponse.json(
      { success: false, error: message },
      { status: 500 }
    );
  }
}