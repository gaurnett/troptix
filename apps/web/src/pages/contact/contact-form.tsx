import EventCard from "@/components/EventCard";
import { EventType } from "@/types/Event";
import { useRouter } from "next/navigation";
import { Button, Collapse, Divider } from "antd";
import { CustomInput, CustomTextArea } from "@/components/ui/input";
import { useState } from "react";

interface ContactForm {
  name: string;
  email: string;
  message: string;
}

export default function ContactFormPage() {
  const [contactForm, setContactForm] = useState<ContactForm>({
    name: "",
    email: "",
    message: "",
  });

  function handleChange(event: any) {
    setContactForm((contact) => ({
      ...contact,
      [event.target.name]: event.target.value,
    }));
  }

  return (
    <section className="relative pb-16">
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
          <div className="flex flex-wrap -mx-3 mb-4">
            <div className="w-full px-3">
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

          <div className="flex flex-wrap -mx-3 mb-4">
            <div className="w-full px-3">
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

          <div className="flex flex-wrap -mx-3 mb-4 mt-4">
            <div className="px-3">
              <Button
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
