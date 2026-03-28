import type { Metadata } from 'next';
import { HeroSection } from '@/components/sections/HeroSection';

export const metadata: Metadata = {
  title: 'Home | Vaigoo Innovations',
  description: 'AI-powered solutions and scalable infrastructure for modern businesses. We build intelligent digital platforms.',
};
import { WhatWeBuildSection } from '@/components/sections/WhatWeBuildSection';
import { ProcessSection } from '@/components/sections/ProcessSection';
import { WhyVaigooSection } from '@/components/sections/WhyVaigooSection';
import { ProjectsSection } from '@/components/sections/ProjectsSection';
import { CtaSection } from '@/components/sections/CtaSection';
import { ContactSection } from '@/components/sections/ContactSection';

export default function Home() {
  return (
    <>
      <HeroSection />
      <WhatWeBuildSection />
      <ProcessSection />
      <WhyVaigooSection />
      <ProjectsSection />
      <CtaSection />
      <ContactSection />
    </>
  );
}
