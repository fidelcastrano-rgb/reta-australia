"use client";
import { MessageCircle, X, Mail } from 'lucide-react';
import { useCart } from './CartContext';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

export default function FloatingElements() {
  const { items, removeItem, clearOrder } = useCart();
  const [mounted, setMounted] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState<'crypto' | 'payid' | 'bank_transfer'>('crypto');
  const [minimized, setMinimized] = useState(false);
  const pathname = usePathname();
  
  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setMounted(true);
  }, []);

  useEffect(() => {
    if (pathname === '/checkout') {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setMinimized(true);
    } else {
      setMinimized(false);
    }
  }, [pathname]);

  if (!mounted) return null;

  const total = items.reduce((acc, item) => acc + (item.price * item.qty), 0);
  const whatsappNumber = "61485958620"; // Updated site whatsapp number

  const isPayidAllowed = total >= 100;
  const isBankTransferAllowed = total >= 200;

  const activePaymentMethod = 
    paymentMethod === 'bank_transfer' && !isBankTransferAllowed
      ? (isPayidAllowed ? 'payid' : 'crypto')
      : (paymentMethod === 'payid' && !isPayidAllowed ? 'crypto' : paymentMethod);
  
  const generateOrderText = () => {
    let text = "Hi, I would like to order:\n\n";
    items.forEach(item => {
      text += `- ${item.qty}x ${item.name} (${item.variant}) - $${item.price * item.qty}\n`;
    });

    const paymentLabels = {
      crypto: "Cryptocurrency (USDT/BTC/LTC - Preferred)",
      payid: "PayID",
      bank_transfer: "Bank Transfer"
    };

    text += `\nTotal: $${total}\n`;
    text += `Payment Method: ${paymentLabels[activePaymentMethod]}\n\n`;
    text += `Please confirm availability and send payment instructions.`;
    return encodeURIComponent(text);
  };

  const sendWA = () => {
    window.open(`https://wa.me/${whatsappNumber}?text=${generateOrderText()}`, '_blank');
  };
  
  const sendEmail = () => {
    window.location.href = `mailto:order@reta-australia.com.au?subject=New Order&body=${generateOrderText()}`;
  };

  const showDrawer = items.length > 0 && !minimized;

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

      {/* Minimized Order Builder Pill */}
      {items.length > 0 && minimized && (
        <button
          onClick={() => setMinimized(false)}
          className="fixed bottom-6 right-6 z-40 flex items-center justify-between gap-4 bg-brand-text text-brand-bg px-5 py-3 border-2 border-brand-cta shadow-xl hover:scale-102 hover:border-brand-success/80 transition-all font-mono text-[10px] uppercase tracking-widest font-bold"
        >
          <span className="flex items-center gap-2">
            <span className="w-2 h-2 bg-brand-success rounded-full animate-pulse" />
            Your Order ({items.reduce((acc, item) => acc + item.qty, 0)})
          </span>
          <span className="text-brand-success">${total}</span>
        </button>
      )}

      {/* Order Builder */}
      <div 
        className={`fixed bottom-0 right-0 sm:bottom-6 sm:right-6 w-full sm:w-96 bg-brand-text text-brand-bg shadow-2xl sm:rounded-none border-t-4 sm:border-4 border-brand-cta transition-transform duration-300 z-50 flex flex-col ${showDrawer ? 'translate-y-0' : 'translate-y-[150%]'}`}
      >
        <div className="p-4 flex justify-between items-center border-b border-brand-secondary/20">
          <h3 className="font-sans font-light tracking-tighter text-lg text-brand-bg">Your Order</h3>
          <div className="flex items-center gap-3">
            <button 
              type="button"
              onClick={clearOrder} 
              className="text-brand-muted hover:text-red-400 text-[10px] uppercase tracking-widest font-mono mr-1"
              title="Clear entire order"
            >
              Clear All
            </button>
            <button 
              type="button"
              onClick={() => setMinimized(true)} 
              className="text-brand-muted hover:text-brand-bg" 
              aria-label="Minimize Order Drawer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>
        
        <div className="max-h-52 overflow-y-auto p-4 flex flex-col gap-3">
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
          {/* Payment Method Selector in Drawer */}
          <div className="mb-4 border-b border-brand-secondary/15 pb-4">
            <div className="text-[10px] uppercase tracking-widest text-brand-muted mb-2 font-mono flex justify-between">
              <span>Payment Method</span>
              <span className="text-brand-success font-bold">Select</span>
            </div>
            <div className="grid grid-cols-3 gap-1.5">
              <button 
                type="button"
                onClick={() => setPaymentMethod('crypto')}
                className={`py-1.5 px-1 text-[9px] uppercase tracking-wider font-bold border transition-all ${
                  activePaymentMethod === 'crypto' 
                    ? 'bg-brand-success text-brand-text border-brand-success' 
                    : 'bg-transparent border-brand-secondary/20 text-brand-muted hover:text-brand-bg hover:border-brand-bg'
                }`}
              >
                Crypto
              </button>
              <button 
                type="button"
                onClick={() => isPayidAllowed && setPaymentMethod('payid')}
                disabled={!isPayidAllowed}
                className={`py-1.5 px-1 text-[9px] uppercase tracking-wider font-bold border transition-all ${
                  activePaymentMethod === 'payid' 
                    ? 'bg-brand-success text-brand-text border-brand-success' 
                    : 'bg-transparent border-brand-secondary/10 text-brand-muted/40 disabled:opacity-30 disabled:cursor-not-allowed'
                } ${isPayidAllowed ? 'hover:text-brand-bg hover:border-brand-bg' : ''}`}
                title={!isPayidAllowed ? "Min $100 for PayID" : "PayID"}
              >
                PayID{!isPayidAllowed && "*"}
              </button>
              <button 
                type="button"
                onClick={() => isBankTransferAllowed && setPaymentMethod('bank_transfer')}
                disabled={!isBankTransferAllowed}
                className={`py-1.5 px-1 text-[9px] uppercase tracking-wider font-bold border transition-all ${
                  activePaymentMethod === 'bank_transfer' 
                    ? 'bg-brand-success text-brand-text border-brand-success' 
                    : 'bg-transparent border-brand-secondary/10 text-brand-muted/40 disabled:opacity-30 disabled:cursor-not-allowed'
                } ${isBankTransferAllowed ? 'hover:text-brand-bg hover:border-brand-bg' : ''}`}
                title={!isBankTransferAllowed ? "Min $200 for Bank Transfer" : "Bank Transfer"}
              >
                Bank{!isBankTransferAllowed && "*"}
              </button>
            </div>
            {!isPayidAllowed && (
              <p className="text-[8px] text-brand-muted/80 mt-1.5 font-light italic">*PayID requires $100+ min, Bank Transfer $200+ min.</p>
            )}
            {isPayidAllowed && !isBankTransferAllowed && (
              <p className="text-[8px] text-brand-muted/80 mt-1.5 font-light italic">*Bank Transfer requires $200+ min.</p>
            )}
          </div>

          <div className="flex justify-between font-bold mb-4 text-lg text-brand-success">
            <span>Total:</span>
            <span>${total}</span>
          </div>

          <div className="flex flex-col gap-2">
            <Link 
              href="/checkout" 
              className="flex items-center justify-center gap-2 bg-brand-success text-brand-text py-3 text-xs uppercase tracking-widest font-bold hover:bg-brand-success/90 transition text-center w-full"
            >
              Secure Checkout
            </Link>
            
            <div className="grid grid-cols-2 gap-2">
              <button 
                onClick={sendWA} 
                className="flex items-center justify-center gap-1 bg-transparent border border-brand-secondary text-brand-bg py-2 text-[9px] uppercase tracking-widest font-semibold hover:bg-brand-secondary/15 hover:text-brand-success transition"
              >
                <MessageCircle className="w-3.5 h-3.5" /> WhatsApp Checkout
              </button>
              <button 
                onClick={sendEmail} 
                className="flex items-center justify-center gap-1 bg-transparent border border-brand-secondary text-brand-bg py-2 text-[9px] uppercase tracking-widest font-semibold hover:bg-brand-secondary/15 hover:text-brand-success transition"
              >
                <Mail className="w-3.5 h-3.5" /> Email Checkout
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
