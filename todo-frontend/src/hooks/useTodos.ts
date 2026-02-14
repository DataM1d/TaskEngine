import { useState, useEffect, useCallback, useMemo } from 'react';
import { todoService } from '../services/todoService';
import { Todo, FilterType, Category } from '../types/todo';
import { detectCategoryFromTitle } from '../utils/itemTypeDetector';

const useTodos = () => {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeFilter, setActiveFilter] = useState<FilterType>('All');

  const fetchTodos = useCallback(async () => {
    try {
      const { data } = await todoService.getAll();
      setTodos(data || []);
    } catch (err) { console.error(err); } 
    finally { setLoading(false); }
  }, []);

  const fetchCategories = useCallback(async () => {
    try {
      const { data } = await todoService.getAllCategories();
      setCategories(data || []);
    } catch (err) { console.error(err); }
  }, []);

  useEffect(() => {
    fetchTodos();
    fetchCategories();
  }, [fetchTodos, fetchCategories]);

  const stats = useMemo(() => {
    const activeTodos = todos.filter(t => t.status !== 'deleted');
    return {
      total: activeTodos.length,
      completed: activeTodos.filter(t => t.is_completed).length,
      active: activeTodos.filter(t => !t.is_completed).length,
      deleted: todos.filter(t => t.status === 'deleted').length,
      recovered: todos.filter(t => t.is_recovered).length,
      notes: activeTodos.filter(t => t.description?.trim()).length,
      catCounts: {} 
    };
  }, [todos]);

  const filteredTodos = useMemo(() => {
    return todos.filter((todo) => {
      if (activeFilter === 'Trash') return todo.status === 'deleted';
      if (todo.status === 'deleted') return false; 

      switch (activeFilter) {
        case 'All': return true;
        case 'Notes': return !!todo.description?.trim();
        case 'Recycle Bin':
        case 'Recovered': return todo.is_recovered;
        default: return todo.categories?.name === activeFilter;
      }
    });
  }, [todos, activeFilter]);

  const updateTodo = async(id: string, payload: Partial<Todo>) => {
    const original = [...todos];
    setTodos(prev => prev.map(t => t.id === id ? { ...t, ...payload } : t));

    try {
      const target = original.find(t => t.id === id);
      
      if (payload.category_id && target) {
        const newCat = categories.find(c => c.id === payload.category_id);
        if (newCat) todoService.learn(target.title, newCat.name);
      }

      if ('description' in payload && Object.keys(payload).length === 1) {
        await todoService.updateDescription(id, payload.description as string);
      } else {
        await todoService.update(id, payload);
      }
    } catch (error) {
      setTodos(original); 
    }
  };

  const deleteTodo = async (id: string) => {
    const original = [...todos];
    const target = todos.find(t => t.id === id);
    const isTrash = target?.status === 'deleted';

    setTodos(prev => isTrash ? prev.filter(t => t.id !== id) : prev.map(t => t.id === id ? { ...t, status: 'deleted' } : t));

    try {
      isTrash ? await todoService.permanentlyDelete(id) : await todoService.delete(id);
    } catch {
      setTodos(original); 
    }
  };

  const createCategory = async (name: string) => {
    try {
      const { data: newCat } = await todoService.createCategory(name);
      if (!newCat) return;

      const matchingTodos = todos.filter(t => 
        !t.category_id && detectCategoryFromTitle(t.title).toUpperCase() === newCat.name.toUpperCase()
      );

      if (matchingTodos.length > 0) {
        await todoService.bulkUpdateCategory(matchingTodos.map(t => t.id), newCat.id);
      }

      await Promise.all([fetchCategories(), fetchTodos()]);
    } catch (err) { throw err; }
  };

  return {
    todos, categories, filteredTodos, stats, loading, activeFilter,
    setActiveFilter, updateTodo, deleteTodo, createCategory,
    addTodo: async (title: string, catId: string | null) => {
        const { data } = await todoService.create(title, catId ?? undefined);
        setTodos(prev => [data, ...prev]);
    },
    restoreTodo: async (id: string) => {
      const original = [...todos];
      setTodos(prev => prev.map(t => t.id === id ? { ...t, status: 'active', is_recovered: true } : t));
      try { await todoService.restore(id); } catch { setTodos(original); }
    },
    deleteAllTrash: async () => {
      const original = [...todos];
      setTodos(prev => prev.filter(t => t.status !== 'deleted'));
      try { await todoService.deleteAll(); } catch { setTodos(original); }
    }
  };
}

export default useTodos;