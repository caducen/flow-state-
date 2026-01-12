'use client'

import { useState } from 'react'
import { Note } from '@/types'

interface NoteAreaProps {
  notes: Note[]
  setNotes: (notes: Note[] | ((prev: Note[]) => Note[])) => void
}

export function NoteArea({ notes, setNotes }: NoteAreaProps) {
  const [activeNoteId, setActiveNoteId] = useState<string | null>(null)
  const [isCreating, setIsCreating] = useState(false)

  const activeNote = notes.find(n => n.id === activeNoteId)

  const createNote = () => {
    const newNote: Note = {
      id: crypto.randomUUID(),
      title: 'Untitled',
      content: '',
      createdAt: Date.now(),
    }
    setNotes(prev => [newNote, ...prev])
    setActiveNoteId(newNote.id)
    setIsCreating(true)
  }

  const updateNote = (id: string, updates: Partial<Note>) => {
    setNotes(prev =>
      prev.map(note =>
        note.id === id ? { ...note, ...updates } : note
      )
    )
  }

  const deleteNote = (id: string) => {
    setNotes(prev => prev.filter(note => note.id !== id))
    if (activeNoteId === id) {
      setActiveNoteId(null)
    }
  }

  const handleBack = () => {
    setActiveNoteId(null)
    setIsCreating(false)
  }

  // Active note view
  if (activeNote) {
    return (
      <div className="bg-surface-base border-subtle rounded-2xl p-5 shadow-card flex-1 flex flex-col animate-fade-in">
        {/* Header */}
        <div className="flex items-center gap-3 mb-4">
          <button
            onClick={handleBack}
            className="text-ink-muted hover:text-ink-rich transition-colors p-1 -ml-1
              hover:bg-surface-raised rounded-lg"
          >
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 19l-7-7 7-7" />
            </svg>
          </button>
          <input
            type="text"
            value={activeNote.title}
            onChange={(e) => updateNote(activeNote.id, { title: e.target.value })}
            placeholder="Note title..."
            autoFocus={isCreating}
            className="flex-1 bg-transparent font-display text-base font-medium text-ink-rich
              focus:outline-none placeholder-ink-faint"
          />
          <button
            onClick={() => deleteNote(activeNote.id)}
            className="text-ink-faint hover:text-rose-accent transition-colors p-1
              hover:bg-surface-raised rounded-lg"
          >
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
            </svg>
          </button>
        </div>

        {/* Content */}
        <textarea
          value={activeNote.content}
          onChange={(e) => updateNote(activeNote.id, { content: e.target.value })}
          placeholder="Start writing..."
          autoFocus={!isCreating}
          className="flex-1 min-h-[120px] w-full bg-surface-raised border-subtle rounded-xl px-4 py-3
            text-sm text-ink-rich placeholder-ink-faint resize-none leading-relaxed
            focus:border-amber-glow/30 focus:shadow-glow-sm
            transition-all duration-200"
        />
      </div>
    )
  }

  // Notes list view
  return (
    <div className="bg-surface-base border-subtle rounded-2xl p-5 shadow-card flex-1 flex flex-col">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-emerald-400" />
          <h2 className="font-display text-base font-medium text-ink-rich">Notes</h2>
        </div>
        <button
          onClick={createNote}
          className="text-xs text-ink-muted hover:text-amber-glow transition-colors
            px-2 py-1 rounded-lg hover:bg-surface-raised"
        >
          + New
        </button>
      </div>

      {/* Notes List */}
      <div className="flex-1 overflow-y-auto space-y-1">
        {notes.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-8">
            <div className="w-10 h-10 rounded-full bg-surface-raised flex items-center justify-center mb-3">
              <svg className="w-5 h-5 text-ink-faint" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
              </svg>
            </div>
            <p className="text-xs text-ink-faint italic">No notes yet</p>
            <button
              onClick={createNote}
              className="text-xs text-amber-glow hover:text-amber-soft mt-2 transition-colors"
            >
              Create your first note
            </button>
          </div>
        ) : (
          notes.map(note => (
            <button
              key={note.id}
              onClick={() => setActiveNoteId(note.id)}
              className="w-full text-left p-3 -mx-1 rounded-xl
                hover:bg-surface-raised transition-all duration-150
                group border border-transparent hover:border-white/5"
            >
              <p className="text-sm font-medium text-ink-rich truncate group-hover:text-amber-soft transition-colors">
                {note.title || 'Untitled'}
              </p>
              <p className="text-xs text-ink-faint truncate mt-0.5">
                {note.content || 'Empty note'}
              </p>
            </button>
          ))
        )}
      </div>
    </div>
  )
}
