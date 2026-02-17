import { useState, useRef, useEffect, useCallback } from 'react';
import { Todo } from '../types/todo';

export function useNoteAutoSave(
  selectedNote: Todo | null, 
  onUpdate: (id: string, payload: Partial<Todo>) => Promise<void> | void
) {
  const [draft, setDraft] = useState('');
  const [lastSaved, setLastSaved] = useState<string | null>(null);
  const saveTimeout = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    if (selectedNote) {
      const savedLocal = localStorage.getItem(`note-draft-${selectedNote.id}`);
      setDraft(savedLocal !== null ? savedLocal : (selectedNote.description || ''));
      setLastSaved(null);
    }

    return () => {
      if (saveTimeout.current) clearTimeout(saveTimeout.current);
    };
  }, [selectedNote?.id]);

  const updateNote = useCallback((value: string) => {
    setDraft(value);
    
    if (selectedNote) {
      localStorage.setItem(`note-draft-${selectedNote.id}`, value);
      
      if (saveTimeout.current) clearTimeout(saveTimeout.current);

      saveTimeout.current = setTimeout(async () => {
        try {
          await onUpdate(selectedNote.id, { description: value });
          
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