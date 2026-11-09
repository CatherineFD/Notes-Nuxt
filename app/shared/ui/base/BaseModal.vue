<script setup lang="ts">
import BaseButton from './BaseButton.vue';

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
    <div v-if="modelValue" class="modal" @keydown="onKeydown">
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
  background: rgba(0, 0, 0, 0.5);

  &__dialog {
    display: flex;
    flex-direction: column;
    width: 100%;
    max-width: 480px;
    max-height: 90vh;
    background: #fff;
    border-radius: 8px;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
    outline: none;
  }

  &__header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 1rem 1.5rem;
    border-bottom: 1px solid #e5e7eb;
  }

  &__title {
    margin: 0;
    font-size: 1.125rem;
    font-weight: 600;
    color: #1a1a1a;
  }

  &__close {
    width: 24px;
    height: 24px;
    border: none;
    border-radius: 4px;
    background: transparent;
    color: #666;
    font-size: 1rem;
    cursor: pointer;

    &:hover {
      background: #f0f0f0;
    }
  }

  &__body {
    padding: 1rem 1.5rem;
    overflow-y: auto;
    flex: 1;
  }

  &__footer {
    display: flex;
    justify-content: flex-end;
    gap: 0.5rem;
    padding: 1rem 1.5rem;
    border-top: 1px solid #e5e7eb;
  }
}
</style>