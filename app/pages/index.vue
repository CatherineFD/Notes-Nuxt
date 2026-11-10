<script setup lang="ts">
import { navigateTo } from '#app'
import NoteCard from '~/entities/note/ui/NoteCard.vue'
import BaseList from '~/shared/ui/base/BaseList.vue'
import BaseButton from '~/shared/ui/button/BaseButton.vue'
import { useNotesListPage } from './lib/useNotesListPage'
import NoteDeleteModal from '~/entities/note/ui/NoteDeleteModal.vue'
import IconPlus from '~/shared/ui/icon/IconPlus.vue'

const {
  notes,
  isDeleteModalOpen,
  noteToDelete,
  handleEdit,
  requestDelete,
  confirmDelete,
} = useNotesListPage();

</script>

<template>
  <div class="page-container">
    <header class="page-header">
      <h1 class="page-title">Мои заметки</h1>
      <BaseButton variant="primary" @click="navigateTo('/notes/new')">
        <IconPlus/>
        Создать заметку
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

    <NoteDeleteModal
      v-model="isDeleteModalOpen"
      :note="noteToDelete"
      @confirm="confirmDelete"
    />
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