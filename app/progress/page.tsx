'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { motion } from 'framer-motion'
import { useAppStore } from '@/store/appStore'
import { supabase } from '@/lib/supabase'

type DayLog = {
  date: string
  count: number
  howFelt: string[]
}

const DAY_LABELS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']

function getLast7Days(): string[] {
  return Array.from({ length: 7 }, (_, i) => {
    const d = new Date()
    d.setDate(d.getDate() - (6 - i))
    return d.toISOString().split('T')[0]
  })
}

function moodColor(logs: DayLog | undefined): string {
  if (!logs || logs.count === 0) return 'bg-slate-100'
  const moods = logs.howFelt
  if (moods.includes('Painful')) return 'bg-red-400'
  if (moods.includes('Sore')) return 'bg-amber-400'
  if (moods.includes('Good')) return 'bg-emerald-400'
  return 'bg-blue-400'
}

export default function ProgressPage() {
  const router = useRouter()
  const { user } = useAppStore()
  const [dayLogs, setDayLogs] = useState<Map<string, DayLog>>(new Map())
  const [totalCompleted, setTotalCompleted] = useState(0)
  const [streak, setStreak] = useState(0)
  const [loading, setLoading] = useState(true)
  const [mounted, setMounted] = useState(false)

  useEffect(() => { setMounted(true) }, [])

  useEffect(() => {
    if (!mounted) return
    if (!user) { router.push('/account'); return }
    fetchProgress()
  }, [mounted, user])

  const fetchProgress = async () => {
    if (!user) return
    setLoading(true)
    try {
      type LogRow = { date: string; completed: boolean; how_felt: string | null }

      const { data } = await supabase
        .from('training_logs')
        .select('date, completed, how_felt')
        .eq('user_id', user.id)
        .eq('completed', true)
        .order('date', { ascending: false })
        .limit(100)

      const rows = (data ?? []) as LogRow[]
      if (rows.length > 0) {
        const map = new Map<string, DayLog>()
        for (const row of rows) {
          const existing = map.get(row.date) ?? { date: row.date, count: 0, howFelt: [] }
          existing.count += 1
          if (row.how_felt) existing.howFelt.push(row.how_felt)
          map.set(row.date, existing)
        }
        setDayLogs(map)
        setTotalCompleted(rows.length)

        // Calculate streak
        let s = 0
        const today = new Date()
        for (let i = 0; i < 30; i++) {
          const d = new Date(today)
          d.setDate(d.getDate() - i)
          const key = d.toISOString().split('T')[0]
          if (map.has(key)) { s++ } else { break }
        }
        setStreak(s)
      }
    } catch {
      // Supabase not configured – show empty state
    }
    setLoading(false)
  }

  if (!mounted || !user) return null

  const last7 = getLast7Days()
  const maxCount = Math.max(...last7.map((d) => dayLogs.get(d)?.count ?? 0), 1)

  return (
    <div className="min-h-screen bg-slate-50 p-6 pb-28">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, ease: 'easeOut' }}
        className="max-w-sm mx-auto"
      >
        <button
          onClick={() => router.back()}
          className="flex items-center gap-1 text-slate-500 text-sm mb-5 hover:text-slate-700 transition-colors"
        >
          <svg viewBox="0 0 20 20" className="w-4 h-4" fill="currentColor">
            <path fillRule="evenodd" d="M9.707 16.707a1 1 0 01-1.414 0l-6-6a1 1 0 010-1.414l6-6a1 1 0 011.414 1.414L5.414 9H17a1 1 0 110 2H5.414l4.293 4.293a1 1 0 010 1.414z" clipRule="evenodd" />
          </svg>
          Back
        </button>

        <div className="mb-6">
          <h1 className="text-2xl font-bold text-slate-800">Your progress</h1>
          <p className="text-slate-500 mt-1">Hi {user.name.split(' ')[0]}, here's how you're doing.</p>
        </div>

        {/* Stat cards */}
        <div className="grid grid-cols-2 gap-3 mb-6">
          <div className="bg-white rounded-xl border border-slate-100 shadow-sm p-4 text-center">
            <p className="text-3xl font-bold text-blue-600">{totalCompleted}</p>
            <p className="text-slate-500 text-sm mt-1">Total exercises</p>
          </div>
          <div className="bg-white rounded-xl border border-slate-100 shadow-sm p-4 text-center">
            <p className="text-3xl font-bold text-emerald-600">{streak}</p>
            <p className="text-slate-500 text-sm mt-1">Day streak 🔥</p>
          </div>
        </div>

        {/* 7-day bar chart */}
        <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-5 mb-6">
          <p className="text-sm font-bold text-slate-600 mb-4">Last 7 days</p>

          {loading ? (
            <div className="h-32 flex items-center justify-center">
              <p className="text-slate-400 text-sm">Loading…</p>
            </div>
          ) : (
            <div className="flex items-end gap-2 h-28">
              {last7.map((date) => {
                const log = dayLogs.get(date)
                const count = log?.count ?? 0
                const heightPct = count === 0 ? 0 : Math.max(10, (count / maxCount) * 100)
                const dayIndex = new Date(date + 'T12:00:00').getDay()
                const isToday = date === new Date().toISOString().split('T')[0]
                return (
                  <div key={date} className="flex-1 flex flex-col items-center gap-1">
                    <div className="w-full flex flex-col justify-end" style={{ height: '80px' }}>
                      <div
                        className={`w-full rounded-t-lg transition-all ${moodColor(log)} ${count === 0 ? 'opacity-40' : ''}`}
                        style={{ height: count === 0 ? '4px' : `${heightPct}%` }}
                      />
                    </div>
                    <p className={`text-xs font-semibold ${isToday ? 'text-blue-600' : 'text-slate-400'}`}>
                      {DAY_LABELS[dayIndex]}
                    </p>
                    {count > 0 && (
                      <p className="text-xs text-slate-500">{count}</p>
                    )}
                  </div>
                )
              })}
            </div>
          )}

          {/* Legend */}
          <div className="flex flex-wrap gap-3 mt-4 pt-4 border-t border-slate-50">
            {[
              { color: 'bg-emerald-400', label: 'Felt good' },
              { color: 'bg-amber-400', label: 'Sore' },
              { color: 'bg-red-400', label: 'Painful' },
              { color: 'bg-slate-100', label: 'No session' },
            ].map(({ color, label }) => (
              <div key={label} className="flex items-center gap-1.5">
                <span className={`w-3 h-3 rounded ${color}`} />
                <span className="text-slate-400 text-xs">{label}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Recent sessions list */}
        {dayLogs.size > 0 && (
          <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-5 mb-6">
            <p className="text-sm font-bold text-slate-600 mb-3">Recent sessions</p>
            <div className="space-y-2">
              {Array.from(dayLogs.entries())
                .sort((a, b) => b[0].localeCompare(a[0]))
                .slice(0, 7)
                .map(([date, log]) => (
                  <div key={date} className="flex items-center justify-between py-2 border-b border-slate-50 last:border-0">
                    <div>
                      <p className="text-sm font-semibold text-slate-700">
                        {new Date(date + 'T12:00:00').toLocaleDateString('en-US', {
                          weekday: 'short',
                          month: 'short',
                          day: 'numeric',
                        })}
                      </p>
                      <p className="text-xs text-slate-400">{log.count} exercise{log.count !== 1 ? 's' : ''}</p>
                    </div>
                    <div className={`w-2.5 h-2.5 rounded-full ${moodColor(log)}`} />
                  </div>
                ))}
            </div>
          </div>
        )}

        {dayLogs.size === 0 && !loading && (
          <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-8 text-center mb-6">
            <p className="text-4xl mb-3">📊</p>
            <p className="text-slate-700 font-semibold mb-1">No sessions yet</p>
            <p className="text-slate-400 text-sm">Complete your first exercise session to see your progress here.</p>
          </div>
        )}

        <div className="space-y-3">
          <button
            onClick={() => router.push('/log')}
            className="w-full bg-teal-600 text-white font-bold py-4 rounded-xl text-base hover:bg-teal-700 transition-colors shadow-sm shadow-teal-200"
          >
            Log today's session →
          </button>
          <button
            onClick={() => router.push('/exercises')}
            className="w-full border-2 border-slate-200 text-slate-600 font-semibold py-3.5 rounded-xl text-base hover:bg-slate-100 transition-colors"
          >
            View exercises
          </button>
        </div>
      </motion.div>
    </div>
  )
}
