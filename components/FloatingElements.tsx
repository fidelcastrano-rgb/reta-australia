"use client";
import { MessageCircle, X, Mail } from 'lucide-react';
import { useCart } from './CartContext';
import { useState, useEffect } from 'react';

export default function FloatingElements() {
  const { items, removeItem, clearOrder } = useCart();
  const [mounted, setMounted] = useState(false);
  
  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setMounted(true);
  }, []);

  if (!mounted) return null;

  const total = items.reduce((acc, item) => acc + (item.price * item.qty), 0);
  const whatsappNumber = "61485958620"; // Updated site whatsapp number
  
  const generateOrderText = () => {
    let text = "Hi, I would like to order:\n\n";
    items.forEach(item => {
      text += `- ${item.qty}x ${item.name} (${item.variant}) - $${item.price * item.qty}\n`;
    });
    text += `\nTotal: $${total}\n\nPlease confirm availability and payment details.`;
    return encodeURIComponent(text);
  };

  const sendWA = () => {
    window.open(`https://wa.me/${whatsappNumber}?text=${generateOrderText()}`, '_blank');
  };
  
  const sendEmail = () => {
    window.location.href = `mailto:order@reta-australia.com.au?subject=New Order&body=${generateOrderText()}`;
  };

  return (
    <>
      {/* WhatsApp Float */}
      <a
        href={`https://wa.me/${whatsappNumber}`}
        target="_blank"
        rel="noopener noreferrer"
        className="fixed bottom-6 left-6 z-50 flex items-center gap-2 bg-[#25D366] text-white px-4 py-3 rounded-full shadow-lg hover:scale-105 transition-transform hidden sm:flex"
        aria-label="Chat with us on WhatsApp"
      >
        <MessageCircle className="w-6 h-6" />
        <span className="font-medium">Chat with us</span>
      </a>

      {/* Order Builder */}
      <div 
        className={`fixed bottom-0 right-0 sm:bottom-6 sm:right-6 w-full sm:w-96 bg-brand-text text-brand-bg shadow-2xl sm:rounded-none border-t-4 sm:border-4 border-brand-cta transition-transform duration-300 z-50 flex flex-col ${items.length > 0 ? 'translate-y-0' : 'translate-y-[150%]'}`}
      >
        <div className="p-4 flex justify-between items-center border-b border-brand-secondary/20">
          <h3 className="font-sans font-light tracking-tighter text-lg text-brand-bg">Your Order</h3>
          <button onClick={clearOrder} className="text-brand-muted hover:text-brand-bg" aria-label="Clear Order"><X className="w-5 h-5" /></button>
        </div>
        
        <div className="max-h-60 overflow-y-auto p-4 flex flex-col gap-3">
          {items.map(item => (
            <div key={item.key} className="flex justify-between items-start text-sm border border-brand-secondary/20 p-3">
              <div>
                <div className="font-bold text-[10px] uppercase tracking-widest text-brand-success">{item.name}</div>
                <div className="text-brand-muted text-[10px] uppercase">{item.qty}x {item.variant}</div>
              </div>
              <div className="flex flex-col items-end gap-1">
                <span className="font-bold text-brand-bg">${item.price * item.qty}</span>
                <button onClick={() => removeItem(item.key)} className="text-brand-muted text-[10px] uppercase tracking-widest hover:text-brand-bg">Remove</button>
              </div>
            </div>
          ))}
        </div>
        
        <div className="p-4 bg-black/20">
          <div className="flex justify-between font-bold mb-4 text-lg text-brand-success">
            <span>Total:</span>
            <span>${total}</span>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <button onClick={sendWA} className="flex items-center justify-center gap-2 bg-brand-success text-brand-text py-3 text-[10px] uppercase tracking-widest font-bold hover:opacity-90">
              <MessageCircle className="w-4 h-4" /> WhatsApp
            </button>
            <button onClick={sendEmail} className="flex items-center justify-center gap-2 bg-brand-secondary text-brand-text py-3 text-[10px] uppercase tracking-widest font-bold hover:opacity-90">
              <Mail className="w-4 h-4" /> Email
            </button>
          </div>
        </div>
      </div>
    </>
  );
}
