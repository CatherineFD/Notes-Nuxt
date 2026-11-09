<script setup lang="ts">
import NoteEditorFeature from '~/features/noteEditorFeature/NoteEditorFeature.vue';
import BaseModal from '~/shared/ui/base/BaseModal.vue';
import BaseButton from '~/shared/ui/base/BaseButton.vue';
import type { Note } from '~/entities/note/model/types';
import { useNoteEditorStore } from '~/features/noteEditorFeature/store/useNoteEditorStore';
import ButtonLink from '~/shared/ui/base/ButtonLink.vue';

const draft = reactive<Note>({
    id: crypto.randomUUID(),
    title: '',
    todoList: [],
});

const useNotesStore = useNuxtApp().$notesStore;
const notesStore = useNotesStore();

const editorStore = useNoteEditorStore();

const showRestoreModal = ref(false);

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
  <main class="edit-note-page">
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

  <!-- <BaseModal 
    :model-value="showRestoreModal"
    title="Восстановить несохранённые изменения?"
    @close="discardDraft"
  >
    <p>Для этой заметки есть несохранённый черновик. Хотите его загрузить?</p>
    <div class="modal-actions">
      <BaseButton @click="discardDraft">Нет, начать заново</BaseButton>
      <BaseButton @click="restoreDraft" class="primary">Да, восстановить</BaseButton>
    </div>
  </BaseModal> -->
</template>