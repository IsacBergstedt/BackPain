export type LocalExercise = {
  name: string
  description: string
  reps_sets: string | null
  hold_time: string | null
  safety_notes: string
  level: string
  benefits: string
  video_url: string
  pain_area: string
  priority_order: number
}

export type QuestionAnswers = {
  radiation: 'none' | 'buttock-thigh' | 'below-knee'
  duration: 'acute' | 'sub-acute' | 'chronic'
  numbness: 'none' | 'mild' | 'significant'
}

export const LOWER_BACK_EXERCISES: LocalExercise[] = [
  {
    name: 'Pelvic Tilt',
    description:
      'Lie on your back with knees bent, feet flat. Tighten your abs and press your lower back into the floor. Hold 5 seconds, then release.',
    reps_sets: '10 reps, 2–3 sets',
    hold_time: '5 seconds',
    safety_notes: 'Stop if sharp pain. This is beginner-friendly core activation.',
    level: 'beginner',
    benefits: 'Core activation, reduces lower back strain',
    video_url: 'https://placeholder.com/pelvic-tilt',
    pain_area: 'Lower Back',
    priority_order: 1,
  },
  {
    name: 'Knee to Chest (Single)',
    description:
      'Lie on back, pull one knee gently toward your chest. Keep the other foot flat or extended. Hold 15–30 seconds, then switch sides.',
    reps_sets: null,
    hold_time: '15–30 seconds each side',
    safety_notes: 'Gentle stretch. Do not force the knee further than is comfortable.',
    level: 'beginner',
    benefits: 'Relieves tension, improves flexibility',
    video_url: 'https://placeholder.com/knee-to-chest',
    pain_area: 'Lower Back',
    priority_order: 2,
  },
  {
    name: 'Cat-Cow Stretch',
    description:
      'On all fours, alternate arching your back up (Cat) and dipping it down (Cow). Move slowly with breath. Do 8–10 full cycles.',
    reps_sets: '8–10 cycles',
    hold_time: null,
    safety_notes: 'Move slowly, do not force extremes of the movement.',
    level: 'beginner',
    benefits: 'Improves spinal mobility, warms up the spine',
    video_url: 'https://placeholder.com/cat-cow',
    pain_area: 'Lower Back',
    priority_order: 3,
  },
  {
    name: 'Bird Dog',
    description:
      'On all fours, extend one arm forward and the opposite leg back simultaneously. Keep hips level and back straight. Hold 5–10 seconds, then alternate sides.',
    reps_sets: null,
    hold_time: '5–10 seconds each side',
    safety_notes: 'Keep back neutral, do not arch. Core stability is essential throughout.',
    level: 'beginner',
    benefits: 'Core stability, balance, back strength',
    video_url: 'https://placeholder.com/bird-dog',
    pain_area: 'Lower Back',
    priority_order: 4,
  },
  {
    name: 'Bridge (Glute Bridge)',
    description:
      'Lie on back with knees bent, feet flat on the floor. Lift hips toward the ceiling, squeeze glutes at the top. Hold 5 seconds, then lower slowly.',
    reps_sets: '10–12 reps, 2–3 sets',
    hold_time: '5 seconds',
    safety_notes: 'Do not overarch the lower back. Squeeze glutes, not lower back muscles.',
    level: 'beginner',
    benefits: 'Strengthens glutes and lower back, pain relief',
    video_url: 'https://placeholder.com/glute-bridge',
    pain_area: 'Lower Back',
    priority_order: 5,
  },
  {
    name: "Child's Pose",
    description:
      "Kneel on the floor, sit back on your heels, then reach your arms forward and lower your chest toward the floor. Breathe deeply and relax.",
    reps_sets: null,
    hold_time: '20–30 seconds',
    safety_notes: "Gentle restorative pose. Only go as far as is comfortable.",
    level: 'beginner',
    benefits: 'Gentle spinal stretch, relaxation, decompression',
    video_url: 'https://placeholder.com/childs-pose',
    pain_area: 'Lower Back',
    priority_order: 6,
  },
  {
    name: 'Supine Twist (Lying)',
    description:
      'Lie on back with knees bent. Let both knees fall gently to one side while keeping shoulders flat on the floor. Hold, then bring knees back to center and switch sides.',
    reps_sets: null,
    hold_time: '15–20 seconds each side',
    safety_notes: 'Keep shoulders flat on the floor. Do not force the rotation.',
    level: 'beginner',
    benefits: 'Spinal mobility, reduces muscle tension',
    video_url: 'https://placeholder.com/supine-twist',
    pain_area: 'Lower Back',
    priority_order: 7,
  },
  {
    name: 'Dead Bug',
    description:
      'Lie on back with arms pointing to the ceiling and knees bent to 90°. Slowly extend one arm overhead and the opposite leg out straight while keeping your lower back pressed to the floor. Alternate sides.',
    reps_sets: '8–10 reps per side',
    hold_time: null,
    safety_notes: 'Keep lower back pressed to the floor throughout. Core control is essential.',
    level: 'beginner',
    benefits: 'Core strength, coordination, back stability',
    video_url: 'https://placeholder.com/dead-bug',
    pain_area: 'Lower Back',
    priority_order: 8,
  },
]

export function getRecommendedExercises(answers: QuestionAnswers): LocalExercise[] {
  const { radiation, duration, numbness } = answers
  const include = new Set<string>()

  // No radiation + acute → gentle stretches priority
  if (radiation === 'none' && duration === 'acute') {
    ;['Knee to Chest (Single)', 'Cat-Cow Stretch', "Child's Pose", 'Supine Twist (Lying)', 'Pelvic Tilt'].forEach((n) =>
      include.add(n)
    )
  }

  // Radiation to buttock/thigh → mixed approach
  if (radiation === 'buttock-thigh') {
    ;['Pelvic Tilt', 'Cat-Cow Stretch', 'Knee to Chest (Single)', 'Bridge (Glute Bridge)', "Child's Pose", 'Bird Dog'].forEach(
      (n) => include.add(n)
    )
  }

  // Radiation below knee OR any numbness → nerve-friendly stability focus
  if (radiation === 'below-knee' || numbness !== 'none') {
    ;['Bird Dog', 'Pelvic Tilt', 'Bridge (Glute Bridge)', 'Dead Bug', 'Cat-Cow Stretch', "Child's Pose"].forEach((n) =>
      include.add(n)
    )
  }

  // Chronic pain → add strengthening exercises
  if (duration === 'chronic') {
    ;['Bird Dog', 'Bridge (Glute Bridge)', 'Dead Bug', 'Pelvic Tilt', 'Cat-Cow Stretch'].forEach((n) => include.add(n))
  }

  // Significant numbness → all stabilization, reduce passive stretches
  if (numbness === 'significant') {
    include.clear()
    ;['Pelvic Tilt', 'Bird Dog', 'Bridge (Glute Bridge)', 'Dead Bug', 'Cat-Cow Stretch'].forEach((n) => include.add(n))
  }

  // Default: show balanced set if nothing was triggered
  if (include.size === 0) {
    ;['Pelvic Tilt', 'Knee to Chest (Single)', 'Cat-Cow Stretch', "Child's Pose", 'Supine Twist (Lying)', 'Bridge (Glute Bridge)'].forEach(
      (n) => include.add(n)
    )
  }

  return LOWER_BACK_EXERCISES.filter((ex) => include.has(ex.name)).sort((a, b) => a.priority_order - b.priority_order)
}
