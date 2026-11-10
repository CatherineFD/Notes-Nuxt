import { ref, onMounted } from 'vue'
import { useRoute, navigateTo, createError } from '#app'
import { useNoteEditorStore } from '~/features/noteEditorFeature/store/useNoteEditorStore'
import { loadDraftFromLS, removeDraftFromLS } from '~/features/noteEditorFeature/lib/draftPersistence'
import type { Note } from '~/entities/note/model/types'

export function useNoteEditorPage() {
  const route = useRoute();
  const noteId = String(route.params.id);

  const useNotesStore = useNuxtApp().$notesStore;
  const notesStore = useNotesStore();
  const editorStore = useNoteEditorStore();

  const showRestoreModal = ref(false);
  const pendingDraft = ref<Note | null>(null);

  let originalNote: Note | undefined;

    const initializeEditor = async () => {
        await notesStore.loadNotes()

        const foundNote = notesStore.getNoteById(noteId)

        if (!foundNote) {
            showError(
            createError({
                statusCode: 404,
                statusMessage: 'Заметка не найдена',
                message: 'Такой заметки не существует или она была удалена.',
                fatal: true,
            }),
            )

            return
        }

        originalNote = foundNote

        const draft = loadDraftFromLS(noteId)

        if (draft) {
            pendingDraft.value = draft
            showRestoreModal.value = true
        } else {
            editorStore.draft = Object.assign(foundNote);
        }
    };

  const handleSave = async (note: Note) => {
    try {
      await notesStore.upsertNote(note);
      editorStore.cleanup();
      navigateTo('/');
    } catch (error) {
      console.error('Ошибка при сохранении заметки:', error);
    }
  };

  const handleCancel = () => {
    navigateTo('/');
  };

  const handleDelete = async (id: string) => {
    try {
      notesStore.deleteNote(id);
      removeDraftFromLS(id);

      editorStore.cleanup();
      navigateTo('/');
    } catch (error) {
      console.error('Ошибка при удалении заметки:', error);
    }
  };

  const restoreDraft = () => {
    if (pendingDraft.value) {
      editorStore.draft = JSON.parse(JSON.stringify(pendingDraft.value)) as Note
    }
    showRestoreModal.value = false
  };

  const discardDraft = () => {
    removeDraftFromLS(noteId)

    if (originalNote) {
      editorStore.draft = JSON.parse(JSON.stringify(originalNote)) as Note
    }
    showRestoreModal.value = false
  };

  onMounted(() => {
    initializeEditor()
  });

  return {
    notesStore,
    editorStore,
    showRestoreModal,
    handleSave,
    handleCancel,
    handleDelete,
    restoreDraft,
    discardDraft,
  }
}