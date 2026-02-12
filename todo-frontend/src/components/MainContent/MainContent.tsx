import { memo, useCallback, useEffect, useMemo, useState } from 'react';
import './MainContent.css';
import TodoHeader from './TodoHeader';
import TodoInput from './TodoInput';
import TodoTabs from './TodoTabs';
import TodoItem from '../TodoItem/TodoItem';
import NotesWorkspace from '../notes/NotesWorkspace';
import { FilterType, Todo } from '../../types/todo';
import { IoTrashOutline } from 'react-icons/io5';

interface MainContentProps {
  filter: FilterType;
  focusedNoteId: string | null;
  onAdd: (title: string) => Promise<void>;
  setFilter: (filter: FilterType, noteId?: string) => void;
  filteredTodos: Todo[];
  allTodos: Todo[];
  updateTodo: (id: string, payload: Partial<Todo>) => Promise<void>;
  deleteTodo: (id: string) => Promise<void>;
  restoreTodo: (id: string) => Promise<void>;
  deleteAll: () => Promise<void>;
  loading: boolean;
  onCategoryCreated: (name: string) => Promise<void>;
  onToggleSidebar: () => void; 
}

const MainContent = memo(
  ({
    filter,
    focusedNoteId,
    filteredTodos,
    allTodos,
    loading,
    onAdd,
    setFilter,
    updateTodo,
    deleteTodo,
    restoreTodo,
    deleteAll,
    onCategoryCreated,
  }: MainContentProps) => {
    const [confirmState, setConfirmState] = useState<'idle' | 'confirm' | 'deleting'>('idle');
    const [selectedNote, setSelectedNote] = useState<Todo | null>(null);
    const [isAddingFlash, setIsAddingFlash] = useState(false);

    const isTrashView = filter === 'Trash';
    const isNotesView = filter === 'Notes';

    useEffect(() => {
      if (focusedNoteId && filter === 'Notes') {
        const noteToFocus = allTodos.find(t => t.id === focusedNoteId);
        if (noteToFocus) setSelectedNote(noteToFocus);
      }
    }, [focusedNoteId, filter, allTodos]);

    useEffect(() => {
      if (!isNotesView) setSelectedNote(null);
    }, [isNotesView]);

    const handleDeleteAll = useCallback(async () => {
      if (confirmState === 'idle') {
        setConfirmState('confirm');
        return;
      }
      setConfirmState('deleting');
      try {
        await deleteAll();
      } finally {
        setConfirmState('idle');
      }
    }, [confirmState, deleteAll]);

    useEffect(() => {
      if (confirmState === 'confirm') {
        const timer = setTimeout(() => setConfirmState('idle'), 3000);
        return () => clearTimeout(timer);
      }
    }, [confirmState]);

    const handleAddWithFlash = useCallback(async (title: string) => {
      setIsAddingFlash(true);
      await onAdd(title);
      setTimeout(() => setIsAddingFlash(false), 800);
    }, [onAdd]);

    const notes = useMemo(
      () => allTodos.filter((t) => t.status !== 'deleted' && (t.description?.trim().length || 0) > 0),
      [allTodos]
    );

    return (
      <main className="sb-dashboard-shell">
        {/* Header moved outside container to maintain a consistent vertical anchor */}
        <TodoHeader
          filter={filter}
          taskCount={isNotesView ? notes.length : filteredTodos.length}
        />

        <div className={`sb-container ${isNotesView ? 'is-notes-view' : ''}`}>
          {isNotesView ? (
            <NotesWorkspace
              notes={notes}
              selectedNote={selectedNote}
              onSelectNote={setSelectedNote}
              onUpdateNote={updateTodo}
            />
          ) : (
            <>
              <div className="sb-workspace">
                <div className="tabs-header-row">
                  <TodoTabs activeFilter={filter} setFilter={setFilter} />

                  {isTrashView && filteredTodos.length > 0 && (
                    <button
                      className={`pro-delete-btn ${confirmState}`}
                      disabled={confirmState === 'deleting'}
                      onClick={handleDeleteAll}
                      title={confirmState === 'confirm' ? 'Click again to confirm' : 'Empty Trash'}
                    >
                     {confirmState === 'deleting' ? <div className="btn-spinner" /> : <IoTrashOutline size={20} />}
                    </button>
                  )}
                </div>
              </div>

              {!isTrashView && (
                <TodoInput 
                  onAdd={handleAddWithFlash} 
                  isFlashActive={isAddingFlash}
                />
              )}

              <ul className="todo-list">
                {loading ? (
                  <LoadingSkeleton />
                ) : filteredTodos.length > 0 ? (
                  filteredTodos.map((todo) => (
                    <TodoItem
                      key={todo.id}
                      todo={todo}
                      onToggle={() => updateTodo(todo.id, { is_completed: !todo.is_completed })}
                      onDelete={() => deleteTodo(todo.id)}
                      onRestore={() => restoreTodo(todo.id)}
                      onUpdate={updateTodo}
                      isTrashView={isTrashView}
                      setFilter={setFilter}
                      onCategoryCreated={onCategoryCreated}
                    />
                  ))
                ) : (
                  <div className="empty-state-msg">No tasks found.</div>
                )}
              </ul>
            </>
          )}
        </div>
      </main>
    );
  }
);

const LoadingSkeleton = () => (
  <>
    {[1, 2, 3].map((n) => (
      <li key={n} className="skeleton-item" style={{ listStyle: 'none' }}>
        <div className="skeleton-shimmer" style={{ height: '60px', borderRadius: '10px', marginBottom: '12px' }} />
      </li>
    ))}
  </>
);

MainContent.displayName = 'MainContent';
export default MainContent;