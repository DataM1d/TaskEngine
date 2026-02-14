import { useState, useRef, useEffect, useCallback } from 'react';
import { Todo } from '../types/todo';

export function useNoteAutoSave(
  selectedNote: Todo | null, 
  onUpdate: (id: string, payload: Partial<Todo>) => Promise<void> | void
) {
  const [draft, setDraft] = useState('');
  const [lastSaved, setLastSaved] = useState<string | null>(null);
  const saveTimeout = useRef<ReturnType<typeof setTimeout> | null>(null);

  // 1. Initial Load: Sync draft with selected note or localStorage fallback
  useEffect(() => {
    if (selectedNote) {
      const savedLocal = localStorage.getItem(`note-draft-${selectedNote.id}`);
      setDraft(savedLocal !== null ? savedLocal : (selectedNote.description || ''));
      setLastSaved(null);
    }

    // Cleanup timeout on note switch or unmount
    return () => {
      if (saveTimeout.current) clearTimeout(saveTimeout.current);
    };
  }, [selectedNote?.id]);

  // 2. Debounced Update Logic
  const updateNote = useCallback((value: string) => {
    setDraft(value);
    
    if (selectedNote) {
      // Immediate local fallback
      localStorage.setItem(`note-draft-${selectedNote.id}`, value);
      
      // Clear existing timer to reset the 1s debounce
      if (saveTimeout.current) clearTimeout(saveTimeout.current);

      saveTimeout.current = setTimeout(async () => {
        try {
          await onUpdate(selectedNote.id, { description: value });
          
          // Successful DB save: update UI and clean local cache
          setLastSaved(new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }));
          localStorage.removeItem(`note-draft-${selectedNote.id}`); 
        } catch (error) {
          console.error("Auto-save failed, keeping local draft as backup:", error);
        }
      }, 1000);
    }
  }, [selectedNote, onUpdate]);

  return { draft, updateNote, lastSaved };
}