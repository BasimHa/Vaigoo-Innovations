import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Internships | Vaigoo Innovations',
  description: 'Start your career journey with a Vaigoo Innovations internship. Apply for 6-month or 12-month internship programs.',
};

export default function InternshipsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
