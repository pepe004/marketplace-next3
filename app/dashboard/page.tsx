"use client";

import { useState, useEffect } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { databases, ORDERS_COLLECTION_ID, WISHLIST_COLLECTION_ID } from '@/lib/appwrite';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import Link from 'next/link';

export default function Dashboard() {
  const { user } = useAuth();
  const [orders, setOrders] = useState([]);
  const [wishlist, setWishlist] = useState([]);

  useEffect(() => {
    if (user) {
      fetchOrders();
      fetchWishlist();
    }
  }, [user]);

  const fetchOrders = async () => {
    try {
      const response = await databases.listDocuments(ORDERS_COLLECTION_ID, [
        `user.$id=${user.$id}`,
      ]);
      setOrders(response.documents);
    } catch (error) {
      console.error('Error fetching orders:', error);
    }
  };

  const fetchWishlist = async () => {
    try {
      const response = await databases.listDocuments(WISHLIST_COLLECTION_ID, [
        `user.$id=${user.$id}`,
      ]);
      setWishlist(response.documents);
    } catch (error) {
      console.error('Error fetching wishlist:', error);
    }
  };

  if (!user) {
    return <div>Please log in to view your dashboard.</div>;
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Your Dashboard</h1>
      <Tabs defaultValue="orders">
        <TabsList>
          <TabsTrigger value="orders">Orders</TabsTrigger>
          <TabsTrigger value="wishlist">Wishlist</TabsTrigger>
          <TabsTrigger value="account">Account Settings</TabsTrigger>
        </TabsList>
        <TabsContent value="orders">
          <h2 className="text-2xl font-semibold mb-4">Your Orders</h2>
          {orders.map((order: any) => (
            <Card key={order.$id} className="mb-4">
              <CardHeader>
                <CardTitle>Order #{order.$id}</CardTitle>
              </CardHeader>
              <CardContent>
                <p>Total: ${order.totalPrice.toFixed(2)}</p>
                <p>Status: {order.status}</p>
                <p>Date: {new Date(order.createdAt).toLocaleDateString()}</p>
              </CardContent>
            </Card>
          ))}
        </TabsContent>
        <TabsContent value="wishlist">
          <h2 className="text-2xl font-semibold mb-4">Your Wishlist</h2>
          {wishlist.map((item: any) => (
            <Card key={item.$id} className="mb-4">
              <CardContent>
                <Link href={`/product/${item.product.$id}`}>
                  <p className="font-semibold">{item.product.name}</p>
                </Link>
              </CardContent>
            </Card>
          ))}
        </TabsContent>
        <TabsContent value="account">
          <h2 className="text-2xl font-semibold mb-4">Account Settings</h2>
          <Card>
            <CardContent>
              <p>Email: {user.email}</p>
              <p>Name: {user.name}</p>
              {/* Add more account settings and options to update them */}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}