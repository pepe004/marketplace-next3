"use client";

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { Card, CardContent, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { databases, PRODUCTS_COLLECTION_ID } from '@/lib/appwrite';

interface Product {
  $id: string;
  name: string;
  price: number;
  description: string;
  image: string;
}

export default function ProductGrid() {
  const [products, setProducts] = useState<Product[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const productsPerPage = 12;

  useEffect(() => {
    fetchProducts();
  }, [currentPage]);

  const fetchProducts = async () => {
    try {
      const response = await databases.listDocuments(PRODUCTS_COLLECTION_ID, [
        `limit(${productsPerPage})`,
        `offset(${(currentPage - 1) * productsPerPage})`,
      ]);
      setProducts(response.documents as Product[]);
      setTotalPages(Math.ceil(response.total / productsPerPage));
    } catch (error) {
      console.error('Error fetching products:', error);
    }
  };

  return (
    <div>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {products.map((product) => (
          <Card key={product.$id}>
            <CardContent>
              <img src={product.image} alt={product.name} className="w-full h-48 object-cover mb-4" />
              <h3 className="text-lg font-semibold">{product.name}</h3>
              <p className="text-sm text-gray-600 mb-2">{product.description}</p>
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
      <div className="mt-8 flex justify-center space-x-2">
        <Button
          onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
          disabled={currentPage === 1}
        >
          Previous
        </Button>
        <span className="py-2 px-4 bg-gray-200 rounded">
          Page {currentPage} of {totalPages}
        </span>
        <Button
          onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
          disabled={currentPage === totalPages}
        >
          Next
        </Button>
      </div>
    </div>
  );
}