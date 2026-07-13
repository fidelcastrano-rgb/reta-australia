"use client";
import { useState } from 'react';
import { useCart } from '@/components/CartContext';
import { FileText, MessageCircle, Mail } from 'lucide-react';

export default function ProductClientDetails({ product }: { product: any }) {
  const [selectedVariant, setSelectedVariant] = useState(product.variants[0]);
  const [added, setAdded] = useState(false);
  const { addToOrder } = useCart();
  const [activeTab, setActiveTab] = useState('contents');

  const handleAdd = () => {
    addToOrder({ id: product.id, name: product.name, variant: selectedVariant.name, price: selectedVariant.price, qty: 1 });
    setAdded(true);
    setTimeout(() => setAdded(false), 1500);
  };

  const whatsappText = encodeURIComponent(`Hi, I would like to order: ${product.name} (${selectedVariant.name}) for $${selectedVariant.price}.`);

  return (
    <div>
      <div className="mb-6">
        <div className="text-xs text-brand-muted uppercase font-bold tracking-wider mb-2">Select Quantity</div>
        <div className="flex flex-wrap gap-3">
          {product.variants.map((v: any) => (
            <button 
              key={v.name}
              onClick={() => setSelectedVariant(v)}
              className={`px-4 py-3 rounded-lg border-2 text-left transition-colors ${
                selectedVariant.name === v.name 
                  ? 'bg-brand-secondary border-brand-accent text-brand-text' 
                  : 'bg-white border-brand-border text-brand-muted hover:border-gray-400'
              }`}
            >
              <div className="font-bold">{v.name}</div>
              {v.savings && <div className="text-brand-success text-sm font-bold mt-1">{v.savings}</div>}
            </button>
          ))}
        </div>
      </div>

      <div className="flex items-end gap-4 mb-8">
        <div>
          <div className="text-xs text-brand-muted uppercase font-bold tracking-wider mb-1">Price</div>
          <div className="text-4xl font-heading font-black text-brand-text">${selectedVariant.price}</div>
        </div>
      </div>

      <div className="flex flex-col gap-3 mb-8">
        <button 
          onClick={handleAdd}
          className={`w-full py-4 rounded-lg font-bold text-lg transition shadow-lg ${added ? 'bg-brand-success text-white' : 'bg-brand-cta text-white hover:bg-opacity-90'}`}
        >
          {added ? '✓ Added to Order' : 'Add to Order Builder'}
        </button>
        <a 
          href={`https://wa.me/61485958620?text=${whatsappText}`}
          target="_blank"
          rel="noopener noreferrer"
          className="w-full flex justify-center items-center gap-2 py-4 rounded-lg font-bold text-lg bg-[#25D366] text-white hover:bg-opacity-90 shadow"
        >
          <MessageCircle /> Order via WhatsApp
        </a>
        <button className="w-full flex justify-center items-center gap-2 py-3 rounded-lg font-bold border-2 border-brand-border text-brand-text hover:bg-gray-100">
          <FileText className="w-5 h-5" /> View Certificate of Analysis (COA)
        </button>
      </div>

      {/* Tabs */}
      <div className="border border-brand-border rounded-xl overflow-hidden">
        <div className="flex border-b border-brand-border bg-gray-50">
          {[
            { id: 'contents', label: 'Contents' },
            { id: 'storage', label: 'Storage' },
            { id: 'supply', label: 'Supply Chain' }
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex-1 py-3 text-sm font-bold text-center ${activeTab === tab.id ? 'bg-white text-brand-accent border-b-2 border-brand-accent' : 'text-brand-muted hover:text-brand-text'}`}
            >
              {tab.label}
            </button>
          ))}
        </div>
        <div className="p-6 bg-white text-sm text-brand-muted font-medium leading-relaxed">
          {activeTab === 'contents' && <p>Each vial contains precisely formulated lyophilized powder. No diluent is included. Reconstitution materials must be sourced separately.</p>}
          {activeTab === 'storage' && <p>Store lyophilized vials at -20°C. Keep away from direct sunlight. Once reconstituted, store at 2-8°C and use within 30 days depending on the solvent used.</p>}
          {activeTab === 'supply' && <p>Synthesized in advanced facilities, purified via HPLC, and verified by independent ISO-certified Australian laboratories.</p>}
        </div>
      </div>
    </div>
  );
}
