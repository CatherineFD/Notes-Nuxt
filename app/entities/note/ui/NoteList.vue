<script setup lang="ts">
import type { Note } from '@/entities/note/model/types'
import BaseList from '~/shared/ui/base/BaseList.vue';

const props = defineProps<{
  notes: Note[]
}>()

defineOptions({
  inheritAttrs: true,
})
</script>

<template>
  <BaseList :data="notes" class="note-list">
    <template #default="{ item, index }">
      <slot name="default" :note="item" :index="index" />
    </template>

    <template #empty>
      <slot name="empty">Нет заметок</slot>
    </template>
  </BaseList>
</template>

<style lang="scss" scoped>
.note-list {
  display: grid;
  grid-template-columns: 1fr;
  gap: 1rem;

  @media (min-width: 768px) {
    grid-template-columns: repeat(2, 1fr);
  }

  @media (min-width: 1024px) {
    grid-template-columns: repeat(3, 1fr);
  }
}
</style>