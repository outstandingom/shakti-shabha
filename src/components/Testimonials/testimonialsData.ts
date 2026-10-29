import { Testimonial } from '../../lib/supabase'

export const DEFAULT_TESTIMONIALS: Testimonial[] = [
  {
    id: 't-1',
    name: 'Pooja Deshmukh',
    role: 'Lathi-Kaushal Graduate',
    location: 'Pune, Maharashtra',
    image_url: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=400&auto=format&fit=crop&q=80',
    quote: 'Joining the Mardini self-defense camp transformed my deepest fears into unshakeable confidence. Holding the lathi was not just learning a weapon—it was reclaiming my dignity and spirit.',
    rating: 5,
    published: true,
    created_at: '2026-01-15T10:00:00.000Z'
  },
  {
    id: 't-2',
    name: 'Sunita Jadhav',
    role: 'Survivor & Peer Mentor',
    location: 'Satara, Maharashtra',
    image_url: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=400&auto=format&fit=crop&q=80',
    quote: 'In Shakti Bhava, I wasn’t treated like a helpless case. The counselors stood by me through legal battles and severe trauma. Today, I lead survivor support circles in my own village.',
    rating: 5,
    published: true,
    created_at: '2026-02-10T10:00:00.000Z'
  },
  {
    id: 't-3',
    name: 'Dr. Neha Kulkarni',
    role: 'Historian & Scholar',
    location: 'Mumbai, Maharashtra',
    image_url: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=400&auto=format&fit=crop&q=80',
    quote: 'Shakti Varta’s intellectual rigor unearths the true, unadulterated history of Bharat’s warrior queens. They combine rigorous historical analysis with real-world grassroots action.',
    rating: 5,
    published: true,
    created_at: '2026-03-05T10:00:00.000Z'
  },
  {
    id: 't-4',
    name: 'Radhika Sharma',
    role: 'Kshatra Camp Trainee',
    location: 'Nashik, Maharashtra',
    image_url: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400&auto=format&fit=crop&q=80',
    quote: 'Waking up at 4 AM, sword kata, mental resilience training, and decolonial discourse—Shakti Sabha is not merely an organization, it is a spiritual renaissance for modern women.',
    rating: 5,
    published: true,
    created_at: '2026-03-22T10:00:00.000Z'
  },
  {
    id: 't-5',
    name: 'Kavita More',
    role: 'Gram Panchayat Member',
    location: 'Kolhapur, Maharashtra',
    image_url: 'https://images.unsplash.com/photo-1567532939604-b6b5b0db2604?w=400&auto=format&fit=crop&q=80',
    quote: 'The legal literacy and self-reliance workshops brought immense courage to our village women. They now question injustice fearlessly and support each other through every crisis.',
    rating: 5,
    published: true,
    created_at: '2026-04-12T10:00:00.000Z'
  },
  {
    id: 't-6',
    name: 'Ananya Joshi',
    role: 'Youth Advocate',
    location: 'Nagpur, Maharashtra',
    image_url: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=400&auto=format&fit=crop&q=80',
    quote: 'Shakti Sabha broke the culture of silence around trauma and mental health. Their holistic model of physical strength plus emotional sanctuary gave us a voice.',
    rating: 5,
    published: true,
    created_at: '2026-05-01T10:00:00.000Z'
  }
]
