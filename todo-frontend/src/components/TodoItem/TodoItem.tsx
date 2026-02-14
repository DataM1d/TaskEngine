import { memo } from 'react';
import { Todo, FilterType } from '../../types/todo'; 
import { useTodoItem } from './useTodoItem';
import { detectIconFromName } from '../../utils/iconDetector';
import CategoryIcon from '../ui/CategoryIcon';
import TodoNotepad from './TodoNotepad';
import QuickCategoryModal from './QuickCategoryModal';
import './TodoItem.css';

interface TodoItemProps {
  todo: Todo;
  isTrashView: boolean;
  setFilter: (filter: FilterType, noteId?: string) => void;
}

const TodoItem = memo(({ todo, isTrashView, setFilter }: TodoItemProps) => { 
  const { state, actions } = useTodoItem(todo, setFilter);
  const { strategy } = state;

  return (
    <>
      <li className={`todo-item ${todo.is_completed ? 'done' : ''} ${isTrashView ? 'in-trash' : ''}`}>
        <div className='task-wrapper' onClick={strategy.onMainClick}>
          {!isTrashView && (
            <div className='checkbox' role="checkbox" aria-checked={todo.is_completed}>
              {todo.is_completed && '✓'}
            </div>
          )}
          <span className='todo-text'>{todo.title}</span>
        </div>

        <div className='item-actions'> 
          {strategy.displayCategory && (
            <span 
              className={`item-type-badge ${strategy.isVirtual ? 'virtual-badge' : 'solid-badge'}`} 
              onClick={(e) => { e.stopPropagation(); strategy.onBadgeClick(); }}
            >
              {strategy.isVirtual && '+ '}{strategy.displayCategory}
            </span>
          )}

          <div className="button-group">
            {!isTrashView && (
              <button onClick={(e) => { e.stopPropagation(); actions.setIsNoteOpen(true); }} title="Open Note">
                <CategoryIcon iconName={detectIconFromName('notes')} />
              </button>
            )}

            {isTrashView && (
              <button onClick={(e) => { e.stopPropagation(); strategy.onRestore(); }} title="Restore">
                <CategoryIcon iconName={detectIconFromName('recycle bin')} />
              </button>
            )}

            <button onClick={(e) => { e.stopPropagation(); strategy.onDelete(); }} title="Delete">
              <CategoryIcon iconName={detectIconFromName('close')} />
            </button>
          </div>
        </div>

        {state.isNoteOpen && (
          <TodoNotepad 
            localNote={state.localNote} 
            setLocalNote={actions.setLocalNote} 
            onSave={actions.handleSaveNote} 
            onClose={() => actions.setIsNoteOpen(false)} 
            showSaveToast={state.showSaveToast}
            onExpand={actions.handleExpand}
          />
        )}
      </li>

      {state.showCreateModal && (
        <QuickCategoryModal 
          categoryName={strategy.displayCategory!} 
          isCreating={state.isCreating} 
          error={state.error} 
          onConfirm={actions.handleCreateCategory} 
          onCancel={() => actions.setShowCreateModal(false)} 
        />
      )}
    </>
  );
});

export default TodoItem;