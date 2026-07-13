'use client';

import { useEffect } from 'react';

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error('Global application error:', error);
  }, [error]);

  return (
    <html lang="en">
      <body className="bg-brand-bg text-brand-text font-sans antialiased min-h-screen flex items-center justify-center p-4">
        <div className="max-w-xl w-full bg-white p-12 border border-brand-border text-center">
          <h2 className="text-2xl font-heading font-light tracking-tighter mb-4">
            Critical System Error
          </h2>
          <p className="text-brand-muted mb-8 text-sm leading-relaxed">
            A critical system error has occurred. Please reset the application to restore services.
          </p>
          <button
            onClick={() => reset()}
            className="bg-brand-cta text-white font-bold text-xs uppercase tracking-widest py-3 px-8 hover:bg-opacity-90 transition"
          >
            Reset Application
          </button>
        </div>
      </body>
    </html>
  );
}
