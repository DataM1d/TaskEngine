import { Todo } from '../../types/todo';
import './NoteSidebar.css';

interface NoteSidebarProps {
  notes: Todo[];
  selectedId: string | null;
  onSelect: (noteId: string) => void;
}

export default function NoteSidebar({ notes, selectedId, onSelect }: NoteSidebarProps) {
  return (
    <aside className="workspace-sidebar">
      <header className="sidebar-header">
        <h3 className="workspace-title">Project Notes</h3>
        <p className="workspace-count">{notes.length} Active Documents</p>
      </header>

      <nav className="note-list">
        {notes.length > 0 ? (
          notes.map((note) => (
            <div
              key={note.id}
              className={`note-item-preview ${selectedId === note.id ? 'active' : ''}`}
              onClick={() => onSelect(note.id)}
              role="button"
              tabIndex={0}
            >
              <div className="note-preview-content">
                <div className="note-title">{note.title || "Untitled Note"}</div>
                <div className="note-internal-divider" />
                <div className="note-snippet">
                  {note.description?.replace(/\n/g, ' ').substring(0, 45) || "No content..."}
                </div>
              </div>
            </div>
          ))
        ) : (
          <div className="sidebar-empty-hint">
            No notes found. Add a description to a task to see it here.
          </div>
        )}
      </nav>
    </aside>
  );
}