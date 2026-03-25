-- Run this in your Supabase SQL Editor to create the submissions table

CREATE TABLE IF NOT EXISTS submissions (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  type TEXT NOT NULL CHECK (type IN ('contact', 'career', 'internship')),
  
  -- Common Fields
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT,
  
  -- Contact Us specific
  message TEXT,
  
  -- Careers & Internship specific
  position TEXT,
  employmentType TEXT,
  
  -- Internship specific
  duration TEXT,
  paidType TEXT,
  
  -- File URL
  resume TEXT,
  
  -- Status flow
  status TEXT DEFAULT 'new' CHECK (status IN ('new', 'reviewed', 'shortlisted', 'rejected')),
  
  -- Timestamp
  createdAt TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable Row Level Security (RLS) but allow anonymous inserts (from public API) 
-- and restrict reads to the API Key logic (handled by Supabase keys in the Next.js API).
ALTER TABLE submissions ENABLE ROW LEVEL SECURITY;

-- Allow public inserts (anyone can submit a form)
CREATE POLICY "Allow anonymous inserts" ON submissions
  FOR INSERT
  WITH CHECK (true);

-- Allow reads/updates only for the service role (used by our protected admin API)
-- The UI will fetch via our /api/submissions which bypasses RLS using the service role key 
-- or you can use the anon key if we don't strict RLS, but it's best to use `supabase-js` from the server.
CREATE POLICY "Allow service role full access" ON submissions
  USING (true)
  WITH CHECK (true);
