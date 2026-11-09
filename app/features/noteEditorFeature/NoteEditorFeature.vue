<!-- app/features/noteEditorFeature/NoteEditorFeature.vue -->
<script setup lang="ts">
import { useNoteEditorStore } from './store/useNoteEditorStore'
import { 
  AddTodoCommand, 
  DeleteTodoCommand, 
  ToggleTodoCommand, 
  ChangeTodoTextCommand,
  ChangeTitleCommand 
} from './model/commands'
import type { Note, Todo } from '~/entities/note/model/types'

import BaseInput from '~/shared/ui/input/BaseInput.vue'
import BaseButton from '~/shared/ui/base/BaseButton.vue'
import TodoList from './ui/TodoList.vue'
import BaseModal from '~/shared/ui/base/BaseModal.vue'

const props = defineProps<{
  onSave: (note: Note) => Promise<void> | void
  onCancel: () => void
  onDelete?: (noteId: string) => Promise<void> | void
}>()

const editorStore = useNoteEditorStore()

const localTitle = ref(editorStore.draft?.title ?? '')

const showCancelModal = ref(false)
const showDeleteModal = ref(false)

watch(
  () => editorStore.draft?.title,
  (newVal) => { if (newVal !== undefined) localTitle.value = newVal }
)

const hasUnsavedChanges = computed(() => editorStore.canUndo)

let titleSnapshot = localTitle.value
const commitTitle = () => {
  if (!editorStore.draft) return
  const current = localTitle.value.trim()
  if (current !== titleSnapshot) {
    editorStore.executeCommand(new ChangeTitleCommand(titleSnapshot, current))
    titleSnapshot = current
  }
}

const handleAddTodo = () => {
  const newTodo: Todo = {
    id: crypto.randomUUID(),
    isComplete: false,
    description: '',
  }
  editorStore.executeCommand(new AddTodoCommand(newTodo))
}

const handleRemoveTodo = (todo: Todo) => {
  editorStore.executeCommand(new DeleteTodoCommand(todo))
}

const handleToggleTodo = (todo: Todo) => {
  editorStore.executeCommand(
    new ToggleTodoCommand(todo.id, todo.isComplete, !todo.isComplete)
  )
}

const handleCommitTodoText = (id: string, newText: string) => {
  if (!editorStore.draft) return
  const todo = editorStore.draft.todoList.find(t => t.id === id)
  if (!todo) return
  
  editorStore.executeCommand(
    new ChangeTodoTextCommand(id, todo.description, newText)
  )
}

const handleSave = async () => {
  commitTitle()
  if (!editorStore.draft || !editorStore.draft.title.trim()) return

  try {
    await props.onSave(editorStore.draft)
    editorStore.cleanup()
  } catch (error) {
    console.error('Ошибка при сохранении заметки:', error)
  }
}

const handleCancel = () => {
  if (!hasUnsavedChanges.value) {
    editorStore.cleanup()
    props.onCancel()
    return
  }
  showCancelModal.value = true
}

const confirmCancel = () => {
  showCancelModal.value = false
  editorStore.cleanup()
  props.onCancel()
}

const handleDelete = () => {
  showDeleteModal.value = true
}

const confirmDelete = async () => {
  if (!editorStore.draft || !props.onDelete) return

  try {
    await props.onDelete(editorStore.draft.id)
    editorStore.cleanup()
  } catch (error) {
    console.error('Ошибка при удалении заметки:', error)
  } finally {
    showDeleteModal.value = false
  }
}

const handleUndo = () => {
  commitTitle()
  editorStore.undo()
  if (editorStore.draft) {
    titleSnapshot = editorStore.draft.title
  }
}

const handleRedo = () => {
  commitTitle()
  editorStore.redo()
  if (editorStore.draft) {
    titleSnapshot = editorStore.draft.title
  }
}


function handleGlobalKeydown(e: KeyboardEvent) {
  const isCtrl = e.ctrlKey || e.metaKey
  if (!isCtrl) return

  const key = e.key.toLowerCase()

  const target = e.target as HTMLElement
  const isTextInput =
    target.tagName === 'INPUT' ||
    target.tagName === 'TEXTAREA' ||
    target.isContentEditable === true

  if (e.shiftKey && key === 'z') {
    e.preventDefault()
    editorStore.redo()
    if (editorStore.draft) {
      titleSnapshot = editorStore.draft.title
    }
    return
  }

  if (!e.shiftKey && key === 'z') {
    if (isTextInput) return

    e.preventDefault()
    editorStore.undo()
    if (editorStore.draft) {
      titleSnapshot = editorStore.draft.title
    }
  }
}

onMounted(() => {
  document.addEventListener('keydown', handleGlobalKeydown)
})

onUnmounted(() => {
  document.removeEventListener('keydown', handleGlobalKeydown)
})

</script>

<template>
  <form v-if="editorStore.draft" class="note-editor" @submit.prevent="handleSave">
    <div class="note-editor__header">
      <BaseInput
        v-model="localTitle"
        label="Название заметки"
        placeholder="Введите название"
        required
        @blur="commitTitle"
      />

      <div class="note-editor__history">
        <BaseButton
          type="button"
          variant="secondary"
          :disabled="!editorStore.canUndo"
          title="Отменить (Ctrl+Z)"
          @click="handleUndo"
        >
          ↶
        </BaseButton>
        <BaseButton
          type="button"
          variant="secondary"
          :disabled="!editorStore.canRedo"
          title="Повторить (Ctrl+Shift+Z)"
          @click="handleRedo"
        >
          ↷
        </BaseButton>
      </div>
    </div>

    <TodoList
      :todos="editorStore.draft.todoList"
      @add="handleAddTodo"
      @remove="handleRemoveTodo"
      @toggle="handleToggleTodo"
      @commit-text="handleCommitTodoText"
    />

    <div class="note-editor__actions">
      <BaseButton type="submit" :disabled="!localTitle.trim()">
        Сохранить
      </BaseButton>
      <BaseButton type="button" variant="secondary" @click="handleCancel">
        Отмена
      </BaseButton>
      <BaseButton 
        v-if="onDelete" 
        type="button" 
        variant="danger" 
        @click="handleDelete"
      >
        Удалить
      </BaseButton>
    </div>
  </form>

  <BaseModal 
    v-model="showCancelModal"
    title="Отменить редактирование?"
  >
    <p>У вас есть несохранённые изменения. Вы уверены, что хотите выйти?</p>
    <template #footer>
      <BaseButton variant="secondary" @click="showCancelModal = false">
        Продолжить редактирование
      </BaseButton>
      <BaseButton variant="danger" @click="confirmCancel">
        Да, отменить
      </BaseButton>
    </template>
  </BaseModal>

  <BaseModal 
    v-model="showDeleteModal"
    title="Удалить заметку?"
  >
    <p>
      Вы уверены, что хотите удалить заметку 
      <strong>"{{ editorStore.draft?.title || 'Без названия' }}"</strong>? 
      Это действие нельзя отменить.
    </p>
    <template #footer>
      <BaseButton variant="secondary" @click="showDeleteModal = false">
        Отмена
      </BaseButton>
      <BaseButton variant="danger" @click="confirmDelete">
        Удалить
      </BaseButton>
    </template>
  </BaseModal>
</template>

<style scoped lang="scss">
.note-editor {
  display: grid;
  gap: 24px;
  max-width: 800px;
  margin: 12px auto 0;

  &__header {
    display: flex;
    justify-content: space-between;
    align-items: flex-end;
    gap: 1rem;
    margin-bottom: 1rem;
  }

  &__history {
    display: flex;
    gap: 0.5rem;
    flex-shrink: 0;
  }

  &__actions {
    display: flex;
    gap: 12px;
    justify-content: flex-end;
    margin-top: 24px;
  }
}
</style>