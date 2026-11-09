<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { navigateTo } from '#app'
import type { Note } from '~/entities/note/model/types'

import NoteCard from '~/entities/note/ui/NoteCard.vue'
import BaseList from '~/shared/ui/base/BaseList.vue'
import BaseButton from '~/shared/ui/base/BaseButton.vue'
import BaseModal from '~/shared/ui/base/BaseModal.vue'

const useNotesStore = useNuxtApp().$notesStore;
const notesStore = useNotesStore();
const { notes } = storeToRefs(notesStore)

const isDeleteModalOpen = ref(false)
const noteToDelete = ref<Note | null>(null)

onMounted(async () => {
  await notesStore.loadNotes()
})

const handleEdit = (note: Note) => {
  navigateTo(`/notes/${note.id}`)
}

const requestDelete = (note: Note) => {
  noteToDelete.value = note
  isDeleteModalOpen.value = true
}

const confirmDelete = async () => {
  if (!noteToDelete.value) return
  
  try {
    await notesStore.deleteNote(noteToDelete.value.id)
  } catch (error) {
    console.error('Ошибка при удалении заметки:', error)
  } finally {
    isDeleteModalOpen.value = false
    noteToDelete.value = null
  }
}

const cancelDelete = () => {
  isDeleteModalOpen.value = false
  noteToDelete.value = null
}
</script>

<template>
  <div class="page-container">
    <header class="page-header">
      <h1 class="page-title">Мои заметки</h1>
      <BaseButton variant="primary" @click="navigateTo('/notes/new')">
        + Создать заметку
      </BaseButton>
    </header>

    <BaseList :data="notes">
      <template #default="{ item }">
        <NoteCard 
          :note="item" 
          @edit="handleEdit" 
          @delete="requestDelete" 
        />
      </template>
      
      <template #empty>
        <div class="empty-state">
          <p>У вас пока нет заметок.</p>
          <BaseButton variant="secondary" @click="navigateTo('/notes/new')">
            Создать первую заметку
          </BaseButton>
        </div>
      </template>
    </BaseList>

    <BaseModal 
      v-model="isDeleteModalOpen" 
      title="Удалить заметку?"
      @close="cancelDelete"
    >
      <p>
        Вы уверены, что хотите удалить заметку 
        <strong>"{{ noteToDelete?.title || 'Без названия' }}"</strong>? 
        Это действие нельзя отменить.
      </p>
      <template #footer>
        <BaseButton variant="secondary" @click="cancelDelete">
          Отмена
        </BaseButton>
        <BaseButton variant="danger" @click="confirmDelete">
          Удалить
        </BaseButton>
      </template>
    </BaseModal>
  </div>
</template>

<style lang="scss" scoped>
.page-container {
  max-width: 800px;
  margin: 2rem auto;
  padding: 0 1rem;
}

.page-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 2rem;
}

.page-title {
  margin: 0;
  font-size: 1.5rem;
  font-weight: 700;
  color: #111827;
}

.empty-state {
  text-align: center;
  padding: 3rem 1rem;
  color: #6b7280;
  
  p {
    margin-bottom: 1rem;
    font-size: 1.125rem;
  }
}
</style>