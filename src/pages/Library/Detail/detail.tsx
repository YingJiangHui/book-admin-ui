import { CustomAMap } from '@/components/CustomAMap';
import { getLibrary, postUpdateLibrary } from '@/services/library';
import { useModel, useRequest, useSearchParams } from '@@/exports';
import { PageContainer, ProCard } from '@ant-design/pro-components';
import { Badge, Descriptions, message } from 'antd';
import React, { memo } from 'react';

type props = {
  libraryId: number;
};
export type LibraryDetailProps = props;
export const LibraryDetail: React.FC<
  React.PropsWithChildren<LibraryDetailProps>
> = memo((props) => {
  // 获取图书馆id
  const { selectedLibrary } = useModel('currentLibrary');
  const libraryReq = useRequest(
    () => getLibrary({ id: selectedLibrary?.id! }),
    {
      // defaultParams: [{ id: libraryId! }],
      refreshDeps: [selectedLibrary?.id],
    },
  );
  const [searchParams, setSearchParams] = useSearchParams({
    activeTab: 'location',
  });
  return (
    <PageContainer
      tabActiveKey={searchParams.get('activeTab')!}
      onTabChange={(activeTab) => {
        setSearchParams({ activeTab }, { replace: true });
      }}
      content={
        <Descriptions column={2}>
          <Descriptions.Item label="图书馆名称">
            {libraryReq.data?.name}
          </Descriptions.Item>
          <Descriptions.Item label="图书馆地址">
            {libraryReq?.data?.address}
          </Descriptions.Item>
          <Descriptions.Item label="经纬度">
            {libraryReq.data?.latitude},{libraryReq?.data?.longitude}
          </Descriptions.Item>
          <Descriptions.Item label="范围(半径)">
            {libraryReq.data?.circumference}m
          </Descriptions.Item>
          <Descriptions.Item label="状态">
            {libraryReq.data?.closed ? (
              <Badge status={'error'} text={'闭馆'} />
            ) : (
              <Badge status={'success'} text={'正常'} />
            )}
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
    </PageContainer>
  );
});
LibraryDetail.displayName = '图书馆详情页';

export default LibraryDetail;
