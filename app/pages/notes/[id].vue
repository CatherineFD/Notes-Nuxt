<!-- app/pages/notes/[id].vue -->
<script setup lang="ts">
import { onMounted, ref } from 'vue'
import { useRoute, navigateTo } from '#app'
import { useNoteEditorStore } from '~/features/noteEditorFeature/store/useNoteEditorStore'
import { loadDraftFromLS, removeDraftFromLS } from '~/features/noteEditorFeature/lib/draftPersistence'
import type { Note } from '~/entities/note/model/types'

import NoteEditorFeature from '~/features/noteEditorFeature/NoteEditorFeature.vue'
import BaseModal from '~/shared/ui/base/BaseModal.vue'
import BaseButton from '~/shared/ui/base/BaseButton.vue'
import ButtonLink from '~/shared/ui/base/ButtonLink.vue'

const route = useRoute()
const noteId = route.params.id as string

const useNotesStore = useNuxtApp().$notesStore;
const notesStore = useNotesStore();
const editorStore = useNoteEditorStore()

const showRestoreModal = ref(false)
const pendingDraft = ref<Note | null>(null)

const isReady = ref(false)

let originalNote: Note | undefined

onMounted(async () => {
  await notesStore.loadNotes()
  
  const foundNote = notesStore.notes.find((n) => n.id === noteId)
  
  if (!foundNote) {
    navigateTo('/')
    return
  }

  originalNote = JSON.parse(JSON.stringify(foundNote)) as Note
  
  const draft = loadDraftFromLS(noteId)
  
  if (draft) {
    pendingDraft.value = draft
    showRestoreModal.value = true
  } else {
    editorStore.draft = JSON.parse(JSON.stringify(foundNote)) as Note
  }
  
  isReady.value = true
})

const handleSave = async (note: Note) => {
  try {
    await notesStore.saveNote(note)
    navigateTo('/')
  } catch (error) {
    console.error('Ошибка при сохранении заметки:', error)
  }
}

const handleCancel = () => {
  navigateTo('/')
}

const restoreDraft = () => {
  if (pendingDraft.value) {
    editorStore.draft = pendingDraft.value
  }
  showRestoreModal.value = false
}

const discardDraft = () => {
  removeDraftFromLS(noteId)
  
  if (originalNote) {
    editorStore.draft = structuredClone(originalNote)
  }
  showRestoreModal.value = false
}

const handleDelete = async (id: string) => {
  notesStore.deleteNote(id)
  
  removeDraftFromLS(id)
  
  navigateTo('/')
}
</script>

<template>
  <div class="page-container">
    <ButtonLink
      to="/"
    >
      Назад
    </ButtonLink>
    <template v-if="isReady && editorStore.draft">
      <NoteEditorFeature 
        :on-save="handleSave" 
        :on-cancel="handleCancel" 
        :on-delete="handleDelete"
      />
    </template>

    <BaseModal 
      v-model="showRestoreModal"
      title="Восстановить несохранённые изменения?"
      @close="discardDraft"
    >
      <p>Для этой заметки найден несохранённый черновик. Хотите его загрузить?</p>
      <template #footer>
        <BaseButton variant="secondary" @click="discardDraft">
          Нет, начать заново
        </BaseButton>
        <BaseButton variant="primary" @click="restoreDraft">
          Да, восстановить
        </BaseButton>
      </template>
    </BaseModal>
  </div>
</template>

<style scoped lang="scss">
.page-container {
  max-width: 800px;
  margin: 2rem auto;
  padding: 0 1rem;
}
</style>