'use client';

import { useEffect } from 'react';

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error('Application error:', error);
  }, [error]);

  return (
    <div className="max-w-xl mx-auto px-4 py-24 text-center">
      <div className="bg-white p-12 border border-brand-border">
        <h2 className="text-2xl font-heading font-light tracking-tighter mb-4">
          Something went wrong!
        </h2>
        <p className="text-brand-muted mb-8 text-sm leading-relaxed">
          An unexpected error occurred while processing this request. Please try reloading the page.
        </p>
        <button
          onClick={() => reset()}
          className="bg-brand-cta text-white font-bold text-xs uppercase tracking-widest py-3 px-8 hover:bg-opacity-90 transition"
        >
          Try Again
        </button>
      </div>
    </div>
  );
}
