import { Constants } from '@/constants';
import {
  cancelReservationApplication,
  fulfillReservationApplication,
  getReservationBookApplication,
  resendNotification,
} from '@/services/reservationApplication';
import { Link, useAccess, useModel } from '@@/exports';
import { QuestionCircleOutlined } from '@ant-design/icons';
import { ActionType, ProTable } from '@ant-design/pro-components';
import { Button, Popconfirm, message } from 'antd';
import React, { memo, useRef } from 'react';

type props = {};
export type ReservationApplicationProps = props;
export const ReservationApplication: React.FC<
  React.PropsWithChildren<ReservationApplicationProps>
> = memo((props) => {
  const { selectedLibrary } = useModel('currentLibrary');
  const access = useAccess();
  const actionRef = useRef<ActionType>();
  const libraryId = selectedLibrary?.id;
  return (
    <>
      <ProTable<
        API.ReservationApplication.Instance,
        Parameters<typeof getReservationBookApplication>[0]
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
        params={{ libraryId: libraryId }}
        columns={[
          { title: '预约编号', dataIndex: 'id', search: false },
          { title: '图书编号', dataIndex: ['book', 'id'], key: 'bookId' },
          {
            title: '书名',
            dataIndex: ['book', 'title'],
            key: 'title',
          },
          {
            title: '预约用户',
            key: 'email',
            dataIndex: ['user', 'email'],
            render: (dom, record) =>
              access.canLibraryAdminOnly ? (
                <Link to={`/reader?id=${record.user.id}`}>{dom}</Link>
              ) : (
                <Link to={`/users?id=${record.user.id}`}>{dom}</Link>
              ),
          },
          {
            title: '创建日期',
            dataIndex: 'createdAt',
            valueType: 'dateTime',
            search: false,
          },
          {
            title: '状态',
            dataIndex: 'status',
            valueEnum:
              Constants.ReservationApplication
                .ReservationApplicationStatusMapToStyle,
          },
          {
            title: '操作',
            dataIndex: 'actions',
            search: false,
            render: (dom, record) => {
              const cantResend = record.status !== 'NOTIFIED';
              const cantCancel =
                record.status === 'CANCELLED' || record.status === 'FULFILLED';
              const cantDone = record.status !== 'NOTIFIED';
              return (
                <>
                  <Popconfirm
                    disabled={cantResend}
                    title="提示"
                    description="是否重发通知短信"
                    icon={<QuestionCircleOutlined />}
                    onConfirm={() => {
                      resendNotification({ id: record.id }).then(() => {
                        message.success('操作成功');
                        actionRef.current?.reload();
                      });
                    }}
                  >
                    <Button
                      style={{ padding: '0 4px 0 0' }}
                      type={'link'}
                      disabled={cantResend}
                    >
                      重发通知
                    </Button>
                  </Popconfirm>
                  <Popconfirm
                    disabled={cantCancel}
                    title="提示"
                    description="是否取消借阅"
                    icon={<QuestionCircleOutlined style={{ color: 'red' }} />}
                    onConfirm={() => {
                      cancelReservationApplication({
                        id: record.id,
                      }).then(() => {
                        message.success('操作成功');
                        actionRef.current?.reload();
                      });
                    }}
                  >
                    <Button
                      style={{ padding: '0 4px 0 0' }}
                      type={'link'}
                      disabled={cantCancel}
                    >
                      取消预约
                    </Button>
                  </Popconfirm>
                  <Popconfirm
                    disabled={cantDone}
                    title="提示"
                    description="是否为用户完成借阅"
                    icon={<QuestionCircleOutlined />}
                    onConfirm={() => {
                      fulfillReservationApplication({
                        id: record.id,
                      }).then(() => {
                        message.success('操作成功');
                        actionRef.current?.reload();
                      });
                    }}
                  >
                    <Button
                      style={{ padding: '0 4px 0 0' }}
                      type={'link'}
                      disabled={cantDone}
                    >
                      完成借阅
                    </Button>
                  </Popconfirm>
                </>
              );
            },
          },
        ]}
        request={async (params) => {
          return getReservationBookApplication(params).then((res) => ({
            data: res.data.data,
            total: res.data.total,
          }));
        }}
      />
    </>
  );
});
ReservationApplication.displayName = '预约管理';

export default ReservationApplication;
