"use client";

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { databases, PRODUCTS_COLLECTION_ID, CATEGORIES_COLLECTION_ID } from '@/lib/appwrite';
import ProductGrid from '@/components/ProductGrid';

interface Category {
  $id: string;
  name: string;
}

export default function CategoryPage() {
  const { id } = useParams();
  const [category, setCategory] = useState<Category | null>(null);
  const [products, setProducts] = useState([]);

  useEffect(() => {
    const fetchCategoryAndProducts = async () => {
      try {
        const categoryResponse = await databases.getDocument(CATEGORIES_COLLECTION_ID, id as string);
        setCategory(categoryResponse as Category);

        const productsResponse = await databases.listDocuments(PRODUCTS_COLLECTION_ID, [
          `category.$id=${id}`,
        ]);
        setProducts(productsResponse.documents);
      } catch (error) {
        console.error('Error fetching category and products:', error);
      }
    };

    if (id) {
      fetchCategoryAndProducts();
    }
  }, [id]);

  if (!category) {
    return <div>Loading...</div>;
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">{category.name}</h1>
      <ProductGrid products={products} />
    </div>
  );
}