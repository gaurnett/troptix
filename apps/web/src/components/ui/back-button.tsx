'use client';

import { useRouter } from 'next/navigation';
import { ArrowLeft } from 'lucide-react';
import { Button, ButtonProps } from '@/components/ui/button';
import { cn } from '@/lib/utils';

interface BackButtonProps extends ButtonProps {
  href?: string;
}

export function BackButton({
  href,
  className,
  children,
  ...props
}: BackButtonProps) {
  const router = useRouter();

  const handleClick = () => {
    if (href) {
      router.push(href);
    } else {
      router.back();
    }
  };

  return (
    <Button
      variant="outline"
      size="sm"
      className={cn('gap-1', className)}
      onClick={handleClick}
      {...props}
    >
      <ArrowLeft className="h-4 w-4" />
      {children ?? 'Back'}
    </Button>
  );
}
