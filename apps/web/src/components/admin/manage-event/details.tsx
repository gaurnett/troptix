import { CustomInput, CustomTextArea } from "@/components/ui/input";
import { UploadOutlined } from "@ant-design/icons";
import type { UploadProps } from "antd";
import { message, Upload, Image, Button, Form } from "antd";
import { RcFile } from "antd/es/upload";
import { uploadFlyerToFirebase } from "@/firebase/storage";
import { getDownloadURL } from "firebase/storage";
import { useState } from "react";

export default function DetailsPage({ event, setEvent, updateEvent }) {
  const [file, setFile] = useState<any>();

  // Handles input change event and updates state
  function handleUploadChange(event) {
    setFile(event.target.files[0]);
  }

  function handleUpload() {
    if (!file) {
      alert("Please choose a file first!");
      return;
    }
    const uploadTask = uploadFlyerToFirebase(event.id, file.name, file);
    message
      .open({
        key: 'update-flyer-loading',
        type: 'loading',
        content: 'Uploading Flyer..',
        duration: 0,
      });

    uploadTask.on(
      "state_changed",
      (snapshot) => {
        const percent = Math.round(
          (snapshot.bytesTransferred / snapshot.totalBytes) * 100
        );
        console.log("Percentage: " + percent);
      },
      (err) => {
        console.log("Storage Error: " + JSON.stringify(err));
        message.destroy('update-flyer-loading');
        message.error(`${file.name} file upload failed.`);
      },
      () => {
        console.log("Get download URL");
        getDownloadURL(uploadTask.snapshot.ref).then((url) => {
          setEvent((previousEvent) => ({
            ...previousEvent,
            ["imageUrl"]: url,
          }));

          message.destroy('update-flyer-loading');
          message.success(`${file.name} file uploaded successfully.`);
        });
      }
    );
  }

  function handleChange(event: React.ChangeEvent<HTMLInputElement>) {
    setEvent((previousEvent) => ({
      ...previousEvent,
      [event.target.name]: event.target.value,
    }));
  }

  const props: UploadProps = {
    name: "file",
    multiple: false,
    listType: "picture",
    maxCount: 1,
    action: '/api/noop',
    // headers: {
    //   "authorization": "authorization-text",
    //   "Access-Control-Allow-Methods": "POST",
    //   "Access-Control-Allow-Headers": "X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version",
    //   'Content-Type': 'multipart/form-data',
    // },
    async onChange(info) {
      const { status } = info.file;
      console.log("Status: " + status);
      if (status === "done") {
        const rcFile = info.file.originFileObj as RcFile;

        const uploadTask = uploadFlyerToFirebase(event.id, info.file.name, rcFile);
        message
          .open({
            key: 'update-flyer-loading',
            type: 'loading',
            content: 'Uploading Flyer..',
            duration: 0,
          });

        uploadTask.on(
          "state_changed",
          (snapshot) => {
            const percent = Math.round(
              (snapshot.bytesTransferred / snapshot.totalBytes) * 100
            );
            console.log("Percentage: " + percent);
          },
          (err) => {
            console.log("Storage Error: " + JSON.stringify(err));
            message.destroy('update-flyer-loading');
            message.error(`${info.file.name} file upload failed.`);
          },
          () => {
            console.log("Get download URL");
            getDownloadURL(uploadTask.snapshot.ref).then((url) => {
              setEvent((previousEvent) => ({
                ...previousEvent,
                ["imageUrl"]: url,
              }));

              message.destroy('update-flyer-loading');
              message.success(`${info.file.name} file uploaded successfully.`);
            });
          }
        );
      } else if (status === "error") {
        console.log("Error Type: " + JSON.stringify(info))
        message.error(`${info.file.name} file upload failed.`);
      }
    },
    onDrop(e) {
      console.log("Drop: " + JSON.stringify(e))
    },
  };

  return (
    <div className="w-full h-screen md:max-w-md mr-8">
      <Form
        className=""
        name="basic"
        onFinish={() => {
          updateEvent(event);
        }}
      >
        <h2
          className="text-2xl md:text-3xl font-extrabold leading-tighter tracking-tighter mb-4"
          data-aos="zoom-y-out"
        >
          Description & Photo
        </h2>

        <div className="flex flex-wrap -mx-3 mb-8">
          <div className="w-full px-3">
            <label className="block text-gray-800 text-sm font-medium mb-1">
              Event Flyer
            </label>

            {event.imageUrl ? (
              <div className="my-4 mx-auto ">
                <Image
                  width={200}
                  height={200}
                  style={{ objectFit: "cover" }}
                  src={event.imageUrl}
                  alt={`${event.name} event flyer`}
                />
              </div>
            ) : (
              <></>
            )}
            <Upload {...props}>
              <Button icon={<UploadOutlined />}>
                Click to upload event flyer
              </Button>
            </Upload>
            <label>File</label>
            <input id="file" type="file" onChange={handleUploadChange} />
            <button onClick={handleUpload}>Upload</button>
          </div>
        </div>

        <div className="flex flex-wrap -mx-3 mb-4">
          <div className="w-full px-3">
            <CustomTextArea
              value={event.summary}
              name={"summary"}
              id={"summary"}
              label={"Event Summary"}
              rows={3}
              placeholder={
                "Add a summary for your event. This will be shown as a snippet when patrons view your event."
              }
              handleChange={handleChange}
              required={true}
            />
          </div>
        </div>
        <div className="flex flex-wrap -mx-3 mb-4">
          <div className="w-full px-3">
            <CustomTextArea
              value={event.description}
              maxLength={2000}
              name={"description"}
              id={"description"}
              label={"Event Description"}
              rows={6}
              placeholder={
                "Add a full description of your event. This will be presented on your event details page."
              }
              handleChange={handleChange}
              required={true}
            />
          </div>
        </div>

        <div>
          <Button
            onClick={() => {
              updateEvent(event);
            }}
            type="primary"
            className="px-6 py-5 shadow-md items-center bg-blue-600 hover:bg-blue-700 justify-center font-medium inline-flex"
          >
            Save Event Details
          </Button>
        </div>
      </Form>
    </div>
  );
}
