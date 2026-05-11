import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import type { QuestionAnswers } from '@/lib/exercises'

export type PainArea = 'Lower Back' | 'Neck' | 'Mid/Upper Back' | 'General'

type AppUser = {
  id: string
  name: string
  email: string
}

type AppState = {
  user: AppUser | null
  painArea: PainArea | null
  redFlagAnswers: (boolean | null)[]
  questionAnswers: QuestionAnswers | null
  setUser: (user: AppUser) => void
  setPainArea: (area: PainArea) => void
  setRedFlagAnswers: (answers: (boolean | null)[]) => void
  setQuestionAnswers: (answers: QuestionAnswers) => void
  reset: () => void
}

export const useAppStore = create<AppState>()(
  persist(
    (set) => ({
      user: null,
      painArea: null,
      redFlagAnswers: [],
      questionAnswers: null,
      setUser: (user) => set({ user }),
      setPainArea: (area) => set({ painArea: area }),
      setRedFlagAnswers: (answers) => set({ redFlagAnswers: answers }),
      setQuestionAnswers: (answers) => set({ questionAnswers: answers }),
      reset: () =>
        set({ user: null, painArea: null, redFlagAnswers: [], questionAnswers: null }),
    }),
    { name: 'backpain-app' }
  )
)
