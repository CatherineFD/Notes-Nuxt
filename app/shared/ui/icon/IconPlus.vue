<script setup lang="ts">
withDefaults(
  defineProps<{
    size?: number | string
    color?: string
    title?: string
  }>(),
  {
    size: 20,
    color: 'currentColor',
    title: '',
  }
)
</script>

<template>
  <svg
    :width="size"
    :height="size"
    viewBox="0 0 24 24"
    fill="none"
    :stroke="color"
    stroke-width="2"
    stroke-linecap="round"
    stroke-linejoin="round"
    :aria-hidden="!title"
    :aria-label="title || undefined"
    class="icon-plus"
  >
    <title v-if="title">{{ title }}</title>
    
    <path d="M12 5v14" />

    <path d="M5 12h14" />
  </svg>
</template>

<style scoped>
.icon-plus {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  vertical-align: middle;
  color: v-bind(color);
  transition: color 0.2s ease, transform 0.2s ease;
}

.icon-plus:hover {
  transform: scale(1.05);
}
</style>