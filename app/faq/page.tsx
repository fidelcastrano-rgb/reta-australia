import { faqs } from '@/lib/data';
import { ChevronDown } from 'lucide-react';
import Link from 'next/link';

export const metadata = {
  title: 'Frequently Asked Questions',
  description: 'Frequently asked questions about buying Retatrutide and research peptides in Australia. Learn about our shipping, lab standards, and more.',
};

export default function FAQPage() {
  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "mainEntity": faqs.map(faq => ({
      "@type": "Question",
      "name": faq.q,
      "acceptedAnswer": {
        "@type": "Answer",
        "text": faq.a
      }
    }))
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
      />
      <div className="text-center mb-16">
        <h1 className="text-5xl font-heading font-black mb-6">Frequently Asked Questions</h1>
        <p className="text-xl text-brand-muted font-medium">Everything you need to know about ordering research peptides in Australia.</p>
      </div>

      <div className="space-y-4">
        {faqs.map((faq, i) => (
          <details key={i} className="group bg-white rounded-xl border border-brand-border overflow-hidden shadow-sm">
            <summary className="flex justify-between items-center font-bold text-lg cursor-pointer p-6 hover:bg-gray-50 list-none">
              {faq.q}
              <ChevronDown className="w-5 h-5 transition-transform group-open:rotate-180 text-brand-muted" />
            </summary>
            <div className="p-6 pt-0 text-brand-muted font-medium border-t border-brand-border bg-gray-50 leading-relaxed">
              {faq.a}
            </div>
          </details>
        ))}
      </div>

      <div className="mt-16 text-center bg-brand-secondary p-12 rounded-2xl border border-brand-border">
        <h3 className="text-2xl font-bold mb-4">Still have questions?</h3>
        <p className="text-brand-muted font-medium mb-8">Our support team is available via WhatsApp or email to assist with any technical or shipping inquiries.</p>
        <Link href="/contact" className="inline-block bg-brand-text text-white font-bold py-4 px-10 rounded-lg shadow-lg hover:bg-gray-800 transition">
          Contact Support
        </Link>
      </div>
    </div>
  );
}
