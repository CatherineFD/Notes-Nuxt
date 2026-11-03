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
  background: #ffffff;
  border: 1px solid #e5e7eb;
  border-radius: 8px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.04);
  overflow: hidden;
  transition: box-shadow 0.2s ease;

  &:hover {
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
  }

  &__header {
    padding: 1rem 1.25rem;
    border-bottom: 1px solid #f0f0f0;
    font-weight: 600;
    font-size: 1.125rem;
    color: #1a1a1a;

    @media (max-width: 768px) {
      padding: 0.75rem 1rem;
      font-size: 1rem;
    }
  }

  &__body {
    padding: 1rem 1.25rem;
    flex: 1;

    @media (max-width: 768px) {
      padding: 0.75rem 1rem;
    }
  }

  &__footer {
    padding: 0.75rem 1.25rem;
    border-top: 1px solid #f0f0f0;
    background: #fafafa;

    @media (max-width: 768px) {
      padding: 0.75rem 1rem;
    }
  }
}
</style>