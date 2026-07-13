"use client";
import Link from 'next/link';
import Image from 'next/image';
import { useState } from 'react';
import { Menu, X } from 'lucide-react';
import { useCart } from './CartContext';

export default function Header() {
  const [isOpen, setIsOpen] = useState(false);
  const { items } = useCart();
  const itemCount = items.reduce((acc, i) => acc + i.qty, 0);

  const navLinks = [
    { name: 'Home', href: '/' },
    { name: 'Shop', href: '/products' },
    { name: 'About', href: '/about' },
    { name: 'Research', href: '/blog' },
    { name: 'FAQs', href: '/faq' },
    { name: 'Contact', href: '/contact' },
  ];

  return (
    <header className="fixed top-0 w-full z-50 bg-white/70 backdrop-blur-md border-b border-brand-border">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-20">
          <Link href="/" className="flex items-center">
            <Image 
              src="/logo.webp" 
              alt="RetaAustralia Logo" 
              width={180} 
              height={48} 
              className="h-10 w-auto object-contain"
              priority
              referrerPolicy="no-referrer"
            />
          </Link>
          
          <nav className="hidden md:flex gap-8 items-center">
            {navLinks.map(link => (
              <Link key={link.name} href={link.href} className="text-xs font-semibold uppercase tracking-widest text-brand-muted hover:text-brand-accent transition-colors">
                {link.name}
              </Link>
            ))}
            <Link href={itemCount > 0 ? "/checkout" : "/products"} className="bg-brand-cta text-white px-5 py-2.5 rounded-none text-xs font-bold uppercase tracking-widest hover:bg-opacity-90 transition-opacity">
              {itemCount > 0 ? `Checkout (${itemCount})` : 'Order Now'}
            </Link>
          </nav>

          <button className="md:hidden p-2" onClick={() => setIsOpen(!isOpen)} aria-label="Toggle menu">
            {isOpen ? <X /> : <Menu />}
          </button>
        </div>
      </div>
      
      {isOpen && (
        <div className="md:hidden fixed inset-0 top-20 bg-brand-bg z-40 p-4">
          <nav className="flex flex-col gap-4">
            {navLinks.map(link => (
              <Link key={link.name} href={link.href} onClick={() => setIsOpen(false)} className="text-lg font-bold p-4 border-b border-brand-border">
                {link.name}
              </Link>
            ))}
            <Link href={itemCount > 0 ? "/checkout" : "/products"} onClick={() => setIsOpen(false)} className="bg-brand-cta text-white text-center p-4 rounded-md font-bold mt-4 shadow uppercase tracking-widest text-xs">
              {itemCount > 0 ? `Checkout (${itemCount})` : 'Order Now'}
            </Link>
          </nav>
        </div>
      )}
    </header>
  );
}
