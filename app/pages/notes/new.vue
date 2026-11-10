<script setup lang="ts">
import NoteEditorFeature from '~/features/noteEditorFeature/NoteEditorFeature.vue';
import ButtonLink from '~/shared/ui/button/ButtonLink.vue';
import { useNoteCreatorPage } from './lib/useNoteCreatorPage';
import IconArrow from '~/shared/ui/icon/IconArrow.vue';

const {
  handleSave,
  handleCancel,
} = useNoteCreatorPage();
</script>

<template>
  <main class="page-container">
    <ButtonLink
      to="/"
    >
      <IconArrow direction="left"/>
    </ButtonLink> 
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