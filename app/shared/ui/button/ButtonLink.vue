<script setup lang="ts">
import type { RouteLocationRaw } from 'vue-router'

defineProps<{
  to: RouteLocationRaw
  variant?: 'primary' | 'secondary' | 'ghost' | 'danger'
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
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  padding: 0.625rem 1rem;
  border: 1px solid transparent;
  border-radius: 0.5rem;
  font: inherit;
  font-size: 0.875rem;
  font-weight: 600;
  line-height: 1.5;
  text-decoration: none;
  cursor: pointer;
  transition: all 0.2s ease;

  &--block {
    display: flex;
    width: 100%;
  }

  &:focus-visible {
    outline: 2px solid $color-primary;
    outline-offset: 2px;
  }

  &--primary {
    background-color: $color-primary;
    color: #ffffff;
    border-color: $color-primary;

    &:hover {
      background-color: $color-primary-hover;
      border-color: $color-primary-hover;
    }

    &:active {
      transform: translateY(1px);
    }
  }

  &--secondary {
    background-color: $color-surface;
    color: $color-text-primary;
    border-color: $color-border;

    &:hover {
      background-color: $color-surface-alt;
      border-color: $color-text-muted;
    }

    &:active {
      transform: translateY(1px);
    }
  }

  &--ghost {
    background-color: transparent;
    color: $color-primary;
    border-color: transparent;

    &:hover {
      background-color: rgba(154, 148, 110, 0.1);
      color: $color-primary-hover;
    }

    &:active {
      transform: translateY(1px);
    }
  }

  &--danger {
    background-color: $color-danger;
    color: #ffffff;
    border-color: $color-danger;

    &:hover {
      background-color: $color-danger-hover;
      border-color: $color-danger-hover;
    }

    &:active {
      transform: translateY(1px);
    }
  }
}
</style>