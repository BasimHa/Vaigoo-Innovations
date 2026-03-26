import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Careers | Vaigoo Innovations',
  description: 'Join Vaigoo Innovations and build the next generation of digital platforms. View our open positions and apply today.',
};

export default function CareersLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
