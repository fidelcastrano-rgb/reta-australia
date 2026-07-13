'use client';

import { useState, useEffect } from 'react';
import { useCart } from '@/components/CartContext';
import Link from 'next/link';
import { motion } from 'motion/react';
import { Loader2 } from 'lucide-react';

export default function CheckoutPage() {
  const { items, clearOrder, removeItem } = useCart();
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    address: '',
    city: '',
    state: '',
    postcode: '',
    country: 'Australia',
  });
  const [shippingMethod, setShippingMethod] = useState<'normal' | 'express'>('normal');
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState<'crypto' | 'payid' | 'bank_transfer'>('crypto');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const subtotal = items.reduce((sum, item) => sum + item.price * item.qty, 0);
  const shippingCost = shippingMethod === 'normal' ? 20 : 70;
  const total = subtotal + shippingCost;

  const isCryptoAllowed = true;
  const isPayidAllowed = total >= 100;
  const isBankTransferAllowed = total >= 200;

  // Derive the active payment method during render
  let paymentMethod = selectedPaymentMethod;
  if (paymentMethod === 'payid' && !isPayidAllowed) {
    paymentMethod = 'crypto';
  } else if (paymentMethod === 'bank_transfer' && !isBankTransferAllowed) {
    paymentMethod = isPayidAllowed ? 'payid' : 'crypto';
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (items.length === 0) return;
    setIsSubmitting(true);
    setError('');

    try {
      const response = await fetch('/api/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...formData,
          shippingMethod,
          paymentMethod,
          items,
          subtotal,
          shippingCost,
          total,
        }),
      });

      if (!response.ok) {
        const errData = await response.json().catch(() => ({}));
        throw new Error(errData.error || 'Failed to process order. Please try again.');
      }

      clearOrder();
      setSuccess(true);
    } catch (err: any) {
      setError(err.message || 'Something went wrong');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (success) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-24 text-center">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="bg-white p-12 border border-brand-border">
          <h1 className="text-3xl font-heading font-light tracking-tighter mb-6">Order Received</h1>
          <p className="text-brand-muted mb-6 leading-relaxed">
            Thank you for your order. We have received your order details and sent a confirmation email to <strong>{formData.email}</strong>. Our team will contact you manually with custom payment instructions shortly.
          </p>
          <div className="bg-brand-secondary p-6 mb-8 text-sm text-left">
            <h3 className="font-bold mb-4 uppercase tracking-widest text-xs">Important Information</h3>
            <p className="text-brand-muted leading-relaxed">
              Please note that your order will be processed and shipped once your payment has cleared on our end. Once cleared, we will process and ship your order, and your tracking number will be emailed to you. We appreciate your patience.
            </p>
          </div>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/" className="inline-block border border-brand-text text-brand-text font-bold text-xs uppercase tracking-widest py-4 px-8 hover:bg-brand-secondary transition">
              Back to Home
            </Link>
            <Link href="/products" className="inline-block bg-brand-cta text-white font-bold text-xs uppercase tracking-widest py-4 px-8 hover:bg-opacity-90 transition">
              Continue Shopping
            </Link>
          </div>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <h1 className="text-4xl font-heading font-light tracking-tighter mb-12">Checkout</h1>

      {items.length === 0 ? (
        <div className="text-center py-12 bg-white border border-brand-border">
          <p className="text-brand-muted mb-6">Your cart is empty.</p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/" className="inline-block border border-brand-text text-brand-text font-bold text-xs uppercase tracking-widest py-3 px-8 hover:bg-brand-secondary transition">
              Back to Home
            </Link>
            <Link href="/products" className="inline-block bg-brand-cta text-white font-bold text-xs uppercase tracking-widest py-3 px-8 hover:bg-opacity-90 transition">
              Browse Products
            </Link>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
          {/* Form Section */}
          <div className="lg:col-span-7">
            <form id="checkout-form" onSubmit={handleSubmit} className="space-y-10">
              {/* Contact Info */}
              <section>
                <h2 className="text-sm font-bold uppercase tracking-widest mb-6 border-b border-brand-border pb-4">Contact Information</h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="firstName" className="block text-xs font-bold text-brand-muted uppercase tracking-wide mb-2">First Name</label>
                    <input type="text" id="firstName" name="firstName" required value={formData.firstName} onChange={handleInputChange} className="w-full border border-brand-border p-3 text-sm focus:outline-none focus:border-brand-text bg-transparent" />
                  </div>
                  <div>
                    <label htmlFor="lastName" className="block text-xs font-bold text-brand-muted uppercase tracking-wide mb-2">Last Name</label>
                    <input type="text" id="lastName" name="lastName" required value={formData.lastName} onChange={handleInputChange} className="w-full border border-brand-border p-3 text-sm focus:outline-none focus:border-brand-text bg-transparent" />
                  </div>
                  <div className="sm:col-span-2">
                    <label htmlFor="email" className="block text-xs font-bold text-brand-muted uppercase tracking-wide mb-2">Email Address</label>
                    <input type="email" id="email" name="email" required value={formData.email} onChange={handleInputChange} className="w-full border border-brand-border p-3 text-sm focus:outline-none focus:border-brand-text bg-transparent" />
                  </div>
                  <div className="sm:col-span-2">
                    <label htmlFor="phone" className="block text-xs font-bold text-brand-muted uppercase tracking-wide mb-2">Phone Number</label>
                    <input type="tel" id="phone" name="phone" required value={formData.phone} onChange={handleInputChange} className="w-full border border-brand-border p-3 text-sm focus:outline-none focus:border-brand-text bg-transparent" />
                  </div>
                </div>
              </section>

              {/* Shipping Address */}
              <section>
                <h2 className="text-sm font-bold uppercase tracking-widest mb-6 border-b border-brand-border pb-4">Shipping Address</h2>
                <div className="space-y-4">
                  <div>
                    <label htmlFor="address" className="block text-xs font-bold text-brand-muted uppercase tracking-wide mb-2">Street Address</label>
                    <input type="text" id="address" name="address" required value={formData.address} onChange={handleInputChange} className="w-full border border-brand-border p-3 text-sm focus:outline-none focus:border-brand-text bg-transparent" />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label htmlFor="city" className="block text-xs font-bold text-brand-muted uppercase tracking-wide mb-2">City / Suburb</label>
                      <input type="text" id="city" name="city" required value={formData.city} onChange={handleInputChange} className="w-full border border-brand-border p-3 text-sm focus:outline-none focus:border-brand-text bg-transparent" />
                    </div>
                    <div>
                      <label htmlFor="state" className="block text-xs font-bold text-brand-muted uppercase tracking-wide mb-2">State</label>
                      <input type="text" id="state" name="state" required value={formData.state} onChange={handleInputChange} className="w-full border border-brand-border p-3 text-sm focus:outline-none focus:border-brand-text bg-transparent" />
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label htmlFor="postcode" className="block text-xs font-bold text-brand-muted uppercase tracking-wide mb-2">Postcode</label>
                      <input type="text" id="postcode" name="postcode" required value={formData.postcode} onChange={handleInputChange} className="w-full border border-brand-border p-3 text-sm focus:outline-none focus:border-brand-text bg-transparent" />
                    </div>
                    <div>
                      <label htmlFor="country" className="block text-xs font-bold text-brand-muted uppercase tracking-wide mb-2">Country</label>
                      <input type="text" id="country" name="country" readOnly value={formData.country} className="w-full border border-brand-border p-3 text-sm bg-brand-secondary text-brand-muted outline-none cursor-not-allowed" />
                    </div>
                  </div>
                </div>
              </section>

              {/* Shipping Method */}
              <section>
                <h2 className="text-sm font-bold uppercase tracking-widest mb-6 border-b border-brand-border pb-4">Shipping Method</h2>
                <div className="space-y-3">
                  <label className={`block border p-4 cursor-pointer transition ${shippingMethod === 'normal' ? 'border-brand-text bg-brand-secondary' : 'border-brand-border hover:border-gray-400'}`}>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <input type="radio" name="shipping" value="normal" checked={shippingMethod === 'normal'} onChange={() => setShippingMethod('normal')} className="accent-brand-text" />
                        <span className="text-sm font-bold">Normal Shipping</span>
                      </div>
                      <span className="font-mono text-sm">$20.00</span>
                    </div>
                  </label>
                  <label className={`block border p-4 cursor-pointer transition ${shippingMethod === 'express' ? 'border-brand-text bg-brand-secondary' : 'border-brand-border hover:border-gray-400'}`}>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <input type="radio" name="shipping" value="express" checked={shippingMethod === 'express'} onChange={() => setShippingMethod('express')} className="accent-brand-text" />
                        <span className="text-sm font-bold">Express Shipping</span>
                      </div>
                      <span className="font-mono text-sm">$70.00</span>
                    </div>
                  </label>
                </div>
              </section>

              {/* Payment Method */}
              <section>
                <h2 className="text-sm font-bold uppercase tracking-widest mb-6 border-b border-brand-border pb-4">Payment Method</h2>
                
                <div className="bg-brand-secondary p-4 text-xs space-y-2 mb-6 border border-brand-border">
                  <div className="font-bold text-brand-text uppercase tracking-wider">Payment Requirements:</div>
                  <ul className="list-disc list-inside text-brand-muted space-y-1">
                    <li><strong>Cryptocurrency</strong>: Available for all orders (No limits) - <span className="text-brand-text font-bold">Preferred</span></li>
                    <li><strong>PayID</strong>: Available for orders of <strong>$100 AUD</strong> or more</li>
                    <li><strong>Bank Transfer</strong>: Available for orders of <strong>$200 AUD</strong> or more</li>
                  </ul>
                </div>

                <div className="space-y-3">
                  <label className={`block border p-4 cursor-pointer transition ${paymentMethod === 'crypto' ? 'border-brand-text bg-brand-secondary' : 'border-brand-border hover:border-gray-400'}`}>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <input type="radio" name="payment" value="crypto" checked={paymentMethod === 'crypto'} onChange={() => setSelectedPaymentMethod('crypto')} className="accent-brand-text" />
                        <span className="text-sm font-bold">Crypto (USDT / BTC / LTC etc.)</span>
                      </div>
                      <span className="bg-brand-text text-brand-bg text-[9px] uppercase font-bold tracking-widest px-2 py-1">MOST PREFERRED</span>
                    </div>
                    {paymentMethod === 'crypto' && (
                      <p className="text-xs text-brand-muted mt-3 ml-7">
                        Pay using cryptocurrency. This is our <strong>most preferred and best option</strong> with <strong>no delay in confirmation and processing</strong>. We will contact you manually with the transfer details shortly.
                      </p>
                    )}
                  </label>
                  
                  <label className={`block border p-4 transition ${
                    isPayidAllowed 
                      ? (paymentMethod === 'payid' ? 'border-brand-text bg-brand-secondary cursor-pointer' : 'border-brand-border hover:border-gray-400 cursor-pointer') 
                      : 'border-brand-border bg-gray-50 opacity-60 cursor-not-allowed'
                  }`}>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <input 
                          type="radio" 
                          name="payment" 
                          value="payid" 
                          checked={paymentMethod === 'payid'} 
                          disabled={!isPayidAllowed}
                          onChange={() => isPayidAllowed && setSelectedPaymentMethod('payid')} 
                          className="accent-brand-text disabled:opacity-50" 
                        />
                        <span className={`text-sm font-bold ${!isPayidAllowed ? 'text-brand-muted' : ''}`}>PayID</span>
                      </div>
                      {!isPayidAllowed && (
                        <span className="text-[10px] text-red-600 font-bold bg-red-50 px-2 py-1 uppercase tracking-wider">Orders $100+ Only</span>
                      )}
                    </div>
                    {isPayidAllowed && paymentMethod === 'payid' && (
                      <p className="text-xs text-brand-muted mt-3 ml-7">Pay using PayID. Our team will contact you manually with the PayID payment instructions shortly.</p>
                    )}
                  </label>

                  <label className={`block border p-4 transition ${
                    isBankTransferAllowed 
                      ? (paymentMethod === 'bank_transfer' ? 'border-brand-text bg-brand-secondary cursor-pointer' : 'border-brand-border hover:border-gray-400 cursor-pointer') 
                      : 'border-brand-border bg-gray-50 opacity-60 cursor-not-allowed'
                  }`}>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <input 
                          type="radio" 
                          name="payment" 
                          value="bank_transfer" 
                          checked={paymentMethod === 'bank_transfer'} 
                          disabled={!isBankTransferAllowed}
                          onChange={() => isBankTransferAllowed && setSelectedPaymentMethod('bank_transfer')} 
                          className="accent-brand-text disabled:opacity-50" 
                        />
                        <span className={`text-sm font-bold ${!isBankTransferAllowed ? 'text-brand-muted' : ''}`}>Bank Transfer</span>
                      </div>
                      {!isBankTransferAllowed && (
                        <span className="text-[10px] text-red-600 font-bold bg-red-50 px-2 py-1 uppercase tracking-wider">Orders $200+ Only</span>
                      )}
                    </div>
                    {isBankTransferAllowed && paymentMethod === 'bank_transfer' && (
                      <p className="text-xs text-brand-muted mt-3 ml-7">Pay via Direct Bank Transfer. Our team will contact you manually with the bank BSB and Account details shortly.</p>
                    )}
                  </label>
                </div>
              </section>

              {error && (
                <div className="p-4 bg-red-50 text-red-600 border border-red-200 text-sm">
                  {error}
                </div>
              )}

              <div className="bg-brand-secondary p-6 text-xs text-brand-muted border-l-2 border-brand-text">
                <p>Please note that your order will be processed and shipped once your payment has cleared on our end. Once cleared, we will process and ship your order, and your tracking number will be emailed to you. We appreciate your patience.</p>
              </div>

            </form>
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-5">
            <div className="bg-white border border-brand-border p-6 lg:p-8 sticky top-28">
              <h2 className="text-sm font-bold uppercase tracking-widest mb-6 border-b border-brand-border pb-4">Order Summary</h2>
              
              <div className="space-y-4 mb-6 max-h-96 overflow-y-auto pr-2">
                {items.map(item => (
                  <div key={item.key} className="flex justify-between items-start">
                    <div className="flex gap-4">
                      <div className="relative">
                        <span className="absolute -top-2 -right-2 bg-brand-text text-white text-[10px] w-5 h-5 flex items-center justify-center rounded-full z-10">
                          {item.qty}
                        </span>
                        <div className="w-16 h-16 bg-brand-secondary border border-brand-border flex items-center justify-center text-xs text-brand-muted font-bold text-center p-1">
                          {item.name.substring(0, 15)}
                        </div>
                      </div>
                      <div>
                        <h4 className="text-xs font-bold uppercase">{item.name}</h4>
                        <p className="text-xs text-brand-muted mt-1">{item.variant}</p>
                        <button onClick={() => removeItem(item.key)} className="text-[10px] text-red-500 hover:text-red-700 mt-2 uppercase tracking-wide">Remove</button>
                      </div>
                    </div>
                    <span className="font-mono text-sm">${(item.price * item.qty).toFixed(2)}</span>
                  </div>
                ))}
              </div>

              <div className="space-y-3 text-sm border-t border-brand-border pt-6 mb-6">
                <div className="flex justify-between">
                  <span className="text-brand-muted">Subtotal</span>
                  <span className="font-mono">${subtotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-brand-muted">Shipping</span>
                  <span className="font-mono">${shippingCost.toFixed(2)}</span>
                </div>
              </div>

              <div className="flex justify-between items-center text-lg font-bold border-t border-brand-border pt-6 mb-8">
                <span>Total</span>
                <span className="font-mono text-brand-accent">${total.toFixed(2)} <span className="text-xs text-brand-muted ml-1">AUD</span></span>
              </div>

              <button 
                type="submit" 
                form="checkout-form"
                disabled={isSubmitting}
                className="w-full bg-brand-cta text-white font-bold text-xs uppercase tracking-widest py-4 flex justify-center items-center gap-2 hover:bg-opacity-90 transition disabled:opacity-70 disabled:cursor-not-allowed"
              >
                {isSubmitting ? (
                  <><Loader2 className="w-4 h-4 animate-spin" /> Processing...</>
                ) : (
                  'Place Order'
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
