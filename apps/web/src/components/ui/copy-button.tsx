"use client";

import { Button } from '@/components/ui/button';
import { 
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import { Copy } from 'lucide-react';
import { useCopyToClipboard } from '@/hooks/useCopyToClipboard';

interface CopyButtonProps {
  text: string;
  className?: string;
  size?: "default" | "sm" | "lg" | "icon";
  variant?: "default" | "destructive" | "outline" | "secondary" | "ghost" | "link";
}

export function CopyButton({ 
  text, 
  className = "h-7 w-7", 
  size = "icon", 
  variant = "ghost" 
}: CopyButtonProps) {
  const { copyToClipboard, isCopied } = useCopyToClipboard();

  const handleCopy = () => {
    copyToClipboard(text);
  };

  return (
    <TooltipProvider>
      <Tooltip open={isCopied ? true : undefined}>
        <TooltipTrigger asChild>
          <Button 
            variant={variant} 
            size={size} 
            className={className} 
            onClick={handleCopy}
          >
            <Copy className="h-4 w-4" />
            <span className="sr-only">Copy link</span>
          </Button>
        </TooltipTrigger>
        <TooltipContent>
          <p>{isCopied ? 'Copied!' : 'Copy link'}</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
}