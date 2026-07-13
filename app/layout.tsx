import type {Metadata} from 'next';
import { Inter, JetBrains_Mono } from 'next/font/google';
import './globals.css';
import { CartProvider } from '@/components/CartContext';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import FloatingElements from '@/components/FloatingElements';

const inter = Inter({ subsets: ['latin'], variable: '--font-sans' });
const jetbrainsMono = JetBrains_Mono({ subsets: ['latin'], variable: '--font-mono' });

export const metadata: Metadata = {
  metadataBase: new URL('https://www.reta-australia.com.au'),
  title: {
    template: '%s | Retatrutide Australia',
    default: 'Buy Retatrutide Australia | Premium Research Peptides | RetaAustralia',
  },
  description: 'Buy Retatrutide Australia. RetaAustralia is the best place to buy Retatrutide and premium research peptides. 99%+ purity, third-party tested, fast Australian shipping.',
  keywords: ['Retatrutide australia', 'Buy retatrutide australia', 'Buy Retatrutide', 'Retatrutide Peptide', 'best place to buy retatrutide australia', 'where to buy retatrutide', 'retatrutide peptide australia', 'Premium Retatrutide', 'Buy Research Peptides Online'],
  openGraph: {
    type: 'website',
    locale: 'en_AU',
    url: 'https://www.reta-australia.com.au',
    siteName: 'Retatrutide Australia',
    title: 'Buy Retatrutide Australia | Premium Research Peptides',
    description: 'RetaAustralia is the best place to buy Retatrutide and premium research peptides in Australia. Laboratory grade, third-party tested.',
    images: [
      {
        url: '/img.png',
        width: 1200,
        height: 630,
        alt: 'Retatrutide Australia - Premium Research Peptides',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Buy Retatrutide Australia | Premium Research Peptides',
    description: 'RetaAustralia is the best place to buy Retatrutide and premium research peptides in Australia.',
    images: ['/img.png'],
  },
  alternates: {
    canonical: '/',
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  icons: {
    icon: '/logo.webp',
    shortcut: '/logo.webp',
    apple: '/logo.webp',
  },
};

export default function RootLayout({children}: {children: React.ReactNode}) {
  const organizationSchema = {
    "@context": "https://schema.org",
    "@type": "Organization",
    "name": "RetaAustralia",
    "url": "https://www.reta-australia.com.au",
    "logo": "https://www.reta-australia.com.au/logo.webp",
    "description": "Premium modern luxury medical research peptide brand in Australia.",
    "contactPoint": {
      "@type": "ContactPoint",
      "contactType": "customer support",
      "availableLanguage": "English"
    }
  };

  return (
    <html lang="en-AU" className={`${inter.variable} ${jetbrainsMono.variable}`}>
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationSchema) }}
        />
      </head>
      <body className="bg-brand-bg text-brand-text font-sans antialiased" suppressHydrationWarning>
        <CartProvider>
          <Header />
          <main className="min-h-screen pt-20">{children}</main>
          <Footer />
          <FloatingElements />
        </CartProvider>
      </body>
    </html>
  );
}
