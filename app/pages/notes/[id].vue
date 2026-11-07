<script setup lang="ts">
const route = useRoute()
const noteId = route.params.id as string
</script>

<template>
  <main class="edit-note-page">
    <h1>Редактирование заметки</h1>
    <p>Note ID: {{ noteId }}</p>
  </main>
</template>