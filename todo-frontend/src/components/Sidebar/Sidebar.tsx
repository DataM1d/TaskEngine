import { useMemo, useState, memo, useEffect, useRef } from 'react';
import SidebarStats from './SidebarStats';
import SidebarDropdown from './SidebarDropdown';
import Toggle from '../ui/Toggle';
import CategoryIcon from '../ui/CategoryIcon';
import { detectIconFromName } from '../../utils/iconDetector';
import './Sidebar.css';
import { Todo, FilterType, SidebarStats as SidebarStatsType, Category } from '../../types/todo';

interface SidebarProps {
  todos: Todo[];
  categories: Category[];
  isDarkMode: boolean;
  setIsDarkMode: (val: boolean) => void;
  onClear: () => void;
  onSelectCategory: (filter: FilterType) => void;
  activeFilter: FilterType;
  onResizeStart: (e: React.MouseEvent) => void; 
  hidden: boolean;
  onToggle: () => void;
  onCreateCategory: (name: string) => Promise<void>;
  onDeleteCategory: (id: string) => Promise<void>;
}

const Sidebar = memo(({
  todos, categories, isDarkMode, setIsDarkMode, onClear, onSelectCategory, activeFilter, onResizeStart, hidden, onToggle, onCreateCategory, onDeleteCategory
}: SidebarProps) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [showCategoryModal, setShowCategoryModal] = useState(false);
  const [categoryName, setCategoryName] = useState('');
  const [isCreating, setIsCreating] = useState(false);
  const [error, setError] = useState('');

  const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null);
  const deleteTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const [openSections, setOpenSections] = useState<string[]>(() => {
    const saved = localStorage.getItem('sidebar_sections_fifo');
    return saved ? JSON.parse(saved) : ["WORKSPACE", "CATEGORIES"]; 
  });

  const modifierKey = useMemo(() => 
    typeof window !== 'undefined' && /Mac|iPod|iPhone|iPad/.test(navigator.platform) ? '⌘' : 'Ctrl', 
  []);

  useEffect(() => {
    localStorage.setItem('sidebar_sections_fifo', JSON.stringify(openSections));
  }, [openSections]);

  useEffect(() => {
    if (showCategoryModal && inputRef.current) {
      inputRef.current.focus();
    }
  }, [showCategoryModal]);

  useEffect(() => {
    return () => {
      if (deleteTimerRef.current) clearTimeout(deleteTimerRef.current);
    }
  }, []);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'l') {
        e.preventDefault(); 
        setIsDarkMode(!isDarkMode);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isDarkMode, setIsDarkMode]);

  const toggleSection = (title: string) => {
    setOpenSections(prev => {
      const isOpen = prev.includes(title);
      
      if (isOpen) {
        return prev.filter(t => t !== title);
      } else {
        const next = [...prev, title];
        if (next.length > 3) {
          next.shift();
        }
        return next;
      }
    });
  };

  const stats = useMemo<SidebarStatsType>(() => {
    return todos.reduce((acc, todo) => {
      if (todo.status === 'deleted') { 
        acc.deleted++; 
      } else {
        acc.total++;
        if (todo.is_completed) acc.completed++; else acc.active++;
        if (todo.is_recovered) acc.recovered++;
        const cat = todo.categories?.name || 'Uncategorized';
        acc.catCounts[cat] = (acc.catCounts[cat] || 0) + 1;
      }
      return acc;
    }, { completed: 0, active: 0, deleted: 0, total: 0, recovered: 0, catCounts: {} } as SidebarStatsType);
  }, [todos]);

  const handleCategoryClick = (cat: FilterType) => {
    onSelectCategory(cat);
    if (window.innerWidth < 768) setIsExpanded(false);
  };

  const handleCreateCategory = async () => {
    if (!categoryName.trim()) {
      setError('Category name cannot be empty');
      return;
    }
    setIsCreating(true);
    setError('');
    try {
      await onCreateCategory(categoryName.trim());
      setCategoryName('');
      setShowCategoryModal(false);
    } catch (err: any) {
      setError(err.message || 'Failed to create category');
    } finally {
      setIsCreating(false);
    }
  };

  const handleDeleteCategory = (e: React.MouseEvent, categoryId: string) => {
    e.stopPropagation();
    if (deleteConfirmId === categoryId) {
      onDeleteCategory(categoryId);
      setDeleteConfirmId(null);
      if (deleteTimerRef.current) clearTimeout(deleteTimerRef.current);
    } else {
      setDeleteConfirmId(categoryId);
      if (deleteTimerRef.current) clearTimeout(deleteTimerRef.current);
      deleteTimerRef.current = setTimeout(() => setDeleteConfirmId(null), 2000);
    }
  };

  const handleModalKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleCreateCategory();
    } else if (e.key === 'Escape') {
      setShowCategoryModal(false);
      setCategoryName('');
    }
  };

  const notesCount = todos.filter(t => t.description?.trim() && t.status !== 'deleted').length;

  const shortcutItems = [
    { label: 'Files', key: 'K' },
    { label: 'Search', key: 'I' },
    { label: 'Sidebar', key: 'B' },
    { label: 'Favorites', key: 'J' },
    { label: 'Appearance', key: 'L' },
  ];

  return (
    <aside className={`sidebar ${isExpanded ? 'expanded' : ''} ${hidden ? 'hidden' : ''}`}>
      <div className="sidebar-profile">
        <div className="profile-info" onClick={() => setIsExpanded(!isExpanded)}>
          <img src="/TodoManager.png" alt="Logo" className="profile-logo" />
          <h2 className="profile-name">TASK MANAGER</h2>
          <span className="mobile-chevron">{isExpanded ? '▲' : '▼'}</span>
        </div>
      </div>

      <div className="mobile-content-wrapper">
        <SidebarStats completed={stats.completed} active={stats.active} />

        <div className="sidebar-nav-scroll">
          <SidebarDropdown 
            title="WORKSPACE" 
            isOpen={openSections.includes("WORKSPACE")} 
            onToggle={() => toggleSection("WORKSPACE")}
          >
            <ul className="dropdown-list">
              <li onClick={() => handleCategoryClick('All')} className={`category-item ${activeFilter === 'All' ? 'active' : ''}`}>
                <div className='item-label'>
                  <span className='icon'><CategoryIcon iconName={detectIconFromName('all', isDarkMode)} size={20} /></span>
                  <span className="category-name-text">All Tasks</span>
                </div>
                <div className="item-actions">
                  <span className="count-badge">{stats.total}</span>
                </div>
              </li>

              <li onClick={() => handleCategoryClick('Notes')} className={`category-item ${activeFilter === 'Notes' ? 'active' : ''}`}>
                <div className="item-label">
                  <span className="icon"><CategoryIcon iconName={detectIconFromName('notes', isDarkMode)} size={20} /></span>
                  <span className="category-name-text">Notes</span>
                </div>
                <div className="item-actions">
                  {notesCount > 0 && <span className="count-badge info">{notesCount}</span>}
                </div>
              </li>

              <li onClick={() => handleCategoryClick('Trash')} className={`category-item ${activeFilter === 'Trash' ? 'active' : ''}`}>
                <div className="item-label">
                  <span className="icon"><CategoryIcon iconName={detectIconFromName('trash', isDarkMode)} size={20} /></span>
                  <span className="category-name-text">Trash</span>
                 </div>
                 <div className="item-actions">
                   {stats.deleted > 0 && <span className="count-badge">{stats.deleted}</span>}
                 </div>
               </li>

               <li onClick={() => handleCategoryClick('Recycle Bin')} className={`category-item ${activeFilter === 'Recycle Bin' ? 'active' : ''}`}>
                <div className="item-label">
                  <span className="icon"><CategoryIcon iconName={detectIconFromName('recycle bin', isDarkMode)} size={20} /></span>
                  <span className="category-name-text">Recycle Bin</span>
                </div>
                <div className="item-actions">
                {stats.recovered > 0 && <span className="count-badge info">{stats.recovered}</span>}
                </div>
              </li>
            </ul>
          </SidebarDropdown>

          <SidebarDropdown 
            title="CATEGORIES" 
            isOpen={openSections.includes("CATEGORIES")} 
            onToggle={() => toggleSection("CATEGORIES")}
            actionButton={
              <button
                className="dropdown-action-button"
                onClick={(e) => { e.stopPropagation(); setShowCategoryModal(true); }}
                title="Add new category"
              >
                <span className="plus-icon">+</span>
              </button>
            }
          >
            <ul className="dropdown-list">
              {categories.map(category => (
                <li 
                  key={category.id} 
                  onClick={() => handleCategoryClick(category.name)} 
                  className={`category-item ${activeFilter === category.name ? 'active' : ''} ${deleteConfirmId === category.id ? 'delete-confirm' : ''}`}
                >
                  <div className="item-label">
                    <span className="icon">
                      <CategoryIcon iconName={detectIconFromName(category.name, isDarkMode)} size={20} />
                    </span>
                    <span className="category-name-text">{category.name}</span>
                  </div>
                  <div className="item-actions">
                    <button 
                      className="category-delete-btn-right"
                      onClick={(e) => handleDeleteCategory(e, category.id)}
                      title="Delete category"
                    >
                      -
                    </button>
                    <span className="count-badge">{stats.catCounts[category.name] || 0}</span>
                  </div>
                </li>
              ))}
            </ul>
          </SidebarDropdown>

          <SidebarDropdown
            title="SHORTCUTS"
            isOpen={openSections.includes("SHORTCUTS")}
            onToggle={() => toggleSection("SHORTCUTS")}
          >
            <div className="sidebar-shortcuts-dropdown-content">
              {shortcutItems.map((item) => (
                <div className="shortcut-row" key={item.label}>
                  <div className="item-label">
                    <span className="icon">
                      <CategoryIcon iconName={detectIconFromName(item.label, isDarkMode)} size={20} />
                    </span>
                    <span className="shortcut-label">{item.label}</span>
                  </div>
                  <kbd className="shortcut-key">{modifierKey} + {item.key}</kbd>
                </div>
              ))}
            </div>
          </SidebarDropdown>

          <SidebarDropdown 
            title="UI SETTINGS" 
            isOpen={openSections.includes("UI SETTINGS")} 
            onToggle={() => toggleSection("UI SETTINGS")}
          >
            <div className="settings-item">
              <div className="item-label">
                <span className="icon">
                  <CategoryIcon iconName={isDarkMode ? 'sun' : 'moon'} size={20} />
                </span>
                <span>Dark Mode</span>
              </div>
              <Toggle isOn={isDarkMode} onToggle={() => setIsDarkMode(!isDarkMode)} />
            </div>
          </SidebarDropdown>
        </div>

        <div className="sidebar-footer">
          {stats.completed > 0 && <button className="clear-btn" onClick={onClear}>Clear {stats.completed} Completed</button>}
        </div>
      </div>

      <div className="sidebar-resizer" onMouseDown={onResizeStart} />
      
      {showCategoryModal && (
        <div className="category-modal-overlay" onClick={() => setShowCategoryModal(false)}>
          <div className="category-modal manager-glass" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3 className="category-modal-title">Manage Categories</h3>
              <button className="close-x" onClick={() => setShowCategoryModal(false)}></button>
            </div>

            <div className="modal-section">
              <div className="category-input-wrapper">
                <input 
                  ref={inputRef}
                  type="text"
                  className="category-modal-input"
                  placeholder="New category name..."
                  value={categoryName}
                  onChange={(e) => setCategoryName(e.target.value)}
                  onKeyDown={handleModalKeyDown}
                />
                <button
                  className='add-inline-btn'
                  onClick={handleCreateCategory}
                  disabled={isCreating || !categoryName.trim()}
                >
                  {isCreating ? '...' : '+'}
                </button>
              </div>
              {error && <div className='category-modal-error'>{error}</div>}
            </div>


            <div className="category-manager-list">
              {categories.map(cat => (
                <div key={cat.id} className='manager-row'>
                  <div className="manager-info">
                    <span className="manager-icon"><CategoryIcon iconName={detectIconFromName(cat.name, isDarkMode)} size={10} /></span>
                    <span className="manager-name">{cat.name}</span>
                  </div>
                  <button 
                    className={`manager-delete-btn ${deleteConfirmId === cat.id ? 'confirming' : ''}`}
                    onClick={(e) => handleDeleteCategory(e, cat.id)}
                  >
                    {deleteConfirmId === cat.id ? 'confirms' : 'x'}
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </aside>
  );
});

Sidebar.displayName = 'Sidebar';
export default Sidebar;