import { useState, useCallback } from 'react';
import { useTodoContext } from '../../context/TodoContext';
import TodoInput from './TodoInput';
import TodoItem from '../TodoItem/TodoItem';
import LoadingSkeleton from './LoadingSkeleton';
import { FilterType } from '../../types/todo';
import './TodoArea.css';

interface TodoAreaProps {
  filter: FilterType;
  isTrashView: boolean;
  setFilter: (f: FilterType, id?: string) => void;
}

export default function TodoArea({ filter, isTrashView, setFilter }: TodoAreaProps) {
  const { filteredTodos, loading, addTodo } = useTodoContext();
  const [isAddingFlash, setIsAddingFlash] = useState(false);

  const handleAdd = useCallback(async (title: string) => {
    setIsAddingFlash(true);
    // By passing 'filter', the todoService will auto categorize 
    // the task based on the current active view.
    await addTodo(title, filter); 
    setTimeout(() => setIsAddingFlash(false), 800);
  }, [addTodo, filter]);

  if (loading) return <LoadingSkeleton />;

  return (
    <>
      {!isTrashView && (
        <TodoInput onAdd={handleAdd} isFlashActive={isAddingFlash} />
      )}

      <ul className="todo-list">
        {filteredTodos.length > 0 ? (
          filteredTodos.map((todo) => (
            <TodoItem 
              key={todo.id} 
              todo={todo} 
              setFilter={setFilter} 
              isTrashView={isTrashView} 
            />
          ))
        ) : (
          <div className="empty-state-msg">
            {isTrashView ? "Trash is empty." : "No tasks found in this category."}
          </div>
        )}
      </ul>
    </>
  );
}