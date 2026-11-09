<script setup lang="ts">
defineOptions({
  inheritAttrs: true,
})
</script>

<template>
  <article class="card">
    <header v-if="$slots.header" class="card__header">
      <slot name="header" />
    </header>

    <div class="card__body">
      <slot />
    </div>

    <footer v-if="$slots.footer" class="card__footer">
      <slot name="footer" />
    </footer>
  </article>
</template>

<style lang="scss" scoped>
.card {
  display: flex;
  flex-direction: column;
  background: $color-surface;
  border: 1px solid $color-border;
  border-radius: 0.75rem;
  box-shadow: 0 2px 8px rgba(141, 135, 65, 0.08);
  overflow: hidden;
  transition: box-shadow 0.2s ease, transform 0.2s ease;

  &:hover {
    box-shadow: 0 6px 16px rgba(141, 135, 65, 0.12);
    transform: translateY(-2px);
  }

  &__header {
    padding: 1rem 1.25rem;
    border-bottom: 1px solid $color-border;
    font-weight: 600;
    font-size: 1.125rem;
    color: $color-text-primary;
    background: $color-surface-alt;

    @media (max-width: 768px) {
      padding: 0.75rem 1rem;
      font-size: 1rem;
    }
  }

  &__body {
    padding: 1rem 1.25rem;
    flex: 1;
    color: $color-text-primary;

    @media (max-width: 768px) {
      padding: 0.75rem 1rem;
    }
  }

  &__footer {
    padding: 0.75rem 1.25rem;
    border-top: 1px solid $color-border;
    background: $color-surface-alt;
    color: $color-text-secondary;

    @media (max-width: 768px) {
      padding: 0.75rem 1rem;
    }
  }
}
</style>