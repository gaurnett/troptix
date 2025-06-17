'use client';

import React from 'react';
import { Button } from '@/components/ui/button';
import { Loader2 } from 'lucide-react';
import { signInWithGoogle } from '@/firebase/auth';
import { toast } from 'sonner';

interface GoogleSignInButtonProps {
  text?: string;
  onSuccess?: () => void;
  disabled?: boolean;
}

export function GoogleSignInButton({ 
  text = "Continue with Google", 
  onSuccess,
  disabled = false 
}: GoogleSignInButtonProps) {
  const [isLoading, setIsLoading] = React.useState(false);

  const handleGoogleSignIn = async () => {
    setIsLoading(true);
    try {
      const { result, error } = await signInWithGoogle();
      
      if (error) {
        toast.error('Failed to sign in with Google. Please try again.');
      } else {
        toast.success('Successfully signed in with Google!');
        onSuccess?.();
      }
    } catch (error) {
      console.error('Google sign-in error:', error);
      toast.error('Failed to sign in with Google. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Button
      type="button"
      variant="outline"
      onClick={handleGoogleSignIn}
      disabled={disabled || isLoading}
      className="w-full h-12 bg-red-600 hover:bg-red-700 text-white border-red-600 hover:border-red-700"
    >
      {isLoading ? (
        <Loader2 className="h-4 w-4 animate-spin" />
      ) : (
        <>
          <svg
            className="w-4 h-4 mr-2 shrink-0"
            viewBox="0 0 16 16"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path 
              fill="currentColor"
              d="M7.9 7v2.4H12c-.2 1-1.2 3-4 3-2.4 0-4.3-2-4.3-4.4 0-2.4 2-4.4 4.3-4.4 1.4 0 2.3.6 2.8 1.1l1.9-1.8C11.5 1.7 9.9 1 8 1 4.1 1 1 4.1 1 8s3.1 7 7 7c4 0 6.7-2.8 6.7-6.8 0-.5 0-.8-.1-1.2H7.9z" 
            />
          </svg>
          {text}
        </>
      )}
    </Button>
  );
}