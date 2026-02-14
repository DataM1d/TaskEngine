import { useState, useCallback, useMemo } from 'react';
import { useTodoContext } from '../../context/TodoContext';
import { Todo, FilterType } from '../../types/todo';
import { detectCategoryFromTitle } from '../../utils/itemTypeDetector';

export function useTodoItem(todo: Todo, setFilter: (f: FilterType, id?: string) => void) {
  const { updateTodo, deleteTodo, restoreTodo, createCategory } = useTodoContext();
  
  const [isNoteOpen, setIsNoteOpen] = useState(false);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [isCreating, setIsCreating] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [localNote, setLocalNote] = useState(todo.description || '');
  const [showSaveToast, setShowSaveToast] = useState(false);

  const displayCategory = useMemo(() => {
    if (todo.categories?.name) return todo.categories.name;
    const detected = detectCategoryFromTitle(todo.title);
    return detected !== 'OTHER' ? detected : null;
  }, [todo.categories, todo.title]);

  const isVirtual = !todo.category_id;
  const isTrash = todo.status === 'deleted';

  // --- Logic Strategy ---
  // Senior Move: Define the "intent" of the item actions here.
  const strategy = useMemo(() => ({
    onMainClick: isTrash ? undefined : () => updateTodo(todo.id, { is_completed: !todo.is_completed }),
    onDelete: () => deleteTodo(todo.id),
    onRestore: () => restoreTodo(todo.id),
    onBadgeClick: isVirtual ? () => setShowCreateModal(true) : () => setFilter(displayCategory as FilterType),
    isTrash,
    isVirtual,
    displayCategory
  }), [isTrash, isVirtual, displayCategory, todo.id, todo.is_completed, updateTodo, deleteTodo, restoreTodo, setFilter]);

  const handleSaveNote = useCallback(() => {
    updateTodo(todo.id, { description: localNote });
    setShowSaveToast(true);
    setTimeout(() => setShowSaveToast(false), 2000);
  }, [localNote, todo.id, updateTodo]);

  const handleCreateCategory = async () => {
    setIsCreating(true);
    try {
      await createCategory(displayCategory!);
      setShowCreateModal(false);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setIsCreating(false);
    }
  };

  return {
    state: { isNoteOpen, showCreateModal, isCreating, error, localNote, showSaveToast, strategy },
    actions: { 
      setIsNoteOpen, 
      setShowCreateModal, 
      setLocalNote, 
      handleSaveNote, 
      handleCreateCategory,
      handleExpand: () => {
        handleSaveNote();
        setFilter('Notes' as FilterType, todo.id);
      }
    }
  };
}