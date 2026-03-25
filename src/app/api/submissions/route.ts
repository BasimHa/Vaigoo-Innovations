import { NextResponse } from 'next/server';
import { supabaseREST } from '@/lib/supabase';

// Helper to reliably trigger the legacy Google App Script email responder
async function triggerAutoReply(submission: any) {
  try {
    const GOOGLE_FORM_URL = 'https://docs.google.com/forms/u/0/d/e/1FAIpQLSfgCsPnjRsiUQCltIeC0rM2Fa-4IbNgAJZmwoM8tfOm_fYtZg/formResponse';
    const formBody = new URLSearchParams();
    
    // Required fields from the DOM
    formBody.append('entry.1424804324', submission.name || 'Applicant');
    formBody.append('entry.1445404356', submission.email || '');
    
    // Properly case enum types
    const typeValue = submission.type ? submission.type.charAt(0).toUpperCase() + submission.type.slice(1) : 'Contact';
    formBody.append('entry.1712063615', typeValue);
    
    const statusValue = submission.status ? submission.status.charAt(0).toUpperCase() + submission.status.slice(1) : 'New';
    formBody.append('entry.1687234610', statusValue);

    await fetch(GOOGLE_FORM_URL, {
      method: 'POST',
      body: formBody,
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded'
      }
    });
  } catch (err) {
    console.error("Failed to trigger auto reply form:", err);
  }
}

// Handle POST to save an application/contact form
export async function POST(req: Request) {
  try {
    const data = await req.json();
    
    if (!data.type || !data.name || !data.email) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    const result = await supabaseREST.insert('submissions', {
       type: data.type,
       name: data.name,
       email: data.email,
       phone: data.phone,
       message: data.message,
       position: data.position,
       employmenttype: data.employmentType || data.employmenttype,
       duration: data.duration,
       paidtype: data.paidType || data.paidtype,
       resume: data.resume,
       status: 'new'
    });

    if (result.error) {
      return NextResponse.json({ error: result.error }, { status: 500 });
    }

    return NextResponse.json({ success: true, data: result.data });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

// Handle GET to list submissions (requires password)
export async function GET(req: Request) {
  const authHeader = req.headers.get('authorization');
  const envPassword = process.env.ADMIN_PASSWORD || 'admin123';
  
  if (!authHeader || authHeader !== `Bearer ${envPassword}`) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const { searchParams } = new URL(req.url);
  const type = searchParams.get('type');
  
  let query = 'select=*&order=createdat.desc';
  if (type && type !== 'all') {
    query += `&type=eq.${type}`;
  }

  const result = await supabaseREST.select('submissions', query);

  if (result.error) {
    return NextResponse.json({ error: result.error }, { status: 500 });
  }

  const mappedData = (result.data || []).map((r: any) => ({
    ...r,
    employmentType: r.employmenttype || r.employmentType,
    paidType: r.paidtype || r.paidType,
    createdAt: r.createdat || r.createdAt
  }));

  return NextResponse.json({ data: mappedData });
}

// Handle PATCH to update status
export async function PATCH(req: Request) {
  const authHeader = req.headers.get('authorization');
  const envPassword = process.env.ADMIN_PASSWORD || 'admin123';
  
  if (!authHeader || authHeader !== `Bearer ${envPassword}`) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const { id, status } = await req.json();
    if (!id || !status) return NextResponse.json({ error: 'Invalid data' }, { status: 400 });

    const result = await supabaseREST.update('submissions', id, { status });
    if (result.error) {
      return NextResponse.json({ error: result.error }, { status: 500 });
    }

    // Trigger the automated Google Apps script in the background
    if (result.data && result.data.length > 0) {
      triggerAutoReply(result.data[0]);
    }

    return NextResponse.json({ success: true });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
