'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { motion } from 'framer-motion'
import { useAppStore } from '@/store/appStore'

const RED_FLAG_QUESTIONS = [
  'Have you lost control of your bladder or bowels recently?',
  'Do you have numbness or tingling in the groin or saddle area (inner thighs, buttocks)?',
  'Have you had fever, chills, or unexplained weight loss alongside the back pain?',
  'Did the pain start after a fall, accident, or major trauma?',
  'Is the pain severe, constant, and gets worse at night — not relieved by rest?',
  'Do you have a history of cancer, long-term steroid use, or IV drug use?',
]

export default function ScreeningPage() {
  const router = useRouter()
  const { user, painArea, setRedFlagAnswers } = useAppStore()
  const [answers, setAnswers] = useState<(boolean | null)[]>(Array(6).fill(null))
  const [showWarning, setShowWarning] = useState(false)
  const [mounted, setMounted] = useState(false)

  useEffect(() => { setMounted(true) }, [])
  useEffect(() => {
    if (mounted && !user) router.push('/account')
    if (mounted && !painArea) router.push('/diagram')
  }, [mounted, user, painArea, router])

  if (!mounted || !user) return null

  const answeredCount = answers.filter((a) => a !== null).length
  const allAnswered = answeredCount === RED_FLAG_QUESTIONS.length
  const anyYes = answers.some((a) => a === true)

  const handleAnswer = (index: number, value: boolean) => {
    const updated = [...answers]
    updated[index] = value
    setAnswers(updated)
  }

  const handleContinue = () => {
    if (!allAnswered) return
    setRedFlagAnswers(answers)
    if (anyYes) {
      setShowWarning(true)
    } else {
      router.push('/questions')
    }
  }

  if (showWarning) {
    return (
      <div className="min-h-screen bg-red-50 flex flex-col items-center justify-center p-6">
        <motion.div
          initial={{ opacity: 0, scale: 0.93 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.35 }}
          className="max-w-sm w-full"
        >
          <div className="bg-white rounded-2xl border-2 border-red-200 p-7 shadow-sm text-center">
            <div className="flex justify-center mb-5">
              <div className="w-20 h-20 bg-red-100 rounded-full flex items-center justify-center text-4xl">
                ⚠️
              </div>
            </div>
            <h2 className="text-2xl font-bold text-red-700 mb-3">Important Warning</h2>
            <p className="text-slate-700 text-base leading-relaxed mb-5">
              Your answers suggest symptoms that may indicate a <strong>serious medical condition</strong>. Please consult a doctor or visit the ER immediately — before starting any exercises.
            </p>
            <div className="bg-red-50 border border-red-200 rounded-xl p-4 mb-6 text-left">
              <p className="text-red-700 text-sm font-semibold leading-snug">
                Do not start an exercise program until you have been evaluated and cleared by a healthcare professional.
              </p>
            </div>
            <div className="space-y-3">
              <button
                onClick={() => setShowWarning(false)}
                className="w-full border-2 border-slate-200 text-slate-700 font-semibold py-3.5 rounded-xl text-base hover:bg-slate-50 transition-colors"
              >
                ← Review my answers
              </button>
              <button
                onClick={() => router.push('/account')}
                className="w-full text-slate-400 text-sm py-2 hover:text-slate-600 transition-colors"
              >
                Return to start
              </button>
            </div>
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
            <div
              key={s}
              className={`h-1 rounded-full flex-1 transition-colors ${s <= 2 ? 'bg-blue-500' : 'bg-slate-200'}`}
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
          <p className="text-blue-600 text-sm font-semibold mb-1">Step 2 of 5</p>
          <h1 className="text-2xl font-bold text-slate-800">Safety check</h1>
          <p className="text-slate-500 mt-1">Please answer these 6 questions carefully before we proceed.</p>
        </div>

        <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 mb-5">
          <p className="text-amber-800 text-sm font-semibold leading-snug">
            If you answer <span className="underline">Yes</span> to any question, we will recommend you see a doctor before doing exercises.
          </p>
        </div>

        <div className="space-y-3 mb-8">
          {RED_FLAG_QUESTIONS.map((q, i) => (
            <div key={i} className="bg-white rounded-xl border border-slate-100 shadow-sm p-4">
              <p className="text-slate-800 font-medium text-base leading-snug mb-3">{q}</p>
              <div className="flex gap-3">
                <button
                  onClick={() => handleAnswer(i, false)}
                  className={`flex-1 py-3 rounded-xl font-bold text-sm transition-all ${
                    answers[i] === false
                      ? 'bg-emerald-600 text-white shadow-sm'
                      : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                  }`}
                >
                  No
                </button>
                <button
                  onClick={() => handleAnswer(i, true)}
                  className={`flex-1 py-3 rounded-xl font-bold text-sm transition-all ${
                    answers[i] === true
                      ? 'bg-red-600 text-white shadow-sm'
                      : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                  }`}
                >
                  Yes
                </button>
              </div>
            </div>
          ))}
        </div>

        <button
          onClick={handleContinue}
          disabled={!allAnswered}
          className="w-full bg-blue-600 text-white font-bold py-4 rounded-xl text-base hover:bg-blue-700 active:scale-[0.98] transition-all disabled:opacity-40 disabled:cursor-not-allowed shadow-sm shadow-blue-200"
        >
          {allAnswered
            ? anyYes
              ? 'See important information →'
              : 'Continue →'
            : `Answer all questions (${answeredCount} / ${RED_FLAG_QUESTIONS.length})`}
        </button>
      </motion.div>
    </div>
  )
}
