-- Run this script in your Supabase SQL Editor to support live Job Postings

CREATE TABLE IF NOT EXISTS job_listings (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  department TEXT NOT NULL,
  employmenttype TEXT NOT NULL,
  description TEXT NOT NULL,
  requirements TEXT NOT NULL,
  location TEXT NOT NULL,
  duration TEXT,
  salarystipend TEXT,
  status TEXT DEFAULT 'open' CHECK (status IN ('open', 'closed')),
  createdat TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable Row Level Security
ALTER TABLE job_listings ENABLE ROW LEVEL SECURITY;

-- Allow public read access (so anonymous applicants can see open jobs)
CREATE POLICY "Allow public read access" ON job_listings
  FOR SELECT
  USING (true);

-- Allow service role full access (admin CRUD operations via our backend)
CREATE POLICY "Allow admin full access" ON job_listings
  USING (true)
  WITH CHECK (true);
