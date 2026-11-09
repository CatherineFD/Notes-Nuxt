<script setup lang="ts">
import { useId } from 'vue'

const model = defineModel<string>({
  default: '',
})

withDefaults(
  defineProps<{
    label?: string
    type?: 'text' | 'email' | 'password' | 'search' | 'url'
    placeholder?: string
    error?: string
    disabled?: boolean
    required?: boolean
  }>(),
  {
    type: 'text',
    placeholder: '',
    error: '',
    disabled: false,
    required: false,
  },
)

const inputId = useId()
const errorId = `${inputId}-error`
</script>

<template>
  <div class="base-input">
    <label class="base-input__label" :for="inputId">
      {{ label }}
      <span v-if="required" class="base-input__required">*</span>
    </label>

    <input
      :id="inputId"
      v-model="model"
      class="base-input__field"
      :class="{ 'base-input__field--error': error }"
      :type="type"
      :placeholder="placeholder"
      :disabled="disabled"
      :required="required"
      :aria-invalid="Boolean(error)"
      :aria-describedby="error ? errorId : undefined"
    />

    <p
      v-if="error"
      :id="errorId"
      class="base-input__error"
      role="alert"
    >
      {{ error }}
    </p>
  </div>
</template>

<style scoped lang="scss">
.base-input {
  display: flex;
  flex-direction: column;
  gap: 0.375rem;

  &__label {
    font-size: 0.875rem;
    font-weight: 500;
    color: var(--color-text-primary, #1f2937);
  }

  &__required {
    color: var(--color-danger, #dc2626);
  }

  &__field {
    padding: 0.625rem 0.75rem;
    border: 1px solid var(--color-border, #d1d5db);
    border-radius: 0.5rem;
    font: inherit;
    color: inherit;
    background-color: var(--color-surface, #fff);
    transition: border-color 0.15s ease, box-shadow 0.15s ease;

    &:focus-visible {
      outline: none;
      border-color: var(--color-primary, #2563eb);
      box-shadow: 0 0 0 3px rgb(37 99 235 / 20%);
    }

    &:disabled {
      opacity: 0.6;
      cursor: not-allowed;
    }

    &--error {
      border-color: var(--color-danger, #dc2626);

      &:focus-visible {
        border-color: var(--color-danger, #dc2626);
        box-shadow: 0 0 0 3px rgb(220 38 38 / 20%);
      }
    }
  }

  &__error {
    margin: 0;
    font-size: 0.8125rem;
    color: var(--color-danger, #dc2626);
  }
}
</style>