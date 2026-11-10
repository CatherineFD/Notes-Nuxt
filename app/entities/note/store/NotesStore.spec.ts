import { describe, it, expect, vi, beforeEach } from 'vitest'
import { createPinia, setActivePinia } from 'pinia'
import { createNotesStore } from './NotesStore'
import type { Note } from '../model/types'

describe('NotesStore', () => {
  let mockGateway: any
  let store: ReturnType<ReturnType<typeof createNotesStore>>

  beforeEach(() => {
    setActivePinia(createPinia())
    
    mockGateway = {
      getNotes: vi.fn(),
      saveNotes: vi.fn(),
    }
    
    store = createNotesStore(mockGateway)()
  })

  describe('Initial State', () => {
    it('должен инициализироваться с правильными значениями по умолчанию', () => {
      expect(store.notes).toEqual([])
      expect(store.isLoading).toBe(false)
      expect(store.error).toBeNull()
    })
  })

  describe('loadNotes', () => {
    it('должен успешно загружать заметки и обновлять состояние', async () => {
      const mockNotes: Note[] = [{ id: '1', title: 'Test', todoList: [] }]
      mockGateway.getNotes.mockResolvedValue(mockNotes)

      await store.loadNotes()

      expect(mockGateway.getNotes).toHaveBeenCalledTimes(1)
      expect(store.notes).toEqual(mockNotes)
      expect(store.isLoading).toBe(false)
      expect(store.error).toBeNull()
    })

    it('должен обрабатывать ошибки при загрузке', async () => {
      mockGateway.getNotes.mockRejectedValue(new Error('Network error'))

      await store.loadNotes()

      expect(store.isLoading).toBe(false)
      expect(store.error).toBe('Не удалось загрузить заметки')
      expect(store.notes).toEqual([])
    })
  })

  describe('getNoteById', () => {
    it('должен возвращать заметку по ID', () => {
      const targetNote = { id: '1', title: 'Целевая заметка', todoList: [] }
      store.notes = [targetNote, { id: '2', title: 'Другая', todoList: [] }]

      const result = store.getNoteById('1')
      expect(result).toEqual(targetNote)
    })

    it('должен возвращать undefined, если заметка не найдена', () => {
      store.notes = [{ id: '1', title: 'Другая заметка', todoList: [] }]
      
      const result = store.getNoteById('999')
      expect(result).toBeUndefined()
    })
  })

  describe('saveNote', () => {
    it('должен обновлять свойства существующей заметки, сохраняя реактивную ссылку', async () => {
      const existingNote: Note = { id: '1', title: 'Старый заголовок', todoList: [] }
      store.notes.push(existingNote)
      
      const noteReference = store.notes[0]

      const updatedNote: Note = { 
        id: '1', 
        title: 'Новый заголовок', 
        todoList: [{ id: 't1', description: 'Задача', isComplete: false }] 
      }
      
      await store.upsertNote(updatedNote)

      expect(store.notes.length).toBe(1)
      
      expect(store.notes[0]).toBe(noteReference)
      
      expect(store.notes[0]?.title).toBe('Новый заголовок')
      expect(store.notes[0]?.todoList).toEqual(updatedNote.todoList)
      
      expect(mockGateway.saveNotes).toHaveBeenCalledWith(store.notes)
    })

    it('должен добавлять новую заметку, если она не найдена по ID', async () => {
      const newNote: Note = { id: '2', title: 'Совершенно новая', todoList: [] }
      
      await store.upsertNote(newNote)

      expect(store.notes.length).toBe(1)
      expect(store.notes[0]?.title).toBe('Совершенно новая')
      expect(mockGateway.saveNotes).toHaveBeenCalledWith(store.notes)
    })
  })

  describe('deleteNote', () => {
    it('должен удалять заметку по ID и вызывать saveNotes', () => {
      store.notes = [
        { id: '1', title: 'Останется', todoList: [] },
        { id: '2', title: 'Удалится', todoList: [] },
      ]

      store.deleteNote('2')

      expect(store.notes.length).toBe(1)
      expect(store.notes[0]?.id).toBe('1')
      expect(mockGateway.saveNotes).toHaveBeenCalledWith(store.notes)
    })

    it('не должен падать, если заметка для удаления не найдена', () => {
      store.notes = [{ id: '1', title: 'Останется', todoList: [] }]
      
      expect(() => store.deleteNote('999')).not.toThrow()
      expect(store.notes.length).toBe(1)
      expect(mockGateway.saveNotes).toHaveBeenCalled()
    })
  })

  describe('saveNotes (внутренний метод)', () => {
    it('должен очищать ошибку при успешном сохранении', async () => {
      store.error = 'Предыдущая ошибка'
      mockGateway.saveNotes.mockResolvedValue(undefined)

      await store.saveNotes()

      expect(store.error).toBeNull()
    })

    it('должен устанавливать ошибку при неудачном сохранении', async () => {
      mockGateway.saveNotes.mockRejectedValue(new Error('Fail'))

      await store.saveNotes()

      expect(store.error).toBe('Не удалось сохранить заметки')
    })
  })
})