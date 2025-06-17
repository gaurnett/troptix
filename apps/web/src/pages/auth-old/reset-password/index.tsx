'use client';

export const metadata = {
  title: 'Sign Up - Simple',
  description: 'Page description',
};

import { TropTixContext } from '@/components/AuthProvider';
import { resetPassword } from '@/firebase/auth';
import { Button, Form, message } from 'antd';
import { useRouter } from 'next/router';
import { useContext, useEffect, useState } from 'react';

export default function ResetPasswordPage() {
  const router = useRouter();
  const [messageApi, contextHolder] = message.useMessage();
  const { user } = useContext(TropTixContext);
  const [email, setEmail] = useState('');

  useEffect(() => {
    if (user?.id) {
      router.push('/');
    }
  }, [router, user]);

  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    setEmail(e.target.value);
  }

  async function onFinish(values: any) {
    const { result, error } = await resetPassword(email);

    if (error) {
      messageApi.open({
        type: 'error',
        content: 'There is an issue with your email. Please try again',
      });
    } else {
      await messageApi.open({
        type: 'success',
        content: 'Email sent successfully',
      });
      router.push('/auth/signin');
    }
  }

  const onFinishFailed = (errorInfo: any) => {};

  return (
    <div>
      {contextHolder}
      {user === undefined || user === null ? (
        <section className="bg-gradient-to-b from-gray-100 to-white">
          <div className="max-w-6xl mx-auto px-4 sm:px-6">
            <div className="pt-32 pb-12 md:pt-40 md:pb-20">
              {/* Page header */}
              <div className="max-w-3xl mx-auto text-center pb-12 md:pb-12">
                <h1 className="h1 mb-4">
                  Let&apos;s get you back up on your feet
                </h1>
                <p className="text-xl text-gray-600">
                  Enter the email address you used when you signed up for your
                  account, and we&apos;ll email you a link to reset your
                  password.
                </p>
              </div>

              {/* Form */}
              <Form
                name="basic"
                onFinish={onFinish}
                onFinishFailed={onFinishFailed}
              >
                <div className="max-w-sm mx-auto">
                  <div className="flex flex-wrap -mx-3 mb-4">
                    <div className="w-full px-3">
                      <label
                        className="block text-gray-800 text-sm font-medium mb-1"
                        htmlFor="email"
                      >
                        Email <span className="text-red-600">*</span>
                      </label>
                      <input
                        onChange={handleChange}
                        id="email"
                        type="email"
                        className="form-input w-full text-gray-800"
                        placeholder="Enter your email address"
                        required
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
                        Send reset link
                      </Button>
                    </div>
                  </div>
                </div>
              </Form>
            </div>
          </div>
        </section>
      ) : (
        <></>
      )}
    </div>
  );
}
