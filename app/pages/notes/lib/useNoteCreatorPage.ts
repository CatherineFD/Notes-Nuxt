import { ref, onMounted } from 'vue'
import { navigateTo } from '#app'
import { useNoteEditorStore } from '~/features/noteEditorFeature/store/useNoteEditorStore'
import { loadDraftFromLS, removeDraftFromLS } from '~/features/noteEditorFeature/lib/draftPersistence'
import type { Note } from '~/entities/note/model/types'

const TEMP_NEW_NOTE_ID = '__new_note__'

export function useNoteCreatorPage() {
  const useNotesStore = useNuxtApp().$notesStore
  const notesStore = useNotesStore()
  const editorStore = useNoteEditorStore()

  const showRestoreModal = ref(false)
  const pendingDraft = ref<Note | null>(null)
  const showUnsavedModal = ref(false)

  const initializeEditor = () => {
    editorStore.draft = {
      id: TEMP_NEW_NOTE_ID,
      title: '',
      todoList: [],
    }

    const savedDraft = loadDraftFromLS(TEMP_NEW_NOTE_ID)

    if (savedDraft) {
      pendingDraft.value = savedDraft
      showRestoreModal.value = true
    }
  }

  const handleSave = async (note: Note) => {
    const finalNote = note.id === TEMP_NEW_NOTE_ID
      ? { ...note, id: crypto.randomUUID() }
      : note

    await notesStore.upsertNote(finalNote)
    removeDraftFromLS(TEMP_NEW_NOTE_ID)
    
    editorStore.clearHistory()
    
    if (editorStore.draft) {
      editorStore.draft.id = finalNote.id
    }
  }

  const handleBackRequest = () => {
    if (editorStore.canUndo) {
      showUnsavedModal.value = true
    } else {
      navigateTo('/')
    }
  }

  const confirmDiscardAndLeave = () => {
    showUnsavedModal.value = false
    removeDraftFromLS(TEMP_NEW_NOTE_ID)
    editorStore.cleanup()
    navigateTo('/')
  }

  const handleCancel = () => {
    handleBackRequest()
  }

  const restoreDraft = () => {
    if (pendingDraft.value) {
      editorStore.draft = JSON.parse(JSON.stringify(pendingDraft.value)) as Note
    }
    showRestoreModal.value = false
  }

  const discardDraft = () => {
    removeDraftFromLS(TEMP_NEW_NOTE_ID)
    editorStore.draft = {
      id: TEMP_NEW_NOTE_ID,
      title: '',
      todoList: [],
    }
    showRestoreModal.value = false
  }

  onMounted(() => {
    initializeEditor()
  })

  return {
    editorStore,
    showRestoreModal,
    showUnsavedModal,
    handleSave,
    handleBackRequest,
    confirmDiscardAndLeave,
    handleCancel,
    restoreDraft,
    discardDraft,
  }
}