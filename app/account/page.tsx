'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { motion } from 'framer-motion'
import { useAppStore } from '@/store/appStore'
import { supabase } from '@/lib/supabase'

export default function AccountPage() {
  const router = useRouter()
  const { user, setUser } = useAppStore()
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  useEffect(() => {
    if (mounted && user) {
      router.push('/diagram')
    }
  }, [mounted, user, router])

  if (!mounted) return null

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!name.trim() || !email.trim()) {
      setError('Please enter your name and email.')
      return
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(email.trim())) {
      setError('Please enter a valid email address.')
      return
    }
    setLoading(true)
    setError('')

    try {
      const normalizedEmail = email.trim().toLowerCase()

      type UserRow = { id: string; name: string; email: string }

      const { data: existing } = await supabase
        .from('users')
        .select('*')
        .eq('email', normalizedEmail)
        .maybeSingle<UserRow>()

      if (existing) {
        setUser({ id: existing.id, name: existing.name, email: existing.email })
      } else {
        const { data: created, error: insertError } = await supabase
          .from('users')
          .insert({ name: name.trim(), email: normalizedEmail })
          .select()
          .maybeSingle<UserRow>()

        if (insertError || !created) {
          // Supabase not configured yet — use a local user
          setUser({ id: crypto.randomUUID(), name: name.trim(), email: normalizedEmail })
        } else {
          setUser({ id: created.id, name: created.name, email: created.email })
        }
      }

      router.push('/diagram')
    } catch {
      // Fallback for when Supabase is not yet configured
      setUser({
        id: crypto.randomUUID(),
        name: name.trim(),
        email: email.trim().toLowerCase(),
      })
      router.push('/diagram')
    }
  }

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center p-6">
      <motion.div
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.45, ease: 'easeOut' }}
        className="w-full max-w-sm"
      >
        {/* App icon */}
        <div className="flex justify-center mb-8">
          <div className="w-20 h-20 bg-blue-600 rounded-3xl flex items-center justify-center shadow-lg shadow-blue-200">
            <svg viewBox="0 0 24 24" className="w-11 h-11 text-white" fill="none" stroke="currentColor" strokeWidth="1.8">
              <path
                d="M12 3C9 3 7 5.5 7 8c0 2 1 3.5 2 5l3 6 3-6c1-1.5 2-3 2-5 0-2.5-2-5-5-5z"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <circle cx="12" cy="8" r="2" fill="currentColor" stroke="none" />
            </svg>
          </div>
        </div>

        <h1 className="text-3xl font-bold text-slate-800 text-center mb-1">BackCare</h1>
        <p className="text-slate-500 text-center mb-8 text-base leading-relaxed">
          Personalized exercises for lower back pain — designed to be safe and effective.
        </p>

        <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-6">
          <h2 className="text-xl font-bold text-slate-800 mb-1">Get started</h2>
          <p className="text-slate-500 text-sm mb-5">Enter your details to personalize your plan.</p>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-1.5">Your name</label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="e.g. Alex Smith"
                autoComplete="name"
                className="w-full px-4 py-3.5 rounded-xl border border-slate-200 text-slate-800 text-base placeholder:text-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-shadow"
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-1.5">Email address</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
                autoComplete="email"
                className="w-full px-4 py-3.5 rounded-xl border border-slate-200 text-slate-800 text-base placeholder:text-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-shadow"
              />
            </div>

            {error && (
              <p className="text-red-600 text-sm font-medium">{error}</p>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-blue-600 text-white font-bold py-4 rounded-xl text-base hover:bg-blue-700 active:scale-[0.98] transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-sm shadow-blue-200"
            >
              {loading ? 'Setting up…' : 'Continue →'}
            </button>
          </form>
        </div>

        <p className="text-center text-slate-400 text-xs mt-5 leading-relaxed">
          Your information is used only to save your exercise history and personalize your plan.
        </p>
      </motion.div>
    </div>
  )
}
