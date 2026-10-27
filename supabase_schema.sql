-- =============================================================================
-- SHAKTI SABHA (शक्ति सभा) — SUPABASE CMS DATABASE SCHEMA & POLICIES
-- Copy and run this entire file in your Supabase SQL Editor:
-- https://supabase.com/dashboard/project/_/sql
-- =============================================================================

-- Enable required extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- -----------------------------------------------------------------------------
-- 1. ADMIN PROFILES TABLE
-- -----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.admin_profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT NOT NULL,
  full_name TEXT,
  role TEXT NOT NULL DEFAULT 'editor' CHECK (role IN ('admin', 'editor')),
  avatar_url TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Trigger to automatically create admin profile on new user registration
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.admin_profiles (id, email, full_name, role)
  VALUES (
    new.id,
    new.email,
    COALESCE(new.raw_user_meta_data->>'full_name', split_part(new.email, '@', 1)),
    'editor'
  )
  ON CONFLICT (id) DO NOTHING;
  RETURN new;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE PROCEDURE public.handle_new_user();

-- -----------------------------------------------------------------------------
-- 2. ARTICLES TABLE (Bilingual Hindi + English Support)
-- -----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.articles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title_en TEXT,
  title_hi TEXT,
  content_en TEXT,
  content_hi TEXT,
  excerpt_en TEXT,
  excerpt_hi TEXT,
  cover_image_url TEXT,
  category TEXT DEFAULT 'General',
  tags TEXT[] DEFAULT '{}',
  published BOOLEAN DEFAULT false,
  author_name TEXT DEFAULT 'Shakti Sabha Editorial',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- -----------------------------------------------------------------------------
-- 3. GALLERY CATEGORIES & PHOTOS TABLES
-- -----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.gallery_categories (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL UNIQUE,
  description TEXT,
  cover_url TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.gallery_photos (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  url TEXT NOT NULL,
  caption TEXT,
  category_id UUID REFERENCES public.gallery_categories(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- -----------------------------------------------------------------------------
-- 4. COURSES TABLE
-- -----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.courses (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  description TEXT,
  price NUMERIC DEFAULT 0,
  duration TEXT,
  level TEXT DEFAULT 'beginner' CHECK (level IN ('beginner', 'intermediate', 'advanced')),
  cover_image_url TEXT,
  syllabus JSONB DEFAULT '[]'::jsonb,
  instructor TEXT DEFAULT 'Shakti Sabha Academy',
  published BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- -----------------------------------------------------------------------------
-- 5. COUNSELLING REQUESTS TABLE (Public Intake)
-- -----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.counselling_requests (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT,
  city TEXT,
  concern TEXT,
  message TEXT,
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'reviewed', 'contacted', 'resolved')),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- -----------------------------------------------------------------------------
-- 6. ENABLE ROW LEVEL SECURITY (RLS) ON ALL TABLES
-- -----------------------------------------------------------------------------
ALTER TABLE public.admin_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.articles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.gallery_categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.gallery_photos ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.courses ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.counselling_requests ENABLE ROW LEVEL SECURITY;

-- -----------------------------------------------------------------------------
-- 7. ROW LEVEL SECURITY (RLS) POLICIES
-- -----------------------------------------------------------------------------

-- Admin Profiles:
DROP POLICY IF EXISTS "Public can view admin profiles" ON public.admin_profiles;
CREATE POLICY "Public can view admin profiles"
  ON public.admin_profiles FOR SELECT USING (true);

DROP POLICY IF EXISTS "Users can update own admin profile" ON public.admin_profiles;
CREATE POLICY "Users can update own admin profile"
  ON public.admin_profiles FOR UPDATE
  USING (auth.uid() = id);

-- Articles:
DROP POLICY IF EXISTS "Public can view published articles" ON public.articles;
CREATE POLICY "Public can view published articles"
  ON public.articles FOR SELECT
  USING (published = true);

DROP POLICY IF EXISTS "Authenticated users full access to articles" ON public.articles;
CREATE POLICY "Authenticated users full access to articles"
  ON public.articles FOR ALL
  TO authenticated
  USING (true)
  WITH CHECK (true);

-- Gallery Categories:
DROP POLICY IF EXISTS "Public can view gallery categories" ON public.gallery_categories;
CREATE POLICY "Public can view gallery categories"
  ON public.gallery_categories FOR SELECT
  USING (true);

DROP POLICY IF EXISTS "Authenticated users full access to gallery categories" ON public.gallery_categories;
CREATE POLICY "Authenticated users full access to gallery categories"
  ON public.gallery_categories FOR ALL
  TO authenticated
  USING (true)
  WITH CHECK (true);

-- Gallery Photos:
DROP POLICY IF EXISTS "Public can view gallery photos" ON public.gallery_photos;
CREATE POLICY "Public can view gallery photos"
  ON public.gallery_photos FOR SELECT
  USING (true);

DROP POLICY IF EXISTS "Authenticated users full access to gallery photos" ON public.gallery_photos;
CREATE POLICY "Authenticated users full access to gallery photos"
  ON public.gallery_photos FOR ALL
  TO authenticated
  USING (true)
  WITH CHECK (true);

-- Courses:
DROP POLICY IF EXISTS "Public can view published courses" ON public.courses;
CREATE POLICY "Public can view published courses"
  ON public.courses FOR SELECT
  USING (published = true);

DROP POLICY IF EXISTS "Authenticated users full access to courses" ON public.courses;
CREATE POLICY "Authenticated users full access to courses"
  ON public.courses FOR ALL
  TO authenticated
  USING (true)
  WITH CHECK (true);

-- Counselling Requests:
-- Any visitor can submit a request:
DROP POLICY IF EXISTS "Public can insert counselling requests" ON public.counselling_requests;
CREATE POLICY "Public can insert counselling requests"
  ON public.counselling_requests FOR INSERT
  WITH CHECK (true);

-- Only authenticated admins can read and manage counselling requests:
DROP POLICY IF EXISTS "Authenticated admins can manage counselling requests" ON public.counselling_requests;
CREATE POLICY "Authenticated admins can manage counselling requests"
  ON public.counselling_requests FOR ALL
  TO authenticated
  USING (true)
  WITH CHECK (true);

-- -----------------------------------------------------------------------------
-- 8. STORAGE BUCKET CREATION & POLICIES ('media')
-- -----------------------------------------------------------------------------
INSERT INTO storage.buckets (id, name, public)
VALUES ('media', 'media', true)
ON CONFLICT (id) DO UPDATE SET public = true;

-- Public can view files in media bucket
DROP POLICY IF EXISTS "Public Access to media bucket" ON storage.objects;
CREATE POLICY "Public Access to media bucket"
  ON storage.objects FOR SELECT
  USING (bucket_id = 'media');

-- Authenticated users can upload to media bucket
DROP POLICY IF EXISTS "Authenticated users can upload to media" ON storage.objects;
CREATE POLICY "Authenticated users can upload to media"
  ON storage.objects FOR INSERT
  TO authenticated
  WITH CHECK (bucket_id = 'media');

-- Authenticated users can update files in media bucket
DROP POLICY IF EXISTS "Authenticated users can update media" ON storage.objects;
CREATE POLICY "Authenticated users can update media"
  ON storage.objects FOR UPDATE
  TO authenticated
  USING (bucket_id = 'media');

-- Authenticated users can delete files in media bucket
DROP POLICY IF EXISTS "Authenticated users can delete media" ON storage.objects;
CREATE POLICY "Authenticated users can delete media"
  ON storage.objects FOR DELETE
  TO authenticated
  USING (bucket_id = 'media');

-- -----------------------------------------------------------------------------
-- 9. INITIAL DEFAULT DATA (Optional Starter Seed)
-- -----------------------------------------------------------------------------
INSERT INTO public.gallery_categories (name, description)
VALUES 
  ('Aaryaveera Camps', 'Residential and rural camps for self defense and leadership'),
  ('Lathi & Sword', 'Traditional martial arts, staff combat, and weapon defense'),
  ('Shakti Bhava', 'Counseling circles, psychological healing, and peer support'),
  ('School Outreach', 'Campus self-defense awareness and legal rights workshops')
ON CONFLICT (name) DO NOTHING;
