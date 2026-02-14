import { IoMenuOutline, IoSearchOutline, IoStarOutline, IoFolderOutline } from 'react-icons/io5';

interface CollapsedNavProps {
  onToggle: () => void;
}

export const CollapsedNav = ({ onToggle }: CollapsedNavProps) => (
  <nav className="activity-bar-vertical">
    <button className="activity-btn" onClick={onToggle} title="Open Sidebar">
      <IoMenuOutline size={22} />
    </button>
    <div className="activity-spacer" />
    <button className="activity-btn" title="Search"><IoSearchOutline size={20} /></button>
    <button className="activity-btn" title="Favorites"><IoStarOutline size={20} /></button>
    <button className="activity-btn" title="Folders"><IoFolderOutline size={20} /></button>
  </nav>
);