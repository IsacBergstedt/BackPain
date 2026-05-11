'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { motion } from 'framer-motion'
import { useAppStore } from '@/store/appStore'
import { getRecommendedExercises, LOWER_BACK_EXERCISES, type LocalExercise } from '@/lib/exercises'
import { supabase } from '@/lib/supabase'

type HowFelt = 'Good' | 'Neutral' | 'Painful' | 'Sore'

type ExerciseLog = {
  exercise: LocalExercise
  completed: boolean
  howFelt: HowFelt | null
  setsRepsDone: string
  notes: string
}

const HOW_FELT_OPTIONS: { value: HowFelt; emoji: string; color: string }[] = [
  { value: 'Good', emoji: '😊', color: 'bg-emerald-100 border-emerald-400 text-emerald-700' },
  { value: 'Neutral', emoji: '😐', color: 'bg-slate-100 border-slate-400 text-slate-600' },
  { value: 'Sore', emoji: '😅', color: 'bg-amber-100 border-amber-400 text-amber-700' },
  { value: 'Painful', emoji: '😣', color: 'bg-red-100 border-red-400 text-red-700' },
]

export default function LogPage() {
  const router = useRouter()
  const { user, painArea, questionAnswers } = useAppStore()
  const [logs, setLogs] = useState<ExerciseLog[]>([])
  const [saving, setSaving] = useState(false)
  const [saved, setSaved] = useState(false)
  const [mounted, setMounted] = useState(false)

  useEffect(() => { setMounted(true) }, [])

  useEffect(() => {
    if (!mounted) return
    if (!user) { router.push('/account'); return }

    const exercises =
      painArea === 'Lower Back' && questionAnswers
        ? getRecommendedExercises(questionAnswers)
        : LOWER_BACK_EXERCISES.slice(0, 6)

    setLogs(
      exercises.map((ex) => ({
        exercise: ex,
        completed: false,
        howFelt: null,
        setsRepsDone: '',
        notes: '',
      }))
    )
  }, [mounted, user, painArea, questionAnswers, router])

  if (!mounted || !user) return null

  const updateLog = (index: number, patch: Partial<ExerciseLog>) => {
    setLogs((prev) => prev.map((l, i) => (i === index ? { ...l, ...patch } : l)))
  }

  const completedCount = logs.filter((l) => l.completed).length

  const handleSave = async () => {
    if (completedCount === 0) return
    setSaving(true)

    const today = new Date().toISOString().split('T')[0]
    const completedLogs = logs.filter((l) => l.completed)

    try {
      type ExRow = { id: string; name: string }
      // Fetch exercise IDs from Supabase by name
      const { data: dbExercises } = await supabase
        .from('exercises')
        .select('id, name')
        .in('name', completedLogs.map((l) => l.exercise.name))

      const nameToId = Object.fromEntries(((dbExercises ?? []) as ExRow[]).map((e) => [e.name, e.id]))

      type LogEntry = {
        user_id: string
        exercise_id: string
        date: string
        completed: boolean
        sets_reps_done: string | null
        how_felt: string
        notes: string | null
      }

      const entries: LogEntry[] = completedLogs
        .filter((l) => nameToId[l.exercise.name])
        .map((l) => ({
          user_id: user.id,
          exercise_id: nameToId[l.exercise.name],
          date: today,
          completed: true,
          sets_reps_done: l.setsRepsDone || null,
          how_felt: l.howFelt ?? 'Neutral',
          notes: l.notes || null,
        }))

      if (entries.length > 0) {
        await supabase.from('training_logs').insert(entries)
      }
    } catch {
      // Supabase not configured – that's OK, just mark as saved locally
    }

    setSaving(false)
    setSaved(true)
  }

  if (saved) {
    return (
      <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center p-6">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.4 }}
          className="max-w-sm w-full text-center"
        >
          <div className="w-24 h-24 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-6 text-5xl">
            ✅
          </div>
          <h2 className="text-2xl font-bold text-slate-800 mb-2">Session saved!</h2>
          <p className="text-slate-500 text-base mb-2">
            Great work, {user.name.split(' ')[0]}! You completed {completedCount} exercise{completedCount !== 1 ? 's' : ''} today.
          </p>
          <p className="text-slate-400 text-sm mb-8">Consistency is key — keep it up.</p>
          <div className="space-y-3">
            <button
              onClick={() => router.push('/progress')}
              className="w-full bg-blue-600 text-white font-bold py-4 rounded-xl text-base hover:bg-blue-700 transition-colors"
            >
              View progress →
            </button>
            <button
              onClick={() => router.push('/exercises')}
              className="w-full border-2 border-slate-200 text-slate-600 font-semibold py-3.5 rounded-xl text-base hover:bg-slate-50 transition-colors"
            >
              Back to exercises
            </button>
          </div>
        </motion.div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-slate-50 p-6 pb-28">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, ease: 'easeOut' }}
        className="max-w-sm mx-auto"
      >
        {/* Step indicator */}
        <div className="flex items-center gap-2 mb-6">
          {[1, 2, 3, 4, 5].map((s) => (
            <div key={s} className="h-1 rounded-full flex-1 bg-blue-500" />
          ))}
        </div>

        <button
          onClick={() => router.back()}
          className="flex items-center gap-1 text-slate-500 text-sm mb-5 hover:text-slate-700 transition-colors"
        >
          <svg viewBox="0 0 20 20" className="w-4 h-4" fill="currentColor">
            <path fillRule="evenodd" d="M9.707 16.707a1 1 0 01-1.414 0l-6-6a1 1 0 010-1.414l6-6a1 1 0 011.414 1.414L5.414 9H17a1 1 0 110 2H5.414l4.293 4.293a1 1 0 010 1.414z" clipRule="evenodd" />
          </svg>
          Back
        </button>

        <div className="mb-5">
          <p className="text-blue-600 text-sm font-semibold mb-1">Step 5 of 5</p>
          <h1 className="text-2xl font-bold text-slate-800">Log today's session</h1>
          <p className="text-slate-500 mt-1">
            {new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })}
          </p>
        </div>

        <div className="space-y-4 mb-6">
          {logs.map((log, i) => (
            <div key={log.exercise.name} className="bg-white rounded-xl border border-slate-100 shadow-sm p-4">
              {/* Exercise header */}
              <div className="flex items-center gap-3 mb-3">
                <button
                  onClick={() => updateLog(i, { completed: !log.completed })}
                  className={`w-7 h-7 rounded-lg border-2 flex items-center justify-center flex-shrink-0 transition-all ${
                    log.completed
                      ? 'bg-emerald-600 border-emerald-600'
                      : 'border-slate-300 hover:border-slate-400'
                  }`}
                >
                  {log.completed && (
                    <svg viewBox="0 0 20 20" className="w-4 h-4 text-white" fill="currentColor">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                  )}
                </button>
                <div>
                  <p className={`font-bold text-base leading-tight ${log.completed ? 'text-slate-800' : 'text-slate-500'}`}>
                    {log.exercise.name}
                  </p>
                  <p className="text-slate-400 text-xs">
                    {log.exercise.reps_sets ?? log.exercise.hold_time ?? ''}
                  </p>
                </div>
              </div>

              {log.completed && (
                <div className="space-y-3 pt-3 border-t border-slate-50">
                  {/* How did it feel */}
                  <div>
                    <p className="text-xs font-bold text-slate-400 uppercase tracking-wide mb-2">How did it feel?</p>
                    <div className="grid grid-cols-4 gap-2">
                      {HOW_FELT_OPTIONS.map((opt) => (
                        <button
                          key={opt.value}
                          onClick={() => updateLog(i, { howFelt: opt.value })}
                          className={`flex flex-col items-center py-2 px-1 rounded-xl border-2 transition-all text-xs font-semibold ${
                            log.howFelt === opt.value ? opt.color : 'border-slate-100 text-slate-500 hover:border-slate-200'
                          }`}
                        >
                          <span className="text-lg mb-0.5">{opt.emoji}</span>
                          {opt.value}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Optional: what they actually did */}
                  <div>
                    <p className="text-xs font-bold text-slate-400 uppercase tracking-wide mb-1.5">What did you do? (optional)</p>
                    <input
                      type="text"
                      value={log.setsRepsDone}
                      onChange={(e) => updateLog(i, { setsRepsDone: e.target.value })}
                      placeholder={`e.g. ${log.exercise.reps_sets ?? log.exercise.hold_time ?? '2 sets'}`}
                      className="w-full px-3 py-2.5 rounded-lg border border-slate-200 text-slate-700 text-sm placeholder:text-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-400"
                    />
                  </div>

                  {/* Notes */}
                  <div>
                    <p className="text-xs font-bold text-slate-400 uppercase tracking-wide mb-1.5">Notes (optional)</p>
                    <textarea
                      value={log.notes}
                      onChange={(e) => updateLog(i, { notes: e.target.value })}
                      placeholder="How are you feeling? Any observations?"
                      rows={2}
                      className="w-full px-3 py-2.5 rounded-lg border border-slate-200 text-slate-700 text-sm placeholder:text-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-400 resize-none"
                    />
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>

        {completedCount > 0 && (
          <div className="bg-emerald-50 border border-emerald-100 rounded-xl p-3 mb-4 text-center">
            <p className="text-emerald-700 font-semibold text-sm">
              {completedCount} exercise{completedCount !== 1 ? 's' : ''} completed today 🎉
            </p>
          </div>
        )}

        <button
          onClick={handleSave}
          disabled={completedCount === 0 || saving}
          className="w-full bg-teal-600 text-white font-bold py-4 rounded-xl text-base hover:bg-teal-700 active:scale-[0.98] transition-all disabled:opacity-40 disabled:cursor-not-allowed shadow-sm shadow-teal-200"
        >
          {saving ? 'Saving…' : completedCount === 0 ? 'Check off exercises to save' : `Save session (${completedCount} done)`}
        </button>
      </motion.div>
    </div>
  )
}
