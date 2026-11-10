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
    class="icon-trash"
  >
    <title v-if="title">{{ title }}</title>
    
    <path d="M3 6h18" />

    <path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6" />
   
    <path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2" />

    <path d="M10 11v6" />
    <path d="M14 11v6" />
  </svg>
</template>

<style scoped>
.icon-trash {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  vertical-align: middle;
  color: v-bind(color);
  transition: color 0.2s ease, transform 0.2s ease;
}

.icon-trash:hover {
  transform: scale(1.05);
}
</style>