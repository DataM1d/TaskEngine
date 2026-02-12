import React, { useState, useRef, useEffect } from 'react';
import { Todo } from '../../types/todo';
import { detectIconFromName } from '../../utils/iconDetector'; 
import Icon from '../../utils/Icon'; 
import './NotesWorkspace.css';

interface NotesWorkspaceProps {
  notes: Todo[];
  selectedNote: Todo | null;
  onSelectNote: (note: Todo) => void;
  onUpdateNote: (id: string, payload: Partial<Todo>) => void;
}

const NotesWorkspace: React.FC<NotesWorkspaceProps> = ({
  notes,
  selectedNote,
  onSelectNote,
  onUpdateNote
}) => {
  const [draft, setDraft] = useState('');
  const [titleDraft, setTitleDraft] = useState('');
  const [lastSaved, setLastSaved] = useState<string | null>(null);
  
  const [fontSize, setFontSize] = useState(16);
  const [isSerif, setIsSerif] = useState(false);
  const [isBold, setIsBold] = useState(false);
  const [isItalic, setIsItalic] = useState(false);

  const saveTimeout = useRef<number | null>(null);
  const storageKey = selectedNote ? `note-draft-${selectedNote.id}` : null;

  const getStats = (text: string) => {
    const words = text.trim() ? text.trim().split(/\s+/).length : 0;
    return { words };
  };

  useEffect(() => {
    if (selectedNote) {
      const savedDraft = storageKey ? localStorage.getItem(storageKey) : null;
      setDraft(savedDraft || selectedNote.description || '');
      setTitleDraft(selectedNote.title || '');
      setLastSaved(null);
    }
    return () => {
      if (saveTimeout.current) window.clearTimeout(saveTimeout.current);
    };
  }, [selectedNote?.id, storageKey]);

  const handleDescriptionChange = (value: string) => {
    setDraft(value);
    if (storageKey) localStorage.setItem(storageKey, value);
    if (saveTimeout.current) window.clearTimeout(saveTimeout.current);
    saveTimeout.current = window.setTimeout(() => {
      if (selectedNote) {
        onUpdateNote(selectedNote.id, { description: value });
        setLastSaved(new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }));
      }
    }, 1000);
  };

  const handleAction = (type: 'bold' | 'italic' | 'case') => {
    if (type === 'bold') { setIsBold(!isBold); return; }
    if (type === 'italic') { setIsItalic(!isItalic); return; }

    const textarea = document.querySelector('.pro-editor') as HTMLTextAreaElement;
    if (!textarea) return;

    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;

    if (start !== end) {
      const selectedText = draft.substring(start, end);
      const isAllUpper = selectedText === selectedText.toUpperCase() && selectedText !== selectedText.toLowerCase();
      const newPiece = isAllUpper ? selectedText.toLowerCase() : selectedText.toUpperCase();
      const updated = draft.substring(0, start) + newPiece + draft.substring(end);
      handleDescriptionChange(updated);
      setTimeout(() => {
        textarea.focus();
        textarea.setSelectionRange(start, end);
      }, 0);
    } else {
      const isAllUpper = draft === draft.toUpperCase() && draft !== draft.toLowerCase();
      handleDescriptionChange(isAllUpper ? draft.toLowerCase() : draft.toUpperCase());
    }
  };

  return (
    <div className="notes-workspace glass-panel">
      <aside className="workspace-sidebar">
        <header className="sidebar-header">
          <h3>Project Notes</h3>
          <p>{notes.length} Active Documents</p>
        </header>

        <div className="note-list">
          {notes.map((note) => (
            <div
              key={note.id}
              className={`note-item-preview ${selectedNote?.id === note.id ? 'active' : ''}`}
              onClick={() => onSelectNote(note)}
            >
              <div className="note-preview-content">
                <div className="note-title">{note.title || "Untitled Note"}</div>
                <div className="note-internal-divider" />
                <div className="note-snippet">
                  {note.description?.substring(0, 45) || "No notes yet..."}
                </div>
              </div>
            </div>
          ))}
        </div>
      </aside>

      <main className="workspace-editor">
        {!selectedNote ? (
          <div className="empty-state">
            <div className="empty-icon">
              <Icon name={detectIconFromName('notes')} size={48} />
            </div>
            <p className="default-text">Select a note from the sidebar to begin</p>
          </div>
        ) : (
          <>
            <div className="editor-header">
              <div className="title-container">
                <input
                  className="editable-title"
                  value={titleDraft}
                  onChange={(e) => {
                    setTitleDraft(e.target.value);
                    onUpdateNote(selectedNote.id, { title: e.target.value });
                  }}
                  placeholder="Untitled Note"
                  spellCheck={false}
                />
                <div className="editor-meta">
                  <span className="meta-date">Created {new Date(selectedNote.created_at).toLocaleDateString()}</span>
                  {lastSaved && <span className="last-saved">Synced {lastSaved}</span>}
                </div>
              </div>
            </div>

            <div className="editor-scroller">
              <textarea
                className="pro-editor"
                style={{ 
                  fontSize: `${fontSize}px`, 
                  fontFamily: isSerif ? 'Georgia, serif' : 'var(--font-ui)',
                  fontWeight: isBold ? 700 : 400,
                  fontStyle: isItalic ? 'italic' : 'normal'
                }}
                value={draft}
                onChange={(e) => handleDescriptionChange(e.target.value)}
                placeholder="Start writing..."
                spellCheck={true}
              />
            </div>

            <footer className="editor-footer">
              <div className="footer-left">
                <div className="stat-group">
                  <span><strong>{getStats(draft).words}</strong> words</span>
                </div>
              </div>

              <div className="footer-right">
                <div className="format-tools">
                  <button className={`tool-btn ${isSerif ? 'active' : ''}`} onClick={() => setIsSerif(!isSerif)} title="Serif Font">
                    <span className="aa-icon">Aa</span>
                  </button>
                  <div className="tool-separator" />
                  <button className={`tool-btn ${isBold ? 'active' : ''}`} onClick={() => handleAction('bold')} title="Bold Toggle">
                    <Icon name="bold" size={14} />
                  </button>
                  <div className="tool-separator" />
                  <button className={`tool-btn ${isItalic ? 'active' : ''}`} onClick={() => handleAction('italic')} title="Italic Toggle">
                    <Icon name="italic" size={14} />
                  </button>
                  <div className="tool-separator" />
                  <button className="tool-btn" onClick={() => handleAction('case')} title="Toggle Case">AG</button>
                  <div className="tool-separator" />
                  <button className="tool-btn" onClick={() => setFontSize(s => Math.max(12, s - 1))}>−</button>
                  <span className="size-display">{fontSize}px</span>
                  <button className="tool-btn" onClick={() => setFontSize(s => Math.min(32, s + 1))}>+</button>
                </div>
              </div>
            </footer>
          </>
        )}
      </main>
    </div>
  );
};

export default NotesWorkspace;