import { ThreadType } from 'src/types/apps/veridionTypes'
import { create } from 'zustand'

type State = {
  messages: string[]
  threads: ThreadType[]
  selectedThreadId: number | null
}

type Action = {
  addMessage: (m: string) => void
  addThread: (t: ThreadType) => void
  setSelectedThreadId: (t: number | null) => void
}

export const useSearchStore = create<State & Action>(set => ({
  messages: [],
  threads: [],
  selectedThreadId: null,

  addMessage: message => {
    set(state => ({ messages: [...state.messages, message] }))
  },

  addThread: (thread: ThreadType) => {
    set(state => ({ threads: [...state.threads, thread] }))
  },

  updateThreads: (thread: ThreadType) => {
    set(state => {
      const elemPosition = state.threads.findIndex(({ id }) => id === thread.id)

      const updatedThreads = [...state.threads.slice(0, elemPosition), thread, ...state.threads.slice(elemPosition + 1)]

      return { threads: updatedThreads }
    })
  },

  setSelectedThreadId: (threadId: number | null) => {
    set(() => ({ selectedThreadId: threadId }))
  }
}))
