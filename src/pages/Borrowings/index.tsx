import { getBorrowings } from '@/services/borrowing';
import { Link, useAccess, useModel } from '@@/exports';
import { PageContainer, ProTable } from '@ant-design/pro-components';
import React, { memo } from 'react';

type props = {};
export type BorrowingsProps = props;
export const Borrowings: React.FC<React.PropsWithChildren<BorrowingsProps>> =
  memo((props) => {
    const { selectedLibrary } = useModel('currentLibrary');
    const access = useAccess();
    return (
      <PageContainer header={{ title: '借阅管理' }}>
        <ProTable<
          API.Borrowing.Instance,
          {
            status?: API.Borrowing.Instance['status'][];
            libraryId: number;
          }
        >
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
            { title: '借阅编号', dataIndex: 'id', search: false },
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
          ]}
          request={async (params) => {
            return getBorrowings(params).then((res) => ({
              data: res.data.data,
              total: res.data.total,
            }));
          }}
        />
      </PageContainer>
    );
  });

Borrowings.displayName = '借阅管理';

export default Borrowings;
