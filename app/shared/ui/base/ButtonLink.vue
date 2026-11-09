<script setup lang="ts">
import type { RouteLocationRaw } from 'vue-router'

defineProps<{
  to: RouteLocationRaw
  variant?: 'primary' | 'secondary' | 'ghost'
  block?: boolean
}>()
</script>

<template>
  <NuxtLink
    :to="to"
    class="base-button"
    :class="[
      `base-button--${variant ?? 'primary'}`,
      { 'base-button--block': block },
    ]"
  >
    <slot />
  </NuxtLink>
</template>

<style scoped lang="scss">
.base-button {
  padding: 10px 16px;
  border: 1px solid transparent;
  border-radius: 8px;
  font: inherit;
  font-weight: 600;
  cursor: pointer;
  display: inline-block;

  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
  }

  &--primary {
    background-color: #2563eb;
    color: #fff;

    &:hover:not(:disabled) {
      background-color: #1d4ed8;
    }
  }

  &--secondary {
    background-color: #fff;
    border-color: #d1d5db;
    color: #1f2937;

    &:hover:not(:disabled) {
      background-color: #f3f4f6;
    }
  }

  &--danger {
    background-color: #dc2626;
    color: #fff;

    &:hover:not(:disabled) {
      background-color: #b91c1c;
    }
  }
}
</style>
