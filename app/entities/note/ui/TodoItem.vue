<script setup lang="ts">
import type { Todo } from '~/entities/note/model/types';

const model = defineModel<Todo>({ required: true });

defineProps<{
  disabled?: boolean;
}>();

const emit = defineEmits<{
  remove: [];
}>();

function updateTodo(patch: Partial<Todo>) {
  model.value = {
    ...model.value,
    ...patch,
  };
}
</script>

<template>
  <li class="base-todo-item">
    <BaseCheckBox
      v-model="model.isComplete"
      :label="model.description || 'Без описания'"
      :disabled="disabled"
      @update:model-value="updateTodo({ isComplete: $event })"
    />

    <BaseInput
      :model-value="model.description"
      label="Описание"
      placeholder="Что нужно сделать?"
      :disabled="disabled"
      @update:model-value="updateTodo({ description: $event })"
    />

    <BaseButton
      variant="danger"
      :disabled="disabled"
      @click="emit('remove')"
    >
      Удалить
    </BaseButton>
  </li>
</template>