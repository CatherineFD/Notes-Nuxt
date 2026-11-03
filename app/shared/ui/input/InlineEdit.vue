<script setup lang="ts">
/**
 * Компонент inline-редактирования текста.
 * Показывает текст + кнопку редактирования (карандаш).
 * При клике на карандаш — появляется input для редактирования.
 */
interface InlineEditProps {
  modelValue: string
  placeholder?: string
  disabled?: boolean
}

const props = withDefaults(defineProps<InlineEditProps>(), {
  placeholder: 'Введите значение',
  disabled: false,
})

const emit = defineEmits<{
  'update:modelValue': [value: string]
  save: [value: string]
  cancel: []
}>()

const isEditing = ref(props.modelValue?.trim() !== '')
const draft = ref(props.modelValue)
const inputRef = ref<HTMLInputElement | null>(null)

function startEdit() {
  if (props.disabled) return
  draft.value = props.modelValue
  isEditing.value = true
}

function save() {
  const value = draft.value.trim()
  if (!value) {
    cancel()
    return
  }
  emit('update:modelValue', value)
  emit('save', value)
  isEditing.value = false
}

function cancel() {
  draft.value = props.modelValue
  isEditing.value = false
  emit('cancel')
}

function handleKeydown(event: KeyboardEvent) {
  if (event.key === 'Enter') {
    event.preventDefault()
    save()
  } else if (event.key === 'Escape') {
    event.preventDefault()
    cancel()
  }
}

watch(isEditing, (editing) => {
  if (editing) {
    nextTick(() => {
      inputRef.value?.focus()
      inputRef.value?.select()
    })
  }
})
</script>

<template>
  <div class="inline-edit">
    <!-- Режим просмотра -->
    <template v-if="!isEditing">
      <span class="inline-edit__text">
        {{ modelValue || placeholder }}
      </span>
      
      <button
        v-if="!disabled"
        class="inline-edit__button"
        type="button"
        aria-label="Редактировать"
        @click="startEdit"
      >
        <!-- SVG иконка карандаша -->
        <svg
          class="inline-edit__icon"
          width="16"
          height="16"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          stroke-width="2"
          stroke-linecap="round"
          stroke-linejoin="round"
        >
          <path d="M17 3a2.85 2.83 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5Z" />
          <path d="m15 5 4 4" />
        </svg>
      </button>
    </template>

    <!-- Режим редактирования -->
    <template v-else>
      <input
        ref="inputRef"
        v-model="draft"
        class="inline-edit__input"
        type="text"
        :placeholder="placeholder"
        @keydown="handleKeydown"
        @blur="save"
      />
      
      <div class="inline-edit__actions">
        <button
          class="inline-edit__action inline-edit__action--save"
          type="button"
          aria-label="Сохранить"
          @click="save"
        >
          ✓
        </button>
        <button
          class="inline-edit__action inline-edit__action--cancel"
          type="button"
          aria-label="Отменить"
          @click="cancel"
        >
          ✕
        </button>
      </div>
    </template>
  </div>
</template>

<style lang="scss" scoped>
.inline-edit {
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;

  &__text {
    font-size: 1rem;
    color: #1a1a1a;
    line-height: 1.5;
  }

  &__button {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    padding: 0.25rem;
    background: transparent;
    border: none;
    border-radius: 4px;
    cursor: pointer;
    color: #666;
    transition: all 0.2s ease;

    &:hover {
      background: #f0f0f0;
      color: #1a1a1a;
    }

    &:focus-visible {
      outline: 2px solid #3b82f6;
      outline-offset: 2px;
    }
  }

  &__icon {
    width: 16px;
    height: 16px;
  }

  &__input {
    flex: 1;
    padding: 0.5rem 0.75rem;
    font-size: 1rem;
    border: 1px solid #d1d5db;
    border-radius: 4px;
    outline: none;
    transition: border-color 0.2s ease;

    &:focus {
      border-color: #3b82f6;
      box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
    }

    @media (max-width: 768px) {
      font-size: 0.875rem;
      padding: 0.375rem 0.5rem;
    }
  }

  &__actions {
    display: inline-flex;
    gap: 0.25rem;
  }

  &__action {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    width: 28px;
    height: 28px;
    border: none;
    border-radius: 4px;
    cursor: pointer;
    font-size: 1rem;
    font-weight: 600;
    transition: all 0.2s ease;

    &:focus-visible {
      outline: 2px solid #3b82f6;
      outline-offset: 2px;
    }

    &--save {
      background: #10b981;
      color: white;

      &:hover {
        background: #059669;
      }
    }

    &--cancel {
      background: #ef4444;
      color: white;

      &:hover {
        background: #dc2626;
      }
    }
  }
}
</style>