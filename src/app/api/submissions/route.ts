import { NextResponse } from 'next/server';
import { supabaseREST } from '@/lib/supabase';

// Handle POST to save an application/contact form
export async function POST(req: Request) {
  try {
    const data = await req.json();
    
    if (!data.type || !data.name || !data.email) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    const result = await supabaseREST.insert('submissions', {
       ...data,
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
  
  let query = 'select=*&order=createdAt.desc';
  if (type && type !== 'all') {
    query += `&type=eq.${type}`;
  }

  const result = await supabaseREST.select('submissions', query);

  if (result.error) {
    return NextResponse.json({ error: result.error }, { status: 500 });
  }

  return NextResponse.json({ data: result.data });
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

    return NextResponse.json({ success: true });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
