import { getGoogleSheet } from './google-sheets';
import { Product } from '@/types/product';

export async function getProducts(): Promise<Product[]> {
  try {
    const doc = await getGoogleSheet();
    const sheet = doc.sheetsByTitle['Products'];
    
    if (!sheet) {
      console.error('Products sheet not found');
      return [];
    }

    const rows = await sheet.getRows();
    
    return rows.map(row => ({
      id: row.get('id'),
      name: row.get('name'),
      price: parseFloat(row.get('price')),
      image: row.get('image'),
      category: row.get('category'),
      rating: parseInt(row.get('rating')),
      description: row.get('description'),
      soldOut: row.get('soldOut') === 'TRUE',
      color: row.get('color'),
      stock: parseInt(row.get('stock')) || 0,
      createdAt: new Date(row.get('createdAt')).getTime(),
      updatedAt: new Date(row.get('updatedAt')).getTime()
    }));
  } catch (error) {
    console.error('Error fetching products:', error);
    return [];
  }
}