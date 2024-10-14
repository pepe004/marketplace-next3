"use client";

import { useCart } from '@/hooks/useCart';
import { Button } from '@/components/ui/button';
import Link from 'next/link';

export default function Cart() {
  const { cart, removeFromCart, updateQuantity, getTotalPrice } = useCart();

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Your Cart</h1>
      {cart.length === 0 ? (
        <p>Your cart is empty.</p>
      ) : (
        <>
          <div className="space-y-4">
            {cart.map((item) => (
              <div key={item.$id} className="flex items-center justify-between border-b pb-4">
                <div>
                  <h3 className="text-lg font-semibold">{item.name}</h3>
                  <p className="text-gray-600">${item.price.toFixed(2)}</p>
                </div>
                <div className="flex items-center space-x-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => updateQuantity(item.$id, item.quantity - 1)}
                  >
                    -
                  </Button>
                  <span>{item.quantity}</span>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => updateQuantity(item.$id, item.quantity + 1)}
                  >
                    +
                  </Button>
                  <Button variant="destructive" size="sm" onClick={() => removeFromCart(item.$id)}>
                    Remove
                  </Button>
                </div>
              </div>
            ))}
          </div>
          <div className="mt-8">
            <p className="text-xl font-bold">Total: ${getTotalPrice().toFixed(2)}</p>
            <Link href="/checkout" passHref>
              <Button className="mt-4">Proceed to Checkout</Button>
            </Link>
          </div>
        </>
      )}
    </div>
  );
}