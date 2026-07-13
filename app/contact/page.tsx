import { MessageCircle, Mail, MapPin, Truck, AlertTriangle, Info } from 'lucide-react';

export const metadata = { 
  title: 'Contact Us',
  description: 'Contact RetaAustralia for wholesale inquiries and ordering. Fast shipping of Retatrutide and research peptides across Australia. Local support team available.',
};

export default function ContactPage() {
  const contactSchema = {
    "@context": "https://schema.org",
    "@type": "Organization",
    "name": "RetaAustralia",
    "url": "https://retaaustralia.com",
    "contactPoint": [
      {
        "@type": "ContactPoint",
        "contactType": "customer service",
        "areaServed": "AU",
        "availableLanguage": "English",
        "telephone": "+61-485-958-620",
        "email": "order@reta-australia.com.au"
      }
    ]
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(contactSchema) }}
      />
      <div className="mb-16">
        <h1 className="text-5xl font-heading font-black mb-6">Contact & Ordering</h1>
        <p className="text-xl text-brand-muted font-medium max-w-2xl">Connect with our Australian support team. All orders are processed securely via WhatsApp or Email.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
        {/* Left Column */}
        <div className="space-y-8">
          <div className="bg-white border-2 border-[#25D366] rounded-2xl p-8 shadow-sm relative overflow-hidden">
            <div className="absolute top-0 right-0 bg-[#25D366] text-white text-xs font-bold px-3 py-1 rounded-bl-lg">RECOMMENDED</div>
            <div className="flex items-center gap-4 mb-6">
              <div className="bg-[#25D366] p-4 rounded-full text-white">
                <MessageCircle className="w-8 h-8" />
              </div>
              <div>
                <h3 className="text-2xl font-bold">WhatsApp Sales</h3>
                <p className="text-brand-muted font-medium">Instant replies during business hours</p>
              </div>
            </div>
            <a href="https://wa.me/61485958620" target="_blank" rel="noopener noreferrer" className="block w-full text-center bg-[#25D366] text-white font-bold py-4 rounded-xl shadow-lg hover:bg-opacity-90 transition mb-6">
              WhatsApp Only: +61 485 958 620
            </a>
            <div className="bg-gray-50 border border-gray-200 rounded-lg p-4 text-sm font-medium">
              <div className="flex justify-between mb-2 pb-2 border-b border-gray-200">
                <span className="text-brand-muted">Monday - Friday</span>
                <span className="font-bold">9:00 AM - 6:00 PM AEST</span>
              </div>
              <div className="flex justify-between">
                <span className="text-brand-muted">Avg Response Time</span>
                <span className="font-bold text-[#25D366]">&lt; 15 mins</span>
              </div>
            </div>
          </div>

          <div className="bg-white border border-brand-border rounded-2xl p-8 shadow-sm">
            <div className="flex items-center gap-4 mb-6">
              <div className="bg-brand-secondary p-4 rounded-full text-brand-accent">
                <Mail className="w-8 h-8" />
              </div>
              <div>
                <h3 className="text-2xl font-bold">Email Support</h3>
                <p className="text-brand-muted font-medium">For large wholesale inquiries</p>
              </div>
            </div>
            <a href="mailto:order@reta-australia.com.au" className="block w-full text-center border-2 border-brand-border text-brand-text font-bold py-4 rounded-xl hover:bg-gray-50 transition">
              order@reta-australia.com.au
            </a>
          </div>

          <div className="bg-brand-secondary border border-brand-border rounded-2xl p-8">
            <h3 className="text-xl font-bold mb-6">4-Step Ordering Flow</h3>
            <ul className="space-y-4">
              <li className="flex gap-4 items-start"><div className="bg-white text-brand-accent font-black w-8 h-8 rounded-full flex items-center justify-center shrink-0 shadow-sm">1</div><p className="font-medium text-brand-text mt-1">Submit your order details via WhatsApp or Email.</p></li>
              <li className="flex gap-4 items-start"><div className="bg-white text-brand-accent font-black w-8 h-8 rounded-full flex items-center justify-center shrink-0 shadow-sm">2</div><p className="font-medium text-brand-text mt-1">Our team verifies stock and sends an invoice with secure payment options.</p></li>
              <li className="flex gap-4 items-start"><div className="bg-white text-brand-accent font-black w-8 h-8 rounded-full flex items-center justify-center shrink-0 shadow-sm">3</div><p className="font-medium text-brand-text mt-1">Send payment confirmation.</p></li>
              <li className="flex gap-4 items-start"><div className="bg-white text-brand-accent font-black w-8 h-8 rounded-full flex items-center justify-center shrink-0 shadow-sm">4</div><p className="font-medium text-brand-text mt-1">Receive AusPost Express tracking number.</p></li>
            </ul>
          </div>
        </div>

        {/* Right Column */}
        <div className="space-y-8">
          <div className="bg-red-50 border-l-4 border-red-500 p-6 rounded-r-2xl shadow-sm">
            <h3 className="text-red-900 font-bold flex items-center gap-2 mb-2"><AlertTriangle className="w-5 h-5" /> No In-Store Pickups</h3>
            <p className="text-red-800 text-sm font-medium leading-relaxed">Due to security and the nature of wholesale laboratory supplies, our warehouses are closed to the public. All orders must be shipped.</p>
          </div>
          
          <div className="bg-white border border-brand-border rounded-2xl p-8 shadow-sm">
            <h3 className="text-xl font-bold mb-6 flex items-center gap-2"><Info className="text-brand-accent" /> Safety Rules</h3>
            <ul className="space-y-3 text-sm font-medium text-brand-muted">
              <li className="flex items-center gap-2">✓ Must be 18+ to purchase.</li>
              <li className="flex items-center gap-2">✓ Strictly for laboratory research only.</li>
              <li className="flex items-center gap-2">✓ Do not inquire about human usage; your order will be cancelled.</li>
            </ul>
          </div>

          <div className="bg-white border border-brand-border rounded-2xl p-8 shadow-sm">
            <h3 className="text-xl font-bold mb-6 flex items-center gap-2"><MapPin className="text-brand-accent" /> Dispatch Locations</h3>
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-brand-secondary p-4 rounded-xl border border-brand-border text-center">
                <div className="font-bold text-brand-text">Sydney, NSW</div>
                <div className="text-xs text-brand-muted mt-1 font-medium">Primary Distribution</div>
              </div>
              <div className="bg-brand-secondary p-4 rounded-xl border border-brand-border text-center">
                <div className="font-bold text-brand-text">Melbourne, VIC</div>
                <div className="text-xs text-brand-muted mt-1 font-medium">Secondary Hub</div>
              </div>
            </div>
          </div>

          <div className="bg-white border border-brand-border rounded-2xl p-8 shadow-sm">
            <h3 className="text-xl font-bold mb-6 flex items-center gap-2"><Truck className="text-brand-accent" /> Shipping Information</h3>
            <table className="w-full text-sm font-medium text-left">
              <tbody>
                <tr className="border-b border-brand-border">
                  <td className="py-3 text-brand-muted">AusPost Express</td>
                  <td className="py-3 font-bold text-right">$15.00</td>
                </tr>
                <tr className="border-b border-brand-border">
                  <td className="py-3 text-brand-muted">Orders over $300</td>
                  <td className="py-3 font-bold text-brand-success text-right">FREE</td>
                </tr>
                <tr>
                  <td className="py-3 text-brand-muted">Cut-off Time</td>
                  <td className="py-3 font-bold text-right">2:00 PM AEST</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
