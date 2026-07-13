import Image from 'next/image';
import Link from 'next/link';
import { products } from '@/lib/data';
import { Truck, CheckCircle } from 'lucide-react';
import { notFound } from 'next/navigation';
import ProductClientDetails from './ProductClientDetails';

export async function generateStaticParams() {
  return products.map((product) => ({
    slug: product.slug,
  }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const product = products.find(p => p.slug === slug);
  if (!product) return { title: 'Product Not Found' };
  
  return {
    title: `Buy ${product.name} Australia | Premium Research Peptides`,
    description: `Buy ${product.name} online in Australia. ${product.description?.substring(0, 100) || 'Premium research peptide.'} Third-party tested, >99% purity. Laboratory grade from RetaAustralia.`,
    alternates: {
      canonical: `/products/${product.slug}`
    }
  };
}

export default async function ProductPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const product = products.find(p => p.slug === slug);
  if (!product) notFound();

  const productSchema = {
    "@context": "https://schema.org/",
    "@type": "Product",
    "name": product.name,
    "image": product.image,
    "description": product.description,
    "sku": product.id,
    "brand": {
      "@type": "Brand",
      "name": "RetaAustralia"
    },
    "offers": {
      "@type": "AggregateOffer",
      "url": `https://retaaustralia.com/products/${product.slug}`,
      "priceCurrency": "AUD",
      "lowPrice": product.priceFrom,
      "highPrice": product.variants[product.variants.length - 1]?.price || product.priceFrom,
      "availability": "https://schema.org/InStock",
      "itemCondition": "https://schema.org/NewCondition"
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(productSchema) }}
      />
      {/* Breadcrumb */}
      <nav className="text-sm text-brand-muted mb-8 font-bold">
        <Link href="/" className="hover:text-brand-accent transition-colors">Home</Link>
        <span className="mx-2 text-gray-300">/</span>
        <Link href="/products" className="hover:text-brand-accent transition-colors">Products</Link>
        <span className="mx-2 text-gray-300">/</span>
        <span className="text-brand-text">{product.name}</span>
      </nav>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16">
        {/* Left: Images */}
        <div>
          <div className="relative aspect-square border border-brand-border mb-4 bg-brand-secondary overflow-hidden group">
            <Image referrerPolicy="no-referrer" src={product.image} alt={product.name} fill className="object-cover grayscale group-hover:grayscale-0 transition-all duration-500" priority />
          </div>
          {product.thumbnails.length > 0 && (
            <div className="grid grid-cols-4 gap-4">
              {product.thumbnails.map((img, i) => (
                <div key={i} className="relative aspect-square border border-brand-border bg-brand-secondary cursor-pointer hover:opacity-80 transition-opacity grayscale hover:grayscale-0">
                  <Image referrerPolicy="no-referrer" src={img} alt={`${product.name} thumbnail`} fill className="object-cover" />
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Right: Info */}
        <div className="flex flex-col">
          {product.tag && (
            <div className="self-start border border-brand-border bg-white text-brand-text text-[10px] font-mono px-2 py-1 uppercase tracking-widest mb-4">
              {product.tag}
            </div>
          )}
          <h1 className="text-4xl font-heading font-light tracking-tighter mb-4 text-brand-text">{product.name}</h1>
          
          <div className="flex items-center gap-4 mb-6 pb-6 border-b border-brand-border">
            <span className="text-brand-text bg-brand-bg px-2 py-1 text-[10px] font-mono uppercase tracking-widest flex items-center gap-2 border border-brand-border">
              <div className="w-1.5 h-1.5 bg-brand-text rounded-full"></div> In Stock
            </span>
            <span className="text-brand-muted text-[10px] font-mono uppercase tracking-widest flex items-center gap-1">
              <Truck className="w-4 h-4" /> Next-day dispatch
            </span>
          </div>

          <p className="text-brand-muted font-light leading-relaxed mb-8">{product.description}</p>
          
          <ProductClientDetails product={product} />

          {/* Info Boxes */}
          <div className="mt-8 space-y-4">
            <div className="border border-brand-border bg-brand-bg p-6">
              <h4 className="text-xs font-bold uppercase tracking-wide mb-2 text-brand-text">Ordering Protocol</h4>
              <p className="text-xs font-light text-brand-muted">Select variant and click &quot;Order&quot; to build your quote. Our team confirms stock instantly and provides secure payment instructions.</p>
            </div>
            <div className="border border-brand-border bg-brand-bg p-6">
              <h4 className="text-xs font-bold uppercase tracking-wide mb-2 text-brand-text">Safety Protocol</h4>
              <p className="text-xs font-light text-brand-muted">Strictly for laboratory research use only. Not for human or animal consumption. Handling requires standard laboratory safety procedures.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
