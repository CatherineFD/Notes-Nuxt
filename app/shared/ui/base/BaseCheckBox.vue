<script setup lang="ts">
const model = defineModel<boolean>({ default: false })

defineProps<{
  label?: string
  disabled?: boolean
}>()
</script>

<template>
  <label class="base-checkbox">
    <input
      v-model="model"
      type="checkbox"
      class="base-checkbox__input"
      :disabled="disabled"
    />

    <span class="base-checkbox__box" aria-hidden="true">
      <svg
        class="base-checkbox__check"
        viewBox="0 0 16 16"
        fill="none"
      >
        <path
          d="M3 8.5 6.5 12 13 4.5"
          stroke="currentColor"
          stroke-width="2"
          stroke-linecap="round"
          stroke-linejoin="round"
        />
      </svg>
    </span>

    <span v-if="label" class="base-checkbox__label">
      {{ label }}
    </span>
  </label>
</template>

<style scoped lang="scss">
.base-checkbox {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  cursor: pointer;
  user-select: none;

  &__input {
    position: absolute;
    width: 1px;
    height: 1px;
    opacity: 0;
  }

  &__box {
    display: inline-flex;
    align-items: center;
    justify-content: center;

    width: 18px;
    height: 18px;
    flex-shrink: 0;

    border: 1px solid #d1d5db;
    border-radius: 4px;
    background-color: #fff;
    color: #fff;

    transition:
      background-color 0.15s ease,
      border-color 0.15s ease;
  }

  &__check {
    width: 12px;
    height: 12px;
    opacity: 0;
    transition: opacity 0.15s ease;
  }

  &__input:checked + &__box {
    background-color: #2563eb;
    border-color: #2563eb;

    .base-checkbox__check {
      opacity: 1;
    }
  }

  &__input:focus-visible + &__box {
    outline: 2px solid #2563eb;
    outline-offset: 2px;
  }

  &__input:disabled + &__box {
    opacity: 0.5;
  }

  &__input:disabled ~ &__label {
    color: #9ca3af;
    cursor: not-allowed;
  }

  &__label {
    font-size: 14px;
    color: #1f2937;
  }
}
</style>