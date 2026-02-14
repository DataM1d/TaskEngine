import { createContext, useContext, ReactNode } from 'react';
import useTodos from '../hooks/useTodos';
import { Todo, Category, FilterType, SidebarStats } from '../types/todo';

// Defining the contract explicitly instead of using ReturnType
interface TodoContextType {
  todos: Todo[];
  categories: Category[];
  filteredTodos: Todo[];
  loading: boolean;
  activeFilter: FilterType;
  stats: SidebarStats; 
  setActiveFilter: (filter: FilterType) => void;
  addTodo: (title: string, categoryId: string | null) => Promise<void>;
  updateTodo: (id: string, payload: Partial<Todo>) => Promise<void>;
  deleteTodo: (id: string) => Promise<void>;
  restoreTodo: (id: string) => Promise<void>;
  clearCompleted: () => Promise<void>;
  deleteAllTrash: () => Promise<void>;
  refreshTodos: () => Promise<void>;
  refreshCategories: () => Promise<void>;
  createCategory: (name: string) => Promise<void>;
  deleteCategory: (id: string) => Promise<void>;
}

const TodoContext = createContext<TodoContextType | undefined>(undefined);

export function TodoProvider({ children }: { children: ReactNode }) {
  const todoState = useTodos();
  
  return (
    <TodoContext.Provider value={todoState as TodoContextType}>
      {children}
    </TodoContext.Provider>
  );
}

export const useTodoContext = () => {
  const context = useContext(TodoContext);
  if (!context) throw new Error("useTodoContext must be used within TodoProvider");
  return context;
};