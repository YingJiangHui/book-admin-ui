import { InviteRegister } from '@/components/FormTemplate/InviteRegister/InviteRegister';
import { Constants } from '@/constants';
import { sendInviteCode } from '@/services/auth';
import { getLibrariesAll } from '@/services/library';
import { getRoles } from '@/services/role';
import { getUsers, updateUserInfo } from '@/services/user';
import { PlusOutlined } from '@ant-design/icons';
import {
  ActionType,
  ModalForm,
  PageContainer,
  ProFormDependency,
  ProFormSelect,
  ProFormSwitch,
  ProFormText,
  ProTable,
} from '@ant-design/pro-components';
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
      <PageContainer title={'用户管理'} ghost>
        <ProTable<API.User.Instance, Parameters<typeof getUsers>[0]>
          // params={{ roleNames: Constants.Role.RoleEnum.READER }}
          actionRef={actionRef}
          bordered
          columns={[
            { dataIndex: 'id', title: '编号' },
            {
              dataIndex: 'email',
              title: '账号',
              render: (dom, record) => {
                // return <Link to={`/library/detail/${record.id}`}>{dom}</Link>;
                return dom;
              },
            },
            {
              dataIndex: 'roleNames',
              title: '角色',
              hideInTable: true,
              valueType: 'select',
              request: async () =>
                getRoles().then((res) => {
                  return res.data.map((role) => ({
                    label: Constants.User.UserRoleMapToText[role.roleName],
                    value: role.roleName,
                  }));
                }),
            },
            {
              search: false,
              dataIndex: 'roles',
              title: '角色',
              render: (_, record) =>
                record.roles.length ? (
                  <Space size={1}>
                    {record.roles.map((role) => (
                      <Tag key={role.id}>{role.description}</Tag>
                    ))}
                  </Space>
                ) : (
                  '-'
                ),
            },
            {
              search: false,
              dataIndex: 'libraries',
              title: '负责图书馆',
              render: (_, record) =>
                record.libraries?.length ? (
                  <Space size={1}>
                    {record.libraries.map((lib) => (
                      <Tag key={lib.id}>{lib.name}</Tag>
                    ))}
                  </Space>
                ) : (
                  '-'
                ),
            },
            {
              search: false,
              dataIndex: 'defaultTimes',
              title: '违约次数',
              renderText: (text) => text || '-',
            },
            {
              dependencies: ['roleNames'],
              dataIndex: 'isBlacklist',
              title: '禁用',
              valueType: 'select',
              valueEnum: {
                true: { text: '是', status: 'Error' },
                false: { text: '否', status: 'Success' },
              },
            },
            {
              dataIndex: 'createdAt',
              title: '注册日期',
              valueType: 'date',
              search: false,
            },
            {
              search: false,
              dataIndex: 'action',
              title: '操作',
              render: (dom, record) => (
                <>
                  <ModalForm<{
                    roles: API.Role.RoleType[];
                    isBlacklist: boolean;
                    libraryIds: number[];
                  }>
                    onFinish={async (values) => {
                      await updateUserInfo({ id: record.id, ...values });

                      message.success('调整成功');
                      actionRef.current?.reload();
                      return Promise.resolve(true);
                    }}
                    title={'用户调整'}
                    initialValues={{
                      roles: record.roles.map((role) => role.roleName),
                      isBlacklist: record.isBlacklist,
                      libraryIds: record.libraries.map((item) => item.id),
                    }}
                    trigger={
                      <Button style={{ padding: '0 4px 0 0' }} type={'link'}>
                        调整
                      </Button>
                    }
                  >
                    <ProFormText
                      initialValue={record.email}
                      disabled
                      label={'用户'}
                      name={'email'}
                    />
                    <ProFormSelect
                      mode={'multiple'}
                      label={'角色'}
                      name={'roles'}
                      request={async () =>
                        getRoles().then((res) => {
                          return res.data.map((role) => ({
                            label:
                              Constants.User.UserRoleMapToText[role.roleName],
                            value: role.roleName,
                          }));
                        })
                      }
                    />
                    <ProFormDependency
                      name={['roles']}
                      dependencies={['roles']}
                    >
                      {({ roles }) => {
                        return roles?.includes(
                          Constants.Role.RoleEnum.LIBRARY_ADMIN,
                        ) ? (
                          <ProFormSelect
                            mode={'multiple'}
                            label={'图书馆'}
                            name={'libraryIds'}
                            request={async () =>
                              getLibrariesAll().then((res) => {
                                return res.data.map((item) => ({
                                  label: item.name,
                                  value: item.id,
                                }));
                              })
                            }
                          />
                        ) : (
                          ''
                        );
                      }}
                    </ProFormDependency>
                    <ProFormSwitch name={'isBlacklist'} label={'禁用用户'} />
                  </ModalForm>
                </>
              ),
            },
          ]}
          // actionRef={actionRef}
          cardBordered
          // params={{ roleNames: 'READER' }}
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
          options={{
            setting: {
              listsHeight: 400,
            },
          }}
          form={{
            // formRef: formRef,
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
                  libraryIds: values.libraryId,
                  roles: [values.role],
                });
                // actionRef.current?.reload();
                message.success('邀请邮件发送成功');
                return Promise.resolve(true);
              }}
              initialValues={{
                libraryId: props.libraryId ? [props.libraryId] : [],
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
      </PageContainer>
    );
  },
);
UserList.displayName = '用户列表界面';

export default UserList;
