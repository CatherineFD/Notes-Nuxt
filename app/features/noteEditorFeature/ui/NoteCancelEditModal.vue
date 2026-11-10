<script setup lang="ts">
import BaseModal from '~/shared/ui/base/BaseModal.vue'
import BaseButton from '~/shared/ui/button/BaseButton.vue'

defineProps<{
  modelValue: boolean
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
    title="Отменить редактирование?"
    @update:model-value="emit('update:modelValue', $event)"
    @close="handleClose"
  >
    <p>У вас есть несохранённые изменения. Вы уверены, что хотите выйти?</p>
    <template #footer>
      <BaseButton variant="secondary" @click="handleClose">
        Продолжить редактирование
      </BaseButton>
      <BaseButton variant="danger" @click="emit('confirm')">
        Да, отменить
      </BaseButton>
    </template>
  </BaseModal>
</template>