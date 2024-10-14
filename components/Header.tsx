"use client";

import Link from 'next/link';
import { ShoppingCart, User, Search } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/hooks/useAuth';
import { useRouter } from 'next/navigation';

export default function Header() {
  const { user, logout } = useAuth();
  const router = useRouter();

  const handleLogout = async () => {
    await logout();
    router.push('/');
  };

  return (
    <header className="bg-white shadow-md">
      <div className="container mx-auto px-4 py-4 flex items-center justify-between">
        <Link href="/" className="text-2xl font-bold">Marketplace</Link>
        <div className="flex items-center space-x-4">
          <Link href="/cart">
            <Button variant="ghost">
              <ShoppingCart className="mr-2" size={20} />
              Cart
            </Button>
          </Link>
          {user ? (
            <>
              <Link href="/dashboard">
                <Button variant="ghost">
                  <User className="mr-2" size={20} />
                  Dashboard
                </Button>
              </Link>
              <Button variant="ghost" onClick={handleLogout}>
                Logout
              </Button>
            </>
          ) : (
            <Link href="/login">
              <Button variant="ghost">
                <User className="mr-2" size={20} />
                Login
              </Button>
            </Link>
          )}
        </div>
      </div>
    </header>
  );
}