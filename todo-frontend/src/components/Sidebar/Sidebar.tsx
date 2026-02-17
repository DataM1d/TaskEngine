import { useState, memo, useCallback } from 'react';
import { useTodoContext } from '../../context/TodoContext';
import { FilterType } from '../../types/todo';
import SidebarStats from './SidebarStats';
import SidebarDropdown from './SidebarDropdown';
import SidebarItem from './SidebarItem';
import CategoryIcon from '../ui/CategoryIcon';
import CategoryModal from '../CategoryManager/CategoryModal';
import { useKeyboardShortcuts } from '../../hooks/useKeyboardShortcuts';
import './Sidebar.css';

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
  setIsDarkMode,
  onSelectCategory, 
  onResizeStart, 
  hidden, 
  onToggle 
}: SidebarProps) => {
  const { activeFilter, clearCompleted, stats, categories, todos } = useTodoContext();
  const [showModal, setShowModal] = useState(false);
  
  const [openSections, setOpenSections] = useState({
    workspace: true,
    categories: true,
    shortcuts: false,
    settings: false
  });

  const toggleSection = (section: keyof typeof openSections) => {
    setOpenSections(prev => ({ ...prev, [section]: !prev[section] }));
  };

  useKeyboardShortcuts({
    onToggleSidebar: onToggle,
    onFocusInput: () => {
      const input = document.querySelector('.todo-input-field') as HTMLInputElement;
      if (input) input.focus();
    },
    onToggleTheme: () => setIsDarkMode(!isDarkMode),
    onNavigateNotes: () => onSelectCategory('Notes'),
    onNavigateImportant: () => onSelectCategory('All'), 
    onToggleCategories: () => toggleSection('categories'),
  });

  return (
    <aside className={`sidebar ${hidden ? 'hidden' : ''}`}>
      <div className="sidebar-profile" onClick={onToggle}>
        <img src="/TodoManager.png" alt="Logo" className="profile-logo" />
        <h2 className="profile-name">TASK MANAGER</h2>
      </div>

      <div className="mobile-content-wrapper">
        <SidebarStats completed={stats.completed} active={stats.active} />

        <div className="sidebar-separator" aria-hidden="true" />

        <div className="sidebar-nav-scroll">
            <SidebarDropdown 
            title="CATEGORIES" 
            isOpen={openSections.categories} 
            onToggle={() => toggleSection('categories')}
            actionButton={
              <button className="dropdown-action-button" onClick={(e) => { e.stopPropagation(); setShowModal(true); }}>
                +
              </button>
            }
          >
            {categories.map(cat => (
              <SidebarItem
                key={cat.id}
                label={cat.name}
                icon={cat.name}
                count={todos.filter(t => t.categories?.name === cat.name && t.status !== 'deleted').length}
                isActive={activeFilter === cat.name}
                onClick={() => onSelectCategory(cat.name as FilterType)}
                isDarkMode={isDarkMode}
              />
            ))}
          </SidebarDropdown>

          <SidebarDropdown 
            title="WORKSPACE" 
            isOpen={openSections.workspace} 
            onToggle={() => toggleSection('workspace')}
          >
              <SidebarItem 
                label="All Tasks" icon="all" count={stats.total} 
                isActive={activeFilter === 'All'} onClick={() => onSelectCategory('All')} 
                isDarkMode={isDarkMode} 
              />
              <SidebarItem 
                label="Notes" icon="notes" count={stats.notes} 
                isActive={activeFilter === 'Notes'} onClick={() => onSelectCategory('Notes')} 
                isDarkMode={isDarkMode} variant="info" 
              />
              <SidebarItem 
                label="Trash" icon="trash" count={stats.deleted} 
                isActive={activeFilter === 'Trash'} onClick={() => onSelectCategory('Trash')} 
                isDarkMode={isDarkMode} 
              />
          </SidebarDropdown>

          <SidebarDropdown 
            title="SHORTCUTS" 
            isOpen={openSections.shortcuts} 
            onToggle={() => toggleSection('shortcuts')}
          >
            <div className="shortcut-list">
              <div className="shortcut-row">
                <div className="setting-info">
                  <CategoryIcon iconName="sidebar" size={14} />
                  <span>Toggle Sidebar</span>
                </div>
                <kbd className="shortcut-tag">⌘ B</kbd>
              </div>

              <div className="shortcut-row">
                <div className="setting-info">
                  <CategoryIcon iconName="notes" size={14} />
                  <span>Jump to Notes</span>
                </div>
                <kbd className="shortcut-tag">⌘ I</kbd>
              </div>

              <div className="shortcut-row">
                <div className="setting-info">
                  <CategoryIcon iconName="all" size={14} />
                  <span>Show All Tasks</span>
                </div>
                <kbd className="shortcut-tag">⌘ E</kbd>
              </div>

              <div className="shortcut-row">
                <div className="setting-info">
                  <CategoryIcon iconName={isDarkMode ? 'sun' : 'moon'} size={14} />
                  <span>Switch Theme</span>
                </div>
                <kbd className="shortcut-tag">⌘ L</kbd>
              </div>

              <div className="shortcut-row">
                <div className="setting-info">
                  <CategoryIcon iconName="folder" size={14} />
                  <span>List Categories</span>
                </div>
                <kbd className="shortcut-tag">⌘ U</kbd>
              </div>
            </div>
          </SidebarDropdown>

          <SidebarDropdown 
            title="UI SETTINGS" 
            isOpen={openSections.settings} 
            onToggle={() => toggleSection('settings')}
          >
            <div className="settings-row">
              <div className="setting-info">
                <span className="settings-icon">
                  <CategoryIcon
                    iconName={isDarkMode ? 'moon' : 'sun'}
                    size={16}
                  />
                </span>
                <span>{isDarkMode ? 'Dark Mode' : 'Light Mode'}</span>
              </div>
              <label className="toggle-switch">
                <input 
                  type="checkbox" 
                  checked={isDarkMode} 
                  onChange={(e) => setIsDarkMode(e.target.checked)} 
                />
                <span className="slider round"></span>
              </label>
            </div>
          </SidebarDropdown>
        </div>

        <div className="sidebar-footer">
          {stats.completed > 0 && (
            <button className="clear-btn" onClick={clearCompleted}>
              Clear Completed ({stats.completed})
            </button>
          )}
        </div>
      </div>

      <div className="sidebar-resizer" onMouseDown={onResizeStart} />
      
      {showModal && (
        <CategoryModal isOpen={showModal} onClose={() => setShowModal(false)} isDarkMode={isDarkMode} />
      )}
    </aside>
  );
});

Sidebar.displayName = 'Sidebar';
export default Sidebar;