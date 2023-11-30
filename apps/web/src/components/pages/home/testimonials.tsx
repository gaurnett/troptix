import { CustomInput, CustomTextArea } from "@/components/ui/input";
import { ContactUsForm } from "@/hooks/types/Contact";
import { PostContactRequest, useCreateContact } from "@/hooks/usePostContact";
import { SmileOutlined } from '@ant-design/icons';
import { Button, Result, message } from "antd";
import Image from "next/image";
import { useState } from "react";

export default function Testimonials() {
  const logoSize = 120;
  const [messageApi, contextHolder] = message.useMessage();
  const [contactForm, setContactForm] = useState<ContactUsForm>({
    name: "",
    email: "",
    message: "",
  });
  const mutation = useCreateContact();
  const [isFormSubmitted, setIsFormSubmitted] = useState(false);

  function handleChange(event: any) {
    setContactForm((contact) => ({
      ...contact,
      [event.target.name]: event.target.value,
    }));
  }

  function sendContactForm() {
    messageApi
      .open({
        key: 'send-message-loading',
        type: 'loading',
        content: 'Sending Message..',
        duration: 0,
      });

    const postContactRequest: PostContactRequest = {
      requestType: "CONTACT_US",
      contactUsForm: contactForm
    }

    mutation.mutate(postContactRequest, {
      onSuccess: () => {
        messageApi.destroy('send-message-loading');
        setContactForm({
          name: "",
          email: "",
          message: "",
        });
        setIsFormSubmitted(true);
      },
      onError: (error) => {
        messageApi.destroy('send-message-loading');
        messageApi.open({
          type: "error",
          content: "Failed to send message event, please try again.",
        });
      },
    });
  }


  return (
    <section className="relative">
      {contextHolder}
      {/* Illustration behind content */}
      <div className="absolute left-1/2 transform -translate-x-1/2 bottom-0 pointer-events-none -mb-32" aria-hidden="true">
        <svg width="1760" height="518" viewBox="0 0 1760 518" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <linearGradient x1="50%" y1="0%" x2="50%" y2="100%" id="illustration-02">
              <stop stopColor="#FFF" offset="0%" />
              <stop stopColor="#EAEAEA" offset="77.402%" />
              <stop stopColor="#DFDFDF" offset="100%" />
            </linearGradient>
          </defs>
          <g transform="translate(0 -3)" fill="url(#illustration-02)" fillRule="evenodd">
            <circle cx="1630" cy="128" r="128" />
            <circle cx="178" cy="481" r="40" />
          </g>
        </svg>
      </div>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 mb-16">
        <div className="pt-12 md:pt-20">

          {/* Section header */}
          <div className="max-w-3xl mx-auto text-center mb-8">
            <h2 className="h2 mb-4">TropTix is powered by industry leaders over the world</h2>
            {/* <p className="text-xl text-gray-600" data-aos="zoom-y-out">Arcu cursus vitae congue mauris rhoncus viverra nibh cras pulvinar mattis
              blandit libero cursus mattis.</p> */}
          </div>

          {/* Items */}
          <div className="max-w-sm md:max-w-4xl mx-auto grid gap-2 grid-cols-2 md:grid-cols-3">

            {/* Item */}
            <div className="flex items-center justify-center py-2 md:col-span-1 md:col-auto">
              <Image
                width={logoSize}
                height={logoSize}
                className="w-auto"
                style={{ objectFit: 'contain' }}
                src={"/logos/google.png"}
                alt={"google logo"} />
            </div>

            {/* Item */}
            <div className="flex items-center justify-center py-2 md:col-span-1 md:col-auto">
              <Image
                width={logoSize}
                height={logoSize}
                className="w-auto"
                style={{ objectFit: 'contain' }}
                src={"/logos/stripe.png"}
                alt={"stripe logo"} />
            </div>

            {/* Item */}
            <div className="flex items-center justify-center py-2 mt-4 md:mt-0 col-span-2 md:col-span-1 md:col-auto">
              <Image
                width={logoSize}
                height={logoSize}
                className="w-auto"
                style={{ objectFit: 'contain' }}
                src={"/logos/microsoft.png"}
                alt={"microsoft logo"} />
            </div>

          </div>

          <div className="relative max-w-3xl md:mx-auto sm:px-6">
            {
              isFormSubmitted ?
                <Result
                  icon={<SmileOutlined />}
                  title="Submitted, thank you for your message!"
                />
                :
                <div className="pt-12">
                  <div className="flex flex-wrap mb-4">
                    <div className="w-full">
                      <CustomInput
                        value={contactForm.name}
                        name={"name"}
                        id={"name"}
                        label={"Name *"}
                        type={"text"}
                        placeholder={"John Doe"}
                        handleChange={handleChange}
                        required={true}
                      />
                    </div>
                  </div>
                  <div className="flex flex-wrap mb-4">
                    <div className="w-full">
                      <CustomInput
                        value={contactForm.email}
                        name={"email"}
                        id={"email"}
                        label={"Email *"}
                        type={"text"}
                        placeholder={"johndoe@gmail.com"}
                        handleChange={handleChange}
                        required={true}
                      />
                    </div>
                  </div>

                  <div className="flex flex-wrap mb-4">
                    <div className="w-full">
                      <CustomTextArea
                        value={contactForm.message}
                        name={"message"}
                        id={"message"}
                        label={"Message *"}
                        rows={6}
                        placeholder={"Give us your thoughts..."}
                        handleChange={handleChange}
                        required={true}
                      />
                    </div>
                  </div>

                  <div className="flex flex-wrap mb-4 mt-4">
                    <div className="">
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
            }
          </div>

          {/* Testimonials */}
          {/* <div className="max-w-3xl mx-auto mt-20" data-aos="zoom-y-out">
            <div className="relative flex items-start border-2 border-gray-200 rounded bg-white">
              <div className="text-center px-12 py-8 pt-20 mx-4 md:mx-0">
                <div className="absolute top-0 -mt-8 left-1/2 transform -translate-x-1/2">
                  <svg className="absolute top-0 right-0 -mt-3 -mr-8 w-16 h-16 fill-current text-blue-500" viewBox="0 0 64 64" aria-hidden="true" xmlns="http://www.w3.org/2000/svg">
                    <path d="M37.89 58.338c-2.648-5.63-3.572-10.045-2.774-13.249.8-3.203 8.711-13.383 23.737-30.538l2.135.532c-6.552 10.033-10.532 17.87-11.939 23.515-.583 2.34.22 6.158 2.41 11.457l-13.57 8.283zm-26.963-6.56c-2.648-5.63-3.572-10.046-2.773-13.25.799-3.203 8.71-13.382 23.736-30.538l2.136.533c-6.552 10.032-10.532 17.87-11.94 23.515-.583 2.339.22 6.158 2.41 11.456l-13.57 8.283z" />
                  </svg>
                  <Image className="relative rounded-full" width={96} height={96} alt="Testimonial 01" />
                </div>
                <blockquote className="text-xl font-medium mb-4">
                  “ I love this product and would recommend it to anyone. Could be not easier to use, and our multiple websites are wonderful. We get nice comments all the time. “
                </blockquote>
                <cite className="block font-bold text-lg not-italic mb-1">Darya Finger</cite>
                <div className="text-gray-600">
                  <span>CEO & Co-Founder</span> <a className="text-blue-600 hover:underline" href="#0">@Dropbox</a>
                </div>
              </div>

            </div>
          </div> */}

        </div>
      </div>
    </section>
  )
}