"use client";
import { useState } from 'react';
import { useCart } from '@/components/CartContext';
import { FileText, MessageCircle, AlertCircle, ShieldCheck } from 'lucide-react';

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

  const whatsappText = encodeURIComponent(`Hi, I would like to order: ${product.name} (${selectedVariant.name}) for $${selectedVariant.price} AUD.`);
  const coaWhatsappText = encodeURIComponent(`Hi RetaAustralia, I would like to request the Certificate of Analysis (COA) testing report for ${product.name}.`);

  return (
    <div>
      {/* Minimum Vial Order & Volume Discount Alert */}
      {product.isVial && (
        <div className="mb-6 p-4 bg-brand-secondary border border-brand-border rounded-lg">
          <div className="flex items-center gap-2 text-xs font-bold text-brand-text uppercase tracking-wider mb-1">
            <AlertCircle className="w-4 h-4 text-brand-success" />
            Minimum Order: 10 Vials
          </div>
          <p className="text-xs text-brand-muted font-light leading-relaxed">
            All vial products are supplied with a strict minimum quantity of 10 vials. The more you buy, the greater the volume discount!
          </p>
        </div>
      )}

      <div className="mb-6">
        <div className="text-xs text-brand-muted uppercase font-bold tracking-wider mb-2">
          Select Package Option {product.isVial ? '(10 Vials Minimum)' : ''}
        </div>
        <div className="flex flex-col gap-2.5">
          {product.variants.map((v: any) => (
            <button 
              key={v.name}
              onClick={() => setSelectedVariant(v)}
              className={`w-full p-3.5 border transition-all text-left flex justify-between items-center ${
                selectedVariant.name === v.name 
                  ? 'bg-brand-text text-white border-brand-text shadow' 
                  : 'bg-white border-brand-border text-brand-text hover:border-brand-text'
              }`}
            >
              <div>
                <div className="font-bold text-sm tracking-wide">{v.name}</div>
                {v.savingsLabel && (
                  <div className={`text-[11px] font-mono mt-0.5 ${selectedVariant.name === v.name ? 'text-brand-success font-bold' : 'text-brand-success'}`}>
                    {v.savingsLabel}
                  </div>
                )}
              </div>
              <div className="text-right">
                <div className="font-heading font-light text-lg">${v.price} AUD</div>
              </div>
            </button>
          ))}
        </div>
      </div>

      <div className="flex items-end justify-between mb-8 pb-4 border-b border-brand-border">
        <div>
          <div className="text-xs text-brand-muted uppercase font-bold tracking-wider mb-1">Selected Price</div>
          <div className="text-3xl font-heading font-light text-brand-text">${selectedVariant.price} AUD</div>
        </div>
        <div className="text-right">
          <span className="text-[10px] font-mono uppercase bg-brand-secondary border border-brand-border px-3 py-1.5 text-brand-text font-bold">
            Min Store Order: $150 AUD
          </span>
        </div>
      </div>

      <div className="flex flex-col gap-3 mb-8">
        <button 
          onClick={handleAdd}
          className={`w-full py-4 font-bold text-xs uppercase tracking-widest transition shadow-lg border border-brand-text ${added ? 'bg-brand-secondary text-brand-text' : 'bg-brand-cta text-white hover:bg-opacity-90'}`}
        >
          {added ? '✓ Added to Order Builder' : 'Add to Order Builder'}
        </button>
        <a 
          href={`https://wa.me/61485958620?text=${whatsappText}`}
          target="_blank"
          rel="noopener noreferrer"
          className="w-full flex justify-center items-center gap-2 py-4 font-bold text-xs uppercase tracking-widest bg-[#25D366] text-white hover:bg-opacity-90 shadow transition"
        >
          <MessageCircle className="w-4 h-4" /> Order via WhatsApp
        </a>
        
        {/* COA Request Section */}
        <div className="mt-2 p-4 bg-white border border-brand-border text-center">
          <div className="flex items-center justify-center gap-2 text-xs font-bold text-brand-text uppercase tracking-widest mb-2">
            <ShieldCheck className="w-4 h-4 text-brand-success" /> Certificate of Analysis (COA)
          </div>
          <p className="text-xs text-brand-muted mb-3 font-light">
            Every batch undergoes independent 3rd-party HPLC & MS lab testing. COAs are available upon request for any batch.
          </p>
          <a
            href={`https://wa.me/61485958620?text=${coaWhatsappText}`}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center justify-center gap-2 px-5 py-2.5 text-[11px] font-bold uppercase tracking-widest border border-brand-border text-brand-text hover:bg-brand-secondary transition"
          >
            <FileText className="w-4 h-4 text-brand-muted" /> Request COA via WhatsApp
          </a>
        </div>
      </div>

      {/* Tabs */}
      <div className="border border-brand-border overflow-hidden">
        <div className="flex border-b border-brand-border bg-brand-secondary">
          {[
            { id: 'contents', label: 'Contents' },
            { id: 'storage', label: 'Storage' },
            { id: 'supply', label: 'Supply Chain' }
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex-1 py-3 text-xs font-bold uppercase tracking-wider text-center transition ${activeTab === tab.id ? 'bg-white text-brand-text border-b-2 border-brand-text' : 'text-brand-muted hover:text-brand-text'}`}
            >
              {tab.label}
            </button>
          ))}
        </div>
        <div className="p-6 bg-white text-xs text-brand-muted font-light leading-relaxed">
          {activeTab === 'contents' && <p>Each vial contains precisely formulated lyophilized powder. Minimal quantity requirement is 10 vials. No diluent is included. Reconstitution materials must be sourced separately.</p>}
          {activeTab === 'storage' && <p>Store lyophilized vials at -20°C. Keep away from direct sunlight. Once reconstituted, store at 2-8°C and use within 30 days depending on the solvent used.</p>}
          {activeTab === 'supply' && <p>Synthesized in advanced ISO-certified facilities, purified via HPLC (&gt;99% purity guarantee), and verified by independent laboratory batch analysis.</p>}
        </div>
      </div>
    </div>
  );
}
