import { ReactNode } from 'react';
import './SidebarDropdown.css';


interface SidebarDropdownProps {
  title: string;
  children: ReactNode;
  isOpen: boolean;
  onToggle: () => void;
  actionButton?: ReactNode;
}

export default function SidebarDropdown({ title, children, isOpen, onToggle, actionButton }: SidebarDropdownProps) {
  return (
    <section className="dropdown-section">
      <div 
        className="dropdown-header" 
        onClick={onToggle} 
        role="button"
        aria-expanded={isOpen}
      >
        <span className="dropdown-title">{title}</span>
        
        <div className="dropdown-header-actions">
          {actionButton}
          <span className={`chevron ${isOpen ? 'open' : ''}`}>
             ▼
          </span>
        </div>
      </div>
      
      <div className={`dropdown-container ${isOpen ? 'show' : ''}`}>
        <div className="dropdown-content">
          {children}
        </div>
      </div>
    </section>
  );
}