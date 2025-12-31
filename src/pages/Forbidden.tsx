/**
 * 403 无权限页面
 */

import React from 'react';
import { Button, Result } from 'antd';
import { useNavigate } from 'react-router-dom';

const Forbidden: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div
      style={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        minHeight: '100vh',
        background: '#f0f2f5',
      }}
    >
      <Result
        status="403"
        title="403"
        subTitle="抱歉，您没有权限访问此页面。"
        extra={
          <Button type="primary" onClick={() => navigate('/dashboard')}>
            返回首页
          </Button>
        }
      />
    </div>
  );
};

export default Forbidden;
