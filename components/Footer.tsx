import Link from 'next/link';

export default function Footer() {
  return (
    <footer className="bg-gray-100 mt-12">
      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div>
            <h3 className="text-lg font-semibold mb-4">About Us</h3>
            <p className="text-sm text-gray-600">We are a leading e-commerce marketplace offering a wide range of products and services.</p>
          </div>
          <div>
            <h3 className="text-lg font-semibold mb-4">Customer Service</h3>
            <ul className="space-y-2">
              <li><Link href="/contact" className="text-sm text-gray-600 hover:text-gray-900">Contact Us</Link></li>
              <li><Link href="/faq" className="text-sm text-gray-600 hover:text-gray-900">FAQ</Link></li>
              <li><Link href="/returns" className="text-sm text-gray-600 hover:text-gray-900">Returns</Link></li>
            </ul>
          </div>
          <div>
            <h3 className="text-lg font-semibold mb-4">Quick Links</h3>
            <ul className="space-y-2">
              <li><Link href="/products" className="text-sm text-gray-600 hover:text-gray-900">All Products</Link></li>
              <li><Link href="/categories" className="text-sm text-gray-600 hover:text-gray-900">Categories</Link></li>
              <li><Link href="/deals" className="text-sm text-gray-600 hover:text-gray-900">Deals</Link></li>
            </ul>
          </div>
          <div>
            <h3 className="text-lg font-semibold mb-4">Connect With Us</h3>
            <ul className="space-y-2">
              <li><a href="#" className="text-sm text-gray-600 hover:text-gray-900">Facebook</a></li>
              <li><a href="#" className="text-sm text-gray-600 hover:text-gray-900">Twitter</a></li>
              <li><a href="#" className="text-sm text-gray-600 hover:text-gray-900">Instagram</a></li>
            </ul>
          </div>
        </div>
        <div className="mt-8 border-t pt-8 text-center text-sm text-gray-600">
          © {new Date().getFullYear()} Your E-commerce Marketplace. All rights reserved.
        </div>
      </div>
    </footer>
  );
}