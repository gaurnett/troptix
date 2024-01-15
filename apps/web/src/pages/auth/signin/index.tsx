"use client";

import { TropTixContext } from '@/components/WebNavigator';
import { signInWithEmail, signInWithGoogle } from '@/firebase/auth';
import { isInputBad, isValidEmail } from '@/lib/utils';
import { Button, Form, message } from 'antd';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { useContext, useEffect, useState } from 'react';

export default function SignInPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const { user } = useContext(TropTixContext);
  const router = useRouter();
  const [messageApi, contextHolder] = message.useMessage();

  function handleChange(event: React.ChangeEvent<HTMLInputElement>) {
    if (event.target.name === "email") {
      setEmail(event.target.value);
    } else {
      setPassword(event.target.value);
    }
  }

  useEffect(() => {
    if (user?.id) {
      router.back();
    }
  }, [router, user]);

  function areSignUpFieldsBad(): boolean {
    return isInputBad(email)
      || isInputBad(password);
  }

  async function onFinish(values: any) {
    if (!isValidEmail(email)) {
      messageApi.open({
        type: "error",
        content: "Please Enter a valid email",
      });
      return;
    }

    if (areSignUpFieldsBad()) {
      messageApi.open({
        type: "error",
        content: "There is an issue signing in. Please try again",
      });
      return;
    }

    let { result, error } = await signInWithEmail(email, password);

    if (error) {
      messageApi.open({
        type: 'error',
        content: 'There is an issue signing in. Please try again'
      })
    }
  }

  const onFinishFailed = (errorInfo: any) => {
  };

  return (
    <section className="bg-gradient-to-b from-gray-100 to-white">
      {contextHolder}
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        <div className="pt-32 pb-12 md:pt-40 md:pb-20">

          {/* Page header */}
          <div className="max-w-3xl mx-auto text-center pb-8">
            <h1 className="h1">Welcome back.</h1>
          </div>

          {/* Form */}
          <Form
            name="basic"
            onFinish={onFinish}
            onFinishFailed={onFinishFailed}>
            <div className="max-w-md mx-auto">
              <div>
                <div>
                  <div onClick={signInWithGoogle} className="flex flex-wrap -mx-3">
                    <div className="w-full px-3">
                      <Button type='default' className="w-full px-6 py-6 shadow-md items-center bg-red-600 hover:bg-red-700 justify-center font-medium inline-flex">
                        <svg className="w-4 h-4 fill-current text-white opacity-75 shrink-0 mx-4" viewBox="0 0 16 16" xmlns="http://www.w3.org/2000/svg">
                          <path d="M7.9 7v2.4H12c-.2 1-1.2 3-4 3-2.4 0-4.3-2-4.3-4.4 0-2.4 2-4.4 4.3-4.4 1.4 0 2.3.6 2.8 1.1l1.9-1.8C11.5 1.7 9.9 1 8 1 4.1 1 1 4.1 1 8s3.1 7 7 7c4 0 6.7-2.8 6.7-6.8 0-.5 0-.8-.1-1.2H7.9z" />
                        </svg>
                        <span className="flex-auto pl-16 pr-8 -ml-16 text-white">Continue with Google</span>
                      </Button>
                    </div>
                  </div>
                </div>
                <div className="flex items-center my-6">
                  <div className="border-t border-gray-300 grow mr-3" aria-hidden="true"></div>
                  <div className="text-gray-600 italic">Or</div>
                  <div className="border-t border-gray-300 grow ml-3" aria-hidden="true"></div>
                </div>
                <div className="flex flex-wrap -mx-3 mb-4">
                  <div className="w-full px-3">
                    <label className="block text-gray-800 text-sm font-medium mb-1" htmlFor="email">Email</label>
                    <input onChange={handleChange} value={email} name='email' id="email" type="email" className="form-input w-full text-gray-800" placeholder="Enter your email address" required />
                  </div>
                </div>
                <div className="flex flex-wrap -mx-3 mb-4">
                  <div className="w-full px-3">
                    <div className="flex justify-between">
                      <label className="block text-gray-800 text-sm font-medium mb-1" htmlFor="password">Password</label>
                      <Link href="/auth/reset-password" className="text-sm font-medium text-blue-600 hover:underline">Having trouble signing in?</Link>
                    </div>
                    <input onChange={handleChange} value={password} name='password' id="password" type="password" className="form-input w-full text-gray-800" placeholder="Enter your password" required />
                  </div>
                </div>
                <div className="flex flex-wrap -mx-3 mt-6">
                  <div className="w-full px-3">
                    <Button htmlType="submit" type='primary' className="w-full px-6 py-6 shadow-md items-center bg-blue-600 hover:bg-blue-700 justify-center font-medium inline-flex">Sign in</Button>
                  </div>
                </div>
              </div>
              <div className="text-gray-600 text-center mt-6">
                Don&apos;t you have an account? <Link href="/auth/signup" className="text-blue-600 hover:underline transition duration-150 ease-in-out">Sign up</Link>
              </div>
            </div>

          </Form>

        </div>
      </div>
    </section>
  )
}