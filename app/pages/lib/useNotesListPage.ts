import { ref, onMounted } from 'vue'
import { navigateTo } from '#app'
import type { Note } from '~/entities/note/model/types'

export function useNotesListPage() {
  const useNotesStore = useNuxtApp().$notesStore
  const notesStore = useNotesStore()
  const { notes } = storeToRefs(notesStore)

  const isDeleteModalOpen = ref(false)
  const noteToDelete = ref<Note | null>(null)

  const loadNotes = async () => {
    await notesStore.loadNotes()
  }

  const handleEdit = (note: Note) => {
    navigateTo(`/notes/${note.id}`)
  }

  const requestDelete = (note: Note) => {
    noteToDelete.value = note
    isDeleteModalOpen.value = true
  }

  const confirmDelete = async () => {
    if (!noteToDelete.value) return

    try {
      await notesStore.deleteNote(noteToDelete.value.id)
    } catch (error) {
      console.error('Ошибка при удалении заметки:', error)
    } finally {
      isDeleteModalOpen.value = false
      noteToDelete.value = null
    }
  }

  const cancelDelete = () => {
    isDeleteModalOpen.value = false
    noteToDelete.value = null
  }

  onMounted(() => {
    loadNotes()
  })

  return {
    notes,
    isDeleteModalOpen,
    noteToDelete,
    handleEdit,
    requestDelete,
    confirmDelete,
    cancelDelete,
  }
}