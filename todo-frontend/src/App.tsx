import { TodoProvider } from './context/TodoContext';
import { useSidebar } from './hooks/useSidebar';
import { useTheme } from './hooks/useTheme';
import { useNavigation } from './hooks/useNavigation';

import Sidebar from './components/Sidebar/Sidebar';
import MainContent from './components/MainContent/MainContent';
import { CollapsedNav } from './components/MainContent/CollapsedNav';
import './App.css';

function AppLayout() {
  const { isDarkMode, setIsDarkMode } = useTheme();
  const { width, isHidden, toggle, startResizing } = useSidebar();
  const { activeFilter, focusedNoteId, handleNavigate } = useNavigation();

  const dynamicStyles = { 
    '--sidebar-width': `${width}px` 
  } as React.CSSProperties;

  return (
    <div className={`app-wrapper ${isDarkMode ? 'dark-theme' : 'light-theme'}`} style={dynamicStyles}>
      <div className='dashboard-container'>
        <Sidebar 
          isDarkMode={isDarkMode} 
          setIsDarkMode={setIsDarkMode}
          onSelectCategory={handleNavigate}
          onResizeStart={startResizing} 
          hidden={isHidden}
          onToggle={toggle}
        />
        
        {isHidden && <CollapsedNav onToggle={toggle} />}
        
        <MainContent 
          filter={activeFilter}
          focusedNoteId={focusedNoteId}
          setFilter={handleNavigate}
        />
      </div>
    </div>
  );
}

export default function App() {
  return (
    <TodoProvider>
      <AppLayout />
    </TodoProvider>
  );
}