import { useState, useEffect } from 'react';
import { Todo } from '../../types/todo';
import { useNoteAutoSave } from '../../hooks/useNoteAutoSave';
import Icon from '../../utils/Icon';
import './NoteEditor.css';

interface NoteEditorProps {
  note: Todo;
  onUpdate: (id: string, payload: Partial<Todo>) => Promise<void>;
}

export default function NoteEditor({ note, onUpdate }: NoteEditorProps) {
  const { draft, updateNote, lastSaved } = useNoteAutoSave(note, onUpdate);
  const [format, setFormat] = useState({ size: 16, serif: false, bold: false, italic: false });
  const [isFocusMode, setIsFocusMode] = useState(false);
  const [isManualExit, setIsManualExit] = useState(false);
  
  const wordCount = draft.trim() ? draft.trim().split(/\s+/).length : 0;
  const charCount = draft.length;

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isFocusMode) {
        setIsManualExit(true);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isFocusMode]);
  
  const handleFocus = () => {
    setIsFocusMode(true);
    // Only reset manual exit if the user hasn't explicitly turned it off
  };

  const handleBlur = () => {
    setTimeout(() => {
      if (document.activeElement?.tagName !== 'TEXTAREA' && 
          document.activeElement?.tagName !== 'INPUT') {
        setIsFocusMode(false);
        setIsManualExit(false);
      }
    }, 150);
  };

  const handleDelete = () => {
    if (confirm("Move this note to trash?")) {
      onUpdate(note.id, { status: 'deleted' });
    }
  };

  const toggleFocusMode = () => {
    setIsManualExit(!isManualExit);
  };

  const shouldBlur = isFocusMode && !isManualExit;

  return (
    <div className={`editor-container ${shouldBlur ? 'is-focused' : ''}`}>
      <div className="editor-header">
        <div className="header-top-row">
          <input
            className="editable-title"
            value={note.title || ''}
            onChange={(e) => onUpdate(note.id, { title: e.target.value })}
            onFocus={handleFocus}
            onBlur={handleBlur}
            placeholder="Untitled Note"
            spellCheck="false"
          />
          <div className="editor-meta">
  <div className="action-group">
    <button 
      className={`focus-toggle-btn ${!isManualExit ? 'active' : ''}`}
      onClick={toggleFocusMode}
      title={isManualExit ? "Enable Focus Blur" : "Disable Focus Blur"}
    >
      <Icon name={isManualExit ? "eye" : "eye-off"} size={14} />
    </button>

    <button className="delete-note-btn" onClick={handleDelete} title="Delete Note">
      <Icon name="trash" size={14} />
    </button>
  </div>

  {lastSaved && (
    <span className="last-saved-badge" key={lastSaved}>
      LAST SAVED {lastSaved}
    </span>
  )}
</div>
        </div>
      </div>

      <textarea
        className="pro-editor"
        style={{ 
          fontSize: `${format.size}px`, 
          fontFamily: format.serif ? 'Georgia, serif' : 'inherit',
          fontWeight: format.bold ? 700 : 400,
          fontStyle: format.italic ? 'italic' : 'normal'
        }}
        value={draft}
        onChange={(e) => updateNote(e.target.value)}
        onFocus={handleFocus}
        onBlur={handleBlur}
        placeholder="Start writing..."
        spellCheck="false"
      />

      <footer className="editor-footer">
        <div className="editor-stats">
          <div className="stat-item">
           <span className="stat-value">{wordCount}</span>
           <span className="stat-label">words</span>
         </div>

         <div className="stat-divider" />

         <div className="stat-item">
          <span className="stat-value">{charCount}</span>
          <span className="stat-label">chars</span>
         </div>
        </div>
      
        <div className="format-tools-tray">
          <div className="format-tools">
            <button 
              className={format.serif ? 'tool-active' : ''} 
              onClick={() => setFormat(f => ({...f, serif: !f.serif}))}
            >Aa</button>
            
            <button 
              className={format.bold ? 'tool-active' : ''} 
              onClick={() => setFormat(f => ({...f, bold: !f.bold}))}
            >
              <Icon name="bold" size={14}/>
            </button>
          </div>

          <div className="size-controls-wrapper">
            <div className="size-controls">
              <button onClick={() => setFormat(f => ({...f, size: Math.max(12, f.size - 1)}))}>-</button>
              <span className="size-display">{format.size}</span>
              <button onClick={() => setFormat(f => ({...f, size: Math.min(32, f.size + 1)}))}>+</button>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}