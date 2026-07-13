import Link from 'next/link';
import Image from 'next/image';
import { blogPosts } from '@/lib/data';

import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Research & Blog | Peptide Studies Australia',
  description: 'Read the latest updates, guides, and research on lyophilized peptides, Retatrutide, and more from RetaAustralia.',
  alternates: {
    canonical: '/blog',
  },
  openGraph: {
    title: 'Research & Blog | Peptide Studies Australia',
    description: 'The latest updates, guides, and scientific research on lyophilized peptides in Australia. Sourced and compiled by our team.',
    url: 'https://www.reta-australia.com.au/blog',
    type: 'website',
    images: [
      {
        url: '/img.png',
        alt: 'Research & Blog - RetaAustralia',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Research & Blog | Peptide Studies Australia',
    description: 'The latest updates, guides, and scientific research on lyophilized peptides in Australia.',
    images: ['/img.png'],
  },
};

export default function BlogPage() {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
      <div className="mb-16">
        <h1 className="text-5xl font-heading font-black mb-6">Research Articles & News</h1>
        <p className="text-xl text-brand-muted font-medium max-w-2xl">The latest updates, guides, and research on lyophilized peptides in Australia.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {blogPosts.map(post => (
          <Link key={post.slug} href={`/blog/${post.slug}`} className="group block bg-white rounded-none border border-brand-border overflow-hidden transition">
            {(post as any).image && (
              <div className="relative w-full h-48 border-b border-brand-border">
                <Image referrerPolicy="no-referrer" src={(post as any).image} alt={post.title} fill className="object-cover grayscale group-hover:grayscale-0 transition-all duration-500" />
              </div>
            )}
            <div className="p-8">
              <div className="text-brand-success text-[10px] font-mono uppercase tracking-widest mb-3">{post.date}</div>
              <h2 className="text-2xl font-light tracking-tighter mb-4 group-hover:text-brand-secondary transition-colors">{post.title}</h2>
              <p className="text-brand-muted font-light mb-6 line-clamp-3">{post.excerpt}</p>
              <div className="text-[10px] font-bold uppercase tracking-widest text-brand-text group-hover:text-brand-success transition-colors">Read Article &rarr;</div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
