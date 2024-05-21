import { InviteRegister } from '@/components/FormTemplate/InviteRegister/InviteRegister';
import { sendInviteCode } from '@/services/auth';
import { getUsers } from '@/services/user';
import { Link } from '@@/exports';
import { PlusOutlined } from '@ant-design/icons';
import { ActionType, ModalForm, ProTable } from '@ant-design/pro-components';
import { Button, Space, Tag, message } from 'antd';
import React, { memo, useRef } from 'react';

type props = {
  roles: API.User.Role[];
  libraryId: number;
};
export type UserListProps = props;
export const UserList: React.FC<React.PropsWithChildren<UserListProps>> = memo(
  (props) => {
    const actionRef = useRef<ActionType>();
    return (
      <ProTable<API.User.Instance, Parameters<typeof getUsers>[0]>
        actionRef={actionRef}
        bordered
        columns={[
          { dataIndex: 'id', title: '编号' },
          {
            dataIndex: 'email',
            title: '账号',
            render: (dom, record) => {
              return <Link to={`/library/detail/${record.id}`}>{dom}</Link>;
            },
          },
          {
            dataIndex: 'roles',
            title: '角色',
            render: (_, record) => (
              <Space size={'small'}>
                {record.roles.map((role) => (
                  <Tag key={role.id}>{role.description}</Tag>
                ))}
              </Space>
            ),
          },
        ]}
        // actionRef={actionRef}
        cardBordered
        params={{ libraryIds: props.libraryId, roleNames: 'LIBRARY_ADMIN' }}
        request={async (params, sort, filter) => {
          console.log(params, 'p');
          const res = await getUsers(params);
          return res.data;
        }}
        editable={{
          type: 'multiple',
        }}
        columnsState={{
          persistenceKey: 'pro-table-singe-demos',
          persistenceType: 'localStorage',
          defaultValue: {
            option: { fixed: 'right', disable: true },
          },
          onChange(value) {
            console.log('value: ', value);
          },
        }}
        rowKey="id"
        search={false}
        options={{
          setting: {
            listsHeight: 400,
          },
        }}
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
        pagination={{
          // pageSize: 5,
          // onChange: (page) => console.log(page),
          showSizeChanger: true,
        }}
        dateFormatter="string"
        toolBarRender={() => [
          <ModalForm
            key={'invite-form'}
            onFinish={async (values) => {
              await sendInviteCode({
                email: values.email,
                libraryIds: [values.libraryId],
                roles: [values.role],
              });
              // actionRef.current?.reload();
              message.success('邀请邮件发送成功');
              return Promise.resolve(true);
            }}
            initialValues={{
              libraryId: props.libraryId,
              role: 'LIBRARY_ADMIN',
            }}
            title={'邀请成为图书管理员'}
            trigger={
              <Button key="button" icon={<PlusOutlined />} type="primary">
                邀请注册
              </Button>
            }
          >
            <InviteRegister />
          </ModalForm>,
        ]}
      />
    );
  },
);
UserList.displayName = '用户列表界面';
