import { FilterType } from '../../types/todo';

interface TodoTabsProps {
  activeFilter: FilterType;
  setFilter: (filter: FilterType) => void;
}

export default function TodoTabs({ activeFilter, setFilter }: TodoTabsProps) {
  const tabs: FilterType[] = ['All', 'Trash'];

  return (
    <nav className="filter-tabs">
      {['All', 'Trash'].map(tab => (
        <button
          key={tab}
          onClick={() => setFilter(tab)}
          className={activeFilter === tab ? 'active' : ''}
          >
            {tab}
          </button>
      ))}
    </nav>
  );
}