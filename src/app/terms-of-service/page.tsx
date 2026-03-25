export const metadata = { title: "Terms of Service | Vaigoo Innovations" };

export default function TermsOfServicePage() {
  return (
    <div className="pt-32 pb-16 px-4 max-w-4xl mx-auto">
      <h1 className="text-4xl md:text-5xl font-black text-slate-900 mb-4">Terms of <span className="text-gradient-primary">Service</span></h1>
      <p className="text-lg text-slate-500 mb-12">Effective Date: 25-03-2026</p>
      
      <div className="prose prose-slate max-w-none text-slate-700 space-y-8 text-lg leading-relaxed">
        <p>Welcome to Vaigoo Innovations. By accessing our website vaigooinnovation.online, you agree to the following terms.</p>

        <div>
          <h2 className="text-2xl font-bold text-slate-900 mb-4">1. Services</h2>
          <p className="mb-2">Vaigoo Innovations provides:</p>
          <ul className="list-disc pl-6 space-y-2">
            <li>Website development</li>
            <li>AI-powered solutions</li>
            <li>Hosting & domain services</li>
            <li>Custom digital services</li>
          </ul>
        </div>

        <div>
          <h2 className="text-2xl font-bold text-slate-900 mb-4">2. Use of Website</h2>
          <p className="mb-2">You agree not to:</p>
          <ul className="list-disc pl-6 space-y-2">
            <li>Use the site for illegal purposes</li>
            <li>Attempt to hack or disrupt services</li>
            <li>Copy or reproduce content without permission</li>
          </ul>
        </div>

        <div>
          <h2 className="text-2xl font-bold text-slate-900 mb-4">3. Intellectual Property</h2>
          <p>All content (design, code, branding) is owned by Vaigoo Innovations unless stated otherwise.</p>
        </div>

        <div>
          <h2 className="text-2xl font-bold text-slate-900 mb-4">4. Payments & Projects</h2>
          <ul className="list-disc pl-6 space-y-2">
            <li>Project timelines and costs are agreed upon before starting</li>
            <li>Payments may be required upfront or in milestones</li>
            <li>No refunds unless explicitly agreed</li>
          </ul>
        </div>

        <div>
          <h2 className="text-2xl font-bold text-slate-900 mb-4">5. Limitation of Liability</h2>
          <p className="mb-2">We are not liable for:</p>
          <ul className="list-disc pl-6 space-y-2">
            <li>Data loss</li>
            <li>Business losses due to service interruptions</li>
            <li>Third-party service failures</li>
          </ul>
        </div>

        <div>
          <h2 className="text-2xl font-bold text-slate-900 mb-4">6. Termination</h2>
          <p>We reserve the right to suspend services if terms are violated.</p>
        </div>

        <div>
          <h2 className="text-2xl font-bold text-slate-900 mb-4">7. Changes to Terms</h2>
          <p>We may update these terms at any time. Continued use means acceptance.</p>
        </div>

        <div>
          <h2 className="text-2xl font-bold text-slate-900 mb-4">8. Contact</h2>
          <p>📧 Email: basimhassan325@gmail.com</p>
        </div>
      </div>
    </div>
  );
}
