"use client";

import { useEffect, useState } from 'react';
import { databases, PRODUCTS_COLLECTION_ID } from '@/lib/appwrite';
import Link from 'next/link';
import { Card, CardContent, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

interface Product {
  $id: string;
  name: string;
  price: number;
  image: string;
}

export default function RelatedProducts({ categoryId, currentProductId }: { categoryId: string, currentProductId: string }) {
  const [relatedProducts, setRelatedProducts] = useState<Product[]>([]);

  useEffect(() => {
    const fetchRelatedProducts = async () => {
      try {
        const response = await databases.listDocuments(PRODUCTS_COLLECTION_ID, [
          `category.$id=${categoryId}`,
          `$id!=${currentProductId}`,
        ]);
        setRelatedProducts(response.documents as Product[]);
      } catch (error) {
        console.error('Error fetching related products:', error);
      }
    };

    fetchRelatedProducts();
  }, [categoryId, currentProductId]);

  if (relatedProducts.length === 0) {
    return null;
  }

  return (
    <div className="mt-12">
      <h2 className="text-2xl font-bold mb-4">Related Products</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {relatedProducts.slice(0, 4).map((product) => (
          <Card key={product.$id}>
            <CardContent>
              <img src={product.image} alt={product.name} className="w-full h-48 object-cover mb-4" />
              <h3 className="text-lg font-semibold">{product.name}</h3>
              <p className="text-lg font-bold">${product.price.toFixed(2)}</p>
            </CardContent>
            <CardFooter>
              <Link href={`/product/${product.$id}`} passHref>
                <Button className="w-full">View Details</Button>
              </Link>
            </CardFooter>
          </Card>
        ))}
      </div>
    </div>
  );
}