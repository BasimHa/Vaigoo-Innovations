import { WhyVaigooSection } from '@/components/sections/WhyVaigooSection';
import { CtaSection } from '@/components/sections/CtaSection';

export const metadata = { title: "About Us | Vaigoo Innovations" };

export default function AboutPage() {
  return (
    <>
      <div className="pt-12 pb-6 text-center px-4">
        <h1 className="text-5xl md:text-6xl font-black text-slate-900 mb-6">
          Architects of the <span className="text-gradient-primary">Future</span>
        </h1>
        <p className="text-xl text-slate-600 max-w-3xl mx-auto leading-relaxed mb-16">
          Vaigoo Innovations is an advanced technology company bridging the gap between bold ideas and robust digital reality. We believe in engineering excellence, AI integration, and design that converts.
        </p>
      </div>
      
      <WhyVaigooSection />
      <CtaSection />
    </>
  );
}
