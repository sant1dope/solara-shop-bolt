import { NextResponse } from 'next/server';
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
    const { message, email, errorDetails, userId } = await request.json();

    if (!message) {
      return new NextResponse('Message is required', { status: 400 });
    }

    await initializeGoogleSheet();

    // Get or create Feedback sheet
    let sheet = doc.sheetsByTitle['Feedback'];
    if (!sheet) {
      sheet = await doc.addSheet({
        title: 'Feedback',
        headerValues: [
          'date',
          'message',
          'email',
          'userId',
          'errorDetails',
          'status',
          'notes'
        ]
      });
    }

    // Add feedback to sheet
    await sheet.addRow({
      date: new Date().toISOString(),
      message,
      email: email || 'Anonymous',
      userId: userId || 'Not logged in',
      errorDetails: errorDetails || 'No error details',
      status: 'New',
      notes: ''
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error submitting feedback:', error);
    return new NextResponse('Internal Server Error', { status: 500 });
  }
}