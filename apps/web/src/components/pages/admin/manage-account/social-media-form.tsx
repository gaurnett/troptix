import { CustomInput } from "@/components/ui/input";
import { Button, Select } from "antd";
import { useState } from "react";
import { SocialMediaAccountType } from 'troptix-models';

export default function SocialMediaForm({ selectedAccount, setSelectedAccount, saveSocialMediaAccount, onClose }) {
  const [accountLinkPlaceholder, setAccountLinkPlaceholder] = useState("https://www.instagram.com/...");

  function handleChange(event: React.ChangeEvent<HTMLInputElement>) {
    setSelectedAccount(previousUser => ({
      ...previousUser,
      [event.target.name]: event.target.value,
    }))
  }

  function handleSelectChange(value: any) {
    setSelectedAccount(previousUser => ({
      ...previousUser,
      ["socialMediaAccountType"]: value,
    }))

    switch (value) {
      case SocialMediaAccountType.FACEBOOK:
        setAccountLinkPlaceholder("https://facebook.com/...")
        break;
      case SocialMediaAccountType.INSTAGRAM:
        setAccountLinkPlaceholder("https://www.instagram.com/...");
        break;
      case SocialMediaAccountType.TIKTOK:
        setAccountLinkPlaceholder("https://www.tiktok.com/...")
        break;
      case SocialMediaAccountType.TWITTER:
        setAccountLinkPlaceholder("https://twitter.com/...")
        break;
      default:
        setAccountLinkPlaceholder("https://www.instagram.com/...");
    }
  };

  return (
    <div className="md:max-w-md">
      <form>
        <h3 className="text-xl md:text-xl font-extrabold leading-tighter tracking-tighter mb-4" data-aos="zoom-y-out">Social Media Details</h3>
        <div className="flex flex-wrap -mx-3 mb-4">
          <div className="w-screen px-3">
            <label className="block text-gray-800 text-sm font-medium mb-1" htmlFor={"socialMediaAccountType"}>Social Media Account Type</label>
            <Select
              className="sm:w-screen w-full md:w-52 h-12 text-gray-800"
              id="socialMediaAccountType"
              onChange={handleSelectChange}
              value={selectedAccount.socialMediaAccountType}
              placeholder={"Instagram"}
              options={[
                { label: 'Instagram', value: SocialMediaAccountType.INSTAGRAM },
                { label: 'Facebook', value: SocialMediaAccountType.FACEBOOK },
                { label: 'TikTok', value: SocialMediaAccountType.TIKTOK },
                { label: 'Twitter', value: SocialMediaAccountType.TWITTER },
              ]}
            />
          </div>
        </div>
        <div className="flex flex-wrap -mx-3 mb-4">
          <div className="w-screen px-3">
            <CustomInput value={selectedAccount.link} name={"link"} id={"link"} label={"Account Link"} type={"text"} placeholder={accountLinkPlaceholder} handleChange={handleChange} required={true} />
          </div>
        </div>

        <div className="flex flex-wrap -mx-3 mb-4 mt-4">
          <div className="px-3">
            <Button onClick={onClose} className="px-8 py-6 shadow-md items-center justify-center font-medium inline-flex">Discard</Button>
          </div>
          <div className="px-3">
            <Button onClick={saveSocialMediaAccount} type="primary" className="px-8 py-6 shadow-md items-center bg-blue-600 hover:bg-blue-700 justify-center font-medium inline-flex">Save Account</Button>
          </div>
        </div>
      </form>
    </div>
  );
}