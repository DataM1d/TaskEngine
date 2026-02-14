import CategoryIcon from '../ui/CategoryIcon';
import { detectIconFromName } from '../../utils/iconDetector';
import './SidebarItem.css'

interface SidebarItemProps {
  label: string;
  icon: string;
  count: number;
  isActive: boolean;
  onClick: () => void;
  isDarkMode: boolean;
  variant?: 'info' | 'default';
}

export default function SidebarItem({ 
  label, icon, count, isActive, onClick, isDarkMode, variant = 'default' 
}: SidebarItemProps) {
  return (
    <li onClick={onClick} className={`category-item ${isActive ? 'active' : ''}`}>
      <div className='item-label'>
        <span className='icon'>
          <CategoryIcon iconName={detectIconFromName(icon, isDarkMode)} size={20} />
        </span>
        <span className="category-name-text">{label}</span>
      </div>
      <div className="item-actions">
        {count > 0 && (
          <span className={`count-badge ${variant === 'info' ? 'info' : ''}`}>
            {count}
          </span>
        )}
      </div>
    </li>
  );
}