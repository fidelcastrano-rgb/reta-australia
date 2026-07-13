import { AlertTriangle } from 'lucide-react';

export const metadata = {
  title: 'About Us',
};

export default function AboutPage() {
  return (
    <div className="pb-24">
      {/* 1. Hero */}
      <section className="bg-brand-text text-white py-24 text-center">
        <div className="max-w-4xl mx-auto px-4">
          <h1 className="text-5xl md:text-6xl font-heading font-black mb-6">Advancing Australian Research</h1>
          <p className="text-xl font-medium text-gray-300">Providing the highest purity lyophilized peptides for leading laboratories nationwide.</p>
        </div>
      </section>

      {/* 2. Stats Row */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 -mt-10 relative z-10">
        <div className="bg-white rounded-2xl shadow-xl border border-brand-border grid grid-cols-2 md:grid-cols-4 divide-x divide-y md:divide-y-0 divide-brand-border">
          <div className="p-8 text-center"><div className="text-3xl font-black text-brand-accent mb-1">99.4%+</div><div className="text-sm font-bold text-brand-muted uppercase tracking-wider">Avg Purity</div></div>
          <div className="p-8 text-center"><div className="text-3xl font-black text-brand-accent mb-1">100%</div><div className="text-sm font-bold text-brand-muted uppercase tracking-wider">Third Party Tested</div></div>
          <div className="p-8 text-center"><div className="text-3xl font-black text-brand-accent mb-1">24h</div><div className="text-sm font-bold text-brand-muted uppercase tracking-wider">Dispatch Time</div></div>
          <div className="p-8 text-center"><div className="text-3xl font-black text-brand-accent mb-1">AU</div><div className="text-sm font-bold text-brand-muted uppercase tracking-wider">Based Inventory</div></div>
        </div>
      </section>

      {/* Scam Warning */}
      <section className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="bg-red-50 rounded-2xl border border-red-200 overflow-hidden shadow-sm">
          <div className="bg-red-500 text-white p-4 font-bold flex items-center justify-center gap-2 text-lg">
            <AlertTriangle className="w-6 h-6" /> IMPORTANT: Beware of Fake Suppliers
          </div>
          <div className="p-8 md:p-10">
            <h3 className="text-2xl font-bold mb-4 text-red-900">The Australian Market is Flooded with Scams</h3>
            <p className="text-red-800 font-medium mb-8 leading-relaxed">Many websites claim to be based in Australia but ship from overseas, leading to customs seizures. Others sell heavily under-dosed or completely fake products.</p>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
              <div className="bg-white p-6 rounded-xl border border-red-100 shadow-sm">
                <h4 className="font-bold text-red-900 mb-2">1. Social Media Scams</h4>
                <p className="text-sm font-medium text-gray-600">Accounts on Instagram/TikTok pushing cheap prices with no website or verifiable COAs.</p>
              </div>
              <div className="bg-white p-6 rounded-xl border border-red-100 shadow-sm">
                <h4 className="font-bold text-red-900 mb-2">2. Fake Local Stock</h4>
                <p className="text-sm font-medium text-gray-600">Sites promising &quot;local delivery&quot; but tracking numbers originate from China.</p>
              </div>
              <div className="bg-white p-6 rounded-xl border border-red-100 shadow-sm">
                <h4 className="font-bold text-red-900 mb-2">3. Doctored COAs</h4>
                <p className="text-sm font-medium text-gray-600">Suppliers using photoshopped lab results or testing one batch and selling another.</p>
              </div>
            </div>

            <h4 className="font-bold text-red-900 mb-4 text-lg">How to verify a legitimate supplier:</h4>
            <ul className="space-y-3 text-sm text-red-800 font-bold">
              <li className="flex items-center gap-2">✓ Check if they have matching batch numbers on vials and COAs.</li>
              <li className="flex items-center gap-2">✓ Request proof of local shipping capability.</li>
              <li className="flex items-center gap-2">✓ Avoid &quot;too good to be true&quot; pricing. High-purity synthesis is expensive.</li>
            </ul>
          </div>
        </div>
      </section>
    </div>
  );
}
