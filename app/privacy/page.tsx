export const metadata = { title: 'Privacy Policy' };

export default function PrivacyPage() {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-24 prose prose-lg prose-slate">
      <h1 className="text-4xl font-heading font-black mb-8 text-brand-text">Privacy Policy</h1>
      <p className="font-medium text-brand-muted border-b border-brand-border pb-8">Last Updated: July 2026</p>
      
      <h2 className="text-2xl font-bold mt-8 mb-4">1. Information We Collect</h2>
      <p className="text-brand-muted font-medium mb-6">We only collect the information necessary to process your order, such as your name, shipping address, and contact details (email or phone number).</p>
      
      <h2 className="text-2xl font-bold mt-8 mb-4">2. How We Use Your Information</h2>
      <p className="text-brand-muted font-medium mb-6">Your information is used exclusively to fulfill orders, provide customer support, and communicate shipping updates.</p>
      
      <h2 className="text-2xl font-bold mt-8 mb-4">3. Data Security</h2>
      <p className="text-brand-muted font-medium mb-6">We implement strict security measures to protect your personal information. We do not sell or share your data with third parties, except as required by law or for shipping purposes.</p>
      
      <h2 className="text-2xl font-bold mt-8 mb-4">4. Cookies</h2>
      <p className="text-brand-muted font-medium mb-6">Our website uses minimal cookies to ensure proper functionality and performance. By using our site, you consent to our use of cookies.</p>
    </div>
  );
}
