import React from 'react';
import { Breadcrumb as AntBreadcrumb } from 'antd';
import { Link, useLocation } from 'react-router-dom';
import { HomeOutlined } from '@ant-design/icons';
import { getRouteConfig } from '../config/routes';
import { useTranslation } from '../hooks/useTranslation';

const Breadcrumb: React.FC = () => {
  const location = useLocation();
  const pathSnippets = location.pathname.split('/').filter(i => i);
  const { t } = useTranslation();

  // 路由路径到翻译 key 的映射
  const routeToI18nKey: Record<string, string> = {
    '/dashboard': 'menu.dashboard',
    '/users': 'menu.users',
    '/orders': 'menu.orders',
    '/analytics': 'menu.analytics',
    '/settings': 'menu.settings',
  };

  // 生成面包屑项
  const breadcrumbItems = [
    {
      title: (
        <Link to="/dashboard">
          <HomeOutlined />
        </Link>
      ),
    },
  ];

  // 构建路径面包屑
  pathSnippets.forEach((snippet, index) => {
    const url = `/${pathSnippets.slice(0, index + 1).join('/')}`;
    const routeConfig = getRouteConfig(url);
    
    if (routeConfig) {
      const isLast = index === pathSnippets.length - 1;
      const i18nKey = routeToI18nKey[url];
      const displayName = i18nKey ? t(i18nKey) : routeConfig.name;
      
      breadcrumbItems.push({
        title: isLast ? (
          <span>{displayName}</span>
        ) : (
          <Link to={url}>{displayName}</Link>
        ),
      });
    }
  });

  return (
    <AntBreadcrumb 
      items={breadcrumbItems}
      style={{ marginBottom: 16 }}
    />
  );
};

export default Breadcrumb;
