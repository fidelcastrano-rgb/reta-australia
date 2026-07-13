import Image from 'next/image';
import Link from 'next/link';
import { products, faqs } from '@/lib/data';
import { ShieldCheck, Truck, Clock, Award, Search, Beaker, CheckCircle, ChevronDown } from 'lucide-react';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Buy Retatrutide Australia | Premium Research Peptides | RetaAustralia',
  description: 'Buy Retatrutide Australia. RetaAustralia is the premier place to buy Retatrutide and premium research peptides in Australia. 99%+ purity, third-party tested, fast Australian shipping.',
  alternates: {
    canonical: '/',
  },
  openGraph: {
    title: 'Buy Retatrutide Australia | Premium Research Peptides',
    description: 'Buy Retatrutide Australia. RetaAustralia is the premier place to buy Retatrutide and premium research peptides in Australia. 99%+ purity, third-party tested.',
    url: 'https://www.reta-australia.com.au',
    type: 'website',
    images: [
      {
        url: '/img.png',
        alt: 'Buy Retatrutide Australia Online',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Buy Retatrutide Australia | Premium Research Peptides',
    description: 'Buy Retatrutide Australia. RetaAustralia is the premier place to buy Retatrutide and premium research peptides in Australia.',
    images: ['/img.png'],
  },
};

export default function Home() {
  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "mainEntity": faqs.slice(0, 4).map(faq => ({
      "@type": "Question",
      "name": faq.q,
      "acceptedAnswer": {
        "@type": "Answer",
        "text": faq.a
      }
    }))
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
      />
      {/* 1. Notice/announcement bar */}
      <div className="bg-brand-text text-white text-sm py-2 overflow-hidden whitespace-nowrap relative">
        <div className="animate-[marquee_20s_linear_infinite] inline-block font-medium">
          <span className="mx-4">🔥 NEXT DAY EXPRESS SHIPPING AUSTRALIA-WIDE</span>
          <span className="mx-4">🧪 THIRD-PARTY TESTED 99%+ PURITY</span>
          <span className="mx-4">🛡️ SECURE LOCAL INVENTORY</span>
          <span className="mx-4">🔥 NEXT DAY EXPRESS SHIPPING AUSTRALIA-WIDE</span>
          <span className="mx-4">🧪 THIRD-PARTY TESTED 99%+ PURITY</span>
          <span className="mx-4">🛡️ SECURE LOCAL INVENTORY</span>
        </div>
      </div>

      {/* 3. Hero Section */}
      <section className="relative overflow-hidden bg-brand-bg pt-24 pb-32 lg:pt-32 lg:pb-40 border-b border-brand-border">
        {/* Background Image */}
        <div className="absolute inset-0 z-0">
          <Image 
            src="/img.png" 
            alt="Premium Research Peptides" 
            fill 
            className="object-cover opacity-70" 
            priority
            referrerPolicy="no-referrer"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-brand-bg via-brand-bg/50 to-transparent"></div>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 flex flex-col items-center text-center">
          <div className="text-xs font-bold text-brand-success uppercase tracking-widest mb-6 flex justify-center items-center gap-2">
            <ShieldCheck className="w-4 h-4" /> Trusted Australian Supplier
          </div>
          <h1 className="text-5xl lg:text-7xl font-heading font-light tracking-tighter leading-tight text-brand-text mb-6">
            Premium Research <br className="hidden md:block"/>
            <span className="italic font-normal">Peptides</span> Delivered.
          </h1>
          <p className="text-xl text-brand-muted mb-10 max-w-2xl mx-auto font-light">
            High-purity lyophilized peptides for advanced clinical research. Local inventory, third-party tested, express shipping.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-12">
            <Link href="/products" className="w-full sm:w-auto px-10 py-5 bg-brand-cta text-white font-bold text-xs uppercase tracking-widest hover:opacity-90 transition">
              Shop Peptides
            </Link>
            <Link href="/contact" className="w-full sm:w-auto px-10 py-5 bg-white/60 backdrop-blur-sm border border-brand-border text-brand-text font-bold text-xs uppercase tracking-widest hover:bg-white transition">
              Contact Sales
            </Link>
          </div>
          <div className="flex flex-wrap items-center justify-center gap-6 text-[10px] font-mono uppercase tracking-widest text-brand-text">
            <div className="flex items-center gap-2 bg-white/60 backdrop-blur-sm px-4 py-2 border border-brand-border"><Award className="w-4 h-4 text-brand-success" /> 99%+ Purity</div>
            <div className="flex items-center gap-2 bg-white/60 backdrop-blur-sm px-4 py-2 border border-brand-border"><Truck className="w-4 h-4 text-brand-success" /> AU Express</div>
          </div>
        </div>
      </section>

      {/* 4. Horizontal Scroll Strip */}
      <section className="bg-brand-secondary py-8 border-b border-brand-border overflow-hidden">
        <div className="flex gap-8 px-4 w-full overflow-x-auto pb-4 snap-x hide-scrollbar">
          {[1,2,3,4,5].map(i => (
            <div key={i} className="min-w-[280px] bg-white p-6 border border-brand-border snap-center flex items-center gap-4">
              <div className="border border-brand-border p-3 text-brand-text">
                <CheckCircle className="w-6 h-6" />
              </div>
              <div>
                <h4 className="text-sm font-bold uppercase tracking-wide text-brand-text">Lab Verified</h4>
                <p className="text-[10px] font-mono text-brand-muted mt-1">Batch #{1000 + i} Tested</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 5. Features / Precision Section */}
      <section className="py-24 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          <div className="relative h-96 w-full border border-brand-border overflow-hidden">
            <Image src="/img_123.webp" alt="Precision Laboratory" fill className="object-cover" referrerPolicy="no-referrer" />
          </div>
          <div>
            <h2 className="text-3xl font-heading font-light tracking-tighter mb-6">Uncompromising Precision for Advanced Research</h2>
            <p className="text-brand-muted leading-relaxed mb-6 font-light">
              Our commitment to quality means every batch is rigorously tested for purity and sequence accuracy. We provide transparent documentation so you can conduct your research with confidence.
            </p>
            <ul className="space-y-4">
              {['HPLC & MS Testing', 'Lyophilized for Stability', 'Bacteriostatic Water Compatible'].map(item => (
                <li key={item} className="flex items-center gap-3 text-sm font-bold uppercase tracking-wide text-brand-text">
                  <div className="w-1.5 h-1.5 bg-brand-text rounded-full"></div> {item}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      {/* SEO Educational Section 1: What is Retatrutide? */}
      <section className="py-24 bg-brand-secondary border-t border-brand-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
            <div>
              <h2 className="text-3xl font-heading font-light tracking-tighter mb-6">What is Retatrutide?</h2>
              <p className="text-brand-muted leading-relaxed mb-6 font-light">
                <strong>Retatrutide Australia</strong> provides access to one of the most significant advancements in modern peptide research. <strong>Retatrutide</strong> is an investigational triple-hormone receptor agonist. Unlike earlier generation peptides, it uniquely targets three distinct receptors: GLP-1 (Glucagon-Like Peptide-1), GIP (Glucose-Dependent Insulinotropic Polypeptide), and GCGR (Glucagon Receptor).
              </p>
              <p className="text-brand-muted leading-relaxed mb-6 font-light">
                This synergistic triple-agonist mechanism makes the <strong>Retatrutide peptide</strong> a fascinating compound for laboratory research, particularly in studies focused on metabolic regulation, energy expenditure, and systemic lipid metabolism. As researchers look for the <strong>best place to buy Retatrutide Australia</strong>, purity and stability remain the most critical factors for reproducible results.
              </p>
            </div>
            <div>
              <h2 className="text-3xl font-heading font-light tracking-tighter mb-6">How Retatrutide Works</h2>
              <p className="text-brand-muted leading-relaxed mb-6 font-light">
                The mechanism of action for the <strong>Retatrutide research compound</strong> is highly complex. By activating the GLP-1 receptor, it modulates appetite pathways. Through GIP receptor agonism, it supports pancreatic function and metabolic homeostasis. Most uniquely, the addition of glucagon receptor (GCGR) agonism dramatically increases basal energy expenditure and promotes lipid oxidation.
              </p>
              <p className="text-brand-muted leading-relaxed font-light">
                For laboratories searching <strong>where to buy Retatrutide</strong>, understanding this tri-agonist behavior is essential. It requires high-purity synthesis to ensure exact receptor binding affinities during in vitro and in vivo models. When you <strong>buy research peptides online</strong> from RetaAustralia, you receive laboratory-grade compounds that preserve these delicate molecular structures.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* SEO Educational Section 2: Research Applications & Benefits */}
      <section className="py-24 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 border-b border-brand-border">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-heading font-light tracking-tighter mb-4">Retatrutide Research Applications</h2>
          <p className="text-brand-muted font-light max-w-2xl mx-auto">Exploring the scientific potential and <strong>Retatrutide benefits</strong> in controlled clinical settings.</p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="bg-white p-10 border border-brand-border">
            <h3 className="text-xl font-heading font-light mb-4">Metabolic Homeostasis Studies</h3>
            <p className="text-brand-muted font-light leading-relaxed mb-4">
              Current scientific literature highlights the profound impact of triple agonists on metabolic pathways. When researchers investigate <strong>premium Retatrutide</strong>, they often focus on its unparalleled ability to regulate hepatic glucose output and enhance cellular insulin sensitivity.
            </p>
            <p className="text-brand-muted font-light leading-relaxed">
              Using <strong>Retatrutide laboratory grade</strong> peptides ensures that researchers can accurately map these signaling cascades without interference from synthesis impurities.
            </p>
          </div>
          <div className="bg-white p-10 border border-brand-border">
            <h3 className="text-xl font-heading font-light mb-4">Lipid Metabolism & Energy Expenditure</h3>
            <p className="text-brand-muted font-light leading-relaxed mb-4">
              Unlike single or dual agonists, the glucagon receptor activation in <strong>Retatrutide</strong> directly stimulates lipolysis and increases resting energy expenditure. This makes it a primary candidate for studies examining metabolic dysfunction.
            </p>
            <p className="text-brand-muted font-light leading-relaxed">
              If you intend to <strong>buy Retatrutide</strong> for these studies, sourcing a stable, lyophilized product is vital. <strong>Retatrutide dosage information</strong> in research settings varies significantly depending on the animal model and the specific receptor activation being monitored.
            </p>
          </div>
        </div>
      </section>

      {/* 6. Products Grid (Featured) */}
      <section className="py-24 border-t border-brand-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <p className="text-xs font-bold text-brand-muted uppercase tracking-widest mb-4">Collection</p>
            <h2 className="text-4xl font-heading font-light tracking-tighter mb-4">Research Peptides</h2>
            <p className="text-brand-muted font-light max-w-2xl mx-auto">Explore our premium selection of lyophilized peptides.</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12">
            {products.slice(0, 6).map(product => (
              <div key={product.id} className="group cursor-pointer">
                <div className="relative aspect-[3/4] w-full mb-6 border border-brand-border bg-brand-secondary overflow-hidden">
                  <Image src={product.image} alt={product.name} fill className="object-cover grayscale group-hover:grayscale-0 transition-all duration-500" referrerPolicy="no-referrer" />
                  <div className="absolute top-3 left-3 bg-white text-brand-text text-[10px] font-mono px-2 py-1 uppercase tracking-widest border border-brand-border">
                    {product.tag}
                  </div>
                </div>
                <div className="flex justify-between items-start mb-2">
                  <div>
                    <h3 className="text-sm font-bold uppercase tracking-wide text-brand-text">{product.name}</h3>
                    <p className="text-xs text-brand-muted mt-1 font-mono">${product.priceFrom} AUD</p>
                  </div>
                  <span className="text-[10px] font-mono text-brand-muted italic">COA &gt;99%</span>
                </div>
                <div className="flex gap-2 mt-4">
                  <Link href={`/products/${product.slug}`} className="flex-1 text-center bg-transparent border border-brand-border text-brand-text text-[10px] font-bold uppercase tracking-widest py-3 hover:bg-brand-secondary transition">
                    Details
                  </Link>
                  <Link href={`/products`} className="flex-1 text-center bg-brand-cta text-white text-[10px] font-bold uppercase tracking-widest py-3 hover:bg-opacity-90 transition">
                    Order
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 9. Proven Data / Stats */}
      <section className="py-16 bg-brand-text text-brand-bg">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
          <div><div className="text-4xl font-heading font-light tracking-tighter mb-2 text-brand-success">99.4%+</div><div className="text-[10px] font-mono text-brand-secondary uppercase tracking-widest">Purity Guarantee</div></div>
          <div><div className="text-4xl font-heading font-light tracking-tighter mb-2 text-brand-success">24h</div><div className="text-[10px] font-mono text-brand-secondary uppercase tracking-widest">Dispatch Time</div></div>
          <div><div className="text-4xl font-heading font-light tracking-tighter mb-2 text-brand-success">10k+</div><div className="text-[10px] font-mono text-brand-secondary uppercase tracking-widest">Orders Fulfilled</div></div>
          <div><div className="text-4xl font-heading font-light tracking-tighter mb-2 text-brand-success">100%</div><div className="text-[10px] font-mono text-brand-secondary uppercase tracking-widest">Australian Owned</div></div>
        </div>
      </section>

      {/* 10. Cards / Bento Grid */}
      <section className="py-24 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl font-heading font-light tracking-tighter mb-4">Why Choose Us</h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="md:col-span-2 bg-brand-secondary p-8 border border-brand-border">
            <Search className="w-8 h-8 text-brand-text mb-6" />
            <h3 className="text-sm font-bold uppercase tracking-wide mb-3">Rigorous QA Process</h3>
            <p className="text-brand-muted text-sm font-light leading-relaxed">Every batch goes through strict High-Performance Liquid Chromatography (HPLC) and Mass Spectrometry (MS) to ensure maximum purity and precise synthesis.</p>
          </div>
          <div className="bg-brand-bg p-8 border border-brand-border">
            <Clock className="w-8 h-8 text-brand-text mb-6" />
            <h3 className="text-sm font-bold uppercase tracking-wide mb-3">Express Delivery</h3>
            <p className="text-brand-muted text-sm font-light leading-relaxed">Next-day shipping available across major Australian cities via AusPost Express.</p>
          </div>
          <div className="bg-brand-bg p-8 border border-brand-border">
            <ShieldCheck className="w-8 h-8 text-brand-text mb-6" />
            <h3 className="text-sm font-bold uppercase tracking-wide mb-3">Local Support</h3>
            <p className="text-brand-muted text-sm font-light leading-relaxed">Our customer service team is based in Australia, ready to assist via WhatsApp.</p>
          </div>
          <div className="md:col-span-2 bg-brand-secondary p-8 border border-brand-border">
            <Beaker className="w-8 h-8 text-brand-text mb-6" />
            <h3 className="text-sm font-bold uppercase tracking-wide mb-3">Lyophilized Stability</h3>
            <p className="text-brand-muted text-sm font-light leading-relaxed">Our peptides are lyophilized to ensure long-term stability during transit, ensuring they arrive ready for safe reconstitution in your lab.</p>
          </div>
        </div>
      </section>

      {/* SEO Educational Section 3: Trust & Quality */}
      <section className="py-24 bg-brand-bg border-t border-brand-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-heading font-light tracking-tighter mb-4">Why RetaAustralia is the Best Place to Buy Retatrutide Australia</h2>
            <p className="text-brand-muted font-light max-w-2xl mx-auto">
              Sourcing <strong>Retatrutide peptide Australia</strong> requires strict adherence to quality and compliance. We provide unmatched laboratory standards.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
            <div className="p-8 border border-brand-border bg-white">
              <h3 className="text-xl font-heading font-light mb-4">Laboratory Quality Standards</h3>
              <p className="text-brand-muted font-light leading-relaxed mb-4">
                We guarantee that every vial of our <strong>premium Retatrutide</strong> meets strict laboratory quality standards. Our manufacturing process utilizes advanced solid-phase peptide synthesis (SPPS) and rigorous purification protocols. This ensures that when you <strong>buy research peptides online</strong> from us, you receive a product with intact molecular integrity.
              </p>
              <p className="text-brand-muted font-light leading-relaxed">
                Whether you are conducting independent academic research or corporate laboratory analysis, the reliability of your compound is non-negotiable.
              </p>
            </div>
            <div className="p-8 border border-brand-border bg-white">
              <h3 className="text-xl font-heading font-light mb-4">Product Testing Procedures</h3>
              <p className="text-brand-muted font-light leading-relaxed mb-4">
                Transparency is at the core of our operations. Every batch of our <strong>Retatrutide research compound</strong> undergoes independent third-party testing via High-Performance Liquid Chromatography (HPLC) and Mass Spectrometry (MS).
              </p>
              <p className="text-brand-muted font-light leading-relaxed">
                These tests confirm the peptide&apos;s sequence accuracy, molecular weight, and verify that purity exceeds 99%. Certificates of Analysis (COAs) are made available to all researchers, validating why we are the <strong>best place to buy Retatrutide Australia</strong>.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 11. FAQ Accordion */}
      <section className="py-24 bg-brand-bg border-t border-brand-border">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-heading font-light tracking-tighter mb-10 text-center">Frequently Asked Questions</h2>
          <div className="space-y-2">
            {faqs.slice(0, 4).map((faq, i) => (
              <details key={i} className="group bg-white border border-brand-border overflow-hidden">
                <summary className="flex justify-between items-center text-sm font-bold uppercase tracking-wide cursor-pointer p-6 hover:bg-brand-secondary list-none">
                  {faq.q}
                  <ChevronDown className="w-5 h-5 transition-transform group-open:rotate-180 text-brand-muted" />
                </summary>
                <div className="p-6 pt-0 text-brand-muted text-sm font-light border-t border-brand-border bg-white leading-relaxed">
                  {faq.a}
                </div>
              </details>
            ))}
          </div>
          <div className="text-center mt-8">
            <Link href="/faq" className="text-xs font-bold uppercase tracking-widest text-brand-muted hover:text-brand-text transition-colors">View all FAQs &rarr;</Link>
          </div>
        </div>
      </section>

      {/* 12. CTA Section */}
      <section className="py-24 bg-brand-text text-brand-bg text-center">
        <div className="max-w-4xl mx-auto px-4">
          <h2 className="text-4xl font-heading font-light tracking-tighter mb-6 text-brand-success">Ready to advance your research?</h2>
          <p className="text-xl text-brand-secondary mb-10 font-light">Order premium peptides today with next-day Australian shipping.</p>
          <Link href="/products" className="inline-block px-10 py-5 bg-brand-bg text-brand-text font-bold text-xs uppercase tracking-widest hover:bg-brand-secondary transition">
            View All Products
          </Link>
        </div>
      </section>
    </>
  );
}
