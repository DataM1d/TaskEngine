import React from 'react';
import * as LucideIcons from 'lucide-react';

interface IconProps {
  name: string;
  size?: number;
  className?: string;
  color?: string;
}

const Icon: React.FC<IconProps> = ({ name, size = 18, className = '', color = 'currentColor' }) => {
  const pascalName = name
    .split('-')
    .map(part => part.charAt(0).toUpperCase() + part.slice(1))
    .join('');

  const LucideIcon = (LucideIcons as any)[pascalName] || LucideIcons.FileText;

  return <LucideIcon size={size} className={className} color={color} />;
};

export default Icon;