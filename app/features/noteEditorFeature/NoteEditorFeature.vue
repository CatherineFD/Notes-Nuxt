<script setup lang="ts">
import { useNoteEditorStore } from '~/features/noteEditorFeature/store/useNoteEditorStore';
import type { Note } from '~/entities/note/model/types';
import BaseInput from '~/shared/ui/base/BaseInput.vue';
import BaseButton from '~/shared/ui/button/BaseButton.vue';
import TodoList from '~/features/noteEditorFeature/ui/TodoList.vue';
import NoteDeleteModal from '~/entities/note/ui/NoteDeleteModal.vue';
import NoteCancelEditModal from '~/features/noteEditorFeature/ui/NoteCancelEditModal.vue';
import { useNoteEditorActions } from '~/features/noteEditorFeature/composables/useNoteEditorActions.ts';
import { useNoteHistory } from '~/features/noteEditorFeature/composables/useNoteHistory.ts';
import { useNoteTitle } from '~/features/noteEditorFeature/composables/useNoteTitle.ts';
import NoteEditorActions from '~/features/noteEditorFeature/ui/NoteEditorActions.vue';

const props = defineProps<{
  onSave: (note: Note) => Promise<void> | void
  onCancel: () => void
  onDelete?: (noteId: string) => Promise<void> | void
}>();

const editorStore = useNoteEditorStore();

const { title, commitTitle, syncTitleState } = useNoteTitle();

const {
  canUndo,
  canRedo,
  undo,
  redo,
} = useNoteHistory({
  syncTitleState,
});

const {
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
} = useNoteEditorActions({
  onSave: props.onSave,
  onCancel: props.onCancel,
  onDelete: props.onDelete,
  commitTitle,
});
</script>

<template>
  <form
    v-if="editorStore.draft"
    class="note-editor"
    @submit.prevent="save"
  >
    <div class="note-editor__header">
      <BaseInput
        v-model="title"
        placeholder="Введите название"
        required
        @blur="commitTitle"
      />

      <div class="note-editor__history">
        <BaseButton
          type="button"
          variant="secondary"
          :disabled="!canUndo"
          title="Отменить (Ctrl+Z)"
          @click="undo"
        >
          ↶
        </BaseButton>

        <BaseButton
          type="button"
          variant="secondary"
          :disabled="!canRedo"
          title="Повторить (Ctrl+Shift+Z)"
          @click="redo"
        >
          ↷
        </BaseButton>
      </div>
    </div>

    <TodoList
      :todos="editorStore.draft.todoList"
      @add="addTodo"
      @remove="removeTodo"
      @toggle="toggleTodo"
      @commit-text="commitTodoText"
    />

    <NoteEditorActions
      :is-save-disabled="!title.trim()"
      :can-delete="Boolean(props.onDelete)"
      @save="save"
      @cancel="cancel"
      @delete="openDeleteModal"
    />
  </form>

  <NoteCancelEditModal
    v-model="isShowCancelModal"
    @confirm="confirmCancel"
  />

  <NoteDeleteModal
    v-model="isShowDeleteModal"
    :note="editorStore.draft"
    @confirm="confirmDelete"
  />
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
}
</style>