<script setup lang="ts">
import NoteEditorFeature from '~/features/noteEditorFeature/NoteEditorFeature.vue';
import BaseModal from '~/shared/ui/base/BaseModal.vue';
import BaseButton from '~/shared/ui/button/BaseButton.vue';
import ButtonLink from '~/shared/ui/button/ButtonLink.vue';
import { useNoteEditorPage } from './lib/useNoteEditorPage';
import IconArrow from '~/shared/ui/icon/IconArrow.vue';

const {
  notesStore,
  editorStore,
  showRestoreModal,
  handleSave,
  handleCancel,
  handleDelete,
  restoreDraft,
  discardDraft,
} = useNoteEditorPage();

</script>

<template>
  <div class="page-container">
    <ButtonLink to="/">
      <IconArrow direction="left"/>
    </ButtonLink>

    <div v-if="notesStore.isLoading" class="loading-state">
      <p>Загрузка заметки...</p>
    </div>

    <template v-else>
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

.loading-state {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 200px;
  color: var(--color-text-muted);
  font-size: 1rem;
}

.error-banner {
  margin-top: 1rem;
  padding: 0.75rem 1rem;
  background-color: rgba(239, 68, 68, 0.1);
  border: 1px solid var(--color-danger);
  border-radius: 0.5rem;
  color: var(--color-danger);
  font-size: 0.875rem;
  text-align: center;
}
</style>