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

const props = defineProps<{
  onSave: (note: Note) => Promise<void> | void
  onCancel: () => void
}>()

const editorStore = useNoteEditorStore()

const localTitle = ref(editorStore.draft?.title ?? '')

watch(
  () => editorStore.draft?.title,
  (newVal) => { if (newVal !== undefined) localTitle.value = newVal }
)

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
  editorStore.cleanup()
  
  props.onCancel()
}
</script>

<template>
  <form v-if="editorStore.draft" class="note-editor" @submit.prevent="handleSave">
    <BaseInput
      v-model="localTitle"
      label="Название заметки"
      placeholder="Введите название"
      required
      @blur="commitTitle"
    />

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
    </div>
  </form>
</template>

<style scoped>
.note-editor {
  display: grid;
  gap: 24px;
  max-width: 800px;
  margin: 0 auto;
}
.note-editor__actions {
  display: flex;
  gap: 12px;
  justify-content: flex-end;
  margin-top: 24px;
}
</style>