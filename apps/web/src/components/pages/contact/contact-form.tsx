import { CustomInput, CustomTextArea } from '@/components/ui/input';
import { ContactUsForm } from '@/hooks/types/Contact';
import { PostContactRequest, useCreateContact } from '@/hooks/usePostContact';
import { Button, message } from 'antd';
import { useState } from 'react';

export default function ContactFormPage() {
  const [messageApi, contextHolder] = message.useMessage();
  const mutation = useCreateContact();

  const [contactForm, setContactForm] = useState<ContactUsForm>({
    name: '',
    email: '',
    message: '',
  });

  function handleChange(event: any) {
    setContactForm((contact) => ({
      ...contact,
      [event.target.name]: event.target.value,
    }));
  }

  function sendContactForm() {
    messageApi.open({
      key: 'send-message-loading',
      type: 'loading',
      content: 'Sending Message..',
      duration: 0,
    });

    const postContactRequest: PostContactRequest = {
      requestType: 'CONTACT_US',
      contactUsForm: contactForm,
    };

    mutation.mutate(postContactRequest, {
      onSuccess: () => {
        messageApi.destroy('send-message-loading');
        messageApi.open({
          type: 'success',
          content: 'Successfully sent message.',
        });
        setContactForm({
          name: '',
          email: '',
          message: '',
        });
      },
      onError: (error) => {
        messageApi.destroy('send-message-loading');
        messageApi.open({
          type: 'error',
          content: 'Failed to send message event, please try again.',
        });
      },
    });
  }

  return (
    <section className="relative pb-16">
      {contextHolder}
      {/* Section background (needs .relative class on parent and next sibling elements) */}
      <div
        className="absolute inset-0 bg-gray-100 pointer-events-none"
        aria-hidden="true"
      ></div>
      <div className="absolute left-0 right-0 m-auto w-px p-px h-20 bg-gray-200 transform -translate-y-1/2"></div>
      <div className="absolute left-0 right-0 bottom-0 m-auto w-px p-px h-20 bg-gray-200 transform translate-y-1/2"></div>

      <div className="relative max-w-3xl md:mx-auto px-4 sm:px-6">
        <div className="pt-12 md:pt-20">
          {/* Section header */}
          <div className="max-w-3xl mx-auto text-center mb-8">
            <h1 className="h2">Contact Form</h1>
          </div>

          <div className="flex flex-wrap -mx-3 mb-4">
            <div className="w-full px-3">
              <CustomInput
                value={contactForm.name}
                name={'name'}
                id={'name'}
                label={'Name *'}
                type={'text'}
                placeholder={'John Doe'}
                handleChange={handleChange}
                required={true}
              />
            </div>
          </div>
          <div className="flex flex-wrap -mx-3 mb-4">
            <div className="w-full px-3">
              <CustomInput
                value={contactForm.email}
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

          <div className="flex flex-wrap -mx-3 mb-4">
            <div className="w-full px-3">
              <CustomTextArea
                value={contactForm.message}
                name={'message'}
                id={'message'}
                label={'Message *'}
                rows={6}
                placeholder={'Give us your thoughts...'}
                handleChange={handleChange}
                required={true}
              />
            </div>
          </div>

          <div className="flex flex-wrap -mx-3 mb-4 mt-4">
            <div className="px-3">
              <Button
                onClick={sendContactForm}
                type="primary"
                className="px-8 py-6 shadow-md items-center bg-blue-600 hover:bg-blue-700 justify-center font-medium inline-flex"
              >
                Send Message
              </Button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
