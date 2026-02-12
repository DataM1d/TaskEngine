import { memo, useState, useRef, useEffect, useCallback, useMemo } from 'react';
import './TodoItem.css';
import { Todo, FilterType } from '../../types/todo';
import { detectCategoryFromTitle } from '../../utils/itemTypeDetector';
import { detectIconFromName } from '../../utils/iconDetector';
import CategoryIcon from '../ui/CategoryIcon';

interface TodoItemProps {
  todo: Todo;
  onToggle: () => void;
  onDelete: () => void;
  onRestore: () => void;
  onUpdate: (id: string, payload: Partial<Todo>) => void;
  isTrashView: boolean;
  setFilter: (filter: FilterType, noteId?: string) => void;
  onCategoryCreated: (name: string) => Promise<void>;
}

const TodoItem = memo(({
  todo,
  onToggle,
  onDelete,
  onRestore,
  onUpdate,
  isTrashView,
  setFilter,
  onCategoryCreated
}: TodoItemProps) => { 
  const [isNoteOpen, setIsNoteOpen] = useState(false);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [isCreating, setIsCreating] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [localNote, setLocalNote] = useState(todo.description || '');
  const [showSaveToast, setShowSaveToast] = useState(false);
  const notepadRef = useRef<HTMLDivElement>(null);

  const displayCategory = useMemo(() => {
      if (todo.categories?.name) return todo.categories.name;
      const detected = detectCategoryFromTitle(todo.title);
      return detected !== 'OTHER' ? detected : null;
  }, [todo.categories, todo.title]);

  const isVirtual = !todo.category_id;
  
  useEffect(() => {
    setLocalNote(todo.description || '');
  }, [todo.description]);

  const handleSave = useCallback(() => {
    if (localNote !== todo.description) {
      onUpdate(todo.id, { description: localNote });
    }
    setShowSaveToast(true);
    const timer = setTimeout(() => setShowSaveToast(false), 2000);
    return () => clearTimeout(timer);
  }, [localNote, todo.description, todo.id, onUpdate]);

  const handleClose = useCallback(() => {
    if (localNote !== todo.description) {
      handleSave();
    }
    setIsNoteOpen(false);
  }, [handleSave, localNote, todo.description]);

  useEffect(() => {
    const handleGlobalKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isNoteOpen) {
        handleClose();
      }
    };
    if (isNoteOpen) {
      window.addEventListener('keydown', handleGlobalKeyDown);
    }
    return () => window.removeEventListener('keydown', handleGlobalKeyDown);
  }, [isNoteOpen, handleClose]);

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if ((e.metaKey || e.ctrlKey) && e.key === 'Enter') {
      e.preventDefault();
      handleSave();
    }
    if (e.key === 'Escape') {
      e.preventDefault();
      handleClose();
    }
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (notepadRef.current && !notepadRef.current.contains(event.target as Node)) {
        handleClose();
      }
    };
    if (isNoteOpen) document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isNoteOpen, handleClose]);

  useEffect(() => {
    if (isNoteOpen && notepadRef.current) {
      setTimeout(() => {
        notepadRef.current?.scrollIntoView({
          behavior: 'smooth',
          block: 'nearest'
        });
      }, 100);
    }
  }, [isNoteOpen]);

  const handleBadgeClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!isVirtual && displayCategory) {
      setFilter(displayCategory as FilterType);
    } else if (displayCategory) {
      setError(null);
      setShowCreateModal(true);
    }
  };

  const handleCreateCategory = async () => {
    if (!displayCategory || isCreating) return;
    setIsCreating(true);
    setError(null);
    try {
      await onCategoryCreated(displayCategory);
      setShowCreateModal(false);
    } catch (err: any) {
      setError(err.message || 'Failed to create category');
    } finally {
      setIsCreating(false);
    }
  };

  return (
    <>
      <li className={`todo-item ${todo.is_completed ? 'done' : ''} ${isTrashView ? 'in-trash' : ''} ${isNoteOpen ? 'is-editing-note' : ''}`}>
        <div className='task-wrapper' onClick={!isTrashView ? onToggle : undefined}>
          {!isTrashView && (
            <div className='checkbox'>
              {todo.is_completed && <span className='checkmark-icon'>✓</span>}
            </div>
          )}
          <div className='todo-content-layout'>
            <span className='todo-text'>{todo.title}</span>
          </div>
        </div>

        <div className='item-actions'> 
          {!isTrashView && displayCategory && (
            <span
              className={`item-type-badge badge-${displayCategory.toLowerCase()} ${isVirtual ? 'virtual-badge' : 'solid-badge'}`}         
              onClick={handleBadgeClick}
            >
              {isVirtual && <span className="badge-plus-icon">+</span>}
              <span className="badge-text">{displayCategory}</span>
            </span>
          )}

          <div className="button-group">
            {!isTrashView && (
              <button 
                className={`note-trigger ${todo.description ? 'has-content' : ''} ${isNoteOpen ? 'active' : ''}`}
                onClick={(e) => { e.stopPropagation(); setIsNoteOpen(true); }}
                title={todo.description ? "View Notes" : "Add Note"}
              >
                <CategoryIcon iconName={detectIconFromName('notes')} />
              </button>
            )}

            {isTrashView && (
              <button className='restore-btn' onClick={(e) => { e.stopPropagation(); onRestore(); }}>
                <CategoryIcon iconName={detectIconFromName('recycle bin')} />
              </button>
            )}
    
            <button className='delete-icon' onClick={(e) => { e.stopPropagation(); onDelete(); }}>
              <CategoryIcon iconName={detectIconFromName('close')} />
            </button>
          </div>
        </div>

        {isNoteOpen && (
          <div className="glass-notepad" ref={notepadRef} onClick={(e) => e.stopPropagation()}>
            
            <div className="notepad-header">
              <div className="header-left">
                <CategoryIcon iconName={detectIconFromName('notes')} />
                <h4>Task Notes</h4>
              </div>
              <div className="header-right-actions">
                <button 
                  className={`expand-workspace-btn ${todo.description ? 'is-active' : 'is-empty'}`}
                  title={localNote.trim() ? "View Full Workspace" : ""}
                  disabled={!localNote.trim()}
                  onClick={() => {
                    handleSave();
                    setFilter('Notes' as FilterType, todo.id);
                  }}
                >
                  <CategoryIcon iconName={detectIconFromName('notes-workspace')} />
                </button>
                <button className="close-note-btn" onClick={handleClose}>×</button>
              </div>
            </div>

            <div className="notepad-workspace">
              <textarea 
               autoFocus
               value={localNote}
               onChange={(e) => setLocalNote(e.target.value)}
               onKeyDown={handleKeyDown}
               placeholder="Ctrl/Cmd + Enter to save..."
               spellCheck="false"
               />
            </div>

            <div className="notepad-footer">
              <div className="footer-info">
                  <span className={`footer-status ${showSaveToast ? 'saved-active' : ''}`}>
                    {showSaveToast ? '✓ Saved' : ''}
                  </span>
                  <span className='char-count'>
                    {localNote.length} characters
                  </span>
              </div>

              <button
                className='submit-note-btn'
                onClick={handleSave}
                data-hint="ESC to close"
              >
                Save
              </button>
            </div>
          </div>
        )}
      </li>

      {showCreateModal && (
        <div className="category-modal-overlay" onClick={() => setShowCreateModal(false)}>
          <div className="category-modal manager-glass" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3 className="category-modal-title">Create Category</h3>
              <button className="close-x" onClick={() => setShowCreateModal(false)}>×</button>
            </div>
            <div className="modal-body">
              <div style={{ padding: '10px 0', color: 'var(--sb-text-muted)' }}>
                Confirm making <strong style={{ color: 'var(--sb-brand)' }}>"{displayCategory}"</strong> a permanent category?
              </div>
              {error && <div className="modal-error-badge">⚠️ {error}</div>}
            </div>
            <div className="category-modal-actions">
              <button className="category-modal-btn category-modal-btn-cancel" onClick={() => setShowCreateModal(false)}>Cancel</button>
              <button className="category-modal-btn category-modal-btn-create" onClick={handleCreateCategory}>Create</button>
            </div>
          </div>
        </div>
      )}
    </>
  );
});

export default TodoItem;