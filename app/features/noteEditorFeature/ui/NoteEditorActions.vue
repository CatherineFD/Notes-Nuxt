<script setup lang="ts">
import BaseButton from '~/shared/ui/button/BaseButton.vue'

defineProps<{
  isSaveDisabled: boolean
  canDelete: boolean
}>()

const emit = defineEmits<{
  save: []
  cancel: []
  delete: []
}>()
</script>

<template>
  <div class="note-editor-actions">
    <BaseButton
      type="submit"
      :disabled="isSaveDisabled"
      @click="emit('save')"
    >
      Сохранить
    </BaseButton>

    <BaseButton
      type="button"
      variant="secondary"
      @click="emit('cancel')"
    >
      Отмена
    </BaseButton>

    <BaseButton
      v-if="canDelete"
      type="button"
      variant="danger"
      @click="emit('delete')"
    >
      Удалить
    </BaseButton>
  </div>
</template>

<style scoped lang="scss">
.note-editor-actions {
  display: flex;
  gap: 12px;
  justify-content: flex-end;
  margin-top: 24px;
}
</style>