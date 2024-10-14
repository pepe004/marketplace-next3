"use client";

import { useState } from 'react';
import { useCart } from '@/hooks/useCart';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useToast } from "@/components/ui/use-toast";
import { databases, ORDERS_COLLECTION_ID } from '@/lib/appwrite';
import { useRouter } from 'next/navigation';
import { sendOrderConfirmationEmail } from '@/lib/sendEmail';

export default function Checkout() {
  const { cart, getTotalPrice, clearCart } = useCart();
  const [address, setAddress] = useState('');
  const [email, setEmail] = useState('');
  const { toast } = useToast();
  const router = useRouter();

  const handleCheckout = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const order = {
        items: cart,
        totalPrice: getTotalPrice(),
        address,
        email,
        status: 'pending',
        createdAt: new Date().toISOString(),
      };

      const createdOrder = await databases.createDocument(ORDERS_COLLECTION_ID, 'unique()', order);
      clearCart();
      await sendOrderConfirmationEmail(email, createdOrder);
      toast({
        title: "Order placed successfully",
        description: "Thank you for your purchase! Check your email for confirmation.",
      });
      router.push('/order-confirmation');
    } catch (error) {
      console.error('Error placing order:', error);
      toast({
        title: "Error",
        description: "There was an error placing your order. Please try again.",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Checkout</h1>
      <form onSubmit={handleCheckout}>
        <div className="mb-4">
          <label htmlFor="email" className="block text-sm font-medium text-gray-700">
            Email
          </label>
          <Input
            type="email"
            id="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="mt-1"
          />
        </div>
        <div className="mb-4">
          <label htmlFor="address" className="block text-sm font-medium text-gray-700">
            Shipping Address
          </label>
          <Input
            type="text"
            id="address"
            value={address}
            onChange={(e) => setAddress(e.target.value)}
            required
            className="mt-1"
          />
        </div>
        <div className="mb-4">
          <h2 className="text-xl font-semibold mb-2">Order Summary</h2>
          {cart.map((item) => (
            <div key={item.$id} className="flex justify-between">
              <span>{item.name} x {item.quantity}</span>
              <span>${(item.price * item.quantity).toFixed(2)}</span>
            </div>
          ))}
          <div className="mt-4 text-xl font-bold">
            Total: ${getTotalPrice().toFixed(2)}
          </div>
        </div>
        <Button type="submit" className="w-full">Place Order</Button>
      </form>
    </div>
  );
}