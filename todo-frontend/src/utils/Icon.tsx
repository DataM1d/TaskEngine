import React from 'react';
// This pulls every icon from the lucide library so we can find them by string name
import * as LucideIcons from 'lucide-react';

interface IconProps {
  name: string;
  size?: number;
  className?: string;
  color?: string;
}

const Icon: React.FC<IconProps> = ({ name, size = 18, className = '', color = 'currentColor' }) => {
  // Your detector returns kebab-case (trash-2), but Lucide exports PascalCase (Trash2).
  // This little helper converts the string so the library understands it.
  const pascalName = name
    .split('-')
    .map(part => part.charAt(0).toUpperCase() + part.slice(1))
    .join('');

  // Look up the icon in the library, or default to 'FileText' if not found
  const LucideIcon = (LucideIcons as any)[pascalName] || LucideIcons.FileText;

  return <LucideIcon size={size} className={className} color={color} />;
};

export default Icon;