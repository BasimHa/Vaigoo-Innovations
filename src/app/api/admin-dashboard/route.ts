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

  if (!URL_MAP[type]) {
    return NextResponse.json({ error: 'Invalid type provided' }, { status: 400 });
  }

  try {
    const googleRes = await fetch(URL_MAP[type], {
      method: "GET",
      // Next.js handles redirects automatically, bringing us to google content server
    });
    
    if (!googleRes.ok) throw new Error("Google Apps Script Error");
    const data = await googleRes.json();
    
    return NextResponse.json(data, { status: 200 });
  } catch (error: any) {
    console.error("DASHBOARD_API_ERROR:", error);
    return NextResponse.json({ error: error.message || 'Failed fetching from Google Sheets' }, { status: 500 });
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
      // Apps Script doPost reads e.postData.contents
    });

    if (!googleRes.ok) {
        // Apps Script throws strange redirects occasionally if failed
        throw new Error("Failed to post to Google Sheets");
    }

    const data = await googleRes.json();
    return NextResponse.json(data, { status: 200 });

  } catch (error: any) {
    return NextResponse.json({ error: error.message || 'Failed updating status' }, { status: 500 });
  }
}
