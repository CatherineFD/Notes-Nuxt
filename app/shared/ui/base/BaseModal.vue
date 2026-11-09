<!-- app/shared/ui/base/BaseModal.vue -->
<script setup lang="ts">
import { ref, watch, nextTick } from 'vue'
import BaseButton from '../button/BaseButton.vue';

interface Props {
  modelValue: boolean
  title?: string
}

const props = withDefaults(defineProps<Props>(), {
  title: '',
})

const emit = defineEmits<{
  'update:modelValue': [value: boolean]
}>()

const dialogRef = ref<HTMLElement | null>(null)

const FOCUSABLE = [
  'a[href]',
  'button:not([disabled])',
  'input:not([disabled])',
  'select:not([disabled])',
  'textarea:not([disabled])',
  '[tabindex]:not([tabindex="-1"])',
].join(',')

function getFocusable(): HTMLElement[] {
  if (!dialogRef.value) return []
  return Array.from(
    dialogRef.value.querySelectorAll<HTMLElement>(FOCUSABLE),
  )
}

function close(): void {
  emit('update:modelValue', false)
}

function onKeydown(event: KeyboardEvent): void {
  if (event.key === 'Escape') {
    event.stopPropagation()
    close()
    return
  }

  if (event.key !== 'Tab') return

  const items = getFocusable()
  if (items.length === 0) return

  const first = items[0]!
  const last = items[items.length - 1]!
  const active = document.activeElement

  if (event.shiftKey && active === first) {
    event.preventDefault()
    last.focus()
  } else if (!event.shiftKey && active === last) {
    event.preventDefault()
    first.focus()
  }
}

watch(
  () => props.modelValue,
  (isOpen) => {
    if (isOpen) {
      document.body.style.overflow = 'hidden'
      nextTick(() => {
        const items = getFocusable()
        items[0]?.focus()
      })
    } else {
      document.body.style.overflow = ''
    }
  },
)

defineOptions({ inheritAttrs: false })
</script>

<template>
  <Teleport to="body">
    <div v-if="modelValue" class="modal" @keydown="onKeydown" @click.self="close">
      <div
        ref="dialogRef"
        class="modal__dialog"
        role="dialog"
        aria-modal="true"
        tabindex="-1"
      >
        <header v-if="title || $slots.header" class="modal__header">
          <slot name="header">
            <h2 class="modal__title">{{ title }}</h2>
          </slot>

          <BaseButton
            type="button"
            variant="ghost"
            class="modal__close"
            aria-label="Закрыть"
            @click="close"
          >
            ✕
          </BaseButton>
        </header>

        <div class="modal__body">
          <slot />
        </div>

        <footer v-if="$slots.footer" class="modal__footer">
          <slot name="footer" />
        </footer>
      </div>
    </div>
  </Teleport>
</template>

<style lang="scss" scoped>
.modal {
  position: fixed;
  inset: 0;
  z-index: 1000;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 1rem;
  background: rgba(74, 69, 60, 0.4); 

  &__dialog {
    display: flex;
    flex-direction: column;
    width: 100%;
    max-width: 480px;
    max-height: 90vh;
    background: $color-surface;
    border-radius: 0.75rem;
    box-shadow: 0 8px 24px rgba(74, 69, 60, 0.1); 
    outline: none;
  }

  &__header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 1rem 1.5rem;
    border-bottom: 1px solid $color-border;
    background: $color-surface-alt;
    border-radius: 0.75rem 0.75rem 0 0;
  }

  &__title {
    margin: 0;
    font-size: 1.125rem;
    font-weight: 600;
    color: $color-text-primary;
  }

  &__close {
    padding: 0.25rem !important;
    width: 32px;
    height: 32px;
    border: none !important;
    border-radius: 0.375rem;
    background: transparent !important;
    color: $color-text-secondary;
    font-size: 1.25rem;
    line-height: 1;

    &:hover {
      background: rgba(154, 148, 110, 0.1) !important;
      color: $color-text-primary;
    }
  }

  &__body {
    padding: 1.5rem;
    overflow-y: auto;
    flex: 1;
    color: $color-text-primary;
  }

  &__footer {
    display: flex;
    justify-content: flex-end;
    gap: 0.75rem;
    padding: 1rem 1.5rem;
    border-top: 1px solid $color-border;
    background: $color-surface-alt;
    border-radius: 0 0 0.75rem 0.75rem;
  }
}
</style>