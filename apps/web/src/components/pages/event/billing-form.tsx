import { Form, message } from 'antd';

import { CustomInput } from '@/components/ui/input';
import { loadStripe } from '@stripe/stripe-js';
const stripeKey = process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY;
const stripePromise = loadStripe(stripeKey ? stripeKey : '');

export default function BillingForm({ checkout, setCheckout }) {
  const [messageApi, contextHolder] = message.useMessage();

  function handleChange(event: React.ChangeEvent<HTMLInputElement>) {
    setCheckout((prevState) => ({
      ...prevState,
      [event.target.name]: event.target.value,
    }));
  }

  const onFinishFailed = (errorInfo: any) => {};

  const onFinish = (values: any) => {};

  return (
    <div className="w-full">
      {contextHolder}
      <div>
        <Form name="basic" onFinish={onFinish} onFinishFailed={onFinishFailed}>
          <h2
            className="text-xl font-bold leading-tighter tracking-tighter mb-4"
            data-aos="zoom-y-out"
          >
            Contact Information
          </h2>

          <div className="flex justify-between">
            <div className="mb-4 mr-1 md:mr-4 w-full">
              <CustomInput
                value={checkout.firstName}
                name={'firstName'}
                id={'firstName'}
                label={'First Name *'}
                type={'text'}
                placeholder={'John'}
                handleChange={handleChange}
                required={true}
              />
            </div>
            <div className="mb-4 ml-1 md:ml-4 w-full">
              <CustomInput
                value={checkout.lastName}
                name={'lastName'}
                id={'lastName'}
                label={'Last Name *'}
                type={'text'}
                placeholder={'Doe'}
                handleChange={handleChange}
                required={true}
              />
            </div>
          </div>
          <div className="flex justify-between">
            <div className="mb-4 w-full">
              <CustomInput
                value={checkout.email}
                name={'email'}
                id={'email'}
                label={'Email *'}
                type={'text'}
                placeholder={'johndoe@gmail.com'}
                handleChange={handleChange}
                required={true}
              />
            </div>
          </div>

          <h2
            className="text-xl font-bold leading-tighter tracking-tighter mb-4"
            data-aos="zoom-y-out"
          >
            Billing Address
          </h2>

          <div className="flex flex-wrap mb-4">
            <div className="w-full">
              <CustomInput
                value={checkout.billingAddress1}
                name={'billingAddress1'}
                id={'billingAddress1'}
                label={'Address *'}
                type={'text'}
                placeholder={'185 Kings Street'}
                handleChange={handleChange}
              />
            </div>
          </div>
          <div className="flex flex-wrap mb-4">
            <div className="w-full">
              <CustomInput
                value={checkout.billingAddress2}
                name={'billingAddress2'}
                id={'billingAddress2'}
                label={'Address 2'}
                type={'text'}
                placeholder={''}
                handleChange={handleChange}
              />
            </div>
          </div>
          <div className="flex justify-between">
            <div className="mb-4 mr-1 md:mr-4 w-full">
              <CustomInput
                value={checkout.billingCity}
                name={'billingCity'}
                id={'billingCity'}
                label={'City *'}
                type={'text'}
                placeholder={'Kingston'}
                handleChange={handleChange}
              />
            </div>
            <div className="mb-4 ml-1 md:ml-4 w-full">
              <CustomInput
                value={checkout.billingZip}
                name={'billingZip'}
                id={'billingZip'}
                label={'Zip/Postal Code *'}
                type={'text'}
                placeholder={'12345'}
                handleChange={handleChange}
              />
            </div>
          </div>
          <div className="flex justify-between">
            <div className="mb-4 mr-1 md:mr-4 w-full">
              <CustomInput
                value={checkout.billingState}
                name={'billingState'}
                id={'billingState'}
                label={'State/Parish *'}
                type={'text'}
                placeholder={'Kingston'}
                handleChange={handleChange}
              />
            </div>
            <div className="mb-4 ml-1 md:ml-4 w-full">
              <CustomInput
                value={checkout.billingCountry}
                name={'billingCountry'}
                id={'billingCountry'}
                label={'Country *'}
                type={'text'}
                placeholder={'Jamaica'}
                handleChange={handleChange}
              />
            </div>
          </div>
        </Form>
      </div>
    </div>
  );
}
