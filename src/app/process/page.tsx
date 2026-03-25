import { ProcessSection } from '@/components/sections/ProcessSection';
import { CtaSection } from '@/components/sections/CtaSection';

export const metadata = { title: "Our Process | Vaigoo Innovations" };

export default function ProcessPage() {
  return (
    <>
      <div className="pt-12 pb-6 text-center px-4">
        <h1 className="text-5xl md:text-6xl font-black text-slate-900 mb-6">How We <span className="text-gradient-primary">Build</span></h1>
        <p className="text-xl text-slate-600 max-w-2xl mx-auto">A transparent, engineering-first approach to delivering high-performance software.</p>
      </div>
      
      <ProcessSection />
      <CtaSection />
    </>
  );
}
