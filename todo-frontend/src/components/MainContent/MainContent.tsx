import { useState, useEffect, memo, useCallback } from 'react';
import './MainContent.css';
import TodoHeader from './TodoHeader';
import TodoInput from './TodoInput';
import TodoTabs from './TodoTabs';
import TodoItem from '../TodoItem/TodoItem';
import { Todo, FilterType } from '../../types/todo';

interface MainContentProps {
  filter: FilterType;
  onAdd: (title: string) => Promise<void>;
  setFilter: (filter: FilterType) => void;
  filteredTodos: Todo[];
  updateTodo: (id: string, payload: Partial<Todo>) => Promise<void>;
  deleteTodo: (id: string) => Promise<void>;
  restoreTodo: (id: string) => Promise<void>;
  deleteAll: () => Promise<void>;
  loading: boolean;
}

const MainContent = memo(({ 
  filter, onAdd, setFilter, filteredTodos, updateTodo, deleteTodo, restoreTodo, deleteAll, loading 
}: MainContentProps) => {
  const [confirmState, setConfirmState] = useState<'idle' | 'confirm' | 'deleting'>('idle');
  const isTrashView = filter.toUpperCase() === 'TRASH' || filter.toUpperCase() === 'RECYCLE BIN';

  const handleDeleteAll = useCallback(async () => {
    if (confirmState === 'idle') {
      setConfirmState('confirm');
      return;
    }
    setConfirmState('deleting');
    try {
      await deleteAll();
      setConfirmState('idle');
    } catch (e) {
      console.error(e);
      setConfirmState('idle');
    }
  }, [confirmState, deleteAll]);

  useEffect(() => {
    if (confirmState === 'confirm') {
      const timer = setTimeout(() => setConfirmState('idle'), 3000);
      return () => clearTimeout(timer);
    }
  }, [confirmState]);

  return (
    <main className="main-content">
      <div className="content-container">
        <TodoHeader filter={filter} taskCount={filteredTodos.length} />
        <div className="tabs-header-row">
          <TodoTabs activeFilter={filter} setFilter={setFilter} />
          <div className="list-controls">
            {filteredTodos.length > 0 && isTrashView && (
              <button 
                disabled={confirmState === 'deleting'}
                className={`pro-delete-btn ${confirmState}`}
                onClick={handleDeleteAll}
                title="Empty Trash"
              >
                <svg className="trash-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M3 6h18M19 6v14a2 2 0 01-2 2H7a2 2 0 01-2-2V6m3 0V4a2 2 0 012-2h4a2 2 0 012 2v2M10 11v6M14 11v6" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
                {confirmState === 'confirm' && <div className="btn-progress" />}
              </button>
            )}
          </div>
        </div>
        {!isTrashView && <TodoInput onAdd={onAdd}/>}
        <ul className="todo-list">
          {loading ? (
            <LoadingSkeleton />
          ) : filteredTodos.length > 0 ? (
            filteredTodos.map(todo => (
              <TodoItem 
                key={todo.id} 
                todo={todo}
                onToggle={() => updateTodo(todo.id, { is_completed: !todo.is_completed })}
                onDelete={() => deleteTodo(todo.id)}
                onRestore={() => restoreTodo(todo.id)}
                isTrashView={isTrashView} 
              />
            ))
          ) : null} 
        </ul>
      </div>
    </main>
  );
});

const LoadingSkeleton = () => (
  <>
    {[1, 2, 3].map((n) => (
      <li key={n} className="skeleton-item" style={{ listStyle: 'none' }}>
        <div className="skeleton-shimmer" style={{ height: '60px', background: '#eee', borderRadius: '12px', marginBottom: '15px' }}></div>
      </li>
    ))}
  </>
);

MainContent.displayName = 'MainContent';
export default MainContent;