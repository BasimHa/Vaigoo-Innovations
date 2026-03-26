import { NextResponse } from 'next/server';
import { supabaseREST } from '@/lib/supabase';

// Handle GET to list jobs (public read allowed, no password required for GET)
export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const status = searchParams.get('status');
  
  let query = 'select=*&order=createdat.desc';
  if (status && status !== 'all') {
    query += `&status=eq.${status}`;
  }

  const result = await supabaseREST.select('job_listings', query);

  if (result.error) {
    return NextResponse.json({ error: result.error }, { status: 500 });
  }

  // Map lowercase pg columns back to camelCase for frontend
  const mappedData = (result.data || []).map((r: any) => ({
    ...r,
    employmentType: r.employmenttype || r.employmentType,
    salaryStipend: r.salarystipend || r.salaryStipend,
    createdAt: r.createdat || r.createdAt
  }));

  return NextResponse.json({ data: mappedData });
}

// Ensure subsequent methods are protected
const authenticateAdmin = (req: Request) => {
  const authHeader = req.headers.get('authorization');
  const envPassword = process.env.ADMIN_PASSWORD || 'admin123';
  const envPasswordExceptCase = process.env.ADMIN_PASSWORD_EXCEPT_CASE || '';
  const providedToken = authHeader?.replace('Bearer ', '') || '';

  const primaryMatch = authHeader === `Bearer ${envPassword}`;
  const secondaryMatch = envPasswordExceptCase &&
    providedToken.toLowerCase() === envPasswordExceptCase.toLowerCase();

  return primaryMatch || secondaryMatch;
};

// Handle POST to create a new job
export async function POST(req: Request) {
  if (!authenticateAdmin(req)) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  try {
    const data = await req.json();
    if (!data.title || !data.department) return NextResponse.json({ error: 'Missing fields' }, { status: 400 });

    const result = await supabaseREST.insert('job_listings', {
      title: data.title,
      department: data.department,
      employmenttype: data.employmentType || data.employmenttype,
      description: data.description,
      requirements: data.requirements,
      location: data.location,
      duration: data.duration,
      salarystipend: data.salaryStipend || data.salarystipend,
      status: data.status || 'open'
    });

    if (result.error) return NextResponse.json({ error: result.error }, { status: 500 });
    return NextResponse.json({ success: true, data: result.data });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

// Handle PATCH to update an existing job
export async function PATCH(req: Request) {
  if (!authenticateAdmin(req)) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  try {
    const data = await req.json();
    if (!data.id) return NextResponse.json({ error: 'Missing ID' }, { status: 400 });
    
    // Convert fields cleanly
    const payload: any = { ...data };
    delete payload.id;
    if (payload.employmentType) { payload.employmenttype = payload.employmentType; delete payload.employmentType; }
    if (payload.salaryStipend) { payload.salarystipend = payload.salaryStipend; delete payload.salaryStipend; }

    const result = await supabaseREST.update('job_listings', data.id, payload);
    if (result.error) return NextResponse.json({ error: result.error }, { status: 500 });

    return NextResponse.json({ success: true });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

// Handle DELETE to remove a job
export async function DELETE(req: Request) {
  if (!authenticateAdmin(req)) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get('id');
    if (!id) return NextResponse.json({ error: 'Missing ID' }, { status: 400 });

    // Assuming we extend supabaseREST to support delete
    const { url, key } = require('@/lib/supabase').getSupabaseConfig();
    const response = await fetch(`${url}/rest/v1/job_listings?id=eq.${id}`, {
      method: 'DELETE',
      headers: {
        'apikey': key,
        'Authorization': `Bearer ${key}`
      }
    });
    
    if (!response.ok) throw new Error("Delete failed");
    return NextResponse.json({ success: true });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
