'use client';

import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { signInWithEmail } from '@/firebase/auth';
import { zodResolver } from '@hookform/resolvers/zod';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';
import { z } from 'zod';
import { FormDivider } from '../_components/FormDivider';
import { GoogleSignInButton } from '../_components/GoogleSignInButton';

const signInSchema = z.object({
  email: z.string().email('Please enter a valid email address'),
  password: z.string().min(1, 'Password is required'),
});

type SignInFormValues = z.infer<typeof signInSchema>;

export default function SignInForm() {
  const router = useRouter();

  const form = useForm<SignInFormValues>({
    resolver: zodResolver(signInSchema),
    defaultValues: {
      email: '',
      password: '',
    },
  });

  // Middleware handles redirecting authenticated users

  const onSubmit = async (values: SignInFormValues) => {
    try {
      const { result, error } = await signInWithEmail(
        values.email,
        values.password
      );

      if (error) {
        toast.error('Invalid email or password. Please try again.');
      } else {
        toast.success('Successfully signed in!');
        router.push('/');
      }
    } catch (error) {
      console.error('Sign-in error:', error);
      toast.error('Failed to sign in. Please try again.');
    }
  };

  return (
    <div className="max-w-md mx-auto">
      <GoogleSignInButton />

      <FormDivider />

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-gray-800 font-medium">
                  Email
                </FormLabel>
                <FormControl>
                  <Input
                    type="email"
                    placeholder="Enter your email address"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="password"
            render={({ field }) => (
              <FormItem>
                <div className="flex justify-between items-center">
                  <FormLabel className="text-gray-800 font-medium">
                    Password
                  </FormLabel>
                  <Link
                    href="/auth/reset-password"
                    className="text-sm font-medium text-blue-600 hover:underline"
                  >
                    Forgot password?
                  </Link>
                </div>
                <FormControl>
                  <Input
                    type="password"
                    placeholder="Enter your password"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <Button
            type="submit"
            className="w-full h-12 bg-blue-600 hover:bg-blue-700 text-white font-medium"
            disabled={form.formState.isSubmitting}
          >
            {form.formState.isSubmitting ? 'Signing in...' : 'Sign in'}
          </Button>
        </form>
      </Form>

      <div className="text-gray-600 text-center mt-6">
        Don&apos;t have an account?{' '}
        <Link
          href="/auth/signup"
          className="text-blue-600 hover:underline transition duration-150 ease-in-out font-medium"
        >
          Sign up
        </Link>
      </div>
    </div>
  );
}
