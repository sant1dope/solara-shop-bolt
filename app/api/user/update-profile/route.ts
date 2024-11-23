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

export async function POST(request: Request) {
  try {
    const { userId } = auth();
    if (!userId) {
      return new NextResponse('Unauthorized', { status: 401 });
    }

    const { fullName, address, contactNumber } = await request.json();
    if (!fullName || !address || !contactNumber) {
      return new NextResponse('All fields are required', { status: 400 });
    }

    await initializeGoogleSheet();

    let sheet = doc.sheetsByTitle['Users'];
    if (!sheet) {
      sheet = await doc.addSheet({ 
        title: 'Users', 
        headerValues: ['userId', 'fullName', 'address', 'contactNumber'] 
      });
    }

    await sheet.loadHeaderRow();
    const rows = await sheet.getRows();
    const userRow = rows.find(row => row.get('userId') === userId);

    if (userRow) {
      userRow.set('fullName', fullName);
      userRow.set('address', address);
      userRow.set('contactNumber', contactNumber);
      await userRow.save();
    } else {
      await sheet.addRow({ 
        userId, 
        fullName, 
        address, 
        contactNumber 
      });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error updating profile:', error);
    return new NextResponse('Internal Server Error', { status: 500 });
  }
}