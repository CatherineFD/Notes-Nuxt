<script setup lang="ts">
withDefaults(
  defineProps<{
    variant?: 'primary' | 'secondary' | 'danger'
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
  padding: 10px 16px;
  border: 1px solid transparent;
  border-radius: 8px;
  font: inherit;
  font-weight: 600;
  cursor: pointer;

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