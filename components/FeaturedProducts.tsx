"use client";

import { useEffect, useState } from 'react';
import { databases, PRODUCTS_COLLECTION_ID } from '@/lib/appwrite';
import ProductGrid from './ProductGrid';

export default function FeaturedProducts() {
  const [featuredProducts, setFeaturedProducts] = useState([]);

  useEffect(() => {
    const fetchFeaturedProducts = async () => {
      try {
        const response = await databases.listDocuments(PRODUCTS_COLLECTION_ID, [
          'limit(4)',
          'orderDesc("popularity")'
        ]);
        setFeaturedProducts(response.documents);
      } catch (error) {
        console.error('Error fetching featured products:', error);
      }
    };

    fetchFeaturedProducts();
  }, []);

  return (
    <div className="my-8">
      <h2 className="text-2xl font-bold mb-4">Featured Products</h2>
      <ProductGrid products={featuredProducts} />
    </div>
  );
}