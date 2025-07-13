'use client';

import React from 'react';
import { X } from 'lucide-react';
import clsx from 'clsx';

type BannerType = 'info' | 'warning' | 'success' | 'error';

interface BannerProps {
  type?: BannerType;
  title?: string;
  message?: string | React.ReactNode;
  onDismiss?: () => void;
  className?: string;
  children?: React.ReactNode;
}

const typeStyles: Record<
  BannerType,
  {
    container: string;
    icon: string;
  }
> = {
  info: {
    container: 'bg-blue-100 text-blue-800 border-blue-200',
    icon: 'text-blue-500',
  },
  warning: {
    container: 'bg-yellow-100 text-yellow-800 border-yellow-300',
    icon: 'text-yellow-600',
  },
  success: {
    container: 'bg-green-100 text-green-800 border-green-300',
    icon: 'text-green-600',
  },
  error: {
    container: 'bg-red-100 text-red-800 border-red-300',
    icon: 'text-red-600',
  },
};

export function Banner({
  type = 'info',
  title,
  message,
  onDismiss,
  className,
  children,
}: BannerProps) {
  return (
    <div
      className={clsx(
        'w-full p-4 rounded-md border flex justify-between items-start space-x-4',
        typeStyles[type].container,
        className
      )}
    >
      <div className="flex-1">
        {title && <div className="font-semibold mb-1">{title}</div>}
        <div className="text-sm">{message}</div>
        {children}
      </div>

      {onDismiss && (
        <button onClick={onDismiss} className="mt-1">
          <X size={16} className="opacity-70 hover:opacity-100" />
        </button>
      )}
    </div>
  );
}
