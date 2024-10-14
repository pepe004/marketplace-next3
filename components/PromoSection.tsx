"use client";

import { useEffect, useState } from 'react';
import { databases, PROMOTIONS_COLLECTION_ID } from '@/lib/appwrite';
import { Card, CardContent } from '@/components/ui/card';

interface Promotion {
  $id: string;
  code: string;
  description: string;
  discountPercentage: number;
}

export default function PromoSection() {
  const [promotions, setPromotions] = useState<Promotion[]>([]);

  useEffect(() => {
    const fetchPromotions = async () => {
      try {
        const response = await databases.listDocuments(PROMOTIONS_COLLECTION_ID);
        setPromotions(response.documents as Promotion[]);
      } catch (error) {
        console.error('Error fetching promotions:', error);
      }
    };

    fetchPromotions();
  }, []);

  return (
    <div className="my-8">
      <h2 className="text-2xl font-bold mb-4">Current Promotions</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
        {promotions.map((promo) => (
          <Card key={promo.$id}>
            <CardContent className="p-4">
              <h3 className="text-lg font-semibold mb-2">{promo.code}</h3>
              <p className="text-sm text-gray-600 mb-2">{promo.description}</p>
              <p className="text-lg font-bold">{promo.discountPercentage}% OFF</p>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}