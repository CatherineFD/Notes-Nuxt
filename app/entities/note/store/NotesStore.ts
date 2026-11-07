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

    async function saveNotes() {
      try {
        await service.saveNotes(notes.value)
      } catch {
        error.value = 'Не удалось сохранить заметки'
      }
    }

    function addNote(title: string) {
      notes.value.push({
        id: crypto.randomUUID(),
        title,
        todoList: [],
      })

      void saveNotes()
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

    return {
      notes,
      isLoading,
      error,
      completedCount,
      loadNotes,
      addNote,
      addTodo,
      toggleTodo,
    }
  })
}

export type NotesStoreFactory = typeof createNotesStore;