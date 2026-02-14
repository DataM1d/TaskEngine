import { FilterType } from '../../types/todo';
import { IoChevronForwardOutline } from 'react-icons/io5';
import './TodoHeader.css';

interface TodoHeaderProps {
  filter: FilterType;
  taskCount: number;
}

export default function TodoHeader({ filter, taskCount }: TodoHeaderProps) {
  // Logic to determine if the current view is a system workspace or a category
  const systemWorkspaces: string[] = ['All', 'Notes', 'Trash', 'Recycle Bin', 'Recovered'];
  const breadcrumbParent = systemWorkspaces.includes(filter) ? 'Workspace' : 'Categories';

  return (
    <header className="saas-header">
      <div className="saas-header__content">
        <div className="saas-header__left">
          <h1 className="saas-header__title">My To Do List</h1>
        </div>

        <div className="saas-header__right">
          <nav className="saas-header__breadcrumbs" aria-label="Breadcrumb">
            <span className="breadcrumb-item">{breadcrumbParent}</span>
            <IoChevronForwardOutline className="breadcrumb-sep" />
            <span className="breadcrumb-item active">{filter}</span>
            <div className="saas-header__accent-badge">
              {taskCount} {taskCount === 1 ? 'task' : 'tasks'}
            </div>
          </nav>
        </div>
      </div>
    </header>
  );
}