"use client";
import Image from 'next/image';
import Link from 'next/link';
import { products } from '@/lib/data';
import { useCart } from '@/components/CartContext';
import { useState } from 'react';
import { ShieldCheck } from 'lucide-react';

export default function ProductsPage() {
  const { addToOrder } = useCart();
  const [activeCategory, setActiveCategory] = useState<string>('All');

  const categories = ['All', ...Array.from(new Set(products.map(p => p.tag)))];

  const filteredProducts = activeCategory === 'All' 
    ? products 
    : products.filter(p => p.tag === activeCategory);

  const collectionSchema = {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    "name": "Research Peptides Collection",
    "description": "Premium research peptides including Retatrutide, available in Australia for laboratory use.",
    "url": "https://retaaustralia.com/products",
    "mainEntity": {
      "@type": "ItemList",
      "itemListElement": products.map((product, index) => ({
        "@type": "ListItem",
        "position": index + 1,
        "url": `https://retaaustralia.com/products/${product.slug}`
      }))
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(collectionSchema) }}
      />
      <div className="mb-12">
        <h1 className="text-4xl font-heading font-light tracking-tighter mb-4">Research Peptides</h1>
        <p className="text-brand-muted font-light max-w-2xl">Browse our complete catalogue of high-purity peptides. All products are third-party tested.</p>
      </div>
      
      {/* Sticky Filter Bar */}
      <div className="sticky top-20 z-30 bg-white/90 backdrop-blur-md py-4 border-b border-brand-border mb-12 flex gap-4 overflow-x-auto hide-scrollbar">
        {categories.map(cat => (
          <button 
            key={cat}
            onClick={() => setActiveCategory(cat)}
            className={`px-5 py-2.5 text-[10px] uppercase tracking-widest font-bold whitespace-nowrap border transition-colors ${
              activeCategory === cat 
                ? 'bg-brand-text text-brand-bg border-brand-text' 
                : 'bg-transparent text-brand-muted hover:text-brand-text border-brand-border'
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-24">
        {filteredProducts.map(product => (
          <ProductCard key={product.id} product={product} addToOrder={addToOrder} />
        ))}
      </div>

      {/* Category SEO Content */}
      <div className="bg-brand-secondary border-t border-brand-border p-8 lg:p-16">
        <h2 className="text-3xl font-heading font-light tracking-tighter mb-6">
          {activeCategory === 'All' ? 'Premium Research Peptides in Australia' : `${activeCategory} Peptides for Research`}
        </h2>
        <div className="prose max-w-none text-brand-muted font-light leading-relaxed space-y-6">
          <p>
            Welcome to the premier destination to <strong>buy research peptides online</strong> in Australia. 
            Whether you are investigating GLP-1 agonists, recovery compounds, or nootropics, our selection of 
            lyophilized peptides provides the purity and stability required for rigorous in vitro and in vivo studies.
          </p>
          {activeCategory === 'GLP-1 Agonists' && (
            <p>
              GLP-1 agonists like <strong>Retatrutide</strong>, Tirzepatide, and Semaglutide are at the forefront 
              of metabolic research. <strong>Retatrutide Australia</strong> researchers frequently utilize these 
              compounds to study insulin secretion, gastric emptying, and appetite regulation pathways. 
              Our <strong>laboratory grade Retatrutide</strong> ensures accurate receptor binding profiles without 
              interference from synthesis byproducts.
            </p>
          )}
          {activeCategory === 'Recovery' && (
            <p>
              Recovery peptides such as BPC-157 and TB-500 are extensively studied for their tissue repair capabilities. 
              Research applications often involve angiogenesis, fibroblast migration, and tendon healing models. 
              When you source from us, you receive third-party tested compounds that preserve these delicate molecular structures.
            </p>
          )}
          {activeCategory === 'Nootropics' && (
            <p>
              Nootropic peptides are investigated for their potential neuromodulatory effects. Studies frequently 
              focus on synaptic plasticity, neuroprotection, and cognitive enhancement pathways.
            </p>
          )}
          {activeCategory === 'All' && (
            <p>
              Our complete catalogue includes the highly sought-after <strong>Retatrutide peptide</strong>, renowned for its triple-agonist mechanism. 
              If you are searching <strong>where to buy Retatrutide</strong> or looking for the <strong>best place to buy Retatrutide Australia</strong>, 
              RetaAustralia guarantees &gt;99% purity, validated by independent MS and HPLC testing. We ensure rapid, secure delivery of 
              temperature-stable lyophilized vials to your laboratory.
            </p>
          )}
        </div>
      </div>
    </div>
  );
}

function ProductCard({ product, addToOrder }: { product: any, addToOrder: any }) {
  const [selectedVariant, setSelectedVariant] = useState(product.variants[0]);
  const [added, setAdded] = useState(false);

  const handleAdd = () => {
    addToOrder({ id: product.id, name: product.name, variant: selectedVariant.name, price: selectedVariant.price, qty: 1 });
    setAdded(true);
    setTimeout(() => setAdded(false), 1500);
  };

  return (
    <div className="bg-white p-6 border border-brand-border flex flex-col h-full hover:border-brand-text transition-colors">
      <div className="relative aspect-[3/4] w-full mb-6 border border-brand-border bg-brand-secondary overflow-hidden group">
        <Image referrerPolicy="no-referrer" src={product.image} alt={product.name} fill className="object-cover grayscale group-hover:grayscale-0 transition-all duration-500" />
        {product.tag && (
          <div className="absolute top-3 left-3 bg-white text-brand-text text-[10px] font-mono px-2 py-1 uppercase tracking-widest border border-brand-border">
            {product.tag}
          </div>
        )}
      </div>
      
      <h3 className="text-sm font-bold uppercase tracking-wide mb-2 text-brand-text">{product.name}</h3>
      <p className="text-brand-muted text-xs font-light mb-4 line-clamp-2">{product.description}</p>
      
      <div className="flex items-center gap-2 mb-4 bg-brand-bg border border-brand-border p-2 text-[10px] font-mono text-brand-text">
        <div className="w-1.5 h-1.5 bg-brand-text rounded-full"></div> COA Verified &gt;99% Purity
      </div>

      <div className="flex flex-wrap gap-2 mb-6">
        {product.variants.map((v: any) => (
          <button 
            key={v.name}
            onClick={() => setSelectedVariant(v)}
            className={`px-3 py-1.5 text-[10px] uppercase tracking-widest font-bold border transition-colors ${
              selectedVariant.name === v.name 
                ? 'bg-brand-text text-white border-brand-text' 
                : 'bg-transparent border-brand-border text-brand-muted hover:text-brand-text hover:border-brand-text'
            }`}
          >
            {v.name} {v.savings && <span className="text-brand-muted ml-1">({v.savings})</span>}
          </button>
        ))}
      </div>

      <div className="mt-auto">
        <div className="flex justify-between items-end mb-4">
          <div>
            <div className="text-[10px] text-brand-muted uppercase tracking-widest mb-1">Price</div>
            <div className="text-xl font-light text-brand-text">${selectedVariant.price}</div>
          </div>
          {selectedVariant.savings && (
            <div className="text-[10px] text-brand-text uppercase tracking-widest font-bold border border-brand-border px-2 py-1">{selectedVariant.savings}</div>
          )}
        </div>

        <div className="flex gap-2">
          <Link href={`/products/${product.slug}`} className="flex-1 text-center bg-transparent border border-brand-border text-brand-text text-[10px] uppercase tracking-widest font-bold py-3 hover:bg-brand-secondary transition">
            Details
          </Link>
          <button 
            onClick={handleAdd}
            className={`flex-1 text-[10px] uppercase tracking-widest font-bold py-3 border border-brand-text transition ${added ? 'bg-brand-secondary text-brand-text' : 'bg-brand-text text-white hover:bg-opacity-90'}`}
          >
            {added ? 'Added' : 'Order'}
          </button>
        </div>
      </div>
    </div>
  );
}
