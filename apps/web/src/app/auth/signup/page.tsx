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
import { SignUpFields } from '@/types/auth';
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

async function createUser(body, response) {
  if (body === undefined || body.user === undefined) {
    return response
      .status(500)
      .json({ error: 'No body found in User POST request' });
  }

  try {
    const user = await prisma.users.create({
      data: getPrismaCreateUserQuery(body.user),
    });

    return response
      .status(200)
      .json({ error: null, message: 'Successfully added user' });
  } catch (e) {
    return response.status(500).json({ error: 'Error adding user' });
  }
}

export async function signUpWithEmail(signUpFields: SignUpFields) {
  let result: any, error: any;
  const displayName = signUpFields.firstName + ' ' + signUpFields.lastName;
  try {
    await createUserWithEmailAndPassword(
      auth,
      signUpFields.email,
      signUpFields.password
    ).then(async (result) => {
      await updateProfile(result.user, { displayName });

      const userResult = result.user;
      const user: User = {
        id: userResult.uid,
        firstName: signUpFields.firstName,
        lastName: signUpFields.lastName,
        email: signUpFields.email,
      };

      // await createUser(user);
    });
  } catch (e) {
    error = e;
  }

  return { result, error };
}

export default function SignUpPage() {
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

  // Middleware handles redirecting authenticated users

  const onSubmit = async (values: SignUpFormValues) => {
    try {
      const { result, error } = await signUpWithEmail({
        firstName: values.firstName.trim(),
        lastName: values.lastName.trim(),
        email: values.email,
        confirmEmail: values.confirmEmail,
        password: values.password,
      });

      if (error) {
        toast.error('Failed to create account. Please try again.');
      } else {
        toast.success('Account created successfully!');
        router.push('/');
      }
    } catch (error) {
      console.error('Sign-up error:', error);
      toast.error('Failed to create account. Please try again.');
    }
  };

  const handleGoogleSuccess = () => {
    router.push('/');
  };

  return (
    <>
      {/* Page header */}
      <div className="max-w-3xl mx-auto text-center pb-8">
        <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
          Welcome to TropTix.
        </h1>
        <p className="text-xl text-gray-600">
          Create your account to get started
        </p>
      </div>

      {/* Form */}
      <div className="max-w-md mx-auto">
        <GoogleSignInButton
          text="Continue with Google"
          onSuccess={handleGoogleSuccess}
        />

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
    </>
  );
}
