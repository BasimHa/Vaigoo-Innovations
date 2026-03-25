import { ProjectsSection } from '@/components/sections/ProjectsSection';
import { CtaSection } from '@/components/sections/CtaSection';

export const metadata = { title: "Case Studies | Vaigoo Innovations" };

export default function ProjectsPage() {
  return (
    <>
      <div className="pt-12 pb-6 text-center px-4">
        <h1 className="text-5xl md:text-6xl font-black text-slate-900 mb-6">Our <span className="text-gradient-primary">Portfolio</span></h1>
        <p className="text-xl text-slate-600 max-w-2xl mx-auto">Explore the range of high-performance digital solutions we've engineered.</p>
      </div>
      
      <ProjectsSection />
      <CtaSection />
    </>
  );
}
