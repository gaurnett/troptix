'use client';

export const metadata = {
  title: 'Sign Up - Simple',
  description: 'Page description',
};

import { TropTixContext } from '@/components/WebNavigator';
import { CustomInput } from '@/components/ui/input';
import { signInWithGoogle, signUpWithEmail } from '@/firebase/auth';
import { isInputBad, isValidEmail } from '@/lib/utils';
import { Button, Form, message } from 'antd';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { useContext, useEffect, useState } from 'react';

export type SignUpFields = {
  firstName: string;
  lastName: string;
  email: string;
  confirmEmail: string;
  password: string;
};

export default function SignUpPage() {
  const router = useRouter();
  const [messageApi, contextHolder] = message.useMessage();
  const { user } = useContext(TropTixContext);

  const [signUpFields, setSignUpFields] = useState<SignUpFields>({
    firstName: '',
    lastName: '',
    email: '',
    confirmEmail: '',
    password: '',
  });

  useEffect(() => {
    if (user?.id) {
      router.back();
    }
  }, [router, user]);

  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    setSignUpFields((fields) => ({
      ...fields,
      [e.target.name]: e.target.value,
    }));
  }
  function sanitizeNames() {
    setSignUpFields((prev) => ({
      ...prev,
      [prev.firstName]: prev.firstName.trim(),
      [prev.lastName]: prev.lastName.trim(),
    }));
  }

  function areSignUpFieldsBad(): boolean {
    return (
      isInputBad(signUpFields.firstName) ||
      isInputBad(signUpFields.lastName) ||
      isInputBad(signUpFields.email) ||
      isInputBad(signUpFields.confirmEmail) ||
      isInputBad(signUpFields.password)
    );
  }

  async function onFinish(values: any) {
    if (!isValidEmail(signUpFields.email)) {
      messageApi.open({
        type: 'error',
        content: 'Please Enter a valid email',
      });
      return;
    }

    if (
      String(signUpFields.email).toLowerCase() !==
      String(signUpFields.confirmEmail).toLowerCase()
    ) {
      messageApi.open({
        type: 'error',
        content: 'Emails do not match',
      });
      return;
    }
    sanitizeNames();

    if (areSignUpFieldsBad()) {
      messageApi.open({
        type: 'error',
        content: 'There is an issue signing up. Please try again',
      });
      return;
    }

    const { result, error } = await signUpWithEmail(signUpFields);

    if (error) {
      messageApi.open({
        type: 'error',
        content: 'There is an issue signing up. Please try again',
      });
    }
  }

  const onFinishFailed = (errorInfo: any) => {};

  return (
    <div>
      {contextHolder}
      <section className="bg-gradient-to-b from-gray-100 to-white">
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          <div className="pt-32 pb-12 md:pt-40 md:pb-20">
            {/* Page header */}
            <div className="max-w-3xl mx-auto text-center pb-8">
              <h1 className="h1">Welcome.</h1>
            </div>

            {/* Form */}
            <Form
              name="basic"
              onFinish={onFinish}
              onFinishFailed={onFinishFailed}
            >
              <div className="max-w-md mx-auto">
                <div>
                  <div
                    onClick={signInWithGoogle}
                    className="flex flex-wrap -mx-3"
                  >
                    <div className="w-full px-3">
                      <Button
                        type="default"
                        className="w-full px-6 py-6 shadow-md items-center bg-red-600 hover:bg-red-700 justify-center font-medium inline-flex"
                      >
                        <svg
                          className="w-4 h-4 fill-current text-white opacity-75 shrink-0 mx-4"
                          viewBox="0 0 16 16"
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <path d="M7.9 7v2.4H12c-.2 1-1.2 3-4 3-2.4 0-4.3-2-4.3-4.4 0-2.4 2-4.4 4.3-4.4 1.4 0 2.3.6 2.8 1.1l1.9-1.8C11.5 1.7 9.9 1 8 1 4.1 1 1 4.1 1 8s3.1 7 7 7c4 0 6.7-2.8 6.7-6.8 0-.5 0-.8-.1-1.2H7.9z" />
                        </svg>
                        <span className="flex-auto pl-16 pr-8 -ml-16 text-white">
                          Continue with Google
                        </span>
                      </Button>
                    </div>
                  </div>
                </div>
                <div className="flex items-center my-6">
                  <div
                    className="border-t border-gray-300 grow mr-3"
                    aria-hidden="true"
                  ></div>
                  <div className="text-gray-600 italic">Or</div>
                  <div
                    className="border-t border-gray-300 grow ml-3"
                    aria-hidden="true"
                  ></div>
                </div>
                <div>
                  <div className="flex flex-row -mx-3 mb-4">
                    <div className="w-full px-3">
                      <CustomInput
                        value={signUpFields.firstName}
                        name={'firstName'}
                        id={'firstName'}
                        label={'First Name *'}
                        type={'text'}
                        placeholder={'John'}
                        handleChange={handleChange}
                        required={true}
                      />
                    </div>
                    <div className="w-full px-3">
                      <CustomInput
                        value={signUpFields.lastName}
                        name={'lastName'}
                        id={'lastName'}
                        label={'Last Name'}
                        type={'text'}
                        placeholder={'Doe'}
                        handleChange={handleChange}
                        required={true}
                      />
                    </div>
                  </div>
                  <div className="flex flex-wrap -mx-3 mb-4">
                    <div className="w-full px-3 mb-2">
                      <CustomInput
                        value={signUpFields.email}
                        name={'email'}
                        id={'email'}
                        label={'Email Address *'}
                        type={'text'}
                        placeholder={'johndoe@gmail.com'}
                        handleChange={handleChange}
                        required={true}
                      />
                    </div>
                    <div className="w-full px-3">
                      <CustomInput
                        value={signUpFields.confirmEmail}
                        name={'confirmEmail'}
                        id={'confirmEmail'}
                        label={'Re-type Email Address *'}
                        type={'text'}
                        placeholder={'johndoe@gmail.com'}
                        handleChange={handleChange}
                        required={true}
                      />
                    </div>
                  </div>
                  <div className="flex flex-wrap -mx-3 mb-4">
                    <div className="w-full px-3">
                      <CustomInput
                        value={signUpFields.password}
                        name={'password'}
                        id={'password'}
                        label={'Password *'}
                        type={'text'}
                        placeholder={'Enter your password'}
                        handleChange={handleChange}
                        required={true}
                        password={true}
                      />
                    </div>
                  </div>
                  <div className="flex flex-wrap -mx-3 mt-6">
                    <div className="w-full px-3">
                      <Button
                        htmlType="submit"
                        type="primary"
                        className="w-full px-6 py-6 shadow-md items-center bg-blue-600 hover:bg-blue-700 justify-center font-medium inline-flex"
                      >
                        Sign up
                      </Button>
                    </div>
                  </div>
                  <div className="text-sm text-gray-500 text-center mt-3">
                    By creating an account, you agree to the{' '}
                    <Link className="underline" href="/terms">
                      terms & conditions
                    </Link>
                    , and our{' '}
                    <Link className="underline" href="/privacypolicy">
                      privacy policy
                    </Link>
                    .
                  </div>
                </div>
                <div className="text-gray-600 text-center mt-6">
                  Already using TropTix?{' '}
                  <Link
                    href="/auth/signin"
                    className="text-blue-600 hover:underline transition duration-150 ease-in-out"
                  >
                    Sign in
                  </Link>
                </div>
              </div>
            </Form>
          </div>
        </div>
      </section>
    </div>
  );
}
