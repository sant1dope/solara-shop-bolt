import { NextResponse } from 'next/server';
import { GoogleSpreadsheet } from 'google-spreadsheet';
import { JWT } from 'google-auth-library';
import { Product } from '@/types/product';

const SCOPES = ['https://www.googleapis.com/auth/spreadsheets'];

function getPrivateKey() {
  if (process.env.GOOGLE_PRIVATE_KEY_BASE64) {
    return Buffer.from(process.env.GOOGLE_PRIVATE_KEY_BASE64, 'base64').toString();
  }
  throw new Error('GOOGLE_PRIVATE_KEY_BASE64 is not set');
}

let jwt: JWT;
let doc: GoogleSpreadsheet;

async function initializeGoogleSheet() {
  console.log('Initializing Google Sheet connection');

  if (!jwt) {
    console.log('Creating new JWT');
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
    console.log('Creating new GoogleSpreadsheet instance');
    const sheetId = process.env.GOOGLE_SHEETS_ID;
    if (!sheetId) {
      throw new Error('Google Sheets ID is not set in environment variables');
    }
    doc = new GoogleSpreadsheet(sheetId, jwt);
    await doc.loadInfo();
    console.log('Google Sheet loaded successfully');
  }
}

async function getProducts(): Promise<Product[]> {
  console.log('Starting getProducts function');
  await initializeGoogleSheet();

  const sheet = doc.sheetsByTitle['Products'];
  if (!sheet) {
    throw new Error('Products sheet not found');
  }
  console.log('Accessing Products sheet');

  await sheet.loadHeaderRow();
  console.log('Header row loaded');

  const rows = await sheet.getRows();
  console.log(`Fetched ${rows.length} rows`);

  return rows.map(row => {
    const imageString = row.get('image');
    const images = imageString.includes('|') 
      ? imageString.split('|')
      : [];
    
    const mainImage = images.length > 0 ? images[0] : imageString;
    const additionalImages = images.length > 0 ? images.slice(1) : [];

    return {
      id: row.get('id'),
      name: row.get('name'),
      price: parseFloat(row.get('price')),
      image: mainImage,
      images: additionalImages,
      category: row.get('category'),
      rating: parseInt(row.get('rating')),
      description: row.get('description'),
      soldOut: row.get('soldOut') === 'TRUE',
      color: row.get('color'),
      stock: parseInt(row.get('stock')) || 0,
      createdAt: new Date(row.get('createdAt')).getTime(),
      updatedAt: new Date(row.get('updatedAt')).getTime(),
    };
  });
}

export async function GET() {
  console.log('Starting GET request');
  try {
    console.log('Environment variables set:',
      !!process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL,
      !!process.env.GOOGLE_PRIVATE_KEY_BASE64,
      !!process.env.GOOGLE_SHEETS_ID
    );

    const products = await getProducts();
    console.log(`Successfully fetched ${products.length} products`);
    return NextResponse.json(products);
  } catch (error: unknown) {
    console.error('Error in GET request:', error);
    const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred';
    return NextResponse.json({ error: 'Failed to fetch products', details: errorMessage }, { status: 500 });
  }
}