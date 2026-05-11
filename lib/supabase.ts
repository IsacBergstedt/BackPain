import { createClient } from '@supabase/supabase-js'

// Fall back to placeholder values so the client initialises even before Supabase is configured.
// API calls will fail gracefully (caught in try/catch) until real env vars are provided.
const supabaseUrl =
  process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://placeholder.supabase.co'
const supabaseAnonKey =
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ||
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJyb2xlIjoiYW5vbiJ9.placeholder'

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

export type DbUser = {
  id: string
  email: string
  name: string
  created_at: string
}

export type DbExercise = {
  id: string
  name: string
  description: string
  reps_sets: string | null
  hold_time: string | null
  safety_notes: string
  level: string
  benefits: string
  video_url: string | null
  pain_area: string
  priority_order: number
  created_at: string
}

export type DbTrainingLog = {
  id: string
  user_id: string
  exercise_id: string
  date: string
  completed: boolean
  sets_reps_done: string | null
  how_felt: string
  notes: string | null
  created_at: string
}
