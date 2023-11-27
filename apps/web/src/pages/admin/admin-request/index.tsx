import { useFetchUser } from "@/hooks/useUser";
import { message } from "antd";
import { useEffect, useState } from "react";

export default function ManageAccountPage() {
  const [messageApi, contextHolder] = message.useMessage();
  const [adminUser, setAdminUser] = useState<any>({});

  const { isPending, isError, user } = useFetchUser();

  useEffect(() => {
    if (user) {
      setAdminUser(user);
    }
  }, [user]);

  return (
    <div className="w-full md:max-w-2xl mx-auto">
      {contextHolder}
      <div className="mx-4">
        <div className="mt-4 font-bold text-xl text-center">
          Unauthorized
        </div>
      </div>
    </div>
  );
}
