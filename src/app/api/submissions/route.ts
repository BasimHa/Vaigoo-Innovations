import { NextResponse } from 'next/server';
import { supabaseREST } from '@/lib/supabase';

const APPS_SCRIPT_URL = process.env.NEXT_PUBLIC_APPS_SCRIPT_URL || '';

async function submitToGoogleForm(data: any) {
  try {
    const isCareer = data.type === 'career';
    const isInternship = data.type === 'internship';
    const formUrl = (isCareer || isInternship)
      ? 'https://docs.google.com/forms/u/0/d/e/1FAIpQLSdC2Z5tERW2sYtjzJN4VP-xCss-aWr1WxaLLqv2gvXCiLwH_Q/formResponse'
      : 'https://docs.google.com/forms/u/0/d/e/1FAIpQLSc37vKm2W-WC47FvzG64RV14UBiM7MGvXXT7OSCdCSCTikgqA/formResponse';

    const body = new URLSearchParams();
    
    if (isCareer || isInternship) {
      body.append('entry.1658472497', data.name || '');
      body.append('entry.862200673', data.email || '');
      body.append('entry.435392044', data.phone || '');
      body.append('entry.153460694', data.position || data.domain || '');
      body.append('entry.1608247299', data.resume || '');
      
      const messageContent = isInternship 
        ? `Duration: ${data.duration} | Type: ${data.internshipType} | Details: ${data.message || 'N/A'}`
        : data.message || '';
      body.append('entry.1724599138', messageContent);
    } else {
      // Contact Form Mapping
      body.append('entry.1152972438', data.name || '');
      body.append('entry.129797516', data.email || '');
      body.append('entry.1015696628', data.phone || '');
      body.append('entry.1656020467', data.message || '');
    }

    await fetch(formUrl, {
      method: 'POST',
      mode: 'no-cors',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: body.toString()
    });
  } catch (err) {
    console.error("[GoogleForm Backup Error]", err);
  }
}


// Handle POST to save an application/contact form
export async function POST(req: Request) {
  try {
    const data = await req.json();
    
    if (!data.type || !data.name || !data.email) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    // 1. Save to Supabase (Legacy/Primary)
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

    // 2. Proxy to Unified Google Apps Script (Email/Calendar Automation)
    if (APPS_SCRIPT_URL && !APPS_SCRIPT_URL.includes('REPLACE_THIS')) {
      try {
        await fetch(APPS_SCRIPT_URL, {
          method: 'POST',
          body: JSON.stringify({ ...data, action: 'submit' }),
          headers: { 'Content-Type': 'application/json' }
        });
      } catch (scriptErr) {
        console.error("[AppsScript Proxy Error]", scriptErr);
      }
    }

    // 3. Backup: Send to direct Google Form directly (Requested re-integration)
    submitToGoogleForm(data);

    if (result.error) return NextResponse.json({ error: result.error }, { status: 500 });
    return NextResponse.json({ success: true, data: result.data });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}


// Handle GET to list submissions
export async function GET(req: Request) {
  const authHeader = req.headers.get('authorization');
  const envPassword = process.env.ADMIN_PASSWORD || 'admin123';
  const envPasswordExceptCase = process.env.ADMIN_PASSWORD_EXCEPT_CASE || '';
  const providedToken = authHeader?.replace('Bearer ', '') || '';

  const primaryMatch = authHeader === `Bearer ${envPassword}`;
  const secondaryMatch = envPasswordExceptCase &&
    providedToken.toLowerCase() === envPasswordExceptCase.toLowerCase();

  if (!primaryMatch && !secondaryMatch) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const { searchParams } = new URL(req.url);
  const type = searchParams.get('type') || 'all';
  const email = searchParams.get('email');

  // If email provided, check for status checker
  if (email && APPS_SCRIPT_URL && !APPS_SCRIPT_URL.includes('REPLACE_THIS')) {
    const checkRes = await fetch(`${APPS_SCRIPT_URL}?type=statusCheck&email=${email}`);
    if (checkRes.ok) return NextResponse.json(await checkRes.json());
  }

  // Otherwise, list for Admin Portal (Supabase)
  let query = 'select=*&order=createdat.desc';
  if (type !== 'all') query += `&type=eq.${type}`;

  const result = await supabaseREST.select('submissions', query);
  if (result.error) return NextResponse.json({ error: result.error }, { status: 500 });

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
  const envPasswordExceptCase = process.env.ADMIN_PASSWORD_EXCEPT_CASE || '';
  const providedToken = authHeader?.replace('Bearer ', '') || '';

  const primaryMatch = authHeader === `Bearer ${envPassword}`;
  const secondaryMatch = envPasswordExceptCase &&
    providedToken.toLowerCase() === envPasswordExceptCase.toLowerCase();

  if (!primaryMatch && !secondaryMatch) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const { id, status } = await req.json();
    if (!id || !status) return NextResponse.json({ error: 'Invalid data' }, { status: 400 });

    const result = await supabaseREST.update('submissions', id, { status });
    if (result.error) return NextResponse.json({ error: result.error }, { status: 500 });

    // Trigger the automated Google Apps script to send emails and sync sheets
    if (APPS_SCRIPT_URL && !APPS_SCRIPT_URL.includes('REPLACE_THIS')) {
      try {
        await fetch(APPS_SCRIPT_URL, {
          method: 'POST',
          body: JSON.stringify({ id, status, action: 'updateStatus' }),
          headers: { 'Content-Type': 'application/json' }
        });
      } catch (err) {
        console.error("[AppsScript Update Error]", err);
      }
    }

    return NextResponse.json({ success: true });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

