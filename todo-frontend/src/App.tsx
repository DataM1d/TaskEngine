import { useState, useEffect, useRef, useCallback } from 'react';
import useTodos from './hooks/useTodos';
import Sidebar from './components/Sidebar/Sidebar';
import MainContent from './components/MainContent/MainContent';
import { FilterType } from './types/todo';
import { IoMenuOutline, IoSearchOutline, IoStarOutline, IoFolderOutline } from 'react-icons/io5';
import './App.css';

export default function App() {
  const { 
    todos, categories, filteredTodos, loading, activeFilter, setActiveFilter, 
    addTodo, updateTodo, deleteTodo, restoreTodo, clearCompleted, deleteAllTrash, createCategory, deleteCategory
  } = useTodos();

  const [isDarkMode, setIsDarkMode] = useState(()=> localStorage.getItem('theme') === 'dark');
  const [focusedNoteId, setFocusedNoteId] = useState<string | null>(null);
  
  const MIN_WIDTH = 220;
  const MAX_WIDTH = 320;
  const COLLAPSE_AT = 220;
  const DEFAULT_WIDTH = 220;

  const [sidebarWidth, setSidebarWidth] = useState(DEFAULT_WIDTH);
  const [sidebarHidden, setSidebarHidden] = useState(false);
  const isResizing = useRef(false);
  const frameId = useRef<number | null>(null);

  const toggleSidebar = useCallback(() => {
    setSidebarHidden(prev => {
      const newState = !prev;
      setSidebarWidth(newState ? 0 : DEFAULT_WIDTH);
      return newState;
    });
  }, []);

  const handleSetFilter = useCallback((filter: FilterType, noteId?: string) => {
    setActiveFilter(filter);
    if (noteId) {
      setFocusedNoteId(noteId);
    } else {
      setFocusedNoteId(null);
    }
  }, [setActiveFilter]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'b') {
        e.preventDefault();
        toggleSidebar();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [toggleSidebar]);

  const handleMouseMove = useCallback((e: MouseEvent) => {
    if (!isResizing.current) return;

    if (frameId.current) {
      cancelAnimationFrame(frameId.current);
    }

    frameId.current = requestAnimationFrame(() => {
      const newWidth = e.clientX;
      if (newWidth < COLLAPSE_AT) {
        setSidebarHidden(true);
        setSidebarWidth(0);
      } else if (newWidth >= MIN_WIDTH && newWidth <= MAX_WIDTH) {
        setSidebarHidden(false);
        setSidebarWidth(newWidth);
      }
    });
  }, []);

  const stopResizing = useCallback(() => {
    isResizing.current = false;
    document.removeEventListener('mousemove', handleMouseMove);
    document.removeEventListener('mouseup', stopResizing);
    document.body.classList.remove('is-resizing');
    if (frameId.current) cancelAnimationFrame(frameId.current);
  }, [handleMouseMove]);

  const startResizing = useCallback((e: React.MouseEvent) => {
    e.preventDefault();
    isResizing.current = true;
    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseup', stopResizing);
    document.body.classList.add('is-resizing');
  }, [handleMouseMove, stopResizing]);

  useEffect(() => {
    const theme = isDarkMode ? 'dark' : 'light';
    document.documentElement.setAttribute('data-theme', theme);
    document.documentElement.setAttribute('data-density', 'compact');
    localStorage.setItem('theme', theme);
  }, [isDarkMode]);

  return (
    <div 
      className="app-wrapper"
      data-theme={isDarkMode ? 'dark' : 'light'}
      style={{ '--sidebar-width': `${sidebarWidth}px` } as React.CSSProperties}
    >
      <div className='dashboard-container'>
        <Sidebar 
          todos={todos} 
          categories={categories}
          isDarkMode={isDarkMode} 
          setIsDarkMode={setIsDarkMode}
          onClear={clearCompleted}
          onSelectCategory={handleSetFilter}
          activeFilter={activeFilter}
          onResizeStart={startResizing} 
          hidden={sidebarHidden}
          onToggle={toggleSidebar}
          onCreateCategory={createCategory}
          onDeleteCategory={deleteCategory}
        />
        
        {/* VS CODE STYLE ACTIVITY BAR - Visible only when sidebar is hidden */}
        {sidebarHidden && (
          <div className="activity-bar-vertical">
            <button className="activity-btn toggle-trigger" onClick={toggleSidebar}>
              <IoMenuOutline size={22} />
            </button>
            <div className="activity-spacer" />
            <button className="activity-btn"><IoSearchOutline size={20} /></button>
            <button className="activity-btn"><IoStarOutline size={20} /></button>
            <button className="activity-btn"><IoFolderOutline size={20} /></button>
          </div>
        )}
        
        <MainContent 
          filter={activeFilter}
          focusedNoteId={focusedNoteId}
          onAdd={(title) => addTodo(title, activeFilter)} 
          setFilter={handleSetFilter}
          filteredTodos={filteredTodos}
          allTodos={todos} 
          updateTodo={updateTodo}
          deleteTodo={deleteTodo}
          restoreTodo={restoreTodo}
          deleteAll={deleteAllTrash} 
          loading={loading}
          onCategoryCreated={createCategory}
          onToggleSidebar={toggleSidebar}
        />
      </div>
    </div>
  );
}