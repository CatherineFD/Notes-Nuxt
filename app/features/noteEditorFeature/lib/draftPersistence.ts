import type { Note } from "~/entities/note/model/types";

const SCHEMA_VERSION = 1;
const DRAFT_KEY_PREFIX = 'note_editor_draft_';

interface DraftStorageData {
  schemaVersion: number;
  noteId: string;
  timestamp: number;
  note: Note;
}

/**
 * Сохраняет черновик в localStorage
 */
export function saveDraftToLS(note: Note): void {
  if (!note?.id) return;

  try {
    const cleanNote = JSON.parse(JSON.stringify(note)) as Note;

    const data: DraftStorageData = {
      schemaVersion: SCHEMA_VERSION,
      noteId: note.id,
      timestamp: Date.now(),
      note: cleanNote, 
    };

    localStorage.setItem(`${DRAFT_KEY_PREFIX}${note.id}`, JSON.stringify(data));
  } catch (error) {
    if (import.meta.dev) {
      console.warn('[Draft] Не удалось сохранить черновик в localStorage:', error);
    }
  }
}

/**
 * Загружает черновик из localStorage (для проверки при монтировании страницы)
 */
export function loadDraftFromLS(noteId: string): Note | null {
  const raw = localStorage.getItem(`${DRAFT_KEY_PREFIX}${noteId}`);
  if (!raw) return null;

  try {
    const data: DraftStorageData = JSON.parse(raw);

    // Проверка версии схемы (на случай будущих обновлений формата данных)
    if (data.schemaVersion !== SCHEMA_VERSION) {
      if (import.meta.dev) console.warn('[Draft] Несовпадение версии схемы, черновик отброшен');
      localStorage.removeItem(`${DRAFT_KEY_PREFIX}${noteId}`);
      return null;
    }

    return data.note;
  } catch (error) {
    if (import.meta.dev) console.warn('[Draft] Ошибка парсинга черновика:', error);
    localStorage.removeItem(`${DRAFT_KEY_PREFIX}${noteId}`);
    return null;
  }
}

/**
 * Удаляет черновик (вызывается при успешном сохранении или отмене редактирования)
 */
export function removeDraftFromLS(noteId: string): void {
  localStorage.removeItem(`${DRAFT_KEY_PREFIX}${noteId}`);
}