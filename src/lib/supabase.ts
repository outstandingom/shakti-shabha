import { createClient } from '@supabase/supabase-js'

const env = import.meta.env as Record<string, string | undefined>
const supabaseUrl = env.VITE_SUPABASE_URL || env.SUPABASE_URL || ''
const supabaseKey = env.VITE_SUPABASE_PUBLISHABLE_KEY || env.SUPABASE_PUBLISHABLE_KEY || ''

if (!supabaseUrl || !supabaseKey) {
  console.warn('⚠️ Supabase environment variables not found. Check VITE_SUPABASE_URL and VITE_SUPABASE_PUBLISHABLE_KEY (or SUPABASE_URL / SUPABASE_PUBLISHABLE_KEY on Vercel).')
}

// Safely instantiate client (use dummy url/key if missing so it does not throw on module load)
export const supabase = (supabaseUrl && supabaseKey)
  ? createClient(supabaseUrl, supabaseKey)
  : createClient('https://placeholder-project.supabase.co', 'placeholder-anon-key')

export type Article = {
  id: string
  title_en: string
  title_hi: string
  content_en: string
  content_hi: string
  excerpt_en: string
  excerpt_hi: string
  cover_image_url: string
  category: string
  tags: string[]
  published: boolean
  author_name: string
  created_at: string
  updated_at: string
}

export type GalleryPhoto = {
  id: string
  url: string
  caption: string
  category_id: string
  created_at: string
}

export type GalleryCategory = {
  id: string
  name: string
  description: string
  cover_url: string
  created_at: string
}

export type Course = {
  id: string
  title: string
  description: string
  price: number
  duration: string
  level: 'beginner' | 'intermediate' | 'advanced'
  cover_image_url: string
  syllabus: { week: string; topic: string }[]
  instructor: string
  published: boolean
  created_at: string
  updated_at: string
}

export type CounsellingRequest = {
  id: string
  name: string
  email: string
  phone: string
  city: string
  concern: string
  message: string
  status: 'pending' | 'reviewed' | 'contacted' | 'resolved'
  created_at: string
}

export type AdminProfile = {
  id: string
  email: string
  full_name: string
  role: 'admin' | 'editor'
  avatar_url: string
  created_at: string
}
