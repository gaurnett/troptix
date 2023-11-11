import { CustomInput, CustomTextArea } from "@/components/ui/input";
import Link from "next/link";
import { useState } from "react";
import { UploadOutlined } from '@ant-design/icons';
import type { UploadProps } from 'antd';
import { message, Upload, Image, Button } from 'antd';
import { RcFile } from "antd/es/upload";
import { uploadFlyerToFirebase } from '@/firebase/storage';
import { getDownloadURL, UploadTask } from "firebase/storage";

const { Dragger } = Upload;

export default function DetailsPage({ event, setEvent }) {
  function handleChange(event: React.ChangeEvent<HTMLInputElement>) {
    setEvent(previousEvent => ({
      ...previousEvent,
      [event.target.name]: event.target.value,
    }))
  }

  const props: UploadProps = {
    name: 'file',
    multiple: false,
    listType: 'picture',
    maxCount: 1,
    async onChange(info) {
      const { status } = info.file;
      if (status === 'done') {
        const rcFile = info.file.originFileObj as RcFile;

        const uploadTask = uploadFlyerToFirebase(info.file.name, rcFile);

        uploadTask.on("state_changed", (snapshot) => {
          const percent = Math.round(
            (snapshot.bytesTransferred / snapshot.totalBytes) * 100
          );
        },
          (err) => {
            message.error(`${info.file.name} file upload failed.`);
          }, () => {
            getDownloadURL(uploadTask.snapshot.ref).then((url) => {
              setEvent(previousEvent => ({
                ...previousEvent,
                ["imageUrl"]: url,
              }))
              message.success(`${info.file.name} file uploaded successfully.`);
            });
          });
      } else if (status === 'error') {
        message.error(`${info.file.name} file upload failed.`);
      }
    },
    onDrop(e) {
      console.log('Dropped files', e.dataTransfer.files);
    },
  };

  return (
    <div className="w-full h-screen md:max-w-md mr-8">
      <form className="">
        <h2 className="text-2xl md:text-3xl font-extrabold leading-tighter tracking-tighter mb-4" data-aos="zoom-y-out">Description & Photo</h2>

        <div className="flex flex-wrap -mx-3 mb-4">
          <div className="w-full px-3">
            <CustomTextArea value={event.summary} name={"summary"} id={"summary"} label={"Event Summary"} rows={3} placeholder={"Add a summary for your event. This will be shown as a snippet when patrons view your event."} handleChange={handleChange} required={true} />
          </div>
        </div>
        <div className="flex flex-wrap -mx-3 mb-4">
          <div className="w-full px-3">
            <CustomTextArea value={event.description} name={"description"} id={"description"} label={"Event Description"} rows={6} placeholder={"Add a full description of your event. This will be presented on your event details page."} handleChange={handleChange} required={true} />
          </div>
        </div>

        <div className="flex flex-wrap -mx-3 mb-12">
          <div className="w-full px-3">
            <label className="block text-gray-800 text-sm font-medium mb-1">Event Flyer</label>

            {
              event.imageUrl ?
                <div className="my-4 mx-auto ">
                  <Image width={200} height={200} style={{ objectFit: 'cover' }} src={event.imageUrl} alt={`${event.name} event flyer`} />
                </div>
                : <></>
            }
            <Upload {...props}>
              <Button icon={<UploadOutlined />}>Click to upload event flyer</Button>
            </Upload>

          </div>
        </div>
      </form>
    </div>
  );
}