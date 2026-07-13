export const metadata = { title: 'Terms of Use' };

export default function TermsPage() {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-24 prose prose-lg prose-slate">
      <h1 className="text-4xl font-heading font-black mb-8 text-brand-text">Terms of Use</h1>
      <p className="font-medium text-brand-muted border-b border-brand-border pb-8">Last Updated: July 2026</p>
      
      <h2 className="text-2xl font-bold mt-8 mb-4">1. Introduction</h2>
      <p className="text-brand-muted font-medium mb-6">Welcome to Retatrutide Australia. By using this website, you agree to these terms of use. Please read them carefully.</p>
      
      <h2 className="text-2xl font-bold mt-8 mb-4">2. Use of Products</h2>
      <p className="text-brand-muted font-medium mb-6">All products sold on this website are strictly for laboratory research and development purposes only. They are not intended for human or animal consumption, diagnosis, treatment, or cure of any disease.</p>
      
      <h2 className="text-2xl font-bold mt-8 mb-4">3. User Responsibilities</h2>
      <p className="text-brand-muted font-medium mb-6">You must be at least 18 years old to purchase from this site. By purchasing, you acknowledge that you are a qualified researcher familiar with the properties and handling of these materials.</p>
      
      <h2 className="text-2xl font-bold mt-8 mb-4">4. Liability</h2>
      <p className="text-brand-muted font-medium mb-6">Retatrutide Australia shall not be held liable for any damages resulting from the handling, misapplication, or misuse of any products sold.</p>
    </div>
  );
}
