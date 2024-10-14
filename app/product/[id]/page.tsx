"use client";

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { databases, PRODUCTS_COLLECTION_ID, REVIEWS_COLLECTION_ID, WISHLIST_COLLECTION_ID } from '@/lib/appwrite';
import { Button } from '@/components/ui/button';
import { useToast } from "@/components/ui/use-toast";
import { useCart } from '@/hooks/useCart';
import SocialShare from '@/components/SocialShare';
import ReviewSection from '@/components/ReviewSection';
import RelatedProducts from '@/components/RelatedProducts';
import { HeartIcon } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';

interface Product {
  $id: string;
  name: string;
  price: number;
  description: string;
  image: string;
  category: { $id: string };
}

export default function ProductDetail() {
  const { id } = useParams();
  const [product, setProduct] = useState<Product | null>(null);
  const { toast } = useToast();
  const { addToCart } = useCart();
  const { user } = useAuth();
  const [isInWishlist, setIsInWishlist] = useState(false);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const response = await databases.getDocument(PRODUCTS_COLLECTION_ID, id as string);
        setProduct(response as Product);
      } catch (error) {
        console.error('Error fetching product:', error);
      }
    };

    const checkWishlist = async () => {
      if (user) {
        try {
          const response = await databases.listDocuments(WISHLIST_COLLECTION_ID, [
            `user.$id=${user.$id}`,
            `product.$id=${id}`,
          ]);
          setIsInWishlist(response.documents.length > 0);
        } catch (error) {
          console.error('Error checking wishlist:', error);
        }
      }
    };

    if (id) {
      fetchProduct();
      checkWishlist();
    }
  }, [id, user]);

  const handleAddToCart = () => {
    if (product) {
      addToCart(product);
      toast({
        title: "Added to cart",
        description: `${product.name} has been added to your cart.`,
      });
    }
  };

  const handleToggleWishlist = async () => {
    if (!user) {
      toast({
        title: "Login required",
        description: "Please login to add items to your wishlist.",
        variant: "destructive",
      });
      return;
    }

    try {
      if (isInWishlist) {
        // Remove from wishlist
        const response = await databases.listDocuments(WISHLIST_COLLECTION_ID, [
          `user.$id=${user.$id}`,
          `product.$id=${id}`,
        ]);
        if (response.documents.length > 0) {
          await databases.deleteDocument(WISHLIST_COLLECTION_ID, response.documents[0].$id);
        }
      } else {
        // Add to wishlist
        await databases.createDocument(WISHLIST_COLLECTION_ID, 'unique()', {
          user: user.$id,
          product: id,
        });
      }
      setIsInWishlist(!isInWishlist);
      toast({
        title: isInWishlist ? "Removed from wishlist" : "Added to wishlist",
        description: `${product?.name} has been ${isInWishlist ? 'removed from' : 'added to'} your wishlist.`,
      });
    } catch (error) {
      console.error('Error toggling wishlist:', error);
      toast({
        title: "Error",
        description: "There was an error updating your wishlist. Please try again.",
        variant: "destructive",
      });
    }
  };

  if (!product) {
    return <div>Loading...</div>;
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div>
          <img src={product.image} alt={product.name} className="w-full h-auto" />
        </div>
        <div>
          <h1 className="text-3xl font-bold mb-4">{product.name}</h1>
          <p className="text-xl font-semibold mb-4">${product.price.toFixed(2)}</p>
          <p className="text-gray-600 mb-6">{product.description}</p>
          <div className="flex space-x-2 mb-4">
            <Button onClick={handleAddToCart}>Add to Cart</Button>
            <Button variant="outline" onClick={handleToggleWishlist}>
              <HeartIcon className={`h-5 w-5 mr-2 ${isInWishlist ? 'text-red-500 fill-red-500' : ''}`} />
              {isInWishlist ? 'Remove from Wishlist' : 'Add to Wishlist'}
            </Button>
          </div>
          <SocialShare url={`${window.location.origin}/product/${id}`} title={product.name} />
        </div>
      </div>
      <ReviewSection productId={id as string} />
      <RelatedProducts categoryId={product.category.$id} currentProductId={product.$id} />
    </div>
  );
}