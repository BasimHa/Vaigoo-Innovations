// ─────────────────────────────────────────────
//  Vaigoo Innovations — Shared Job Listings Types
// ─────────────────────────────────────────────

export type JobStatus = 'open' | 'closed';

export type EmploymentType =
  | 'Full-time'
  | 'Part-time'
  | 'Internship – 6 Months (Paid)'
  | 'Internship – 6 Months (Unpaid/Free)'
  | 'Internship – 12 Months (Paid)'
  | 'Internship – 12 Months (Unpaid/Free)';

export type Department =
  | 'Frontend Engineering'
  | 'Backend Engineering'
  | 'AI / Machine Learning'
  | 'UI/UX Design'
  | 'Growth & Marketing'
  | 'Operations'
  | 'General';

export type WorkLocation = 'Remote' | 'On-site' | 'Hybrid';

export interface JobListing {
  id: string;
  title: string;
  department: Department;
  employmentType: EmploymentType;
  description: string;
  requirements: string;
  location: WorkLocation;
  duration?: string;       // optional — used mainly for internships
  salaryStipend?: string;  // optional
  status: JobStatus;
  featured: boolean;       // featured jobs appear at top with a highlight badge
  createdAt: string;       // ISO date string
}

// ─── Dropdown option arrays ───────────────────

export const EMPLOYMENT_TYPES: EmploymentType[] = [
  'Full-time',
  'Part-time',
  'Internship – 6 Months (Paid)',
  'Internship – 6 Months (Unpaid/Free)',
  'Internship – 12 Months (Paid)',
  'Internship – 12 Months (Unpaid/Free)',
];

export const DEPARTMENTS: Department[] = [
  'Frontend Engineering',
  'Backend Engineering',
  'AI / Machine Learning',
  'UI/UX Design',
  'Growth & Marketing',
  'Operations',
  'General',
];

export const LOCATIONS: WorkLocation[] = ['Remote', 'On-site', 'Hybrid'];

/** Returns true if the employment type is any internship variant */
export function isInternship(type: EmploymentType): boolean {
  return type.startsWith('Internship');
}
