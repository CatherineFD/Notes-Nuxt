import { describe, it, expect, vi, beforeEach } from 'vitest'
import { setActivePinia, createPinia } from 'pinia'
import { useNoteEditorStore } from './useNoteEditorStore'
import type { Note } from '~/entities/note/model/types'
import type { NoteCommand } from '../model/commands'
import * as draftPersistence from '../lib/draftPersistence'

vi.mock('../lib/draftPersistence', () => ({
  saveDraftToLS: vi.fn(),
  removeDraftFromLS: vi.fn(),
}))

describe('useNoteEditorStore', () => {
  let store: ReturnType<typeof useNoteEditorStore>
  let mockNote: Note

  beforeEach(() => {
    setActivePinia(createPinia())
    store = useNoteEditorStore()
    
    mockNote = {
      id: 'test-note-1',
      title: 'Тестовая заметка',
      todoList: [],
    }

    vi.clearAllMocks()
  })

  describe('Initial State', () => {
    it('должен инициализироваться с null draft и пустыми стеками', () => {
      expect(store.draft).toBeNull()
      expect(store.undoStack).toEqual([])
      expect(store.redoStack).toEqual([])
      expect(store.canUndo).toBe(false)
      expect(store.canRedo).toBe(false)
    })
  })

    describe('executeCommand', () => {
    it('должен выполнить команду и добавить её в undo стек', () => {
      store.draft = mockNote
      
      const mockCommand: NoteCommand = {
        type: 'TEST_COMMAND',
        execute: vi.fn(),
        revert: vi.fn(),
      }

      store.executeCommand(mockCommand)

      expect(mockCommand.execute).toHaveBeenCalledWith(mockNote)
      expect(store.undoStack).toHaveLength(1)
      
      expect(store.undoStack[0]).toStrictEqual(mockCommand)
      
      expect(store.canUndo).toBe(true)
      expect(draftPersistence.saveDraftToLS).toHaveBeenCalledWith(mockNote)
    })

    it('должен очистить redo стек при выполнении новой команды после undo', () => {
      store.draft = mockNote
      
      const command1: NoteCommand = { type: 'CMD1', execute: vi.fn(), revert: vi.fn() }
      const command2: NoteCommand = { type: 'CMD2', execute: vi.fn(), revert: vi.fn() }

      store.executeCommand(command1)
      expect(store.undoStack).toHaveLength(1)
      expect(store.redoStack).toHaveLength(0)

      store.undo()
      expect(store.undoStack).toHaveLength(0)
      expect(store.redoStack).toHaveLength(1)
      expect(store.redoStack[0]?.type).toBe('CMD1')

      store.executeCommand(command2)
      
      expect(store.redoStack).toHaveLength(0) 
      expect(store.undoStack).toHaveLength(1) 
      expect(store.undoStack[0]?.type).toBe('CMD2')
    })
  })

  describe('undo', () => {
    it('должен отменить последнюю команду и переместить её в redo стек', () => {
      store.draft = mockNote
      
      const mockCommand: NoteCommand = {
        type: 'TEST',
        execute: vi.fn(),
        revert: vi.fn(),
      }

      store.executeCommand(mockCommand)
      expect(store.undoStack).toHaveLength(1)
      expect(store.redoStack).toHaveLength(0)

      store.undo()

      expect(mockCommand.revert).toHaveBeenCalledWith(mockNote)
      expect(store.undoStack).toHaveLength(0)
      expect(store.redoStack).toHaveLength(1)
      expect(store.canUndo).toBe(false)
      expect(store.canRedo).toBe(true)
      expect(draftPersistence.saveDraftToLS).toHaveBeenCalledWith(mockNote)
    })

    it('не должен выполнять undo, если стек пуст', () => {
      store.draft = mockNote
      
      store.undo()

      expect(store.undoStack).toHaveLength(0)
      expect(store.redoStack).toHaveLength(0)
    })

    it('не должен выполнять undo, если draft is null', () => {
      store.draft = null
      
      const mockCommand: NoteCommand = {
        type: 'TEST',
        execute: vi.fn(),
        revert: vi.fn(),
      }
      
      store.undoStack.push(mockCommand)

      store.undo()

      expect(mockCommand.revert).not.toHaveBeenCalled()
    })
  })

  describe('redo', () => {
    it('должен повторить отменённую команду и переместить её обратно в undo стек', () => {
      store.draft = mockNote
      
      const mockCommand: NoteCommand = {
        type: 'TEST',
        execute: vi.fn(),
        revert: vi.fn(),
      }

      store.executeCommand(mockCommand)
      store.undo()
      
      expect(store.undoStack).toHaveLength(0)
      expect(store.redoStack).toHaveLength(1)

      store.redo()

      expect(mockCommand.execute).toHaveBeenCalledTimes(2) // execute + redo
      expect(store.undoStack).toHaveLength(1)
      expect(store.redoStack).toHaveLength(0)
      expect(store.canRedo).toBe(false)
      expect(store.canUndo).toBe(true)
    })

    it('не должен выполнять redo, если стек пуст', () => {
      store.draft = mockNote
      
      store.redo()

      expect(store.undoStack).toHaveLength(0)
      expect(store.redoStack).toHaveLength(0)
    })

    it('не должен выполнять redo, если draft is null', () => {
      store.draft = null
      
      const mockCommand: NoteCommand = {
        type: 'TEST',
        execute: vi.fn(),
        revert: vi.fn(),
      }
      
      store.redoStack.push(mockCommand)

      store.redo()

      expect(mockCommand.execute).not.toHaveBeenCalled()
    })
  })

  describe('Undo/Redo Cycle', () => {
    it('должен корректно работать в цикле undo/redo', () => {
      store.draft = mockNote
      
      const command1: NoteCommand = { type: 'CMD1', execute: vi.fn(), revert: vi.fn() }
      const command2: NoteCommand = { type: 'CMD2', execute: vi.fn(), revert: vi.fn() }

      store.executeCommand(command1)
      store.executeCommand(command2)
      
      expect(store.undoStack).toHaveLength(2)
      expect(command2.execute).toHaveBeenCalledTimes(1)

      // Первое undo
      store.undo()
      expect(command2.revert).toHaveBeenCalledTimes(1)
      expect(store.undoStack).toHaveLength(1)
      expect(store.redoStack).toHaveLength(1)

      // Второе undo
      store.undo()
      expect(command1.revert).toHaveBeenCalledTimes(1)
      expect(store.undoStack).toHaveLength(0)
      expect(store.redoStack).toHaveLength(2)

      // Первое redo
      store.redo()
      expect(command1.execute).toHaveBeenCalledTimes(2)
      expect(store.undoStack).toHaveLength(1)
      expect(store.redoStack).toHaveLength(1)

      // Второе redo
      store.redo()
      expect(command2.execute).toHaveBeenCalledTimes(2)
      expect(store.undoStack).toHaveLength(2)
      expect(store.redoStack).toHaveLength(0)
    })
  })

  describe('clearDraftStorage', () => {
    it('должен удалить черновик из localStorage', () => {
      store.draft = mockNote

      store.clearDraftStorage()

      expect(draftPersistence.removeDraftFromLS).toHaveBeenCalledWith('test-note-1')
    })

    it('не должен вызывать removeDraftFromLS, если draft is null', () => {
      store.draft = null

      store.clearDraftStorage()

      expect(draftPersistence.removeDraftFromLS).not.toHaveBeenCalled()
    })
  })

  describe('reset', () => {
    it('должен сбросить все состояния стора', () => {
      store.draft = mockNote
      store.undoStack.push({ type: 'TEST', execute: vi.fn(), revert: vi.fn() })
      store.redoStack.push({ type: 'TEST', execute: vi.fn(), revert: vi.fn() })

      store.reset()

      expect(store.draft).toBeNull()
      expect(store.undoStack).toEqual([])
      expect(store.redoStack).toEqual([])
      expect(store.canUndo).toBe(false)
      expect(store.canRedo).toBe(false)
    })
  })

  describe('cleanup', () => {
    it('должен очистить localStorage и сбросить состояние', () => {
      store.draft = mockNote
      store.undoStack.push({ type: 'TEST', execute: vi.fn(), revert: vi.fn() })

      store.cleanup()

      expect(draftPersistence.removeDraftFromLS).toHaveBeenCalledWith('test-note-1')
      expect(store.draft).toBeNull()
      expect(store.undoStack).toEqual([])
      expect(store.redoStack).toEqual([])
    })
  })
})