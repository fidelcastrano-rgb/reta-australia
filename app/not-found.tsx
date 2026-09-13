import Link from 'next/link';

export const dynamic = 'force-dynamic';

export default function NotFound() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen">
      <h2 className="text-2xl font-bold">404 - Page Not Found</h2>
      <Link href="/" className="mt-4 text-brand-cta">
        Return Home
      </Link>
    </div>
  );
}
