import { useState } from 'react';
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

  // Quick word count calculation
  const wordCount = draft.trim() ? draft.trim().split(/\s+/).length : 0;

  return (
    <div className="editor-container">
      <div className="editor-header">
        <input
          className="editable-title"
          value={note.title || ''}
          onChange={(e) => onUpdate(note.id, { title: e.target.value })}
          placeholder="Untitled Note"
        />
        <div className="editor-meta">
          {lastSaved && <span className="last-saved-badge">Saved {lastSaved}</span>}
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
        placeholder="Start writing..."
        spellCheck="false"
      />

      <footer className="editor-footer">
        <div className="stat-group"><strong>{wordCount}</strong> words</div>
        <div className="format-tools">
          <button 
            className={format.serif ? 'tool-active' : ''} 
            onClick={() => setFormat(f => ({...f, serif: !f.serif}))}
            title="Toggle Serif"
          >Aa</button>
          
          <button 
            className={format.bold ? 'tool-active' : ''} 
            onClick={() => setFormat(f => ({...f, bold: !f.bold}))}
          >
            <Icon name="bold" size={14}/>
          </button>
          
          <div className="size-controls">
            <button onClick={() => setFormat(f => ({...f, size: Math.max(12, f.size - 1)}))}>-</button>
            <span className="size-display">{format.size}</span>
            <button onClick={() => setFormat(f => ({...f, size: Math.min(32, f.size + 1)}))}>+</button>
          </div>
        </div>
      </footer>
    </div>
  );
}