'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { motion } from 'framer-motion'
import { useAppStore } from '@/store/appStore'
import type { QuestionAnswers } from '@/lib/exercises'

type RadioOption<T extends string> = { value: T; label: string; sub?: string }

const RADIATION_OPTIONS: RadioOption<QuestionAnswers['radiation']>[] = [
  { value: 'none', label: 'No, just in the back' },
  { value: 'buttock-thigh', label: 'Yes, into the buttock or thigh' },
  { value: 'below-knee', label: 'Yes, below the knee', sub: '(sciatica-like)' },
]

const DURATION_OPTIONS: RadioOption<QuestionAnswers['duration']>[] = [
  { value: 'acute', label: 'Less than 2 weeks', sub: '(recent / acute)' },
  { value: 'sub-acute', label: '2 to 6 weeks', sub: '(sub-acute)' },
  { value: 'chronic', label: 'More than 6 weeks', sub: '(chronic)' },
]

const NUMBNESS_OPTIONS: RadioOption<QuestionAnswers['numbness']>[] = [
  { value: 'none', label: 'No numbness or tingling' },
  { value: 'mild', label: 'Yes, mild', sub: '(occasional or minor)' },
  { value: 'significant', label: 'Yes, significant', sub: '(frequent or strong)' },
]

function RadioGroup<T extends string>({
  question,
  options,
  value,
  onChange,
}: {
  question: string
  options: RadioOption<T>[]
  value: T | null
  onChange: (v: T) => void
}) {
  return (
    <div className="bg-white rounded-xl border border-slate-100 shadow-sm p-4">
      <p className="text-slate-800 font-semibold text-base leading-snug mb-3">{question}</p>
      <div className="space-y-2">
        {options.map((opt) => (
          <button
            key={opt.value}
            onClick={() => onChange(opt.value)}
            className={`w-full text-left px-4 py-3 rounded-xl border-2 transition-all ${
              value === opt.value
                ? 'border-blue-500 bg-blue-50'
                : 'border-slate-100 hover:border-slate-200'
            }`}
          >
            <span className={`font-semibold text-sm ${value === opt.value ? 'text-blue-700' : 'text-slate-700'}`}>
              {opt.label}
            </span>
            {opt.sub && (
              <span className="text-slate-400 text-xs ml-1.5">{opt.sub}</span>
            )}
          </button>
        ))}
      </div>
    </div>
  )
}

export default function QuestionsPage() {
  const router = useRouter()
  const { user, painArea, setQuestionAnswers } = useAppStore()
  const [radiation, setRadiation] = useState<QuestionAnswers['radiation'] | null>(null)
  const [duration, setDuration] = useState<QuestionAnswers['duration'] | null>(null)
  const [numbness, setNumbness] = useState<QuestionAnswers['numbness'] | null>(null)
  const [mounted, setMounted] = useState(false)

  useEffect(() => { setMounted(true) }, [])
  useEffect(() => {
    if (mounted && !user) router.push('/account')
    if (mounted && !painArea) router.push('/diagram')
  }, [mounted, user, painArea, router])

  if (!mounted || !user) return null

  const allAnswered = radiation !== null && duration !== null && numbness !== null

  const handleContinue = () => {
    if (!allAnswered) return
    setQuestionAnswers({ radiation: radiation!, duration: duration!, numbness: numbness! })
    router.push('/exercises')
  }

  // For non-Lower Back areas, still show questions but note limited content
  const isLowerBack = painArea === 'Lower Back'

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
              className={`h-1 rounded-full flex-1 transition-colors ${s <= 3 ? 'bg-blue-500' : 'bg-slate-200'}`}
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

        <div className="mb-5">
          <p className="text-blue-600 text-sm font-semibold mb-1">Step 3 of 5</p>
          <h1 className="text-2xl font-bold text-slate-800">A few more details</h1>
          <p className="text-slate-500 mt-1">
            Help us understand your{' '}
            <span className="font-semibold text-slate-700">{painArea}</span> pain better.
          </p>
        </div>

        {!isLowerBack && (
          <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 mb-5">
            <p className="text-blue-700 text-sm font-medium">
              We currently have a full exercise library for lower back pain. Your answers will help us show the most relevant exercises available.
            </p>
          </div>
        )}

        <div className="space-y-4 mb-8">
          <RadioGroup
            question="1. Does the pain travel (radiate) down one or both legs?"
            options={RADIATION_OPTIONS}
            value={radiation}
            onChange={setRadiation}
          />
          <RadioGroup
            question="2. How long have you had this pain?"
            options={DURATION_OPTIONS}
            value={duration}
            onChange={setDuration}
          />
          <RadioGroup
            question="3. Do you have numbness, tingling, or weakness in your legs or feet?"
            options={NUMBNESS_OPTIONS}
            value={numbness}
            onChange={setNumbness}
          />
        </div>

        <button
          onClick={handleContinue}
          disabled={!allAnswered}
          className="w-full bg-blue-600 text-white font-bold py-4 rounded-xl text-base hover:bg-blue-700 active:scale-[0.98] transition-all disabled:opacity-40 disabled:cursor-not-allowed shadow-sm shadow-blue-200"
        >
          See my exercises →
        </button>
      </motion.div>
    </div>
  )
}
