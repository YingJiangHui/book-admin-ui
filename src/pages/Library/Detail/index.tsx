import { CustomAMap } from '@/components/CustomAMap';
import BookList from '@/pages/Book/BookList';
import { BorrowingList } from '@/pages/Borrowings/list';
import { ReservationApplicationList } from '@/pages/ReservationApplication/list';
import { ReservationList } from '@/pages/Reservations/list';
import { UserList } from '@/pages/User/User';
import { getLibrary, postUpdateLibrary } from '@/services/library';
import { useParams, useRequest, useSearchParams } from '@@/exports';
import { PageContainer, ProCard } from '@ant-design/pro-components';
import { Badge, Descriptions, message } from 'antd';
import React, { memo } from 'react';

type props = {};
export type LibraryDetailProps = props;
export const LibraryDetail: React.FC<
  React.PropsWithChildren<LibraryDetailProps>
> = memo((props) => {
  // 获取图书馆id
  const params = useParams<{ id: string }>();
  const libraryId = params.id;
  const libraryReq = useRequest(getLibrary, {
    defaultParams: [{ id: libraryId! }],
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
                libraryId={Number(libraryId)}
              />
            </ProCard>
          ),
        },
        {
          tab: '藏书',
          key: 'book',
          children: (
            <ProCard loading={libraryReq.loading}>
              <BookList libraryId={Number(libraryId)} />
            </ProCard>
          ),
        },
        {
          tab: '借阅',
          key: 'borrow',
          children: (
            <ProCard loading={libraryReq.loading}>
              <BorrowingList libraryId={Number(libraryId)} />
            </ProCard>
          ),
        },
        {
          tab: '预订',
          key: 'reservation',
          children: (
            <ProCard loading={libraryReq.loading}>
              <ReservationList libraryId={Number(libraryId)} />
            </ProCard>
          ),
        },
        {
          tab: '预约',
          key: 'reservationApplication',
          children: (
            <ProCard loading={libraryReq.loading}>
              <ReservationApplicationList libraryId={Number(libraryId)} />
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
      {/*图书馆基本信息*/}
    </PageContainer>
  );
});
LibraryDetail.displayName = '图书馆详情页';

export default LibraryDetail;
