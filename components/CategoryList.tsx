"use client";

import { useEffect, useState } from 'react';
import { databases, CATEGORIES_COLLECTION_ID } from '@/lib/appwrite';
import Link from 'next/link';

interface Category {
  $id: string;
  name: string;
}

export default function CategoryList() {
  const [categories, setCategories] = useState<Category[]>([]);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await databases.listDocuments(CATEGORIES_COLLECTION_ID);
        setCategories(response.documents as Category[]);
      } catch (error) {
        console.error('Error fetching categories:', error);
      }
    };

    fetchCategories();
  }, []);

  return (
    <div className="mb-8">
      <h2 className="text-2xl font-bold mb-4">Categories</h2>
      <div className="flex flex-wrap gap-2">
        {categories.map((category) => (
          <Link
            key={category.$id}
            href={`/category/${category.$id}`}
            className="px-4 py-2 bg-gray-200 rounded-full hover:bg-gray-300 transition-colors"
          >
            {category.name}
          </Link>
        ))}
      </div>
    </div>
  );
}