import { NextResponse } from 'next/server';
import { readFileSync, writeFileSync } from 'fs';
import { join } from 'path';
import { randomUUID } from 'crypto';
import type { JobListing } from '@/lib/jobs';

// ─── JSON File Store ─────────────────────────────────────────────────────────
// Data lives in /data/jobs.json. Swap readJobs/writeJobs with DB calls to migrate.

const DATA_PATH = join(process.cwd(), 'data', 'jobs.json');

function readJobs(): JobListing[] {
  try {
    const raw = readFileSync(DATA_PATH, 'utf-8');
    return JSON.parse(raw).jobs || [];
  } catch {
    return [];
  }
}

function writeJobs(jobs: JobListing[]): void {
  writeFileSync(DATA_PATH, JSON.stringify({ jobs }, null, 2), 'utf-8');
}

// ─── Auth ─────────────────────────────────────────────────────────────────────
const PASSKEY = process.env.ADMIN_PASSWORD || 'Basim123!';

function isAuthorized(req: Request): boolean {
  const auth = req.headers.get('authorization') || '';
  const token = auth.replace('Bearer ', '').trim();
  return token === PASSKEY;
}

// ─── GET — public, no auth required ──────────────────────────────────────────
export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const status = searchParams.get('status'); // 'open' | 'closed' | null (all)

  let jobs = readJobs();

  if (status && status !== 'all') {
    jobs = jobs.filter((j) => j.status === status);
  }

  // Featured jobs first, then sorted by createdAt desc
  jobs.sort((a, b) => {
    if (a.featured && !b.featured) return -1;
    if (!a.featured && b.featured) return 1;
    return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
  });

  return NextResponse.json({ data: jobs });
}

// ─── POST — create a new job ──────────────────────────────────────────────────
export async function POST(req: Request) {
  if (!isAuthorized(req)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const body = await req.json();
    if (!body.title || !body.department) {
      return NextResponse.json({ error: 'Missing required fields: title, department' }, { status: 400 });
    }

    const newJob: JobListing = {
      id: randomUUID(),
      title: body.title,
      department: body.department,
      employmentType: body.employmentType || 'Full-time',
      description: body.description || '',
      requirements: body.requirements || '',
      location: body.location || 'Remote',
      duration: body.duration || undefined,
      salaryStipend: body.salaryStipend || undefined,
      status: body.status || 'open',
      featured: body.featured ?? false,
      createdAt: new Date().toISOString(),
    };

    const jobs = readJobs();
    jobs.push(newJob);
    writeJobs(jobs);

    return NextResponse.json({ success: true, data: newJob });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

// ─── PATCH — update job fields ────────────────────────────────────────────────
export async function PATCH(req: Request) {
  if (!isAuthorized(req)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const body = await req.json();
    if (!body.id) {
      return NextResponse.json({ error: 'Missing job ID' }, { status: 400 });
    }

    const jobs = readJobs();
    const idx = jobs.findIndex((j) => j.id === body.id);
    if (idx === -1) {
      return NextResponse.json({ error: 'Job not found' }, { status: 404 });
    }

    // Merge fields — only update what's provided
    const { id, ...updates } = body;
    jobs[idx] = { ...jobs[idx], ...updates };
    writeJobs(jobs);

    return NextResponse.json({ success: true, data: jobs[idx] });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

// ─── DELETE — remove a job ────────────────────────────────────────────────────
export async function DELETE(req: Request) {
  if (!isAuthorized(req)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get('id');
    if (!id) {
      return NextResponse.json({ error: 'Missing job ID' }, { status: 400 });
    }

    const jobs = readJobs();
    const filtered = jobs.filter((j) => j.id !== id);
    if (filtered.length === jobs.length) {
      return NextResponse.json({ error: 'Job not found' }, { status: 404 });
    }

    writeJobs(filtered);
    return NextResponse.json({ success: true });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
