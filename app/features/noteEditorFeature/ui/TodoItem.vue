<script setup lang="ts">
import { ref, watch } from 'vue'
import type { Todo } from '~/entities/note/model/types'
import BaseCheckBox from '~/shared/ui/base/BaseCheckBox.vue'
import BaseInput from '~/shared/ui/input/BaseInput.vue'
import BaseButton from '~/shared/ui/base/BaseButton.vue'

const props = defineProps<{
  todo: Todo
}>()

const emit = defineEmits<{
  toggle: [todo: Todo]
  remove: [todo: Todo]
  commitText: [id: string, newText: string]
}>()

const localText = ref(props.todo.description)

watch(
  () => props.todo.description,
  (newVal) => {
    if (localText.value !== newVal) {
      localText.value = newVal
    }
  },
  { immediate: true }
)

const handleBlur = () => {
  const trimmed = localText.value.trim()

  if (trimmed !== props.todo.description) {
    emit('commitText', props.todo.id, trimmed)
  }
}
</script>

<template>
  <div class="note-editor__todo">
    <BaseCheckBox
      :model-value="todo.isComplete"
      @update:model-value="emit('toggle', todo)"
    />

    <BaseInput
      v-model="localText"
      placeholder="Что нужно сделать?"
      @blur="handleBlur"
      class="note-editor__todo-input"
    />

    <BaseButton
      variant="danger"
      @click="emit('remove', todo)"
    >
      Удалить
    </BaseButton>
  </div>
</template>

<style scoped lang="scss">
.note-editor{
    &__todo {
    display: flex;
    justify-content: center;
    align-items: center;
    gap: 12px;
    margin-bottom: 8px;
  }

  &__todo-input {
    width: 100%;
  }
}
</style>