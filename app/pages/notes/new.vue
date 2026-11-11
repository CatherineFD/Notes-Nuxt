<script setup lang="ts">
import NoteEditorFeature from '~/features/noteEditorFeature/NoteEditorFeature.vue'
import BaseModal from '~/shared/ui/base/BaseModal.vue'
import BaseButton from '~/shared/ui/button/BaseButton.vue'
import IconArrow from '~/shared/ui/icon/IconArrow.vue'
import { useNoteCreatorPage } from './lib/useNoteCreatorPage'

const {
  editorStore,
  showRestoreModal,
  showUnsavedModal,
  handleSave,
  handleBackRequest,
  confirmDiscardAndLeave,
  restoreDraft,
  discardDraft,
} = useNoteCreatorPage()
</script>

<template>
  <main class="page-container">
    <BaseButton variant="ghost" class="back-btn" @click="handleBackRequest">
      <IconArrow direction="left" />
      Назад
    </BaseButton>
    
    <template v-if="editorStore.draft">
      <NoteEditorFeature 
        :on-save="handleSave" 
        :on-cancel="handleBackRequest" 
      />
    </template>

    <BaseModal
      v-model="showRestoreModal"
      title="Восстановить несохранённые изменения?"
      @close="discardDraft"
    >
      <p>Найден несохранённый черновик новой заметки. Хотите его загрузить?</p>
      <template #footer>
        <BaseButton variant="secondary" @click="discardDraft">
          Нет, начать заново
        </BaseButton>
        <BaseButton variant="primary" @click="restoreDraft">
          Да, восстановить
        </BaseButton>
      </template>
    </BaseModal>

    <BaseModal
      v-model="showUnsavedModal"
      title="Выйти без сохранения?"
      @close="showUnsavedModal = false"
    >
      <p>У вас есть несохранённые изменения. Они будут потеряны, если вы покинете эту страницу.</p>
      <template #footer>
        <BaseButton variant="secondary" @click="showUnsavedModal = false">
          Остаться
        </BaseButton>
        <BaseButton variant="danger" @click="confirmDiscardAndLeave">
          Выйти без сохранения
        </BaseButton>
      </template>
    </BaseModal>
  </main>
</template>

<style scoped lang="scss">
.page-container {
  max-width: 800px;
  margin: 2rem auto;
  padding: 0 1rem;
}

.back-btn {
  margin-bottom: 1rem;
  padding-left: 0;
  color: var(--color-text-secondary);
  
  &:hover {
    color: var(--color-text-primary);
  }
}
</style>