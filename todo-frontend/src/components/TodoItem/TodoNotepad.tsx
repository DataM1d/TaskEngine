import { useEffect, useRef } from 'react';
import CategoryIcon from '../ui/CategoryIcon';
import { detectIconFromName } from '../../utils/iconDetector';
import './TodoNotepad.css';


interface TodoNotepadProps {
  localNote: string;
  setLocalNote: (val: string) => void;
  onSave: () => void;
  onClose: () => void;
  showSaveToast: boolean;
  onExpand: () => void;
}

export default function TodoNotepad({ localNote, setLocalNote, onSave, onClose, showSaveToast, onExpand }: TodoNotepadProps) {
  const notepadRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (notepadRef.current && !notepadRef.current.contains(e.target as Node)) onClose();
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [onClose]);

  return (
    <div className="glass-notepad" ref={notepadRef} onClick={(e) => e.stopPropagation()}>
      <div className="notepad-header">
        <div className="header-left">
          <CategoryIcon iconName={detectIconFromName('notes')} />
          <h4>Task Notes</h4>
        </div>
        <div className="header-right-actions">
          <button className="expand-workspace-btn" disabled={!localNote.trim()} onClick={onExpand}>
            <CategoryIcon iconName={detectIconFromName('notes-workspace')} />
          </button>
          <button className="close-note-btn" onClick={onClose}>×</button>
        </div>
      </div>
      <div className="notepad-workspace">
        <textarea 
          autoFocus 
          value={localNote} 
          onChange={(e) => setLocalNote(e.target.value)} 
          placeholder="Ctrl/Cmd + Enter to save..."
        />
      </div>
      <div className="notepad-footer">
        <div className="footer-info">
          <span className={`footer-status ${showSaveToast ? 'saved-active' : ''}`}>{showSaveToast ? '✓ Saved' : ''}</span>
          <span className='char-count'>{localNote.length} chars</span>
        </div>
        <button className='submit-note-btn' onClick={onSave}>Save</button>
      </div>
    </div>
  );
}