import React from 'react';
import { Spin } from 'antd';

interface LoadingOverlayProps {
  loading: boolean;
  tip?: string;
}

const LoadingOverlay: React.FC<LoadingOverlayProps> = ({ loading, tip = '加载中...' }) => {
  if (!loading) return null;

  return (
    <div
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: 'rgba(255, 255, 255, 0.8)',
        zIndex: 9999,
      }}
    >
      <Spin size="large" tip={tip} />
    </div>
  );
};

export default LoadingOverlay;
