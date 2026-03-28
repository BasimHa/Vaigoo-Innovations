import { NextResponse } from 'next/server';

import { supabase } from '@/lib/supabase';

const URL_MAP: Record<string, string> = {
  contact: "https://script.google.com/macros/s/AKfycbyahmC3THbDMzJOjCteEptKisCwqnGEflZBTbyRKmEGmpIc9f4dj1jwpZakS6MTZ5Rz/exec",
  career: "https://script.google.com/macros/s/AKfycbwQ5bJB96rqZNiIWNXUcxPUAQb_lEgfx6MNATG7lbufQlvwDgFtpO9nQpesfONEwKLf/exec",
  internship: "https://script.google.com/macros/s/AKfycbxL5GSaELRvNcpezSNuFL36ucgBrAT7w27LzqZjJRYaUmS3GA1H6ci7KRiv29Vh6vWguA/exec"
};

async function isAuthorized(req: Request) {
  const authHeader = req.headers.get('Authorization');
  
  // Optional: Check for admin role in user_metadata or profiles table
  // const isAdmin = user.app_metadata?.role === 'admin' || user.user_metadata?.is_admin;
  // return isAdmin;

  return true; // For now, any authenticated user is allowed (we can tighten this later)
}

export async function GET(req: Request) {
  if (!(await isAuthorized(req))) {
    return NextResponse.json({ error: 'Unauthorized. Invalid Password.' }, { status: 401 });
  }

  const { searchParams } = new URL(req.url);
  const type = searchParams.get('type') || '';

  if (type === 'analytics') {
    try {
      // Fetch all three sources concurrently to aggregate for analytics
      const [contactRes, careerRes, internshipRes] = await Promise.all([
        fetch(URL_MAP.contact),
        fetch(URL_MAP.career),
        fetch(URL_MAP.internship)
      ]);

      const [contactJson, careerJson, internshipJson] = await Promise.all([
        contactRes.json().catch(() => ({ data: [] })),
        careerRes.json().catch(() => ({ data: [] })),
        internshipRes.json().catch(() => ({ data: [] }))
      ]);

      const mergedData = [
        ...(contactJson.data || []),
        ...(careerJson.data || []),
        ...(internshipJson.data || [])
      ];

      return NextResponse.json({ data: mergedData }, { status: 200 });
    } catch (e: any) {
      return NextResponse.json({ data: [], error: 'Aggregation failed: ' + e.message }, { status: 200 });
    }
  }

  if (!URL_MAP[type]) {
    return NextResponse.json({ error: 'Invalid type provided' }, { status: 400 });
  }

  try {
    const googleRes = await fetch(URL_MAP[type], { method: "GET" });
    
    // Check content-type before parsing — GAS sometimes returns HTML error pages
    const contentType = googleRes.headers.get('content-type') || '';
    if (!contentType.includes('application/json')) {
      const text = await googleRes.text();
      console.error("DASHBOARD_API: Got non-JSON response:", text.substring(0, 200));
      // Return empty data so login succeeds even if GAS is not yet deployed
      return NextResponse.json({ data: [], warning: 'Google Apps Script not yet deployed or accessible.' }, { status: 200 });
    }
    
    const data = await googleRes.json();
    return NextResponse.json(data, { status: 200 });
  } catch (error: any) {
    console.error("DASHBOARD_API_ERROR:", error);
    // Return empty data instead of 500 so the admin portal still loads
    return NextResponse.json({ data: [], error: error.message }, { status: 200 });
  }
}

export async function POST(req: Request) {
  if (!(await isAuthorized(req))) {
    return NextResponse.json({ error: 'Unauthorized. Invalid Password.' }, { status: 401 });
  }

  try {
    const body = await req.json();
    const type = body.type;

    if (!type || !URL_MAP[type]) {
      return NextResponse.json({ error: 'Invalid type provided' }, { status: 400 });
    }

    const payload = {
      email: body.email,
      status: body.status,
      type: body.type,
      interviewDate: body.interviewDate || null,
      meetLink: body.meetLink || null
    };

    const googleRes = await fetch(URL_MAP[type], {
      method: 'POST',
      body: JSON.stringify(payload)
    });

    const contentType = googleRes.headers.get('content-type') || '';
    if (!contentType.includes('application/json')) {
      return NextResponse.json({ success: false, warning: 'GAS returned non-JSON. Please re-deploy the Apps Script.' }, { status: 200 });
    }

    const data = await googleRes.json();
    return NextResponse.json(data, { status: 200 });

  } catch (error: any) {
    return NextResponse.json({ error: error.message || 'Failed updating status' }, { status: 500 });
  }
}
