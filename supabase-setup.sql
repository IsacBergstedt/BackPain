-- Run this SQL in your Supabase SQL editor at:
-- https://supabase.com/dashboard/project/YOUR_PROJECT_REF/sql

-- 1. Users table
create table if not exists users (
  id uuid primary key default gen_random_uuid(),
  email text unique not null,
  name text not null,
  created_at timestamp with time zone default now()
);

-- 2. Exercises table
create table if not exists exercises (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  description text not null,
  reps_sets text,
  hold_time text,
  safety_notes text not null,
  level text not null default 'beginner',
  benefits text not null,
  video_url text,
  pain_area text not null,
  priority_order integer not null,
  created_at timestamp with time zone default now()
);

-- 3. Training logs table
create table if not exists training_logs (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references users(id) on delete cascade,
  exercise_id uuid references exercises(id) on delete cascade,
  date date not null,
  completed boolean not null default false,
  sets_reps_done text,
  how_felt text,
  notes text,
  created_at timestamp with time zone default now()
);

-- 4. Seed exercises
insert into exercises (name, description, reps_sets, hold_time, safety_notes, level, benefits, video_url, pain_area, priority_order) values
(
  'Pelvic Tilt',
  'Lie on your back with knees bent, feet flat. Tighten your abs and press your lower back into the floor. Hold 5 seconds, then release.',
  '10 reps, 2–3 sets', '5 seconds',
  'Stop if sharp pain. This is beginner-friendly core activation.',
  'beginner', 'Core activation, reduces lower back strain',
  'https://placeholder.com/pelvic-tilt', 'Lower Back', 1
),
(
  'Knee to Chest (Single)',
  'Lie on back, pull one knee gently toward your chest. Keep the other foot flat or extended. Hold 15–30 seconds, then switch sides.',
  null, '15–30 seconds each side',
  'Gentle stretch. Do not force the knee further than is comfortable.',
  'beginner', 'Relieves tension, improves flexibility',
  'https://placeholder.com/knee-to-chest', 'Lower Back', 2
),
(
  'Cat-Cow Stretch',
  'On all fours, alternate arching your back up (Cat) and dipping it down (Cow). Move slowly with breath. Do 8–10 full cycles.',
  '8–10 cycles', null,
  'Move slowly, do not force extremes of the movement.',
  'beginner', 'Improves spinal mobility, warms up the spine',
  'https://placeholder.com/cat-cow', 'Lower Back', 3
),
(
  'Bird Dog',
  'On all fours, extend one arm forward and the opposite leg back simultaneously. Keep hips level and back straight. Hold 5–10 seconds, then alternate sides.',
  null, '5–10 seconds each side',
  'Keep back neutral, do not arch. Core stability is essential throughout.',
  'beginner', 'Core stability, balance, back strength',
  'https://placeholder.com/bird-dog', 'Lower Back', 4
),
(
  'Bridge (Glute Bridge)',
  'Lie on back with knees bent, feet flat on the floor. Lift hips toward the ceiling, squeeze glutes at the top. Hold 5 seconds, then lower slowly.',
  '10–12 reps, 2–3 sets', '5 seconds',
  'Do not overarch the lower back. Squeeze glutes, not lower back muscles.',
  'beginner', 'Strengthens glutes and lower back, pain relief',
  'https://placeholder.com/glute-bridge', 'Lower Back', 5
),
(
  'Child''s Pose',
  'Kneel on the floor, sit back on your heels, then reach your arms forward and lower your chest toward the floor. Breathe deeply and relax.',
  null, '20–30 seconds',
  'Gentle restorative pose. Only go as far as is comfortable.',
  'beginner', 'Gentle spinal stretch, relaxation, decompression',
  'https://placeholder.com/childs-pose', 'Lower Back', 6
),
(
  'Supine Twist (Lying)',
  'Lie on back with knees bent. Let both knees fall gently to one side while keeping shoulders flat on the floor. Hold, then bring knees back to center and switch sides.',
  null, '15–20 seconds each side',
  'Keep shoulders flat on the floor. Do not force the rotation.',
  'beginner', 'Spinal mobility, reduces muscle tension',
  'https://placeholder.com/supine-twist', 'Lower Back', 7
),
(
  'Dead Bug',
  'Lie on back with arms pointing to the ceiling and knees bent to 90°. Slowly extend one arm overhead and the opposite leg out straight while keeping your lower back pressed to the floor. Alternate sides.',
  '8–10 reps per side', null,
  'Keep lower back pressed to the floor throughout. Core control is essential.',
  'beginner', 'Core strength, coordination, back stability',
  'https://placeholder.com/dead-bug', 'Lower Back', 8
);

-- 5. Row-level security (optional, for production)
-- alter table users enable row level security;
-- alter table training_logs enable row level security;
