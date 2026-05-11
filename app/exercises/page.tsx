'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { motion } from 'framer-motion'
import { useAppStore } from '@/store/appStore'
import { getRecommendedExercises, LOWER_BACK_EXERCISES, type LocalExercise } from '@/lib/exercises'

function ExerciseCard({ ex, index }: { ex: LocalExercise; index: number }) {
  const [expanded, setExpanded] = useState(false)

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35, delay: index * 0.06 }}
      className="bg-white rounded-xl border border-slate-100 shadow-sm overflow-hidden"
    >
      <button
        onClick={() => setExpanded(!expanded)}
        className="w-full text-left p-4"
      >
        <div className="flex items-start gap-3">
          <div className="w-8 h-8 rounded-lg bg-blue-100 flex items-center justify-center flex-shrink-0 mt-0.5">
            <span className="text-blue-700 font-bold text-sm">{ex.priority_order}</span>
          </div>
          <div className="flex-1 min-w-0">
            <p className="font-bold text-slate-800 text-base leading-tight">{ex.name}</p>
            {(ex.reps_sets || ex.hold_time) && (
              <p className="text-slate-500 text-sm mt-0.5">
                {ex.reps_sets ?? ex.hold_time}
              </p>
            )}
          </div>
          <svg
            viewBox="0 0 20 20"
            className={`w-5 h-5 text-slate-400 flex-shrink-0 transition-transform mt-0.5 ${expanded ? 'rotate-180' : ''}`}
            fill="currentColor"
          >
            <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
          </svg>
        </div>
      </button>

      {expanded && (
        <div className="px-4 pb-4 border-t border-slate-50">
          <div className="pt-3 space-y-3">
            <div>
              <p className="text-xs font-bold text-slate-400 uppercase tracking-wide mb-1">How to do it</p>
              <p className="text-slate-700 text-sm leading-relaxed">{ex.description}</p>
            </div>

            {ex.reps_sets && (
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold text-slate-400 uppercase tracking-wide">Sets / Reps:</span>
                <span className="text-sm font-semibold text-teal-700 bg-teal-50 px-2 py-0.5 rounded-lg">{ex.reps_sets}</span>
              </div>
            )}
            {ex.hold_time && (
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold text-slate-400 uppercase tracking-wide">Hold:</span>
                <span className="text-sm font-semibold text-teal-700 bg-teal-50 px-2 py-0.5 rounded-lg">{ex.hold_time}</span>
              </div>
            )}

            <div>
              <p className="text-xs font-bold text-slate-400 uppercase tracking-wide mb-1">Benefits</p>
              <p className="text-sm text-slate-600">{ex.benefits}</p>
            </div>

            <div className="bg-amber-50 border border-amber-100 rounded-lg p-3">
              <p className="text-xs font-bold text-amber-700 uppercase tracking-wide mb-1">⚠ Safety note</p>
              <p className="text-sm text-amber-800">{ex.safety_notes}</p>
            </div>
          </div>
        </div>
      )}
    </motion.div>
  )
}

export default function ExercisesPage() {
  const router = useRouter()
  const { user, painArea, questionAnswers } = useAppStore()
  const [mounted, setMounted] = useState(false)

  useEffect(() => { setMounted(true) }, [])
  useEffect(() => {
    if (mounted && !user) router.push('/account')
    if (mounted && !painArea) router.push('/diagram')
    if (mounted && !questionAnswers) router.push('/questions')
  }, [mounted, user, painArea, questionAnswers, router])

  if (!mounted || !user || !questionAnswers) return null

  const exercises =
    painArea === 'Lower Back'
      ? getRecommendedExercises(questionAnswers)
      : LOWER_BACK_EXERCISES.slice(0, 6) // Show general set for other areas

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
            <div
              key={s}
              className={`h-1 rounded-full flex-1 transition-colors ${s <= 4 ? 'bg-blue-500' : 'bg-slate-200'}`}
            />
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

        <div className="mb-2">
          <p className="text-blue-600 text-sm font-semibold mb-1">Step 4 of 5</p>
          <h1 className="text-2xl font-bold text-slate-800">Your exercises</h1>
          <p className="text-slate-500 mt-1">
            {exercises.length} exercises selected for your{' '}
            <span className="font-semibold text-slate-700">{painArea}</span> pain.
          </p>
        </div>

        {/* General info banner */}
        <div className="bg-blue-50 border border-blue-100 rounded-xl p-4 my-4">
          <p className="text-blue-700 text-sm font-medium leading-snug">
            Tap any exercise to expand the instructions. Start gently and stop immediately if you feel sharp pain.
          </p>
        </div>

        <div className="space-y-3 mb-6">
          {exercises.map((ex, i) => (
            <ExerciseCard key={ex.name} ex={ex} index={i} />
          ))}
        </div>

        {/* Safety reminder */}
        <div className="bg-red-50 border border-red-100 rounded-xl p-4 mb-6">
          <p className="text-red-700 text-sm font-semibold mb-1">Important safety reminders</p>
          <ul className="text-red-700 text-sm space-y-1 list-disc list-inside leading-relaxed">
            <li>Stop any exercise that causes sharp or shooting pain</li>
            <li>Move slowly and never force a position</li>
            <li>Consult a physiotherapist if pain does not improve in 2 weeks</li>
          </ul>
        </div>

        <button
          onClick={() => router.push('/log')}
          className="w-full bg-teal-600 text-white font-bold py-4 rounded-xl text-base hover:bg-teal-700 active:scale-[0.98] transition-all shadow-sm shadow-teal-200"
        >
          Log today's session →
        </button>

        <button
          onClick={() => router.push('/progress')}
          className="w-full mt-3 border-2 border-slate-200 text-slate-600 font-semibold py-3.5 rounded-xl text-base hover:bg-slate-100 transition-colors"
        >
          View progress
        </button>
      </motion.div>
    </div>
  )
}
