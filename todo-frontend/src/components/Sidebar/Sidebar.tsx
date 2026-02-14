import { useState, memo } from 'react';
import { useTodoContext } from '../../context/TodoContext';
import { FilterType } from '../../types/todo'; // Import your types
import SidebarStats from './SidebarStats';
import SidebarDropdown from './SidebarDropdown';
import SidebarItem from './SidebarItem';
import CategorySection from './CategorySection';
import CategoryModal from '../CategoryManager/CategoryModal';
import './Sidebar.css';

// 1. Strict Interface Definition
interface SidebarProps {
  isDarkMode: boolean;
  setIsDarkMode: (val: boolean) => void;
  onSelectCategory: (filter: FilterType, noteId?: string) => void;
  onResizeStart: (e: React.MouseEvent) => void;
  hidden: boolean;
  onToggle: () => void;
}

const Sidebar = memo(({ 
  isDarkMode, 
  onSelectCategory, 
  onResizeStart, 
  hidden, 
  onToggle 
}: SidebarProps) => {
  // 2. Consume pre-calculated stats from Context
  const { activeFilter, clearCompleted, stats } = useTodoContext();
  const [showModal, setShowModal] = useState(false);

  return (
    <aside className={`sidebar ${hidden ? 'hidden' : ''}`}>
      <div className="sidebar-profile" onClick={onToggle}>
        <img src="/TodoManager.png" alt="Logo" className="profile-logo" />
        <h2 className="profile-name">TASK MANAGER</h2>
      </div>

      <div className="mobile-content-wrapper">
        {/* Pass simplified stats directly */}
        <SidebarStats completed={stats.completed} active={stats.active} />

        <div className="sidebar-nav-scroll">
          <SidebarDropdown title="WORKSPACE" isOpen={true} onToggle={() => {}}>
            <ul className="dropdown-list">
              <SidebarItem 
                label="All Tasks" 
                icon="all" 
                count={stats.total} 
                isActive={activeFilter === 'All'} 
                onClick={() => onSelectCategory('All')} 
                isDarkMode={isDarkMode} 
              />
              <SidebarItem 
                label="Notes" 
                icon="notes" 
                count={stats.notes} 
                isActive={activeFilter === 'Notes'} 
                onClick={() => onSelectCategory('Notes')} 
                isDarkMode={isDarkMode} 
                variant="info" 
              />
              <SidebarItem 
                label="Trash" 
                icon="trash" 
                count={stats.deleted} 
                isActive={activeFilter === 'Trash'} 
                onClick={() => onSelectCategory('Trash')} 
                isDarkMode={isDarkMode} 
              />
            </ul>
          </SidebarDropdown>

          <SidebarDropdown 
            title="CATEGORIES" 
            isOpen={true} 
            onToggle={() => {}}
            actionButton={
              <button className="dropdown-action-button" onClick={() => setShowModal(true)} aria-label="Add Category">
                +
              </button>
            }
          >
            <CategorySection 
              isDarkMode={isDarkMode} 
              activeFilter={activeFilter} 
              onSelect={onSelectCategory} 
            />
          </SidebarDropdown>
        </div>

        <div className="sidebar-footer">
          {stats.completed > 0 && (
            <button className="clear-btn" onClick={clearCompleted}>
              Clear Completed
            </button>
          )}
        </div>
      </div>

      <div className="sidebar-resizer" onMouseDown={onResizeStart} />
      
      {showModal && (
        <CategoryModal 
          isOpen={showModal} 
          onClose={() => setShowModal(false)} 
          isDarkMode={isDarkMode} 
        />
      )}
    </aside>
  );
});

Sidebar.displayName = 'Sidebar';
export default Sidebar;