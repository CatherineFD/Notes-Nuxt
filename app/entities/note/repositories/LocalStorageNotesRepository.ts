import type { NotesRepository } from '@/entities/note/repositories/note-repository'
import type { NoteDTO } from '@/shared/dto/noteDto'
import { RepositoryError } from '@/shared/types/errors'
import { storageGet, storageSet } from '@/shared/lib/utils/storage'

const STORAGE_KEY = 'notes'

export class LocalStorageNotesRepository implements NotesRepository {
  async getNotes(): Promise<NoteDTO[]> {
    try {
      return storageGet<NoteDTO[]>(STORAGE_KEY, [])
    } catch {
      throw new RepositoryError('Failed to read notes')
    }
  }

  async saveNotes(notes: NoteDTO[]): Promise<void> {
    try {
      storageSet(STORAGE_KEY, notes)
    } catch {
      throw new RepositoryError('Failed to save notes')
    }
  }
}