<script setup lang="ts">
import type { NuxtError } from '#app'
import BaseButton from '~/shared/ui/button/BaseButton.vue'

defineProps<{
  error: NuxtError
}>()

const handleError = () => clearError({ redirect: '/' })
</script>

<template>
  <div class="error-page">
    <div class="error-card">
      <h1 class="error-code">{{ error?.statusCode || 500 }}</h1>
      <h2 class="error-title">{{ error?.statusMessage || 'Ошибка' }}</h2>
      <p class="error-message">
        {{ error?.message || 'Что-то пошло не так. Попробуйте обновить страницу.' }}
      </p>
      
      <BaseButton variant="primary" @click="handleError">
        Вернуться на главную
      </BaseButton>
    </div>
  </div>
</template>

<style scoped lang="scss">
.error-page {
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: 100vh;
  background-color: $color-surface;
  padding: 1rem;
}

.error-card {
  text-align: center;
  background-color: $color-surface-alt;
  padding: 3rem 2rem;
  border-radius: 1rem;
  border: 1px solid $color-border;
  max-width: 450px;
  width: 100%;
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.2);
}

.error-code {
  font-size: 5rem;
  font-weight: 800;
  color: $color-primary;
  margin: 0;
  line-height: 1;
  letter-spacing: -2px;
}

.error-title {
  font-size: 1.5rem;
  color: $color-text-primary;
  margin: 1rem 0 0.5rem;
  font-weight: 600;
}

.error-message {
  color: $color-text-secondary;
  margin-bottom: 2rem;
  line-height: 1.6;
  font-size: 1rem;
}
</style>