import { useState, useEffect, useCallback, useMemo } from 'react';
import { todoService } from '../services/todoService';
import { Todo, FilterType, Category } from '../types/todo';
import { detectCategoryFromTitle } from '../utils/itemTypeDetector';

const useTodos = () => {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [activeFilter, setActiveFilter] = useState<FilterType>('All');

  const fetchTodos = useCallback(async () => {
    setLoading(true);
    try {
      const { data } = await todoService.getAll();
      setTodos((data as unknown as Todo[]) || []);
    } catch (error) {
      console.error('Failed to fetch todos:', error);
    } finally {
      setLoading(false);
    }
  }, []);

  const fetchCategories = useCallback(async () => {
    try {
      const { data } = await todoService.getAllCategories();
      setCategories(data || []);
    } catch (error) {
      console.error('Failed to fetch categories:', error);
    }
  }, []);

  useEffect(() => {
    fetchTodos();
    fetchCategories();
  }, [fetchTodos, fetchCategories]);

 
  const filteredTodos = useMemo(() => {
    return todos.filter((todo) => {
      if (activeFilter === 'Trash') {
        return todo.status === 'deleted';
      }

      if (todo.status === 'deleted') {
        return false;
      }

      if (activeFilter === 'Recycle Bin' || activeFilter === 'Recovered') {
        return todo.is_recovered === true;
      }

      if (activeFilter === 'Notes') {
        return todo.description && todo.description.trim().length > 0;
      }

      if (activeFilter === 'Recovered') {
        return todo.is_recovered === true;
      }

      if (activeFilter !== 'All') {
        return todo.categories?.name === activeFilter;
      }

      return true;
    });
  }, [todos, activeFilter]);

  const addTodo = async (title: string, categoryId: string | null) => {
    try {
      const { data } = await todoService.create(title, categoryId ?? undefined);
      setTodos(prev => [data, ...prev]);
    } catch (error) {
      console.error('Failed to add todo:', error);
    }
  };

const updateTodo = async (id: string, payload: Partial<Todo>) => {
  const previousTodos = [...todos];
  const targetTodo = todos.find(t => t.id === id);
  
  setTodos(prev => prev.map(t => (t.id === id ? { ...t, ...payload } : t)));
  
  try {
    if (payload.category_id && targetTodo) {
      const newCat = categories.find(c => c.id === payload.category_id);
      if (newCat) {
        await todoService.learn(targetTodo.title, newCat.name);
      }
    }

    if ('description' in payload && Object.keys(payload).length === 1) {
      await todoService.updateDescription(id, payload.description as string);
    } else {
      await todoService.update(id, payload);
    }
  } catch (error) {
    setTodos(previousTodos);
  }
 };

  const deleteTodo = async (id: string) => {
    const previousTodos = [...todos];
    const targetTodo = todos.find(t => t.id === id);
    const isAlreadyInTrash = targetTodo?.status === 'deleted';

    if (isAlreadyInTrash) {
      setTodos(prev => prev.filter(t => t.id !== id));
      try {
        await todoService.permanentlyDelete(id);
      } catch {
        setTodos(previousTodos);
      }
    } else {
      setTodos(prev => prev.map(t => (t.id === id ? { ...t, status: 'deleted' } : t)));
      try {
        await todoService.delete(id);
      } catch {
        setTodos(previousTodos);
      }
    }
  };

  const restoreTodo = async (id: string) => {
    const previousTodos = [...todos];
    setTodos(prev => prev.map(t => 
      t.id === id ? { ...t, status: 'active', is_recovered: true } : t
    ));

    try {
      await todoService.restore(id);
    } catch {
      setTodos(previousTodos);
    }
  };

  const clearCompleted = async () => {
    const previousTodos = [...todos];
    const completedIds = todos
      .filter(t => t.is_completed && t.status === 'active')
      .map(t => t.id);
    
    if (completedIds.length === 0) return;

    setTodos(prev => prev.map(t => 
      completedIds.includes(t.id) ? { ...t, status: 'deleted' } : t
    ));

    try {
      await Promise.all(completedIds.map(id => todoService.delete(id)));
    } catch {
      setTodos(previousTodos);
    }
  };

  const deleteAllTrash = async () => {
    const previousTodos = [...todos];
    setTodos(prev => prev.filter(t => t.status !== 'deleted'));
    
    try {
      await todoService.deleteAll();
    } catch {
      setTodos(previousTodos);
    }
  };

  const createCategory = async (name: string) => {
    try {
      const response = await todoService.createCategory(name);
      const newCat = response.data;

    if (newCat) {
      const todosToUpdate = todos.filter(t => 
        !t.category_id && 
        detectCategoryFromTitle(t.title).toUpperCase() === newCat.name.toUpperCase()
      );

      if (todosToUpdate.length > 0) {
        const ids = todosToUpdate.map(t => t.id);
        await todoService.bulkUpdateCategory(ids, newCat.id);
      }

        await fetchCategories();
       await fetchTodos();
      }
    } catch (error) {
      console.error('Failed to create category:', error);
      throw error;
    }
  };

  const deleteCategory = async (id: string) => {
    try {
      await todoService.deleteCategory(id);
      await fetchCategories();
      await fetchTodos();

      if (activeFilter !== 'All' && activeFilter !== 'Trash' && activeFilter !== 'Notes') {
        setActiveFilter('All');
      }
    } catch (error) {
      console.error('Failed to delete category:', error);
    }
  };

  return { 
    todos,
    categories,
    filteredTodos,
    loading, 
    activeFilter,
    setActiveFilter,
    addTodo, 
    updateTodo, 
    deleteTodo, 
    restoreTodo,
    clearCompleted, 
    deleteAllTrash, 
    refreshTodos: fetchTodos,
    refreshCategories: fetchCategories,
    createCategory,
    deleteCategory
  };
};

export default useTodos;