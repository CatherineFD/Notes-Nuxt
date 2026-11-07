import type { NoteDTO } from '@/shared/dto/noteDto'

export interface NotesRepository {
  getNotes(): Promise<NoteDTO[]>
  saveNotes(notes: NoteDTO[]): Promise<void>
}