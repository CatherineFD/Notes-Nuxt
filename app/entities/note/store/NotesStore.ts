import { defineStore } from 'pinia'
import { ref } from 'vue'
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
        await service.saveNotes(notes.value);
        error.value = null;
      } catch {
        error.value = 'Не удалось сохранить заметки';
      }
    }

    function upsertNote(note: Note) {
      const cleanNote = {
        ...note,
        todoList: note.todoList.filter((todo) => todo.description.trim() !== '')
      }

      const index = notes.value.findIndex((item) => item.id === cleanNote.id)

      if (index === -1) {
        notes.value.push(cleanNote)
      } else {
        notes.value[index] = cleanNote
      }

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
      loadNotes,
      getNoteById,
      upsertNote,
      saveNotes,
      deleteNote,
    }
  })
}

export type NotesStoreFactory = typeof createNotesStore;