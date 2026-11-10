import { onMounted, onUnmounted } from 'vue'
import { useNoteEditorStore } from '../store/useNoteEditorStore'

type HistoryCallbacks = {
  commitTitle: () => void
  syncTitleState: () => void
}

export function useNoteHistory({
  commitTitle,
  syncTitleState,
}: HistoryCallbacks) {
  const editorStore = useNoteEditorStore()

  const undo = () => {
    commitTitle()
    editorStore.undo()
    syncTitleState()
  }

  const redo = () => {
    commitTitle()
    editorStore.redo()
    syncTitleState()
  }

  const handleGlobalKeydown = (event: KeyboardEvent) => {
    const isCtrl = event.ctrlKey || event.metaKey

    if (!isCtrl) return

    const key = event.key.toLowerCase()

    if ((event.shiftKey && key === 'z') || key === 'y') {
      event.preventDefault()
      redo()
      return
    }

    if (key === 'z') {
      event.preventDefault()
      undo()
    }
  }

  onMounted(() => {
    document.addEventListener('keydown', handleGlobalKeydown)
  })

  onUnmounted(() => {
    document.removeEventListener('keydown', handleGlobalKeydown)
  })

  return {
    canUndo: editorStore.canUndo,
    canRedo: editorStore.canRedo,
    undo,
    redo,
  }
}