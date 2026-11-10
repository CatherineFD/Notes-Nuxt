<script setup lang="ts">
import type { Note } from '~/entities/note/model/types';
import BaseModal from '~/shared/ui/base/BaseModal.vue'
import BaseButton from '~/shared/ui/button/BaseButton.vue'

defineProps<{
  modelValue: boolean
  note: Note | null
}>()

const emit = defineEmits<{
  'update:modelValue': [value: boolean]
  confirm: []
}>()

const handleClose = () => {
  emit('update:modelValue', false)
}
</script>

<template>
  <BaseModal
    :model-value="modelValue"
    title="Удалить заметку?"
    @update:model-value="emit('update:modelValue', $event)"
    @close="handleClose"
  >
    <p>
      Вы уверены, что хотите удалить заметку
      <strong>"{{ note?.title || 'Без названия' }}"</strong>?
      Это действие нельзя отменить.
    </p>
    <template #footer>
      <BaseButton variant="secondary" @click="handleClose">
        Отмена
      </BaseButton>
      <BaseButton variant="danger" @click="emit('confirm')">
        Удалить
      </BaseButton>
    </template>
  </BaseModal>
</template>