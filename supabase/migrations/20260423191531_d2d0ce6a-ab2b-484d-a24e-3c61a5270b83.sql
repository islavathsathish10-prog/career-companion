-- Create student_registrations table
CREATE TABLE public.student_registrations (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  email TEXT NOT NULL UNIQUE,
  phone TEXT NOT NULL,
  password_hash TEXT NOT NULL,
  college TEXT NOT NULL,
  branch TEXT NOT NULL,
  graduation_year TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE public.student_registrations ENABLE ROW LEVEL SECURITY;

-- Allow public inserts (registration is open to anyone)
CREATE POLICY "Anyone can register"
ON public.student_registrations
FOR INSERT
WITH CHECK (true);

-- Allow public reads (needed for login lookup); restrict later if you add auth
CREATE POLICY "Anyone can read registrations"
ON public.student_registrations
FOR SELECT
USING (true);

-- Timestamp trigger function
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SET search_path = public;

CREATE TRIGGER update_student_registrations_updated_at
BEFORE UPDATE ON public.student_registrations
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

-- Index for faster email lookups
CREATE INDEX idx_student_registrations_email ON public.student_registrations(email);