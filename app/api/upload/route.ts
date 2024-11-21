import { NextResponse } from 'next/server';
import { GoogleSpreadsheet } from 'google-spreadsheet';
import { JWT } from 'google-auth-library';
import { google } from 'googleapis';
import { Readable } from 'stream';

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

async function uploadToDrive(fileBuffer: Buffer, fileName: string, mimeType: string): Promise<string> {
  const auth = new google.auth.JWT({
    email: process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL,
    key: getPrivateKey(),
    scopes: ['https://www.googleapis.com/auth/drive.file']
  });

  const drive = google.drive({ version: 'v3', auth });

  // Create a folder if it doesn't exist
  let folderId = process.env.GOOGLE_DRIVE_FOLDER_ID;
  if (!folderId) {
    const folderMetadata = {
      name: 'Receipt Uploads',
      mimeType: 'application/vnd.google-apps.folder'
    };

    const folderResponse = await drive.files.create({
      requestBody: folderMetadata,
      fields: 'id'
    });

    folderId = folderResponse.data.id!;
  }

  // Convert Buffer to Readable Stream
  const stream = new Readable();
  stream.push(fileBuffer);
  stream.push(null);

  // Upload file
  const fileMetadata = {
    name: fileName,
    parents: [folderId]
  };

  const media = {
    mimeType: mimeType,
    body: stream
  };

  const uploadResponse = await drive.files.create({
    requestBody: fileMetadata,
    media: media,
    fields: 'id, webViewLink'
  });

  if (!uploadResponse.data.id) {
    throw new Error('Failed to upload file');
  }

  // Make the file publicly accessible
  await drive.permissions.create({
    fileId: uploadResponse.data.id,
    requestBody: {
      role: 'reader',
      type: 'anyone'
    }
  });

  return uploadResponse.data.webViewLink || '';
}

async function updateOrderWithReceipt(orderId: string, receiptUrl: string) {
  const doc = await initializeGoogleSheet();
  const sheet = doc.sheetsByTitle['Orders'];
  
  if (!sheet) {
    throw new Error('Orders sheet not found');
  }

  await sheet.loadHeaderRow();
  const rows = await sheet.getRows();
  
  const orderRow = rows.find(row => row.get('orderId') === orderId);
  
  if (!orderRow) {
    throw new Error('Order not found');
  }

  orderRow.set('receiptUrl', receiptUrl);
  orderRow.set('status', 'Paid');
  await orderRow.save();
}

export async function POST(request: Request) {
  try {
    const formData = await request.formData();
    const uploadedFile = formData.get('receipt') as File;
    const orderId = formData.get('orderId') as string;

    if (!uploadedFile || !orderId) {
      return NextResponse.json(
        { success: false, error: 'Missing required data' },
        { status: 400 }
      );
    }

    const buffer = Buffer.from(await uploadedFile.arrayBuffer());
    const fileName = `receipt_${orderId}_${Date.now()}_${uploadedFile.name}`;
    
    const receiptUrl = await uploadToDrive(buffer, fileName, uploadedFile.type);

    await updateOrderWithReceipt(orderId, receiptUrl);

    return NextResponse.json({
      success: true,
      url: receiptUrl
    });
  } catch (error) {
    console.error('Upload error:', error);
    return NextResponse.json(
      { 
        success: false, 
        error: error instanceof Error ? error.message : 'Upload failed' 
      },
      { status: 500 }
    );
  }
}