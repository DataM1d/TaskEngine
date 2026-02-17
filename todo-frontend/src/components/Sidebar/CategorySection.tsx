import { useState, useRef } from 'react';
import { useTodoContext } from '../../context/TodoContext';
import { FilterType } from '../../types/todo';
import SidebarItem from './SidebarItem';

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
    <>
      {categories.map(cat => {
        const count = todos.filter(t => t.categories?.name === cat.name && t.status !== 'deleted').length;
        
        return (
          <SidebarItem
            key={cat.id}
            label={cat.name}
            icon={cat.name}
            count={count}
            isActive={activeFilter === cat.name}
            onClick={(() => onSelect(cat.name))}
            isDarkMode={isDarkMode}
          />
        );
      })}
    </>
  );
}