'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { motion } from 'framer-motion'
import { useAppStore, type PainArea } from '@/store/appStore'

const PAIN_AREAS: { id: PainArea; label: string; desc: string; svgColor: string; svgHover: string; svgSelected: string; dot: string }[] = [
  {
    id: 'Lower Back',
    label: 'Lower Back',
    desc: 'Lumbar region, above the hips',
    svgColor: '#DBEAFE',
    svgHover: '#BFDBFE',
    svgSelected: '#3B82F6',
    dot: 'bg-blue-500',
  },
  {
    id: 'Mid/Upper Back',
    label: 'Mid / Upper Back',
    desc: 'Thoracic region, between shoulder blades',
    svgColor: '#D1FAE5',
    svgHover: '#A7F3D0',
    svgSelected: '#10B981',
    dot: 'bg-emerald-500',
  },
  {
    id: 'Neck',
    label: 'Neck',
    desc: 'Cervical region, base of skull to shoulders',
    svgColor: '#FEF3C7',
    svgHover: '#FDE68A',
    svgSelected: '#F59E0B',
    dot: 'bg-amber-500',
  },
  {
    id: 'General',
    label: 'General / Multiple Areas',
    desc: 'Pain across multiple back regions',
    svgColor: '#EDE9FE',
    svgHover: '#DDD6FE',
    svgSelected: '#8B5CF6',
    dot: 'bg-violet-500',
  },
]

export default function DiagramPage() {
  const router = useRouter()
  const { user, setPainArea } = useAppStore()
  const [selected, setSelected] = useState<PainArea | null>(null)
  const [hovered, setHovered] = useState<PainArea | null>(null)
  const [mounted, setMounted] = useState(false)

  useEffect(() => { setMounted(true) }, [])
  useEffect(() => {
    if (mounted && !user) router.push('/account')
  }, [mounted, user, router])

  if (!mounted || !user) return null

  const getAreaConfig = (id: PainArea) => PAIN_AREAS.find((a) => a.id === id)!

  const zoneStyle = (id: PainArea) => {
    const cfg = getAreaConfig(id)
    if (selected === id) return { fill: cfg.svgSelected }
    if (hovered === id) return { fill: cfg.svgHover }
    return { fill: cfg.svgColor }
  }

  const textColor = (id: PainArea) => (selected === id ? 'white' : '#475569')

  const handleContinue = () => {
    if (!selected) return
    setPainArea(selected)
    router.push('/screening')
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
              className={`h-1 rounded-full flex-1 transition-colors ${s === 1 ? 'bg-blue-500' : 'bg-slate-200'}`}
            />
          ))}
        </div>

        <div className="mb-6">
          <p className="text-blue-600 text-sm font-semibold mb-1">Step 1 of 5</p>
          <h1 className="text-2xl font-bold text-slate-800">Where does it hurt?</h1>
          <p className="text-slate-500 mt-1">Tap the diagram or select a region below.</p>
        </div>

        {/* SVG Diagram */}
        <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-5 mb-5 flex justify-center">
          <svg viewBox="0 0 200 330" className="w-44" aria-label="Body back diagram">
            {/* Head */}
            <circle cx="100" cy="38" r="26" fill="#F1F5F9" stroke="#CBD5E1" strokeWidth="1.5" />

            {/* Neck zone */}
            <rect
              x="85" y="62" width="30" height="24"
              rx="5"
              style={zoneStyle('Neck')}
              stroke={selected === 'Neck' ? '#D97706' : '#E2E8F0'}
              strokeWidth="1.5"
              cursor="pointer"
              onClick={() => setSelected('Neck')}
              onMouseEnter={() => setHovered('Neck')}
              onMouseLeave={() => setHovered(null)}
            />
            <text x="100" y="78" textAnchor="middle" fontSize="6.5" fill={textColor('Neck')} style={{ pointerEvents: 'none', fontWeight: 600 }}>
              Neck
            </text>

            {/* Body silhouette */}
            <path
              d="M 55 88 Q 40 94 38 118 L 38 258 Q 38 268 55 270 L 145 270 Q 162 268 162 258 L 162 118 Q 160 94 145 88 Q 122 82 100 82 Q 78 82 55 88 Z"
              fill="#F8FAFC"
              stroke="#E2E8F0"
              strokeWidth="1.5"
            />

            {/* Mid/Upper Back zone */}
            <rect
              x="50" y="92" width="100" height="80"
              rx="8"
              style={zoneStyle('Mid/Upper Back')}
              stroke={selected === 'Mid/Upper Back' ? '#059669' : '#E2E8F0'}
              strokeWidth="1.5"
              cursor="pointer"
              onClick={() => setSelected('Mid/Upper Back')}
              onMouseEnter={() => setHovered('Mid/Upper Back')}
              onMouseLeave={() => setHovered(null)}
            />
            <text x="100" y="130" textAnchor="middle" fontSize="6.5" fill={textColor('Mid/Upper Back')} style={{ pointerEvents: 'none', fontWeight: 600 }}>
              Mid / Upper
            </text>
            <text x="100" y="140" textAnchor="middle" fontSize="6.5" fill={textColor('Mid/Upper Back')} style={{ pointerEvents: 'none', fontWeight: 600 }}>
              Back
            </text>

            {/* Lower Back zone */}
            <rect
              x="54" y="178" width="92" height="70"
              rx="8"
              style={zoneStyle('Lower Back')}
              stroke={selected === 'Lower Back' ? '#2563EB' : '#E2E8F0'}
              strokeWidth="1.5"
              cursor="pointer"
              onClick={() => setSelected('Lower Back')}
              onMouseEnter={() => setHovered('Lower Back')}
              onMouseLeave={() => setHovered(null)}
            />
            <text x="100" y="218" textAnchor="middle" fontSize="6.5" fill={textColor('Lower Back')} style={{ pointerEvents: 'none', fontWeight: 600 }}>
              Lower Back
            </text>

            {/* Spine line */}
            <line x1="100" y1="88" x2="100" y2="175" stroke="#CBD5E1" strokeWidth="1.5" strokeDasharray="4 3" style={{ pointerEvents: 'none' }} />
            <line x1="100" y1="180" x2="100" y2="246" stroke="#CBD5E1" strokeWidth="1.5" strokeDasharray="4 3" style={{ pointerEvents: 'none' }} />
          </svg>
        </div>

        {/* Area selection cards */}
        <div className="space-y-2.5 mb-6">
          {PAIN_AREAS.map((area) => (
            <button
              key={area.id}
              onClick={() => setSelected(area.id)}
              className={`w-full text-left p-4 rounded-xl border-2 transition-all ${
                selected === area.id
                  ? 'border-blue-500 bg-blue-50'
                  : 'border-slate-100 bg-white hover:border-slate-200 active:bg-slate-50'
              }`}
            >
              <div className="flex items-center gap-3">
                <span className={`w-3.5 h-3.5 rounded-full flex-shrink-0 ${area.dot} ${selected === area.id ? 'opacity-100' : 'opacity-40'}`} />
                <div className="flex-1 min-w-0">
                  <p className={`font-semibold text-base leading-tight ${selected === area.id ? 'text-blue-700' : 'text-slate-800'}`}>
                    {area.label}
                  </p>
                  <p className="text-slate-400 text-sm mt-0.5">{area.desc}</p>
                </div>
                {selected === area.id && (
                  <svg viewBox="0 0 20 20" className="w-5 h-5 text-blue-600 flex-shrink-0" fill="currentColor">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                )}
              </div>
            </button>
          ))}
        </div>

        <button
          onClick={handleContinue}
          disabled={!selected}
          className="w-full bg-blue-600 text-white font-bold py-4 rounded-xl text-base hover:bg-blue-700 active:scale-[0.98] transition-all disabled:opacity-40 disabled:cursor-not-allowed shadow-sm shadow-blue-200"
        >
          Continue →
        </button>
      </motion.div>
    </div>
  )
}
