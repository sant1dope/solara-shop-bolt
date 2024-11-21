import ProductDetails from '@/components/shop/product-details';
import { Product } from '@/types/product';

async function getProduct(id: string): Promise<Product | null> {
  try {
    // Use absolute URL for server-side fetching
    const baseUrl = process.env.VERCEL_URL 
      ? `https://${process.env.VERCEL_URL}` 
      : process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000';
    
    const response = await fetch(`${baseUrl}/api/products`, {
      // Add cache options for better performance
      next: {
        revalidate: 60 // Revalidate every minute
      }
    });

    if (!response.ok) {
      throw new Error('Failed to fetch products');
    }

    const products: Product[] = await response.json();
    const product = products.find(p => p.id === id);
    
    if (!product) {
      console.log('Product not found:', id);
      console.log('Available products:', products.map(p => p.id));
    }

    return product || null;
  } catch (error) {
    console.error('Error fetching product:', error);
    return null;
  }
}

export default async function ProductPage({ params }: { params: { id: string } }) {
  const product = await getProduct(params.id);

  if (!product) {
    return (
      <div className="container mx-auto px-4 py-16 text-center">
        <h1 className="text-2xl font-bold text-gray-900">Product Not Found</h1>
        <p className="mt-4 text-gray-600">
          The product you're looking for doesn't exist or has been removed.
        </p>
      </div>
    );
  }

  return <ProductDetails product={product} />;
}

// Generate static params for all products
export async function generateStaticParams() {
  try {
    const baseUrl = process.env.VERCEL_URL 
      ? `https://${process.env.VERCEL_URL}` 
      : process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000';
    
    const response = await fetch(`${baseUrl}/api/products`);
    const products: Product[] = await response.json();

    return products.map((product) => ({
      id: product.id,
    }));
  } catch (error) {
    console.error('Error generating static params:', error);
    return [];
  }
}