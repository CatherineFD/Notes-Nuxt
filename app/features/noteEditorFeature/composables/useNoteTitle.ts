import { ref, watch } from 'vue'
import { useNoteEditorStore } from '../store/useNoteEditorStore'
import { ChangeTitleCommand } from '../model/commands'

export function useNoteTitle() {
  const editorStore = useNoteEditorStore()

  const title = ref(editorStore.draft?.title ?? '')
  let titleSnapshot = title.value

  watch(
    () => editorStore.draft?.title,
    (newTitle) => {
      if (newTitle !== undefined) {
        title.value = newTitle
        titleSnapshot = newTitle
      }
    },
  )

  const commitTitle = () => {
    if (!editorStore.draft) return

    const nextTitle = title.value.trim()

    if (nextTitle === titleSnapshot) return

    editorStore.executeCommand(
      new ChangeTitleCommand(titleSnapshot, nextTitle),
    )

    titleSnapshot = nextTitle
  }

  const syncTitleState = () => {
    if (!editorStore.draft) return

    titleSnapshot = editorStore.draft.title
    title.value = titleSnapshot
  }

  return {
    title,
    commitTitle,
    syncTitleState,
  }
}