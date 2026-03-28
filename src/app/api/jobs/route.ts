import { NextResponse } from 'next/server';
import { supabaseREST, getSupabaseConfig } from '@/lib/supabase';
import { randomUUID } from 'crypto';
import type { JobListing } from '@/lib/jobs';

// ─── Auth ─────────────────────────────────────────────────────────────────────
const PASSKEY = process.env.ADMIN_PASSWORD || 'Basim123!';

function isAuthorized(req: Request): boolean {
  const auth = req.headers.get('authorization') || '';
  const token = auth.replace('Bearer ', '').trim();
  return token === PASSKEY;
}

// ─── Column mapping (Supabase uses lowercase) ─────────────────────────────────
function toDb(data: Partial<JobListing> & Record<string, any>) {
  return {
    ...(data.title !== undefined && { title: data.title }),
    ...(data.department !== undefined && { department: data.department }),
    ...(data.employmentType !== undefined && { employmenttype: data.employmentType }),
    ...(data.description !== undefined && { description: data.description }),
    ...(data.requirements !== undefined && { requirements: data.requirements }),
    ...(data.location !== undefined && { location: data.location }),
    ...(data.duration !== undefined && { duration: data.duration }),
    ...(data.salaryStipend !== undefined && { salarystipend: data.salaryStipend }),
    ...(data.status !== undefined && { status: data.status }),
    ...(data.featured !== undefined && { featured: data.featured }),
  };
}

function fromDb(r: any): JobListing {
  return {
    id: r.id,
    title: r.title,
    department: r.department,
    employmentType: r.employmenttype || r.employmentType,
    description: r.description,
    requirements: r.requirements,
    location: r.location,
    duration: r.duration,
    salaryStipend: r.salarystipend || r.salaryStipend,
    status: r.status,
    featured: r.featured ?? false,
    createdAt: r.createdat || r.createdAt,
  };
}

// ─── GET — public, no auth required ──────────────────────────────────────────
export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const status = searchParams.get('status');

  let query = 'select=*&order=featured.desc,createdat.desc';
  if (status && status !== 'all') {
    query += `&status=eq.${status}`;
  }

  const result = await supabaseREST.select('job_listings', query);
  if (result.error) {
    return NextResponse.json({ error: result.error }, { status: 500 });
  }

  const data = (result.data || []).map(fromDb);
  return NextResponse.json({ data });
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

    const row = {
      id: randomUUID(),
      ...toDb(body),
      createdat: new Date().toISOString(),
    };

    const result = await supabaseREST.insert('job_listings', row);
    if (result.error) {
      return NextResponse.json({ error: result.error }, { status: 500 });
    }

    return NextResponse.json({ success: true, data: fromDb(result.data?.[0] || row) });
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

    const { id, ...rest } = body;
    const result = await supabaseREST.update('job_listings', id, toDb(rest));
    if (result.error) {
      return NextResponse.json({ error: result.error }, { status: 500 });
    }

    return NextResponse.json({ success: true });
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

    const { url, key } = getSupabaseConfig();
    const response = await fetch(`${url}/rest/v1/job_listings?id=eq.${id}`, {
      method: 'DELETE',
      headers: {
        'apikey': key,
        'Authorization': `Bearer ${key}`,
      },
    });

    if (!response.ok) throw new Error('Delete failed: ' + response.statusText);
    return NextResponse.json({ success: true });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
