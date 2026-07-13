import Link from 'next/link';
import Image from 'next/image';

export default function Footer() {
  return (
    <footer className="bg-brand-secondary pt-16 pb-8 border-t border-brand-border mt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-12">
          <div>
            <div className="mb-4">
              <Image 
                src="/logo.webp" 
                alt="RetaAustralia Logo" 
                width={150} 
                height={40} 
                className="h-8 w-auto object-contain"
                referrerPolicy="no-referrer"
              />
            </div>
            <p className="text-brand-muted text-sm leading-relaxed">
              Australia&apos;s Most Trusted Research Peptide Wholesaler. Providing premium purity for advanced clinical research.
            </p>
          </div>
          <div>
            <h4 className="font-bold mb-4">Products</h4>
            <ul className="space-y-2 text-sm text-brand-muted">
              <li><Link href="/products" className="hover:text-brand-accent">All Peptides</Link></li>
              <li><Link href="/products/retatrutide-10mg" className="hover:text-brand-accent">Retatrutide</Link></li>
              <li><Link href="/products/tirzepatide-10mg" className="hover:text-brand-accent">Tirzepatide</Link></li>
            </ul>
          </div>
          <div>
            <h4 className="font-bold mb-4">Research & Support</h4>
            <ul className="space-y-2 text-sm text-brand-muted">
              <li><Link href="/faq" className="hover:text-brand-accent">FAQs & Guides</Link></li>
              <li><Link href="/blog" className="hover:text-brand-accent">Blog & Articles</Link></li>
              <li><Link href="/about" className="hover:text-brand-accent">About Us</Link></li>
            </ul>
          </div>
          <div>
            <h4 className="font-bold mb-4">Company</h4>
            <ul className="space-y-2 text-sm text-brand-muted">
              <li><Link href="/contact" className="hover:text-brand-accent">Contact Us</Link></li>
              <li><Link href="/terms" className="hover:text-brand-accent">Terms of Use</Link></li>
              <li><Link href="/privacy" className="hover:text-brand-accent">Privacy Policy</Link></li>
            </ul>
          </div>
        </div>
        <div className="pt-8 border-t border-brand-border text-center text-xs text-brand-muted">
          <p className="mb-2 uppercase font-bold text-brand-cta">WARNING: STRICTLY FOR LABORATORY RESEARCH USE ONLY. NOT FOR HUMAN CONSUMPTION.</p>
          <p>&copy; {new Date().getFullYear()} RetaAustralia. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}
