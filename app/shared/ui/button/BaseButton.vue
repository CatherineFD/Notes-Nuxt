<script setup lang="ts">
withDefaults(
  defineProps<{
    variant?: 'primary' | 'secondary' | 'danger' | 'ghost'
    type?: 'button' | 'submit' | 'reset'
    disabled?: boolean
  }>(),
  {
    variant: 'primary',
    type: 'button',
    disabled: false,
  },
)
</script>

<template>
  <button
    :type="type"
    class="base-button"
    :class="`base-button--${variant}`"
    :disabled="disabled"
  >
    <slot />
  </button>
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
  cursor: pointer;
  transition: all 0.2s ease;

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }

  &:focus-visible {
    outline: 2px solid $color-primary;
    outline-offset: 2px;
  }

  &--primary {
    background-color: $color-primary;
    color: #fff;
    border-color: $color-primary;

    &:hover:not(:disabled) {
      background-color: $color-primary-hover;
      border-color: $color-primary-hover;
    }

    &:active:not(:disabled) {
      transform: translateY(1px);
    }
  }

  &--secondary {
    background-color: $color-surface;
    color: $color-text-primary;
    border-color: $color-border;

    &:hover:not(:disabled) {
      background-color: $color-surface-alt;
      border-color: $color-text-muted;
    }

    &:active:not(:disabled) {
      transform: translateY(1px);
    }
  }

  &--danger {
    background-color: $color-danger;
    color: #fff;
    border-color: $color-danger;

    &:hover:not(:disabled) {
      background-color: $color-danger-hover;
      border-color: $color-danger-hover;
    }

    &:active:not(:disabled) {
      transform: translateY(1px);
    }
  }

  &--ghost {
    background-color: transparent;
    color: $color-text-secondary;
    border-color: transparent;
    font-weight: 500;

    &:hover:not(:disabled) {
      background-color: rgba(154, 148, 110, 0.1);
      color: $color-text-primary;
    }

    &:active:not(:disabled) {
      background-color: rgba(154, 148, 110, 0.2);
      transform: translateY(1px);
    }
  }
}
</style>