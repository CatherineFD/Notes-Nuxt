import { onMounted, onUnmounted } from 'vue';
import { storeToRefs } from 'pinia';
import { useNoteEditorStore } from '../store/useNoteEditorStore';

type HistoryCallbacks = {
  syncTitleState: () => void;
}

export function useNoteHistory({
  syncTitleState,
}: HistoryCallbacks) {
  const editorStore = useNoteEditorStore();
  const { canUndo, canRedo } = storeToRefs(editorStore);

  const undo = () => {
    editorStore.undo();
    syncTitleState();
  };

  const redo = () => {
    editorStore.redo();
    syncTitleState();
  };

  const handleGlobalKeydown = (event: KeyboardEvent) => {
    const isCtrl = event.ctrlKey || event.metaKey;

    if (!isCtrl) return;

    const key = event.key.toLowerCase();

    if ((event.shiftKey && key === 'z') || key === 'y') {
      event.preventDefault();
      redo();
      return;
    }

    if (key === 'z') {
      event.preventDefault();
      undo();
    }
  }

  onMounted(() => {
    document.addEventListener('keydown', handleGlobalKeydown);
  })

  onUnmounted(() => {
    document.removeEventListener('keydown', handleGlobalKeydown);
  })

  return {
    canUndo,
    canRedo,
    undo,
    redo,
  }
}