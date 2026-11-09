<script setup lang="ts">
import type { Note } from '../model/types'
import BaseButton from '~/shared/ui/base/BaseButton.vue'

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
        <BaseButton variant="secondary" size="small" @click.stop="emit('edit', note)">
          Изменить
        </BaseButton>
        <BaseButton variant="danger" size="small" @click.stop="emit('delete', note)">
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
  background: #ffffff;
  border: 1px solid #e5e7eb;
  border-radius: 8px;
  padding: 1rem;
  transition: box-shadow 0.2s, transform 0.2s;

  &:hover {
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);
    transform: translateY(-2px);
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
    color: #111827;
    word-break: break-word;
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
    color: #4b5563;
  }

  &__todo-text--completed {
    text-decoration: line-through;
    color: #9ca3af;
  }

  &__empty-todos {
    font-size: 0.875rem;
    color: #9ca3af;
    font-style: italic;
  }

  &__more {
    font-size: 0.75rem;
    color: #6b7280;
    margin-top: 0.5rem;
  }
}

.checkbox-fake {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 16px;
  height: 16px;
  border: 1px solid #d1d5db;
  border-radius: 4px;
  background: #f9fafb;
  font-size: 12px;
  color: #10b981;
  flex-shrink: 0;
  margin-top: 2px;

  &--checked {
    background: #d1fae5;
    border-color: #10b981;
  }
}
</style>