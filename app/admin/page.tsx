"use client";

import { useState, useEffect } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { databases, PRODUCTS_COLLECTION_ID, ORDERS_COLLECTION_ID } from '@/lib/appwrite';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/components/ui/use-toast";

export default function AdminDashboard() {
  const { user } = useAuth();
  const [products, setProducts] = useState([]);
  const [orders, setOrders] = useState([]);
  const [newProduct, setNewProduct] = useState({ name: '', price: '', description: '' });
  const { toast } = useToast();

  useEffect(() => {
    if (user) {
      fetchProducts();
      fetchOrders();
    }
  }, [user]);

  const fetchProducts = async () => {
    try {
      const response = await databases.listDocuments(PRODUCTS_COLLECTION_ID);
      setProducts(response.documents);
    } catch (error) {
      console.error('Error fetching products:', error);
    }
  };

  const fetchOrders = async () => {
    try {
      const response = await databases.listDocuments(ORDERS_COLLECTION_ID);
      setOrders(response.documents);
    } catch (error) {
      console.error('Error fetching orders:', error);
    }
  };

  const handleAddProduct = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await databases.createDocument(PRODUCTS_COLLECTION_ID, 'unique()', {
        name: newProduct.name,
        price: parseFloat(newProduct.price),
        description: newProduct.description,
      });
      setNewProduct({ name: '', price: '', description: '' });
      fetchProducts();
      toast({
        title: "Product added",
        description: "The new product has been added successfully.",
      });
    } catch (error) {
      console.error('Error adding product:', error);
      toast({
        title: "Error",
        description: "There was an error adding the product. Please try again.",
        variant: "destructive",
      });
    }
  };

  if (!user) {
    return <div>Please log in to access the admin dashboard.</div>;
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Admin Dashboard</h1>
      <Tabs defaultValue="products">
        <TabsList>
          <TabsTrigger value="products">Products</TabsTrigger>
          <TabsTrigger value="orders">Orders</TabsTrigger>
        </TabsList>
        <TabsContent value="products">
          <h2 className="text-2xl font-semibold mb-4">Manage Products</h2>
          <form onSubmit={handleAddProduct} className="mb-8">
            <h3 className="text-xl font-semibold mb-2">Add New Product</h3>
            <div className="space-y-2">
              <Input
                type="text"
                placeholder="Product Name"
                value={newProduct.name}
                onChange={(e) => setNewProduct({ ...newProduct, name: e.target.value })}
                required
              />
              <Input
                type="number"
                placeholder="Price"
                value={newProduct.price}
                onChange={(e) => setNewProduct({ ...newProduct, price: e.target.value })}
                required
              />
              <Input
                type="text"
                placeholder="Description"
                value={newProduct.description}
                onChange={(e) => setNewProduct({ ...newProduct, description: e.target.value })}
                required
              />
              <Button type="submit">Add Product</Button>
            </div>
          </form>
          <div className="space-y-4">
            {products.map((product: any) => (
              <Card key={product.$id}>
                <CardHeader>
                  <CardTitle>{product.name}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p>Price: ${product.price}</p>
                  <p>{product.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>
        <TabsContent value="orders">
          <h2 className="text-2xl font-semibold mb-4">Manage Orders</h2>
          <div className="space-y-4">
            {orders.map((order: any) => (
              <Card key={order.$id}>
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
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}