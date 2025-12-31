import React from 'react';
import { Card, Skeleton, Space } from 'antd';

interface TableSkeletonProps {
  rows?: number;
}

const TableSkeleton: React.FC<TableSkeletonProps> = ({ rows = 5 }) => {
  return (
    <Card style={{ boxShadow: '0 4px 12px rgba(0,0,0,0.08)', borderRadius: '8px' }}>
      <Space direction="vertical" style={{ width: '100%' }} size="large">
        {/* 表头骨架 */}
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 16 }}>
          <Skeleton.Input active style={{ width: 200 }} />
          <Space>
            <Skeleton.Button active style={{ width: 100 }} />
            <Skeleton.Button active style={{ width: 100 }} />
          </Space>
        </div>

        {/* 表格行骨架 */}
        {Array.from({ length: rows }).map((_, index) => (
          <div
            key={index}
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              padding: '12px 0',
              borderBottom: index < rows - 1 ? '1px solid #f0f0f0' : 'none',
            }}
          >
            <Skeleton.Input active style={{ width: '15%' }} />
            <Skeleton.Input active style={{ width: '20%' }} />
            <Skeleton.Input active style={{ width: '25%' }} />
            <Skeleton.Input active style={{ width: '15%' }} />
            <Skeleton.Input active style={{ width: '15%' }} />
          </div>
        ))}
      </Space>
    </Card>
  );
};

export default TableSkeleton;
