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

defineEmits<{
  (e: 'blur', event: FocusEvent): void
}>()

const inputId = useId()
const errorId = `${inputId}-error`
</script>

<template>
  <div class="base-input">
    <label class="base-input__label" :for="inputId">
      {{ label }}
    </label>

    <div class="base-input__container">
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
        @blur="$emit('blur', $event)"
      />
      <span v-if="required && !label" class="base-input__required">*</span>
    </div>

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
    color: $color-text-primary;
  }

  &__required {
    color: $color-danger;
  }

  &__container {
    display: flex;
    gap: 5px;
  }

  &__field {
    padding: 0.625rem 0.75rem;
    border: 1px solid $color-border;
    border-radius: 0.5rem;
    font: inherit;
    color: $color-text-primary;
    background-color: $color-surface;
    transition: border-color 0.15s ease, box-shadow 0.15s ease;

    &::placeholder {
      color: $color-text-muted;
      opacity: 0.7;
    }

    &:focus-visible {
      outline: none;
      border-color: $color-primary;
      box-shadow: 0 0 0 3px rgba(141, 135, 65, 0.2);
    }

    &:disabled {
      opacity: 0.6;
      cursor: not-allowed;
      background-color: $color-surface-alt;
    }

    &--error {
      border-color: $color-danger;

      &:focus-visible {
        border-color: $color-danger;
        box-shadow: 0 0 0 3px rgba(220, 38, 38, 0.2);
      }
    }
  }

  &__error {
    margin: 0;
    font-size: 0.8125rem;
    color: $color-danger;
  }
}
</style>