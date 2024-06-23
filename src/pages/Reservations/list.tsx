import { borrowBookFormReservations } from '@/services/borrowing';
import { cancelReservations, getReservations } from '@/services/reservation';
import { QuestionCircleOutlined } from '@ant-design/icons';
import { ActionType, ProTable } from '@ant-design/pro-components';
import { Button, Popconfirm, message } from 'antd';
import React, { memo, useRef } from 'react';

type props = {
  libraryId: number;
};
export type reservationListProps = props;
export const ReservationList: React.FC<
  React.PropsWithChildren<reservationListProps>
> = memo((props) => {
  const { libraryId } = props;
  const actionRef = useRef<ActionType>();

  return (
    <>
      <ProTable<
        API.Reservation.Instance,
        {
          status?: API.Reservation.Instance['status'][];
          libraryId?: number;
        }
      >
        actionRef={actionRef}
        bordered
        form={{
          // 由于配置了 transform，提交的参与与定义的不同这里需要转化一下
          syncToUrl: false,
        }}
        params={{ libraryId: libraryId }}
        columns={[
          { title: '预订编号', dataIndex: 'id', search: false },
          { title: '图书编号', dataIndex: ['book', 'id'], key: 'bookId' },
          {
            title: '书名',
            dataIndex: ['book', 'title'],
            key: 'title',
          },
          {
            title: 'ISBN',
            dataIndex: ['book', 'isbn'],
            search: false,
          },
          {
            title: '预订用户',
            key: 'email',
            dataIndex: ['user', 'email'],
            render: (dom, record) => dom,
          },
          {
            title: '预订借阅日期',
            dataIndex: 'borrowedAt',
            valueType: 'date',
            search: false,
          },
          {
            title: '预订归还日期',
            dataIndex: 'returnedAt',
            valueType: 'date',
            search: false,
          },
          {
            title: '状态',
            dataIndex: 'status',
            valueEnum: {
              NOT_BORROWABLE: { text: '未到借阅日期', status: 'default' },
              BORROWABLE: { text: '待取书', status: 'warning' },
              CANCELLED: { text: '已取消', status: 'default' },
              FULFILLED: { text: '已取书', status: 'success' },
              EXPIRED: { text: '未按时取书', status: 'error' },
            },
          },
          {
            title: '操作',
            dataIndex: 'actions',
            search: false,
            render: (dom, record) => {
              const cantCancelled =
                !!record.borrowingId || record.deleted === true;
              const cantBorrow =
                !!record.borrowingId || record.deleted === true;
              return (
                <>
                  <Popconfirm
                    disabled={cantCancelled}
                    title="提示"
                    description="确认是否取消用户的预订请求"
                    icon={<QuestionCircleOutlined style={{ color: 'red' }} />}
                    onConfirm={() => {
                      cancelReservations({ ids: [record.id] }).then(() => {
                        message.success('操作成功');
                        actionRef.current?.reload();
                      });
                    }}
                  >
                    <Button
                      style={{ padding: '0 4px 0 0' }}
                      type={'link'}
                      disabled={cantCancelled}
                    >
                      取消
                    </Button>
                  </Popconfirm>
                  <Popconfirm
                    disabled={cantBorrow}
                    title="提示"
                    description="确认是否借阅图书"
                    icon={<QuestionCircleOutlined />}
                    onConfirm={() => {
                      borrowBookFormReservations({
                        reservationIds: [record.id],
                      }).then(() => {
                        message.success('操作成功');
                        actionRef.current?.reload();
                      });
                    }}
                  >
                    <Button
                      style={{ padding: '0 4px 0 0' }}
                      type={'link'}
                      disabled={cantBorrow}
                    >
                      借阅
                    </Button>
                  </Popconfirm>
                </>
              );
            },
          },
        ]}
        request={async (params) => {
          return getReservations(params).then((res) => ({
            data: res.data.data,
            total: res.data.total,
          }));
        }}
      />
    </>
  );
});
ReservationList.displayName = '预订列表';
