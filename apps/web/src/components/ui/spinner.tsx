import { LoadingOutlined } from '@ant-design/icons';
import { Spin } from 'antd';

export function Spinner({ text }) {
  return (
    <div className="flex flex-col w-full justify-center item-center">
      <Spin
        size="large"
        indicator={<LoadingOutlined style={{ fontSize: 54 }} spin />}
      />
      <div className="text-center mt-4 text-base">{text}</div>
    </div>
  );
}
