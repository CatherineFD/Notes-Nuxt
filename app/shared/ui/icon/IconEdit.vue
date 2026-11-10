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
    :fill="color === 'currentColor' ? 'none' : color"
    :stroke="color"
    stroke-width="2"
    stroke-linecap="round"
    stroke-linejoin="round"
    :aria-hidden="!title"
    :aria-label="title || undefined"
    class="icon-edit"
  >
    <title v-if="title">{{ title }}</title>

    <path d="M17 3a2.828 2.828 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5L17 3z" />
  </svg>
</template>

<style scoped>
.icon-edit {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  vertical-align: middle;
  color: v-bind(color);
  transition: color 0.2s ease, transform 0.2s ease;
}

.icon-edit:hover {
  transform: scale(1.05);
}
</style>