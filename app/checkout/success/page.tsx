'use client';

import { Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { motion } from 'motion/react';
import { CheckCircle2, ShieldCheck, Truck, ArrowRight, Mail } from 'lucide-react';

function SuccessContent() {
  const searchParams = useSearchParams();
  const orderRef = searchParams.get('order_ref') || 'CONFIRMED';

  return (
    <div className="max-w-3xl mx-auto px-4 py-20">
      <motion.div 
        initial={{ opacity: 0, y: 20 }} 
        animate={{ opacity: 1, y: 0 }} 
        className="bg-white p-8 sm:p-12 border border-brand-border shadow-sm text-center"
      >
        <div className="w-16 h-16 bg-emerald-50 rounded-full flex items-center justify-center mx-auto mb-6 border border-emerald-200">
          <CheckCircle2 className="w-8 h-8 text-emerald-600" />
        </div>

        <span className="text-[10px] uppercase font-mono tracking-widest text-brand-muted bg-brand-secondary px-3 py-1 border border-brand-border inline-block mb-3">
          Order Reference: #{orderRef}
        </span>

        <h1 className="text-3xl sm:text-4xl font-heading font-light tracking-tight mb-4 text-brand-text">
          Thank You For Your Order
        </h1>
        
        <p className="text-brand-muted text-sm sm:text-base mb-8 max-w-lg mx-auto leading-relaxed">
          Your order has been recorded in our system. A full receipt with order breakdown and instructions has been emailed to you.
        </p>

        {/* Status card */}
        <div className="bg-brand-secondary/60 border border-brand-border p-6 text-left mb-8 space-y-4">
          <div className="flex items-start gap-3">
            <Mail className="w-5 h-5 text-brand-text shrink-0 mt-0.5" />
            <div>
              <h4 className="text-xs font-bold uppercase tracking-wider text-brand-text">Payment &amp; Processing</h4>
              <p className="text-xs text-brand-muted mt-0.5 leading-relaxed">
                If you selected Credit Card or manual payment, payment instructions or a secure payment link will be sent to your email to complete your payment.
              </p>
            </div>
          </div>

          <div className="flex items-start gap-3 border-t border-brand-border pt-4">
            <Truck className="w-5 h-5 text-brand-text shrink-0 mt-0.5" />
            <div>
              <h4 className="text-xs font-bold uppercase tracking-wider text-brand-text">Fast Local Express Dispatch</h4>
              <p className="text-xs text-brand-muted mt-0.5 leading-relaxed">
                Orders placed before 2:00 PM AEST are dispatched same/next business day with discrete Australia Post express tracking once payment clears.
              </p>
            </div>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link 
            href="/products" 
            className="inline-flex items-center justify-center gap-2 bg-brand-cta text-white font-bold text-xs uppercase tracking-widest py-4 px-8 hover:bg-opacity-90 transition"
          >
            Browse More Research Compounds <ArrowRight className="w-4 h-4" />
          </Link>
          <Link 
            href="/" 
            className="inline-flex items-center justify-center gap-2 border border-brand-border text-brand-text font-bold text-xs uppercase tracking-widest py-4 px-8 hover:bg-brand-secondary transition"
          >
            Back to Home
          </Link>
        </div>
      </motion.div>
    </div>
  );
}

export default function CheckoutSuccessPage() {
  return (
    <Suspense fallback={
      <div className="max-w-3xl mx-auto px-4 py-24 text-center">
        <div className="p-12 bg-white border border-brand-border">
          <p className="text-sm font-mono text-brand-muted">Loading order confirmation...</p>
        </div>
      </div>
    }>
      <SuccessContent />
    </Suspense>
  );
}
