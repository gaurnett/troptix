import { Spin } from 'antd';

export function LoadingSpinner({ children }) {
  return (
    <Spin className="mt-16" tip={children} size="large">
      <div className="content" />
    </Spin>
  );
}
