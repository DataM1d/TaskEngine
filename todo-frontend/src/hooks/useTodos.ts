import { useState, useEffect, useCallback, useMemo } from 'react';
import { todoService } from '../services/todoService';
import { Todo, FilterType } from '../types/todo';

const useTodos = () => {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [activeFilter, setActiveFilter] = useState<FilterType>('All');

  const fetchTodos = useCallback(async () => {
    setLoading(true);
    try {
      const { data } = await todoService.getAll();
      setTodos((data as unknown as Todo[]) || []);
    } catch {
      console.error("Failed to fetch todos");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchTodos();
  }, [fetchTodos]);

  const filteredTodos = useMemo(() => {
    return todos.filter((todo) => {
      if (activeFilter === 'Trash') return todo.status === 'deleted';
      if (todo.status === 'deleted') return false;
      if (activeFilter === 'Recovered') return todo.is_recovered === true;
      if (activeFilter !== 'All') return todo.categories?.name === activeFilter;
      return true;
    });
  }, [todos, activeFilter]);

  const addTodo = async (title: string, categoryId: string | null) => {
    try {
      const { data } = await todoService.create(title, categoryId ?? undefined);
      setTodos(prev => [(data as unknown as Todo), ...prev]);
    } catch {
      console.error("Failed to add todo");
    }
  };

  const updateTodo = async (id: string, payload: Partial<Todo>) => {
    const previousTodos = [...todos];
    setTodos(prev => prev.map(t => t.id === id ? { ...t, ...payload } : t));
    try {
      await todoService.update(id, payload);
    } catch {
      setTodos(previousTodos);
    }
  };

  const deleteTodo = async (id: string) => {
    const previousTodos = [...todos];
    const targetTodo = todos.find(t => t.id === id);
    const isAlreadyDeleted = targetTodo?.status === 'deleted';

    if (isAlreadyDeleted) {
      setTodos(prev => prev.filter(t => t.id !== id));
      try {
        await todoService.permanentlyDelete(id);
      } catch {
        setTodos(previousTodos);
      }
    } else {
      setTodos(prev => prev.map(t => t.id === id ? { ...t, status: 'deleted' } : t));
      try {
        await todoService.delete(id);
      } catch {
        setTodos(previousTodos);
      }
    }
  };

  const restoreTodo = async (id: string) => {
    const previousTodos = [...todos];
    setTodos(prev => prev.map(t => t.id === id ? { ...t, status: 'active', is_recovered: true } : t));
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

    setTodos(prev => prev.map(t => completedIds.includes(t.id) ? { ...t, status: 'deleted' } : t));
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

  return { 
    todos,
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
    refreshTodos: fetchTodos 
  };
};

export default useTodos;