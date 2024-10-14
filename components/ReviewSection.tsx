"use client";

import { useState, useEffect } from 'react';
import { databases, REVIEWS_COLLECTION_ID } from '@/lib/appwrite';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from "@/components/ui/use-toast";
import { useAuth } from '@/hooks/useAuth';
import { StarIcon } from 'lucide-react';

interface Review {
  $id: string;
  user: { $id: string; name: string };
  rating: number;
  comment: string;
  createdAt: string;
}

export default function ReviewSection({ productId }: { productId: string }) {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [newReview, setNewReview] = useState({ rating: 0, comment: '' });
  const { user } = useAuth();
  const { toast } = useToast();

  useEffect(() => {
    fetchReviews();
  }, [productId]);

  const fetchReviews = async () => {
    try {
      const response = await databases.listDocuments(REVIEWS_COLLECTION_ID, [
        `product.$id=${productId}`,
      ]);
      setReviews(response.documents as Review[]);
    } catch (error) {
      console.error('Error fetching reviews:', error);
    }
  };

  const handleSubmitReview = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) {
      toast({
        title: "Login required",
        description: "Please login to submit a review.",
        variant: "destructive",
      });
      return;
    }

    try {
      await databases.createDocument(REVIEWS_COLLECTION_ID, 'unique()', {
        user: user.$id,
        product: productId,
        rating: newReview.rating,
        comment: newReview.comment,
        createdAt: new Date().toISOString(),
      });
      setNewReview({ rating: 0, comment: '' });
      fetchReviews();
      toast({
        title: "Review submitted",
        description: "Thank you for your review!",
      });
    } catch (error) {
      console.error('Error submitting review:', error);
      toast({
        title: "Error",
        description: "There was an error submitting your review. Please try again.",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="mt-12">
      <h2 className="text-2xl font-bold mb-4">Customer Reviews</h2>
      {reviews.map((review) => (
        <div key={review.$id} className="mb-4 p-4 border rounded">
          <div className="flex items-center mb-2">
            <div className="flex mr-2">
              {[1, 2, 3, 4, 5].map((star) => (
                <StarIcon
                  key={star}
                  className={`h-5 w-5 ${star <= review.rating ? 'text-yellow-400' : 'text-gray-300'}`}
                />
              ))}
            </div>
            <span className="font-semibold">{review.user.name}</span>
          </div>
          <p>{review.comment}</p>
          <p className="text-sm text-gray-500 mt-1">
            {new Date(review.createdAt).toLocaleDateString()}
          </p>
        </div>
      ))}
      <form onSubmit={handleSubmitReview} className="mt-8">
        <h3 className="text-xl font-semibold mb-2">Write a Review</h3>
        <div className="flex mb-2">
          {[1, 2, 3, 4, 5].map((star) => (
            <StarIcon
              key={star}
              className={`h-6 w-6 cursor-pointer ${star <= newReview.rating ? 'text-yellow-400' : 'text-gray-300'}`}
              onClick={() => setNewReview({ ...newReview, rating: star })}
            />
          ))}
        </div>
        <Textarea
          value={newReview.comment}
          onChange={(e) => setNewReview({ ...newReview, comment: e.target.value })}
          placeholder="Write your review here..."
          className="mb-2"
        />
        <Button type="submit" disabled={!user || newReview.rating === 0 || newReview.comment === ''}>
          Submit Review
        </Button>
      </form>
    </div>
  );
}