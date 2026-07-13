import { blogPosts } from '@/lib/data';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { ArrowLeft } from 'lucide-react';

export async function generateStaticParams() {
  return blogPosts.map((post) => ({
    slug: post.slug,
  }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const post = blogPosts.find(p => p.slug === slug);
  if (!post) return { title: 'Not Found' };
  return { title: post.title, description: post.excerpt };
}

export default async function BlogPost({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const post = blogPosts.find(p => p.slug === slug);
  if (!post) notFound();

  return (
    <article className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
      <Link href="/blog" className="inline-flex items-center gap-2 text-brand-muted hover:text-brand-text font-bold mb-10 transition-colors">
        <ArrowLeft className="w-4 h-4" /> Back to blog
      </Link>
      
      <header className="mb-12">
        <div className="flex items-center gap-4 text-[10px] font-mono uppercase tracking-widest text-brand-muted mb-6">
          <span>{post.date}</span>
          <span>•</span>
          <span>By {post.author}</span>
        </div>
        <h1 className="text-4xl md:text-5xl font-heading font-light tracking-tighter leading-tight mb-8 text-brand-text">{post.title}</h1>
      </header>

      {(post as any).image && (
        <div className="relative w-full h-64 md:h-96 mb-12 border border-brand-border">
          <Image referrerPolicy="no-referrer" src={(post as any).image} alt={post.title} fill className="object-cover grayscale" />
        </div>
      )}

      <div className="prose prose-lg max-w-none text-brand-text">
        {post.content.split('\n\n').map((paragraph, i) => {
          if (paragraph.startsWith('## ')) {
            return <h2 key={i} className="text-3xl font-heading font-light tracking-tighter mt-10 mb-4 text-brand-text">{paragraph.replace('## ', '')}</h2>;
          }
          if (paragraph.startsWith('### ')) {
            return <h3 key={i} className="text-2xl font-heading font-light tracking-tighter mt-8 mb-3 text-brand-text">{paragraph.replace('### ', '')}</h3>;
          }
          return <p key={i} className="mb-6 leading-relaxed font-light text-brand-muted">{paragraph}</p>;
        })}
      </div>
      
      <div className="mt-16 pt-12 border-t border-brand-border">
        <div className="bg-brand-bg p-10 border border-brand-border text-center">
          <h3 className="text-2xl font-light tracking-tighter mb-4 text-brand-text">Looking for high-purity peptides?</h3>
          <p className="text-brand-muted font-light mb-8">Browse our complete catalogue of third-party tested research peptides with next-day Australian shipping.</p>
          <Link href="/products" className="inline-block bg-brand-cta text-white font-bold py-4 px-10 text-[10px] uppercase tracking-widest hover:opacity-90">
            Shop Now
          </Link>
        </div>
      </div>
    </article>
  );
}
