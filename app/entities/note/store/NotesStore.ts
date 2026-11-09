import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import type { Note } from '../model/types'

export interface NotesGateway {
  getNotes(): Promise<Note[]>
  saveNotes(notes: Note[]): Promise<void>
}

export function createNotesStore(service: NotesGateway) {
  return defineStore('notes', () => {
    const notes = ref<Note[]>([])
    const isLoading = ref(false)
    const error = ref<string | null>(null)

    const completedCount = computed(() =>
      notes.value.reduce(
        (total, note) =>
          total + note.todoList.filter((todo) => todo.isComplete).length,
        0,
      ),
    )

    async function loadNotes() {
      isLoading.value = true
      error.value = null

      try {
        notes.value = await service.getNotes()
      } catch {
        error.value = 'Не удалось загрузить заметки'
      } finally {
        isLoading.value = false
      }
    }

    function addNote(title: string) {
      const newNote: Note = {
        id: crypto.randomUUID(),
        title: title.trim(),
        todoList: [],
      }
      notes.value.push(newNote)
      void saveNotes()
    }

    async function saveNotes() {
      try {
        await service.saveNotes(notes.value);
        error.value = null;
      } catch {
        error.value = 'Не удалось сохранить заметки';
      }
    }

    async function saveNote(note: Note) {
      const existingIndex = notes.value.findIndex((n) => n.id === note.id)

      if (existingIndex !== -1) {
        notes.value[existingIndex] = note
      } else {
        notes.value.push(note)
      }

      await service.saveNotes(notes.value)
    }

    function addTodo(noteId: string, description: string) {
      const note = notes.value.find((item) => item.id === noteId)
      if (!note) return

      note.todoList.push({
        id: crypto.randomUUID(),
        description,
        isComplete: false,
      })

      void saveNotes()
    }

    function toggleTodo(noteId: string, todoId: string) {
      const note = notes.value.find((item) => item.id === noteId)
      const todo = note?.todoList.find((item) => item.id === todoId)
      if (!todo) return

      todo.isComplete = !todo.isComplete

      void saveNotes()
    }

    function getNoteById(noteId: string): Note | undefined {
      const note = notes.value.find((item) => item.id === noteId);

      return note;
    }

    function deleteNote(noteId: string) {
      notes.value = notes.value.filter((n) => n.id !== noteId)
      void saveNotes()
    }

    return {
      notes,
      isLoading,
      error,
      completedCount,
      loadNotes,
      addNote,
      addTodo,
      toggleTodo,
      getNoteById,
      saveNote,
      deleteNote,
    }
  })
}

export type NotesStoreFactory = typeof createNotesStore;