<script setup lang="ts">
import type { Note } from '~/entities/note/model/types';
import NoteList from '~/entities/note/ui/NoteList.vue';
import BaseCard from '~/shared/ui/base/BaseCard.vue';
import ButtonLink from '~/shared/ui/base/ButtonLink.vue';

const useNotesStore = useNuxtApp().$notesStore;
const notesStore = useNotesStore();

onMounted(() => {
    notesStore.loadNotes()
});

const { notes } = storeToRefs(notesStore);

const handleEdit = (note: Note) => {
    console.log('edit', note);
}

const handleDelete = (note: Note) => {
    console.log('delete', note);
}
</script>

<template>
    <div>
        <ButtonLink to="/notes/new">Создать заметку</ButtonLink>
        <NoteList :notes="notes">
            <template #default="{ note }">
                <BaseCard
                    :note="note"
                    @edit="handleEdit(note)"
                    @delete="handleDelete(note)"
                />
            </template>

            <template #empty>
                <p>Создайте первую заметку!</p>
            </template>
        </NoteList>
    </div>
</template>