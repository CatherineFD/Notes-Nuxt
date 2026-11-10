<script setup lang="ts" generic="T extends { id: number | string }">
withDefaults(
  defineProps<{
    data?: T[]
  }>(),
  {
    data: () => [],
  },
)

defineOptions({
  inheritAttrs: true,
})
</script>

<template>
  <TransitionGroup name="list" tag="ul" class="base-list">
      <li
        v-for="(item, index) in data"
        :key="`item-${item.id}`"
        class="base-list__item"
      >
        <slot name="default" :item="item" :index="index" />
      </li>

      <li v-if="data.length === 0" key="empty" class="base-list__empty">
        <slot name="empty">Пусто</slot>
      </li>
  </TransitionGroup>
</template>

<style lang="scss" scoped>
.base-list {
  list-style: none;
  margin: 0;
  padding: 0;
  display: flex;
  flex-direction: column;
  gap: 12px;

  &__empty {
    padding: 1rem;
    text-align: center;
    color: #999;
    font-size: 0.875rem;
  }
}

.list-enter-active,
.list-leave-active {
  transition: all 0.4s ease;
}

.list-enter-from {
  opacity: 0;
  transform: translateY(-30px);
}

.list-leave-to {
  opacity: 0;
  transform: translateY(30px);
}

.list-move {
  transition: transform 0.4s ease;
}

.list-enter-to,
.list-leave-from {
  opacity: 1;
  transform: translateY(0);
}
</style>