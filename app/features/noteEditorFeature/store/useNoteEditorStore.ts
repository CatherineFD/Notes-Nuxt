import type { Note } from "~/entities/note/model/types";
import type { NoteCommand } from "../model/commands";
import { removeDraftFromLS, saveDraftToLS } from "../lib/draftPersistence";

export const useNoteEditorStore = defineStore('note-editor', () => {
  const draft = ref<Note | null>(null);
  const undoStack = ref<NoteCommand[]>([]);
  const redoStack = ref<NoteCommand[]>([]);
  const HISTORY_LIMIT = 50;

  const canUndo = computed(() => undoStack.value.length > 0);
  const canRedo = computed(() => redoStack.value.length > 0);

  function executeCommand(command: NoteCommand) {
    if (!draft.value) return;
    
    command.execute(draft.value);
    
    undoStack.value.push(command);
    if (undoStack.value.length > HISTORY_LIMIT) {
      undoStack.value.shift();
    }
    
    redoStack.value = []; 
    
    saveDraftToLS(draft.value);
  }

  function undo() {
    if (!draft.value || !canUndo.value) return;
    const command = undoStack.value.pop()!;
    command.revert(draft.value);
    redoStack.value.push(command);
    saveDraftToLS(draft.value);
  }

  function redo() {
    if (!draft.value || !canRedo.value) return;
    const command = redoStack.value.pop()!;
    command.execute(draft.value);
    undoStack.value.push(command);
    saveDraftToLS(draft.value);
  }

  function reset() {
    draft.value = null;
    undoStack.value = [];
    redoStack.value = [];
  }

  function cancel() {
    if (!draft.value) return

    removeDraftFromLS(draft.value.id)

    reset()
  }

  function clearDraftStorage() {
    if (draft.value) {
      removeDraftFromLS(draft.value.id)
    }
  }

  function cleanup() {
    clearDraftStorage()
    reset()
  }

  return {
    draft,
    undoStack,
    redoStack,
    canUndo,
    canRedo,
    executeCommand,
    undo,
    redo,
    reset,
    cancel,
    clearDraftStorage,
    cleanup,
  };
});