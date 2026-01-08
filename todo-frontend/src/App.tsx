import { useState } from 'react';
import useTodos from './hooks/useTodos';
import Sidebar from './components/Sidebar/Sidebar';
import MainContent from './components/MainContent/MainContent';
import './App.css';

export default function App() {
  const { 
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
    deleteAllTrash 
  } = useTodos();

  const [isDarkMode, setIsDarkMode] = useState(false);

  const categories = Array.from(
    new Set(
      todos
        .map(t => t.categories?.name)
        .filter((name): name is string => !!name)
    )
  );

  return (
    <div className={`app-wrapper ${isDarkMode ? 'dark-mode' : ''}`}>
      <div className='dashboard-container'>
        <Sidebar 
          todos={todos} 
          categories={categories}
          isDarkMode={isDarkMode} 
          setIsDarkMode={setIsDarkMode}
          onClear={clearCompleted}
          onSelectCategory={setActiveFilter}
          activeFilter={activeFilter}
        />
        <MainContent 
          filter={activeFilter}
          onAdd={(title) => addTodo(title, activeFilter)} 
          setFilter={setActiveFilter}
          filteredTodos={filteredTodos}
          updateTodo={updateTodo}
          deleteTodo={deleteTodo}
          restoreTodo={restoreTodo}
          deleteAll={deleteAllTrash} 
          loading={loading}
        />
      </div>
    </div>
  );
}