'use client';

import { Button } from '@/components/ui/button';
import { auth } from '@/config';
import { createUser } from '@/firebase/auth';
import { User } from '@/hooks/types/User';
import {
  GoogleAuthProvider,
  getAdditionalUserInfo,
  signInWithPopup,
} from 'firebase/auth';
import { Loader2 } from 'lucide-react';
import { useRouter } from 'next/navigation';
import React from 'react';
import { toast } from 'sonner';

interface GoogleSignInButtonProps {
  text?: string;
  onSuccess?: () => void;
  disabled?: boolean;
}

export function GoogleSignInButton({
  text = 'Continue with Google',
  disabled = false,
}: GoogleSignInButtonProps) {
  const [isLoading, setIsLoading] = React.useState(false);
  const route = useRouter();

  const handleGoogleSignIn = async () => {
    setIsLoading(true);
    try {
      signInWithPopup(auth, new GoogleAuthProvider())
        .then(async (result) => {
          const userResult = result.user;
          const additionalInfo = getAdditionalUserInfo(result);

          if (additionalInfo?.isNewUser) {
            const user: User = {
              id: userResult.uid,
              email: userResult.email || '',
            };

            await createUser({
              user,
              onSuccess: () => {
                toast.success('Successfully signed in with Google!');
                route.push('/');
              },
              onFailed: () => {},
            });
          } else {
            toast.success('Successfully signed in with Google!');
            route.push('/');
          }
        })
        .catch((error) => {
          toast.error('Failed to sign in with Google. Please try again.');
        });
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
