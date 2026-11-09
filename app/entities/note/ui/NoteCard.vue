<!-- app/entities/note/ui/NoteCard.vue -->
<script setup lang="ts">
import { computed } from 'vue'
import type { Note } from '../model/types'
import BaseButton from '~/shared/ui/button/BaseButton.vue'

const props = defineProps<{
  note: Note
}>()

const emit = defineEmits<{
  edit: [note: Note]
  delete: [note: Note]
}>()

const previewTodos = computed(() => props.note.todoList.slice(0, 3))
const hasMoreTodos = computed(() => props.note.todoList.length > 3)
</script>

<template>
  <article class="note-card">
    <header class="note-card__header">
      <h3 class="note-card__title">{{ note.title || 'Без названия' }}</h3>
      <div class="note-card__actions">
        <BaseButton variant="secondary" @click.stop="emit('edit', note)">
          Изменить
        </BaseButton>
        <BaseButton variant="danger" @click.stop="emit('delete', note)">
          Удалить
        </BaseButton>
      </div>
    </header>

    <div class="note-card__todos">
      <ul v-if="previewTodos.length > 0" class="note-card__todo-list">
        <li v-for="todo in previewTodos" :key="todo.id" class="note-card__todo-item">
          <span class="checkbox-fake" :class="{ 'checkbox-fake--checked': todo.isComplete }">
            {{ todo.isComplete ? '✓' : '' }}
          </span>
          <span :class="{ 'note-card__todo-text--completed': todo.isComplete }">
            {{ todo.description || 'Без описания' }}
          </span>
        </li>
      </ul>
      
      <p v-else class="note-card__empty-todos">Нет задач</p>

      <p v-if="hasMoreTodos" class="note-card__more">
        И ещё {{ note.todoList.length - 3 }} задач...
      </p>
    </div>
  </article>
</template>

<style lang="scss" scoped>
.note-card {
  background: $color-surface;
  border: 1px solid $color-border;
  border-radius: 0.75rem;
  padding: 1rem 1.25rem;
  transition: box-shadow 0.2s ease, transform 0.2s ease;

  &:hover {
    box-shadow: 0 6px 16px rgba(74, 69, 60, 0.08);
  }

  &__header {
    display: flex;
    justify-content: space-between;
    align-items: flex-start;
    margin-bottom: 1rem;
    gap: 1rem;
  }

  &__title {
    margin: 0;
    font-size: 1.125rem;
    font-weight: 600;
    color: $color-text-primary;
    word-break: break-word;
    line-height: 1.4;
  }

  &__actions {
    display: flex;
    gap: 0.5rem;
    flex-shrink: 0;
  }

  &__todo-list {
    list-style: none;
    margin: 0;
    padding: 0;
    display: flex;
    flex-direction: column;
    gap: 0.5rem;
  }

  &__todo-item {
    display: flex;
    align-items: flex-start;
    gap: 0.5rem;
    font-size: 0.875rem;
    color: $color-text-secondary;
    line-height: 1.4;
  }

  &__todo-text--completed {
    text-decoration: line-through;
    color: $color-text-muted;
  }

  &__empty-todos {
    font-size: 0.875rem;
    color: $color-text-muted;
    font-style: italic;
    margin: 0;
  }

  &__more {
    font-size: 0.75rem;
    color: $color-text-muted;
    margin: 0.5rem 0 0 0;
  }
}

.checkbox-fake {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 16px;
  height: 16px;
  border: 1px solid $color-border;
  border-radius: 4px;
  background: $color-surface-alt;
  font-size: 11px;
  color: $color-success;
  flex-shrink: 0;
  margin-top: 2px;
  transition: background-color 0.15s ease, border-color 0.15s ease;

  &--checked {
    background: rgba(140, 184, 140, 0.2); // $color-success с 20% прозрачности
    border-color: $color-success;
    color: $color-success;
  }
}
</style>