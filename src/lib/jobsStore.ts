// ─────────────────────────────────────────────
//  Vaigoo Innovations — Jobs localStorage Store
//  SSR-safe: all operations guard `typeof window`
// ─────────────────────────────────────────────

import type { JobListing } from './jobs';

const STORAGE_KEY = 'vaigoo_job_listings';

// ─── Helpers ──────────────────────────────────

function generateId(): string {
  return `job_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`;
}

// ─── Public API ───────────────────────────────

/** Read all job listings from localStorage. Returns [] on server. */
export function getJobs(): JobListing[] {
  if (typeof window === 'undefined') return [];
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    return JSON.parse(raw) as JobListing[];
  } catch {
    return [];
  }
}

/** Read only open/published job listings. */
export function getOpenJobs(): JobListing[] {
  return getJobs().filter((j) => j.status === 'open');
}

/** Overwrite the entire jobs array in localStorage. */
export function saveJobs(jobs: JobListing[]): void {
  if (typeof window === 'undefined') return;
  localStorage.setItem(STORAGE_KEY, JSON.stringify(jobs));
}

/** Add a new job listing. Returns the new listing including generated id/createdAt. */
export function addJob(
  data: Omit<JobListing, 'id' | 'createdAt'>
): JobListing {
  const newJob: JobListing = {
    ...data,
    id: generateId(),
    createdAt: new Date().toISOString(),
  };
  const current = getJobs();
  saveJobs([newJob, ...current]);
  return newJob;
}

/** Update specific fields on an existing job. */
export function updateJob(id: string, updates: Partial<Omit<JobListing, 'id' | 'createdAt'>>): void {
  const jobs = getJobs().map((j) =>
    j.id === id ? { ...j, ...updates } : j
  );
  saveJobs(jobs);
}

/** Delete a job by id. */
export function deleteJob(id: string): void {
  saveJobs(getJobs().filter((j) => j.id !== id));
}

/** Toggle a job's status between open ↔ closed. */
export function toggleJobStatus(id: string): void {
  const jobs = getJobs().map((j) =>
    j.id === id ? { ...j, status: j.status === 'open' ? 'closed' : 'open' } as JobListing : j
  );
  saveJobs(jobs);
}
