
import EventCard from '@/components/EventCard';
import { useRouter } from 'next/router';
import { useCallback, useContext, useEffect, useState } from 'react';
import { SocialMediaAccount, SocialMediaAccountType } from 'troptix-models';
import { GetUsersRequest, getUsers, GetUsersType } from 'troptix-api';
import { TropTixContext } from '@/components/WebNavigator';
import Link from 'next/link';
import { List, Spin, Image, Form, Button, Popconfirm, Drawer, message } from 'antd';
import { CustomInput } from '@/components/ui/input';
import SocialMediaForm from './social-media-form';

export default function AccountDetails({ adminUser, setAdminUser }) {

  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    setAdminUser(previousUser => ({
      ...previousUser,
      [e.target.name]: e.target.value,
    }))
  }

  async function onFinish(values: any) {
  };

  const onFinishFailed = (errorInfo: any) => {
  };

  return (
    <div className="w-full md:max-w-2xl mx-auto">
      <div>
        <Form
          name="basic"
          onFinish={onFinish}
          onFinishFailed={onFinishFailed}>
          <div className="flex flex-wrap -mx-3 mb-4">
            <div className="w-full px-3">
              <CustomInput value={adminUser.name} name={"name"} id={"name"} label={"Name"} type={"text"} placeholder={"John Doe"} handleChange={handleChange} required={true} />
            </div>
          </div>
          <div className="flex flex-wrap -mx-3 mb-4">
            <div className="w-full px-3">
              <CustomInput value={adminUser.email} name={"organizer"} id={"organizer"} label={"Email"} type={"text"} placeholder={"johndoe@gmail.com"} handleChange={handleChange} required={true} />
            </div>
          </div>
          <div className="flex flex-wrap -mx-3 mb-4">
            <div className="w-full px-3">
              <CustomInput value={adminUser.telephoneNumber} name={"organizer"} id={"organizer"} label={"Telephone Number"} type={"text"} placeholder={"1234567890"} handleChange={handleChange} required={true} />
            </div>
          </div>

          <div className="flex flex-wrap -mx-3 mb-4 mt-8">
            <div className="px-3">
              <Button htmlType="submit" type="primary" className="px-6 py-6 shadow-md items-center bg-blue-600 hover:bg-blue-700 justify-center font-medium inline-flex">Save Account Details</Button>
            </div>
          </div>
        </Form>
      </div>
    </div>
  );
}