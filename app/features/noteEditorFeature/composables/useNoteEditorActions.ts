import { ref } from 'vue'
import { useNoteEditorStore } from '../store/useNoteEditorStore'
import {
  AddTodoCommand,
  DeleteTodoCommand,
  ToggleTodoCommand,
  ChangeTodoTextCommand,
} from '../model/commands'
import type { Note, Todo } from '~/entities/note/model/types'

type NoteEditorActionsOptions = {
  onSave: (note: Note) => Promise<void> | void
  onCancel: () => void
  onDelete?: (noteId: string) => Promise<void> | void
  commitTitle: () => void
}

export function useNoteEditorActions({
  onSave,
  onCancel,
  onDelete,
  commitTitle,
}: NoteEditorActionsOptions) {
  const editorStore = useNoteEditorStore()

  const isShowCancelModal = ref(false)
  const isShowDeleteModal = ref(false)

  const addTodo = () => {
    const newTodo: Todo = {
      id: crypto.randomUUID(),
      isComplete: false,
      description: '',
    }

    editorStore.executeCommand(new AddTodoCommand(newTodo))
  }

  const removeTodo = (todo: Todo) => {
    editorStore.executeCommand(new DeleteTodoCommand(todo))
  }

  const toggleTodo = (todo: Todo) => {
    editorStore.executeCommand(
      new ToggleTodoCommand(todo.id, todo.isComplete, !todo.isComplete),
    )
  }

  const commitTodoText = (todoId: string, newText: string) => {
    const todo = editorStore.draft?.todoList.find(
      (item) => item.id === todoId,
    )

    if (!todo) return

    editorStore.executeCommand(
      new ChangeTodoTextCommand(todo.id, todo.description, newText),
    )
  }

  const save = async () => {
    commitTitle()

    if (!editorStore.draft || !editorStore.draft.title.trim()) return

    try {
      await onSave(editorStore.draft)
      editorStore.clearDraftStorage()
    } catch (error) {
      console.error('Ошибка при сохранении заметки:', error)
    }
  }

  const cancel = () => {
    commitTitle();

    if (!editorStore.canUndo) {
      cleanup();
      return;
    }

    isShowCancelModal.value = true;
  }

  const confirmCancel = () => {
    isShowCancelModal.value = false
    cleanup()
  }

  const openDeleteModal = () => {
    isShowDeleteModal.value = true
  }

  const confirmDelete = async () => {
    if (!editorStore.draft || !onDelete) return

    try {
      await onDelete(editorStore.draft.id)
      editorStore.cleanup()
    } catch (error) {
      console.error('Ошибка при удалении заметки:', error)
    } finally {
      isShowDeleteModal.value = false
    }
  }

  const cleanup = () => {
    editorStore.cleanup()
    onCancel()
  }

  return {
    isShowCancelModal,
    isShowDeleteModal,
    addTodo,
    removeTodo,
    toggleTodo,
    commitTodoText,
    save,
    cancel,
    confirmCancel,
    openDeleteModal,
    confirmDelete,
  }
}