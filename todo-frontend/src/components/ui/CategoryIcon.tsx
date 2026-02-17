import React from 'react';
import * as LucideIcons from 'react-icons/lu';

interface CategoryIconProps {
  iconName: string;
  size?: number;
  className?: string;
}

const CategoryIcon: React.FC<CategoryIconProps> = ({ iconName, size = 20, className = "" }) => {
  const formatIconName = (name: string) => {
    const pascal = name
      .split('-')
      .map(part => part.charAt(0).toUpperCase() + part.slice(1))
      .join('');
    return `Lu${pascal}`;
  }

  const IconComponentName = formatIconName(iconName);
  const IconComponent = (LucideIcons as any)[IconComponentName];

  if (!IconComponent) {
    return <LucideIcons.LuFolder size={size} className={className} stroke="currentColor" />;
  }

  return <IconComponent size={size} className={className} stroke="currentColor" />;
};

export default CategoryIcon;