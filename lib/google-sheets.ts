import { GoogleSpreadsheet } from 'google-spreadsheet';
import { JWT } from 'google-auth-library';

const SCOPES = [
  'https://www.googleapis.com/auth/spreadsheets',
  'https://www.googleapis.com/auth/drive.file',
];

function validateEnvironmentVariables() {
  const requiredVars = {
    GOOGLE_CLIENT_EMAIL: process.env.GOOGLE_CLIENT_EMAIL,
    GOOGLE_PRIVATE_KEY_BASE64: process.env.GOOGLE_PRIVATE_KEY_BASE64,
    GOOGLE_SHEET_ID: process.env.GOOGLE_SHEET_ID
  };

  const missingVars = Object.entries(requiredVars)
    .filter(([_, value]) => !value)
    .map(([key]) => key);

  if (missingVars.length > 0) {
    throw new Error(`Missing required environment variables: ${missingVars.join(', ')}`);
  }
}

function getPrivateKey() {
  if (!process.env.GOOGLE_PRIVATE_KEY_BASE64) {
    throw new Error('GOOGLE_PRIVATE_KEY_BASE64 is not set in environment variables');
  }

  try {
    const decodedKey = Buffer.from(process.env.GOOGLE_PRIVATE_KEY_BASE64, 'base64').toString();
    if (!decodedKey.includes('BEGIN PRIVATE KEY') || !decodedKey.includes('END PRIVATE KEY')) {
      throw new Error('Invalid private key format');
    }
    return decodedKey;
  } catch (error) {
    console.error('Error decoding private key:', error);
    throw new Error('Failed to decode GOOGLE_PRIVATE_KEY_BASE64');
  }
}

export async function getGoogleSheet() {
  try {
    validateEnvironmentVariables();
    
    const privateKey = getPrivateKey();
    
    console.log('Initializing Google Sheets client with:', {
      email: process.env.GOOGLE_CLIENT_EMAIL,
      sheetId: process.env.GOOGLE_SHEET_ID,
      keyLength: privateKey.length,
      scopes: SCOPES
    });

    const jwt = new JWT({
      email: process.env.GOOGLE_CLIENT_EMAIL,
      key: privateKey,
      scopes: SCOPES,
    });

    const doc = new GoogleSpreadsheet(process.env.GOOGLE_SHEET_ID!, jwt);
    
    console.log('Loading sheet info...');
    await doc.loadInfo();
    console.log('Sheet loaded successfully:', doc.title);
    
    return doc;
  } catch (error) {
    console.error('Error initializing Google Sheet:', error);
    const message = error instanceof Error ? error.message : 'Unknown error occurred';
    throw new Error(`Google API error - ${message}`);
  }
}