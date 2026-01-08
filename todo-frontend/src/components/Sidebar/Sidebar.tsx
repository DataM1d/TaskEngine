import { useMemo, useState, memo } from 'react';
import SidebarStats from './SidebarStats';
import SidebarDropdown from './SidebarDropdown';
import Toggle from '../ui/Toggle';
import './Sidebar.css';
import { Todo, FilterType, SidebarStats as SidebarStatsType } from '../../types/todo';

interface SidebarProps {
  todos: Todo[];
  categories: string[];
  isDarkMode: boolean;
  setIsDarkMode: (val: boolean) => void;
  onClear: () => void;
  onSelectCategory: (filter: FilterType) => void;
  activeFilter: FilterType;
}

const Sidebar = memo(({ 
  todos, 
  categories, 
  isDarkMode, 
  setIsDarkMode, 
  onClear, 
  onSelectCategory, 
  activeFilter 
}: SidebarProps) => {
  const [isExpanded, setIsExpanded] = useState(false);
  
  const stats = useMemo<SidebarStatsType>(() => {
    return todos.reduce((acc, todo) => {
      if (todo.status === 'deleted') {
        acc.deleted++;
      } else {
        acc.total++;
        if (todo.is_completed) acc.completed++;
        else acc.active++;
        
        if (todo.is_recovered) acc.recovered++;
        
        const cat = todo.categories?.name || 'Uncategorized';
        acc.catCounts[cat] = (acc.catCounts[cat] || 0) + 1;
      }
      return acc;
    }, { 
      completed: 0, 
      active: 0, 
      deleted: 0, 
      total: 0, 
      recovered: 0, 
      catCounts: {} 
    } as SidebarStatsType);
  }, [todos]);

  const handleCategoryClick = (cat: FilterType) => {
    onSelectCategory(cat);
    if (window.innerWidth < 768) setIsExpanded(false);
  };

  const getCategoryIcon = (name: string) => {
    switch (name.toUpperCase()) {
      case 'PERSONAL': return '👤';
      case 'WORK': return '💼';
      case 'SHOPPING': return '🛒';
      case 'HEALTH': return '💪';
      case 'FINANCE': return '💰';
      case 'URGENT': return '🔥';
      default: return '📁';
    }
  };

  return (
    <aside className={`sidebar ${isExpanded ? 'expanded' : ''}`}>
      <div className="sidebar-profile" onClick={() => setIsExpanded(!isExpanded)}>
        <div className="profile-info">
          <img src="/TodoManager.png" alt="Logo" className="profile-logo" />
          <h2 className="profile-name">TASK MANAGER</h2>
          <span className="mobile-chevron">{isExpanded ? '▲' : '▼'}</span>
        </div>
      </div>

      <div className="mobile-content-wrapper">
        <SidebarStats completed={stats.completed} active={stats.active} />
        <hr className="sidebar-divider" />

        <div className="sidebar-nav-scroll">
          <SidebarDropdown title="WORKSPACE">
            <ul className="dropdown-list">
              <li onClick={() => handleCategoryClick('All')} className={`category-item all-item ${activeFilter === 'All' ? 'active' : ''}`}>
                <div className='item-label'><span className='icon'>📑</span><span>All Tasks</span></div>
                <span className="count-badge">{stats.total}</span>
              </li>
              <li onClick={() => handleCategoryClick('Recovered')} className={`category-item recovered-item ${activeFilter === 'Recovered' ? 'active' : ''}`}>
                <div className="item-label"><span className="icon">🟢</span><span>Recovered</span></div>
                {stats.recovered > 0 && <span className="count-badge success">{stats.recovered}</span>}
              </li>
              <li onClick={() => handleCategoryClick('Trash')} className={`category-item trash-item ${activeFilter === 'Trash' ? 'active' : ''}`}>
                <div className="item-label"><span className="icon">🗑️</span><span>Recycle Bin</span></div>
                {stats.deleted > 0 && <span className="count-badge danger">{stats.deleted}</span>}
              </li>
            </ul>
          </SidebarDropdown>

          <SidebarDropdown title="CATEGORIES">
            <ul className="dropdown-list">
              {categories.map(catName => (
                <li key={catName} onClick={() => handleCategoryClick(catName)} className={`category-item ${catName.toLowerCase()}-item ${activeFilter === catName ? 'active' : ''}`}>
                  <div className="item-label"><span className="icon">{getCategoryIcon(catName)}</span><span>{catName}</span></div>
                  <span className="count-badge">{stats.catCounts[catName] || 0}</span>
                </li>
              ))}
            </ul>
          </SidebarDropdown>

          <SidebarDropdown title="SETTINGS">
            <div className="settings-item">
              <div className="item-label"><span className="icon">{isDarkMode ? '🌙' : '☀️'}</span><span>Dark Mode</span></div>
              <Toggle isOn={isDarkMode} onToggle={() => setIsDarkMode(!isDarkMode)} />
            </div>
          </SidebarDropdown>
        </div>

        <div className="sidebar-footer">
          {stats.completed > 0 && (
            <button className="clear-btn" onClick={onClear}>
              <span>Clear {stats.completed} Completed</span>
            </button>
          )}
        </div>
      </div>
    </aside>
  );
});

Sidebar.displayName = 'Sidebar';
export default Sidebar;