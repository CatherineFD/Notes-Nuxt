import { LocalStorageNotesRepository } from "~/entities/note/repositories/LocalStorageNotesRepository"
import { NotesService } from "~/entities/note/services/NotesService"
import { createNotesStore } from "~/entities/note/store/NotesStore"

export default defineNuxtPlugin(() => {
  const repository = new LocalStorageNotesRepository()
  const notesService = new NotesService(repository)

  const useNotesStore = createNotesStore({
    getNotes: () => notesService.getNotes(),
    saveNotes: (notes) => notesService.saveNotes(notes),
  })

  return {
    provide: {
      notesStore: useNotesStore,
    },
  }
})