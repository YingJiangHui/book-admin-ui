import { CustomAMap } from '@/components/CustomAMap';
import BookList from '@/pages/Book/Book';
import { UserList } from '@/pages/User/User';
import { getLibrary, postUpdateLibrary } from '@/services/library';
import { useParams, useRequest, useSearchParams } from '@@/exports';
import { PageContainer, ProCard } from '@ant-design/pro-components';
import { Descriptions, message } from 'antd';
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
          tab: '地理位置',
          key: 'location',
          children: (
            <ProCard loading={libraryReq.loading}>
              <CustomAMap
                onFinish={async (values) => {
                  await postUpdateLibrary({
                    ...values,
                    id: libraryReq.data?.id,
                  });
                  message.success('修改成功');
                  libraryReq.refresh();
                  return Promise.resolve(true);
                }}
                initialValues={libraryReq.data}
              />
            </ProCard>
          ),
        },
        {
          tab: '管理人员',
          key: 'admin',
          children: (
            <ProCard loading={libraryReq.loading}>
              <UserList
                roles={['LIBRARY_ADMIN']}
                libraryId={Number(params.id)}
              />
            </ProCard>
          ),
        },
        {
          tab: '藏书',
          key: 'book',
          children: (
            <ProCard loading={libraryReq.loading}>
              <BookList libraryId={Number(params.id)} />
            </ProCard>
          ),
        },
      ]}
      content={
        <Descriptions column={2}>
          <Descriptions.Item label="图书馆名称">
            {libraryReq.data?.name}
          </Descriptions.Item>
          <Descriptions.Item label="图书馆地址">
            {libraryReq?.data?.address}
          </Descriptions.Item>
          <Descriptions.Item label="经纬度">
            {libraryReq?.data?.longitude},{libraryReq.data?.latitude}
          </Descriptions.Item>
          <Descriptions.Item label="范围(半径)">
            {libraryReq.data?.circumference}m
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
