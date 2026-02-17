import { useMemo, memo } from 'react';
import { useTodoContext } from '../../context/TodoContext';
import NoteSidebar from './NoteSidebar';
import NoteEditor from './NoteEditor';
import EmptyNoteState from './EmptyNoteState';
import { FilterType } from '../../types/todo';
import './NotesWorkspace.css';

interface NotesWorkspaceProps {
  focusedNoteId: string | null;
  setFilter: (filter: FilterType, noteId?: string) => void;
}

const NotesWorkspace = memo(({ focusedNoteId, setFilter }: NotesWorkspaceProps) => {
  const { todos, updateTodo } = useTodoContext();

  const notes = useMemo(() => 
    todos.filter(t => t.status !== 'deleted')
  , [todos]);

  const selectedNote = useMemo(() => 
    notes.find(n => n.id === focusedNoteId) || null
  , [notes, focusedNoteId]);

  return (
    <div className="notes-workspace glass-panel">
      <NoteSidebar 
        notes={notes} 
        selectedId={focusedNoteId} 
        onSelect={(id) => setFilter('Notes', id)} 
      />

      <main className="workspace-editor">
        {selectedNote ? (
          <NoteEditor 
            key={selectedNote.id} 
            note={selectedNote} 
            onUpdate={updateTodo} 
          />
        ) : (
          <EmptyNoteState />
        )}
      </main>
    </div>
  );
});

NotesWorkspace.displayName = 'NotesWorkspace';
export default NotesWorkspace;