<script setup lang="ts">
import type { Todo } from '~/entities/note/model/types'
import BaseList from '~/shared/ui/base/BaseList.vue'
import BaseButton from '~/shared/ui/button/BaseButton.vue'
import TodoItem from '~/features/noteEditorFeature/ui/TodoItem.vue';

defineProps<{
  todos: Todo[]
}>()

const emit = defineEmits<{
  add: []
  remove: [todo: Todo]
  toggle: [todo: Todo]
  commitText: [id: string, newText: string]
}>()
</script>

<template>
  <section class="note-editor__todos">
    <h2 class="note-editor__subtitle">Список задач</h2>

    <BaseList :data="todos">
      <template #default="{ item }">
        <TodoItem
          :todo="item"
          @toggle="(todo) => emit('toggle', todo)"
          @remove="(todo) => emit('remove', todo)"
          @commit-text="(id, text) => emit('commitText', id, text)"
        />
      </template>
      <template #empty>
        Задач пока нет. Нажмите кнопку ниже, чтобы добавить.
      </template>
    </BaseList>

    <BaseButton variant="secondary" @click="emit('add')">
      Добавить задачу
    </BaseButton>
  </section>
</template>

<style scoped>
.note-editor__todos {
  display: grid;
  gap: 16px;
}
.note-editor__subtitle {
  margin: 0;
  font-size: 18px;
}
</style>