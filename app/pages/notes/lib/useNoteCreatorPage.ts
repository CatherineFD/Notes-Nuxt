import { ref, onMounted } from 'vue'
import { navigateTo } from '#app'
import { useNoteEditorStore } from '~/features/noteEditorFeature/store/useNoteEditorStore'
import { loadDraftFromLS, removeDraftFromLS } from '~/features/noteEditorFeature/lib/draftPersistence'
import type { Note } from '~/entities/note/model/types'

const TEMP_NEW_NOTE_ID = '__new_note__';

export function useNoteCreatorPage() {
  const useNotesStore = useNuxtApp().$notesStore;
  const notesStore = useNotesStore();
  const editorStore = useNoteEditorStore();

  const showRestoreModal = ref(false);
  const pendingDraft = ref<Note | null>(null);

  const initializeEditor = () => {
    const draft = loadDraftFromLS(TEMP_NEW_NOTE_ID);

    if (draft) {
      pendingDraft.value = draft;
      showRestoreModal.value = true;
    } else {
      editorStore.draft = {
        id: TEMP_NEW_NOTE_ID,
        title: '',
        todoList: [],
      }
    }
  }

  const handleSave = async (note: Note) => {
    const finalNote = note.id === TEMP_NEW_NOTE_ID
      ? { ...note, id: crypto.randomUUID() }
      : note;

    await notesStore.upsertNote(finalNote);
    removeDraftFromLS(TEMP_NEW_NOTE_ID);
    editorStore.clearHistory();
    navigateTo(`/notes/${finalNote.id}`);
  }

  const handleCancel = () => {
    removeDraftFromLS(TEMP_NEW_NOTE_ID);
    editorStore.cleanup();
    navigateTo('/');
  }

  const restoreDraft = () => {
    if (pendingDraft.value) {
      editorStore.draft =  JSON.parse(JSON.stringify(pendingDraft.value));
    }
    showRestoreModal.value = false;
  }

  const discardDraft = () => {
    removeDraftFromLS(TEMP_NEW_NOTE_ID);
    editorStore.draft = {
      id: TEMP_NEW_NOTE_ID,
      title: '',
      todoList: [],
    }
    showRestoreModal.value = false;
  }

  onMounted(() => {
    initializeEditor();
  })

  return {
    editorStore,
    showRestoreModal,
    handleSave,
    handleCancel,
    restoreDraft,
    discardDraft,
  }
}