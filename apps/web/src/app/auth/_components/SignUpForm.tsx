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
import { auth } from '@/config';
import { createUser } from '@/firebase/auth';
import { User } from '@/hooks/types/User';
import { zodResolver } from '@hookform/resolvers/zod';
import { createUserWithEmailAndPassword, updateProfile } from 'firebase/auth';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';
import { z } from 'zod';
import { FormDivider } from '../_components/FormDivider';
import { GoogleSignInButton } from '../_components/GoogleSignInButton';

const signUpSchema = z
  .object({
    firstName: z.string().min(1, 'First name is required').trim(),
    lastName: z.string().min(1, 'Last name is required').trim(),
    email: z.string().email('Please enter a valid email address'),
    confirmEmail: z.string().email('Please enter a valid email address'),
    password: z.string().min(6, 'Password must be at least 6 characters'),
  })
  .refine((data) => data.email === data.confirmEmail, {
    message: "Email addresses don't match",
    path: ['confirmEmail'],
  });

type SignUpFormValues = z.infer<typeof signUpSchema>;

export default function SignUpForm() {
  const router = useRouter();

  const form = useForm<SignUpFormValues>({
    resolver: zodResolver(signUpSchema),
    defaultValues: {
      firstName: '',
      lastName: '',
      email: '',
      confirmEmail: '',
      password: '',
    },
  });

  const onSubmit = async (signUpFields: SignUpFormValues) => {
    try {
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        signUpFields.email,
        signUpFields.password
      );

      const userResult = userCredential.user;
      const displayName = signUpFields.firstName + ' ' + signUpFields.lastName;

      await updateProfile(userResult, { displayName });
      const user: User = {
        id: userResult.uid,
        email: signUpFields.email,
        firstName: signUpFields.firstName,
        lastName: signUpFields.lastName,
      };

      await createUser({
        user,
        onSuccess: () => {
          toast.success('Account created successfully!');
          router.push('/');
        },
        onFailed: () => {
          toast.error('Failed to create account. Please try again.');
        },
      });
    } catch (e: any) {
      console.error('Sign-up error:', e);
      toast.error('Failed to create account. Please try again.');
    }
  };

  return (
    <div>
      {/* Form */}
      <div className="max-w-md mx-auto">
        <GoogleSignInButton text="Continue with Google" />

        <FormDivider />

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="firstName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-gray-800 font-medium">
                      First Name *
                    </FormLabel>
                    <FormControl>
                      <Input placeholder="John" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="lastName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-gray-800 font-medium">
                      Last Name *
                    </FormLabel>
                    <FormControl>
                      <Input placeholder="Doe" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-gray-800 font-medium">
                    Email Address *
                  </FormLabel>
                  <FormControl>
                    <Input
                      type="email"
                      placeholder="john.doe@example.com"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="confirmEmail"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-gray-800 font-medium">
                    Confirm Email Address *
                  </FormLabel>
                  <FormControl>
                    <Input
                      type="email"
                      placeholder="john.doe@example.com"
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
                  <FormLabel className="text-gray-800 font-medium">
                    Password *
                  </FormLabel>
                  <FormControl>
                    <Input
                      type="password"
                      placeholder="Enter a secure password"
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
              {form.formState.isSubmitting
                ? 'Creating account...'
                : 'Create account'}
            </Button>
          </form>
        </Form>

        <div className="text-sm text-gray-500 text-center mt-4">
          By creating an account, you agree to our{' '}
          <Link
            className="underline text-blue-600 hover:text-blue-800"
            href="/terms"
          >
            Terms & Conditions
          </Link>{' '}
          and{' '}
          <Link
            className="underline text-blue-600 hover:text-blue-800"
            href="/privacypolicy"
          >
            Privacy Policy
          </Link>
          .
        </div>

        <div className="text-gray-600 text-center mt-6">
          Already have an account?{' '}
          <Link
            href="/auth/signin"
            className="text-blue-600 hover:underline transition duration-150 ease-in-out font-medium"
          >
            Sign in
          </Link>
        </div>
      </div>
    </div>
  );
}
