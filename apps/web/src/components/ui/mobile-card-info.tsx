import React from 'react';
import { LucideIcon } from 'lucide-react';

interface MobileCardInfoRowProps {
  icon: LucideIcon;
  iconColor?: string;
  content: string | React.ReactNode;
  className?: string;
}

export const MobileCardInfoRow: React.FC<MobileCardInfoRowProps> = ({
  icon: Icon,
  iconColor = 'text-muted-foreground',
  content,
  className = 'text-sm text-muted-foreground',
}) => {
  return (
    <div className={`flex items-center gap-3 ${className}`}>
      <Icon className={`h-4 w-4 ${iconColor}`} />
      <span className="truncate">{content}</span>
    </div>
  );
};

interface MobileCardInfoRowLargeProps {
  icon: LucideIcon;
  iconColor?: string;
  content: string | React.ReactNode;
  className?: string;
}

export const MobileCardInfoRowLarge: React.FC<MobileCardInfoRowLargeProps> = ({
  icon: Icon,
  iconColor = 'text-muted-foreground',
  content,
  className = 'font-semibold text-base',
}) => {
  return (
    <div className={`flex items-center gap-3`}>
      <Icon className={`h-5 w-5 ${iconColor}`} />
      <span className={`truncate ${className}`}>{content}</span>
    </div>
  );
};