"use client";

import { useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import { databases, PRODUCTS_COLLECTION_ID } from '@/lib/appwrite';
import ProductGrid from '@/components/ProductGrid';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Slider } from '@/components/ui/slider';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

export default function SearchPage() {
  const searchParams = useSearchParams();
  const query = searchParams.get('q') || '';
  const [products, setProducts] = useState([]);
  const [filters, setFilters] = useState({
    minPrice: 0,
    maxPrice: 1000,
    category: '',
    sortBy: 'price',
    sortOrder: 'asc',
  });

  useEffect(() => {
    searchProducts();
  }, [query]);

  const searchProducts = async () => {
    try {
      let response = await databases.listDocuments(PRODUCTS_COLLECTION_ID, [
        `name~${query}`,
        filters.category ? `category.$id=${filters.category}` : '',
        `price>=${filters.minPrice}`,
        `price<=${filters.maxPrice}`,
      ].filter(Boolean));

      let sortedProducts = response.documents;
      if (filters.sortBy === 'price') {
        sortedProducts.sort((a, b) => filters.sortOrder === 'asc' ? a.price - b.price : b.price - a.price);
      } else if (filters.sortBy === 'rating') {
        sortedProducts.sort((a, b) => filters.sortOrder === 'asc' ? a.averageRating - b.averageRating : b.averageRating - a.averageRating);
      }

      setProducts(sortedProducts);
    } catch (error) {
      console.error('Error searching products:', error);
    }
  };

  const handleFilterChange = (key: string, value: any) => {
    setFilters({ ...filters, [key]: value });
  };

  const applyFilters = () => {
    searchProducts();
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Search Results for "{query}"</h1>
      <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
        <div className="md:col-span-1">
          <h2 className="text-xl font-semibold mb-4">Filters</h2>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">Price Range</label>
              <Slider
                min={0}
                max={1000}
                step={10}
                value={[filters.minPrice, filters.maxPrice]}
                onValueChange={(value) => {
                  handleFilterChange('minPrice', value[0]);
                  handleFilterChange('maxPrice', value[1]);
                }}
              />
              <div className="flex justify-between mt-2">
                <span>${filters.minPrice}</span>
                <span>${filters.maxPrice}</span>
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Category</label>
              <Input
                type="text"
                value={filters.category}
                onChange={(e) => handleFilterChange('category', e.target.value)}
                placeholder="Enter category"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Sort By</label>
              <Select onValueChange={(value) => handleFilterChange('sortBy', value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Sort by" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="price">Price</SelectItem>
                  <SelectItem value="rating">Rating</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Sort Order</label>
              <Select onValueChange={(value) => handleFilterChange('sortOrder', value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Sort order" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="asc">Ascending</SelectItem>
                  <SelectItem value="desc">Descending</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <Button onClick={applyFilters}>Apply Filters</Button>
          </div>
        </div>
        <div className="md:col-span-3">
          <ProductGrid products={products} />
        </div>
      </div>
    </div>
  );
}