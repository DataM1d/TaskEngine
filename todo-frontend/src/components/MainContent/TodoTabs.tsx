import { FilterType } from '../../types/todo';
import './TodoTabs.css';

interface TodoTabsProps {
  activeFilter: FilterType;
  setFilter: (filter: FilterType) => void;
}

export default function TodoTabs({ activeFilter, setFilter }: TodoTabsProps) {
  const tabs: FilterType[] = ['All', 'Notes', 'Trash'];

  return (
    <nav className="filter-tabs">
      {tabs.map(tab => (
        <button
          key={tab}
          onClick={() => setFilter(tab)}
          className={activeFilter === tab ? 'active' : ''}
          aria-current={activeFilter === tab ? 'page' : undefined}
        >
          {tab}
        </button>
      ))}
    </nav>
  );
}