<script setup lang="ts">
import NoteEditorFeature from '~/features/noteEditorFeature/NoteEditorFeature.vue';
import type { Note } from '~/entities/note/model/types';
import { useNoteEditorStore } from '~/features/noteEditorFeature/store/useNoteEditorStore';
import ButtonLink from '~/shared/ui/button/ButtonLink.vue';

const useNotesStore = useNuxtApp().$notesStore;
const notesStore = useNotesStore();

const editorStore = useNoteEditorStore();

const handleSave = async (note: Note) => {
  await notesStore.saveNote(note);
  
  navigateTo('/')
}

const handleCancel = () => {
  navigateTo('/')
}

onMounted(() => {
  editorStore.draft = {
    id: crypto.randomUUID(),
    title: '',
    todoList: [],
  }
})
</script>

<template>
  <main class="page-container">
    <ButtonLink
      to="/"
    >
      Назад
    </ButtonLink>
    <h1>Новая заметка</h1>
      <NoteEditorFeature 
        :on-save="handleSave" 
        :on-cancel="handleCancel" 
      />
  </main>
</template>

<style scoped lang="scss">
.page-container {
  max-width: 800px;
  margin: 2rem auto;
  padding: 0 1rem;
}
</style>