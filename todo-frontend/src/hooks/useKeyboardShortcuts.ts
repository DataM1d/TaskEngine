import { useEffect } from 'react';

interface ShortcutActions {
  onToggleSidebar: () => void;
  onFocusInput: () => void;
  onToggleTheme: () => void;
  onNavigateNotes: () => void;
  onNavigateImportant: () => void;
  onToggleCategories: () => void;
}

export const useKeyboardShortcuts = (actions: ShortcutActions) => {
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      const isInput = e.target instanceof HTMLInputElement || 
                      e.target instanceof HTMLTextAreaElement || 
                      (e.target as HTMLElement).isContentEditable;
      
      const cmd = e.metaKey || e.ctrlKey;
      const key = e.key.toLowerCase();

      const kbdTags = document.querySelectorAll('.shortcut-tag');
      kbdTags.forEach(kbd => {
        const text = kbd.textContent?.toLowerCase();
        if (text?.includes(key)) {
            kbd.classList.add('pressed');
            setTimeout(() => kbd.classList.remove('pressed'), 150)
        }
      });

      if (cmd && key === 'b') {
        e.preventDefault();
        actions.onToggleSidebar();
      }

      if (cmd && key === 'l') {
        e.preventDefault();
        actions.onToggleTheme();
      }

      if (isInput) return;

      if (cmd && key === 'i') {
        e.preventDefault();
        actions.onNavigateNotes();
      }

      if (cmd && key === 'e') {
        e.preventDefault();
        actions.onNavigateImportant();
      }

      if (cmd && key === 'u') {
        e.preventDefault();
        actions.onToggleCategories();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [actions]);
};