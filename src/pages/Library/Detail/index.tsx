import { CustomAMap } from '@/components/CustomAMap';
import BookList from '@/pages/Book/Book';
import { UserList } from '@/pages/User/User';
import { getLibrary } from '@/services/library';
import { useParams, useSearchParams } from '@@/exports';
import { PageContainer, ProCard } from '@ant-design/pro-components';
import { useRequest } from 'ahooks';
import { Descriptions } from 'antd';
import React, { memo } from 'react';

type props = {};
export type LibraryDetailProps = props;
export const LibraryDetail: React.FC<
  React.PropsWithChildren<LibraryDetailProps>
> = memo((props) => {
  // 获取图书馆id
  const params = useParams<{ id: string }>();

  const libraryReq = useRequest(getLibrary, {
    defaultParams: [{ id: params.id! }],
  });
  const [searchParams, setSearchParams] = useSearchParams({
    activeTab: 'location',
  });
  return (
    <PageContainer
      tabActiveKey={searchParams.get('activeTab')!}
      onTabChange={(activeTab) => {
        setSearchParams({ activeTab }, { replace: true });
      }}
      tabList={[
        {
          tab: '图书馆地理位置',
          key: 'location',
          children: (
            <ProCard>
              <CustomAMap></CustomAMap>
            </ProCard>
          ),
        },
        {
          tab: '图书馆管理人员',
          key: 'admin',
          children: (
            <ProCard>
              <UserList
                roles={['LIBRARY_ADMIN']}
                libraryId={Number(params.id)}
              />
            </ProCard>
          ),
        },
        {
          tab: '图书馆藏书',
          key: 'book',
          children: (
            <ProCard>
              <BookList libraryId={Number(params.id)} />
            </ProCard>
          ),
        },
      ]}
      content={
        <Descriptions column={3}>
          <Descriptions.Item label="图书馆名称">
            {libraryReq.data?.data.name}
          </Descriptions.Item>
          <Descriptions.Item label="图书馆地址">
            {libraryReq.data?.data.longitude},{libraryReq.data?.data.latitude}
          </Descriptions.Item>
          <Descriptions.Item label="范围(半径)">
            {libraryReq.data?.data.circumference}m
          </Descriptions.Item>
        </Descriptions>
      }
      header={{
        title: '图书馆详情',
        breadcrumb: {
          items: [
            {
              path: '/',
              breadcrumbName: '首页',
            },
            {
              path: '/library',
              breadcrumbName: '图书馆',
            },
            {
              path: '/library/detail',
              breadcrumbName: '详情',
            },
          ],
        },
      }}
    >
      {/*图书馆基本信息*/}
    </PageContainer>
  );
});
LibraryDetail.displayName = '图书馆详情页';

export default LibraryDetail;
