import { getBorrowings, returnBook } from '@/services/borrowing';
import { useAccess } from '@@/exports';
import { QuestionCircleOutlined } from '@ant-design/icons';
import { ActionType, ProTable } from '@ant-design/pro-components';
import { Button, Popconfirm, message } from 'antd';
import React, { memo, useRef } from 'react';

type props = {
  libraryId: number;
};
export type BorrowingListProps = props;
export const BorrowingList: React.FC<
  React.PropsWithChildren<BorrowingListProps>
> = memo((props) => {
  const { libraryId } = props;
  const access = useAccess();
  const actionRef = useRef<ActionType>();
  return (
    <ProTable<
      API.Borrowing.Instance,
      {
        status?: API.Borrowing.Instance['status'][];
        libraryId: number;
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
        { title: '借阅编号', dataIndex: 'id', search: false },
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
          title: '借阅用户',
          dataIndex: ['user', 'email'],
          search: false,
        },
        {
          title: '预计归还日期',
          dataIndex: 'expectedReturnAt',
          valueType: 'date',
          search: false,
        },
        {
          title: '实际归还日期',
          dataIndex: 'returnedAt',
          valueType: 'date',
          search: false,
        },
        {
          title: '状态',
          dataIndex: 'status',
          valueEnum: {
            RETURNED: { text: '已归还', status: 'success' },
            OVERDUE_NOT_RETURNED: { text: '已逾期', status: 'error' },
            NOT_RETURNED: { text: '未归还', status: 'warning' },
            OVERDUE_RETURNED: { text: '逾期已归还', status: 'success' },
          },
        },
        {
          title: '操作',
          dataIndex: 'actions',
          search: false,
          render: (dom, record) => {
            const cantBorrowed = !!record.returnedAt;
            return (
              <>
                <Popconfirm
                  disabled={cantBorrowed}
                  title="提示"
                  description="确认是否归还图书"
                  icon={<QuestionCircleOutlined />}
                  onConfirm={() => {
                    returnBook({ borrowingIds: [record.id] }).then(() => {
                      message.success('操作成功');
                      actionRef.current?.reload();
                    });
                  }}
                >
                  <Button
                    style={{ padding: '0 4px 0 0' }}
                    type={'link'}
                    disabled={cantBorrowed}
                  >
                    归还
                  </Button>
                </Popconfirm>
              </>
            );
          },
        },
      ]}
      request={async (params) => {
        return getBorrowings(params).then((res) => ({
          data: res.data.data,
          total: res.data.total,
        }));
      }}
    />
  );
});
BorrowingList.displayName = '借阅列表';