import { useState, useRef } from 'react';
import { useTodoContext } from '../../context/TodoContext';
import { FilterType } from '../../types/todo';
import CategoryIcon from '../ui/CategoryIcon';
import { detectIconFromName } from '../../utils/iconDetector';

interface CategorySectionProps {
  isDarkMode: boolean;
  activeFilter: FilterType;
  onSelect: (filter: FilterType) => void;
}

export default function CategorySection({ isDarkMode, activeFilter, onSelect }: CategorySectionProps) {
  const { categories, deleteCategory, todos } = useTodoContext();
  const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const handleDelete = (e: React.MouseEvent, id: string) => {
    e.stopPropagation();
    if (deleteConfirmId === id) {
      deleteCategory(id);
      setDeleteConfirmId(null);
    } else {
      setDeleteConfirmId(id);
      if (timerRef.current) clearTimeout(timerRef.current);
      timerRef.current = setTimeout(() => setDeleteConfirmId(null), 2000);
    }
  };

  return (
    <ul className="dropdown-list">
      {categories.map(cat => {
        // Calculate count once per category render
        const count = todos.filter(t => t.categories?.name === cat.name && t.status !== 'deleted').length;
        
        return (
          <li 
            key={cat.id} 
            onClick={() => onSelect(cat.name)} 
            className={`category-item ${activeFilter === cat.name ? 'active' : ''} ${deleteConfirmId === cat.id ? 'delete-confirm' : ''}`}
          >
            <div className="item-label">
              <span className="icon">
                <CategoryIcon iconName={detectIconFromName(cat.name, isDarkMode)} size={20} />
              </span>
              <span className="category-name-text">{cat.name}</span>
            </div>
            <div className="item-actions">
              <button className="category-delete-btn-right" onClick={(e) => handleDelete(e, cat.id)}>-</button>
              {count > 0 && <span className="count-badge">{count}</span>}
            </div>
          </li>
        );
      })}
    </ul>
  );
}