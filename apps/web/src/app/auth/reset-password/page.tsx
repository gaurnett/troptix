'use client';

import React from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { toast } from 'sonner';
import { resetPassword } from '@/firebase/auth';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { ArrowLeft } from 'lucide-react';

const resetPasswordSchema = z.object({
  email: z.string().email('Please enter a valid email address'),
});

type ResetPasswordFormValues = z.infer<typeof resetPasswordSchema>;

export default function ResetPasswordPage() {
  const router = useRouter();

  const form = useForm<ResetPasswordFormValues>({
    resolver: zodResolver(resetPasswordSchema),
    defaultValues: {
      email: '',
    },
  });

  // Middleware handles redirecting authenticated users

  const onSubmit = async (values: ResetPasswordFormValues) => {
    try {
      const { result, error } = await resetPassword(values.email);

      if (error) {
        toast.error(
          'Failed to send reset email. Please check your email address and try again.'
        );
      } else {
        toast.success(
          'Password reset email sent! Check your inbox for further instructions.'
        );
        // Redirect to sign-in page after successful reset
        setTimeout(() => {
          router.push('/auth/signin');
        }, 2000);
      }
    } catch (error) {
      console.error('Password reset error:', error);
      toast.error('Failed to send reset email. Please try again.');
    }
  };

  return (
    <>
      {/* Back button */}
      <div className="max-w-sm mx-auto mb-8">
        <Link
          href="/auth/signin"
          className="inline-flex items-center text-blue-600 hover:text-blue-800 transition-colors"
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to sign in
        </Link>
      </div>

      {/* Page header */}
      <div className="max-w-3xl mx-auto text-center pb-8">
        <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
          Reset your password
        </h1>
        <p className="text-xl text-gray-600 max-w-2xl mx-auto">
          Enter the email address associated with your account and we&apos;ll
          send you a link to reset your password.
        </p>
      </div>

      {/* Form */}
      <div className="max-w-sm mx-auto">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
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
                      placeholder="Enter your email address"
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
              {form.formState.isSubmitting ? 'Sending...' : 'Send reset link'}
            </Button>
          </form>
        </Form>

        <div className="text-gray-600 text-center mt-6">
          Remember your password?{' '}
          <Link
            href="/auth/signin"
            className="text-blue-600 hover:underline transition duration-150 ease-in-out font-medium"
          >
            Sign in
          </Link>
        </div>
      </div>
    </>
  );
}
