import { GoogleSpreadsheet } from 'google-spreadsheet';
import { JWT } from 'google-auth-library';
import { Order } from './columns';

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

export async function getOrders(): Promise<Order[]> {
  await initializeGoogleSheet();

  const sheet = doc.sheetsByTitle['Orders'];
  if (!sheet) {
    throw new Error('Orders sheet not found');
  }

  await sheet.loadHeaderRow();
  const rows = await sheet.getRows();

  return rows.map(row => ({
    orderId: row.get('orderId'),
    date: row.get('date'),
    customerName: row.get('customerName'),
    email: row.get('email'),
    contactNumber: row.get('contactNumber'),
    address: row.get('address'),
    paymentMethod: row.get('paymentMethod'),
    totalAmount: parseFloat(row.get('totalAmount')),
    items: JSON.parse(row.get('items') || '[]'),
    status: row.get('status'),
    receiptUrl: row.get('receiptUrl'),
  }));
}