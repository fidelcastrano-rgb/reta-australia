import { products } from '@/lib/data';
import ProductsClient from './ProductsClient';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Research Peptides | Buy Retatrutide Australia Online',
  description: 'Buy research peptides online in Australia. RetaAustralia is the leading supplier of laboratory-grade peptides including Retatrutide. 99%+ purity, HPLC/MS certified.',
  alternates: {
    canonical: '/products',
  },
  openGraph: {
    title: 'Research Peptides Collection | Buy Retatrutide Australia Online',
    description: 'RetaAustralia is the leading supplier of high-purity laboratory research peptides including Retatrutide. 99%+ purity, independent testing.',
    url: 'https://www.reta-australia.com.au/products',
    type: 'website',
    images: [
      {
        url: '/img.png',
        alt: 'Buy Research Peptides Australia Online',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Research Peptides Collection | Buy Retatrutide Australia Online',
    description: 'RetaAustralia is the leading supplier of high-purity laboratory research peptides in Australia.',
    images: ['/img.png'],
  },
};

export default function ProductsPage() {
  const collectionSchema = {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    "name": "Research Peptides Collection",
    "description": "Premium research peptides including Retatrutide, available in Australia for laboratory use.",
    "url": "https://www.reta-australia.com.au/products",
    "mainEntity": {
      "@type": "ItemList",
      "itemListElement": products.map((product, index) => ({
        "@type": "ListItem",
        "position": index + 1,
        "url": `https://www.reta-australia.com.au/products/${product.slug}`
      }))
    }
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(collectionSchema) }}
      />
      <ProductsClient />
    </>
  );
}
