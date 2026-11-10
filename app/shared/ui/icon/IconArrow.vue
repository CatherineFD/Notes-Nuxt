<script setup lang="ts">
import { computed } from 'vue'

type ArrowDirection = 'up' | 'down' | 'left' | 'right'

const props = withDefaults(
  defineProps<{
    size?: number | string
    color?: string
    direction?: ArrowDirection
    title?: string
  }>(),
  {
    size: 20,
    color: 'currentColor',
    direction: 'right',
    title: '',
  }
)

const rotationAngle = computed(() => {
  const angles: Record<ArrowDirection, number> = {
    right: 0,
    down: 90,
    left: 180,
    up: -90,
  }
  return angles[props.direction]
})
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
    class="icon-arrow"
  >
    <title v-if="title">{{ title }}</title>
    
    <g :style="{ transform: `rotate(${rotationAngle}deg)`, transformOrigin: 'center' }">
      <path d="M9 18l6-6-6-6" />
    </g>
  </svg>
</template>

<style scoped>
.icon-arrow {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  vertical-align: middle;
  color: v-bind(color);
}

.icon-arrow g {
  transition: transform 0.2s ease;
}
</style>