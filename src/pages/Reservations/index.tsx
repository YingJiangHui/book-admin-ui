import { cancelReservations, getReservations } from '@/services/reservation';
import { Link, useAccess, useModel } from '@@/exports';
import { QuestionCircleOutlined } from '@ant-design/icons';
import {
  ActionType,
  PageContainer,
  ProTable,
} from '@ant-design/pro-components';
import { Popconfirm, message } from 'antd';
import React, { memo, useRef } from 'react';

type props = {};
export type ReservationsProps = props;
export const Reservations: React.FC<
  React.PropsWithChildren<ReservationsProps>
> = memo((props) => {
  const { selectedLibrary } = useModel('currentLibrary');
  const access = useAccess();
  const actionRef = useRef<ActionType>();
  return (
    <PageContainer header={{ title: '预约管理' }}>
      <ProTable<
        API.Reservation.Instance,
        {
          status?: API.Reservation.Instance['status'][];
          libraryId: number;
        }
      >
        actionRef={actionRef}
        bordered
        form={{
          // 由于配置了 transform，提交的参与与定义的不同这里需要转化一下
          syncToUrl: (values, type) => {
            if (type === 'get') {
              return {
                ...values,
                // created_at: [values.startTime, values.endTime],
              };
            }
            return values;
          },
        }}
        params={{ libraryId: selectedLibrary?.id }}
        columns={[
          { title: '预约编号', dataIndex: 'id', search: false },
          { title: '图书编号', dataIndex: ['book', 'id'], key: 'bookId' },
          {
            title: '书名',
            dataIndex: ['book', 'title'],
            key: 'title',
            render: (dom, record) => (
              <Link to={`/books?id=${record.book.id}`}>{dom}</Link>
            ),
          },
          {
            title: 'ISBN',
            dataIndex: ['book', 'isbn'],
            search: false,
          },
          {
            title: '借阅用户',
            dataIndex: ['user', 'email'],
            search: false,
            render: (dom, record) =>
              access.canLibraryAdminOnly ? (
                <Link to={`/reader?id=${record.user.id}`}>{dom}</Link>
              ) : (
                <Link to={`/users?id=${record.user.id}`}>{dom}</Link>
              ),
          },
          {
            title: '预约借阅日期',
            dataIndex: 'borrowedAt',
            valueType: 'date',
            search: false,
          },
          {
            title: '预约归还日期',
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
              EXPIRED: { text: '未按时取书', status: 'danger' },
            },
          },
          {
            title: '操作',
            dataIndex: 'actions',
            render: (dom, record) => {
              return (
                <Popconfirm
                  title="提示"
                  description="确认是否取消用户的预约请求"
                  icon={<QuestionCircleOutlined style={{ color: 'red' }} />}
                  onConfirm={() => {
                    cancelReservations({ ids: [record.id] }).then(() => {
                      message.success('操作成功');
                      actionRef.current?.reload();
                    });
                  }}
                >
                  <a>取消</a>
                </Popconfirm>
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
    </PageContainer>
  );
});
Reservations.displayName = '预约管理';

export default Reservations;
