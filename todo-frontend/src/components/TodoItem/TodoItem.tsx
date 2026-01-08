import { memo } from 'react';
import './TodoItem.css';
import { Todo } from '../../types/todo';

interface TodoItemProps {
  todo: Todo;
  onToggle: () => void;
  onDelete: () => void;
  onRestore: () => void;
  isTrashView: boolean;
}

const TodoItem = memo(({
  todo,
  onToggle,
  onDelete,
  onRestore,
  isTrashView
}: TodoItemProps) => {
  return (
    <li className={`todo-item ${todo.is_completed ? 'done' : ''} ${isTrashView ? 'in-trash' : ''}`}>
      <div 
        className='task-wrapper'
        onClick={!isTrashView ? onToggle : undefined}
        role={!isTrashView ? 'button' : 'presentation'}
        tabIndex={!isTrashView ? 0 : -1}
        onKeyDown={(e) => {
          if (!isTrashView && (e.key === 'Enter' || e.key === ' ')) {
            onToggle();
          }
        }}
      >
        {!isTrashView && (
          <div className='checkbox'>
            {todo.is_completed && <span className='checkmark-icon'>✓</span>}
          </div>
        )}
        
        <div className='todo-content-layout'>
          <span className='todo-text'>{todo.title}</span>
          {todo.categories?.name && (
            <span className={`category-badge ${todo.categories.name.toLowerCase()}`}>
              {todo.categories.name}
            </span>
          )}
        </div>
      </div>

      <div className='item-actions'>
        {isTrashView && (
          <button 
            className='restore-btn'
            onClick={(e) => {
              e.stopPropagation();
              onRestore();
            }}
            aria-label='Restore Task'
          >
            ↺
          </button>
        )}
        <button 
          className='delete-icon'
          onClick={(e) => {
            e.stopPropagation();
            onDelete();
          }}
          aria-label={isTrashView ? 'Delete Permanently' : 'Move to Trash'}
        >
          {isTrashView ? '×' : '×'}
        </button>
      </div>
    </li>
  );
});

TodoItem.displayName = 'TodoItem';
export default TodoItem;