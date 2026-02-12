import React from 'react';
import * as LucideIcons from 'react-icons/lu';

interface CategoryIconProps {
  iconName: string;
  size?: number;
  className?: string;
}

const CategoryIcon: React.FC<CategoryIconProps> = ({ iconName, size = 20, className = "" }) => {
  const formatIconName = (name: string) => {
    // Converts "panel-right" to "PanelRight" or "trash-2" to "Trash2"
    const pascal = name
      .split('-')
      .map(part => part.charAt(0).toUpperCase() + part.slice(1))
      .join('');
    return `Lu${pascal}`;
  };

  const IconComponentName = formatIconName(iconName);
  const IconComponent = (LucideIcons as any)[IconComponentName];

  if (!IconComponent) {
    // Fallback to Folder if the icon name is not found in Lucide
    return <LucideIcons.LuFolder size={size} className={className} />;
  }

  return <IconComponent size={size} className={className} />;
};

export default CategoryIcon;