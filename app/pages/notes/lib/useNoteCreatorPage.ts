import { onMounted } from 'vue'
import { navigateTo } from '#app'
import { useNoteEditorStore } from '~/features/noteEditorFeature/store/useNoteEditorStore'
import type { Note } from '~/entities/note/model/types'

export function useNoteCreatorPage() {
  const useNotesStore = useNuxtApp().$notesStore
  const notesStore = useNotesStore()
  const editorStore = useNoteEditorStore()

  const initializeEditor = () => {
    editorStore.draft = {
      id: crypto.randomUUID(),
      title: '',
      todoList: [],
    }
  }

  const handleSave = async (note: Note) => {
    await notesStore.upsertNote(note)
    navigateTo(`/notes/${note.id}`)
  }

  const handleCancel = () => {
    navigateTo('/')
  }

  onMounted(() => {
    initializeEditor()
  })

  return {
    editorStore,
    handleSave,
    handleCancel,
  }
}