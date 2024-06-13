import { Constants } from '@/constants';
import { getUsers, updateUserInfo } from '@/services/user';
import { useModel } from '@@/exports';
import {
  ActionType,
  PageContainer,
  ProTable,
} from '@ant-design/pro-components';
import { Space, Tag, message } from 'antd';
import React, { memo, useRef } from 'react';

type props = {};
export type ReaderListProps = props;
export const ReaderList: React.FC<React.PropsWithChildren<ReaderListProps>> =
  memo((props) => {
    const actionRef = useRef<ActionType>();
    const { selectedLibrary } = useModel('currentLibrary');
    return (
      <PageContainer title={'读者管理'} ghost>
        <ProTable<API.User.Instance, Parameters<typeof getUsers>[0]>
          params={{
            roleNames: Constants.Role.RoleEnum.READER,
            libraryIds: selectedLibrary?.id ? selectedLibrary.id : undefined,
          }}
          actionRef={actionRef}
          bordered
          columns={[
            { dataIndex: 'id', title: '编号', search: false },
            {
              dataIndex: 'email',
              title: '账号',
              render: (dom, record) => {
                // return <Link to={`/library/detail/${record.id}`}>{dom}</Link>;
                return dom;
              },
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
                  {record.isBlacklist ? (
                    <a
                      onClick={async () => {
                        await updateUserInfo({
                          id: record.id,
                          isBlacklist: false,
                        });
                        message.success('调整成功');
                        actionRef.current?.reload();
                      }}
                    >
                      解禁用
                    </a>
                  ) : (
                    <a
                      onClick={async () => {
                        await updateUserInfo({
                          id: record.id,
                          isBlacklist: true,
                        });
                        message.success('调整成功');
                        actionRef.current?.reload();
                      }}
                    >
                      禁用
                    </a>
                  )}
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
            // <ModalForm
            //   key={'invite-form'}
            //   onFinish={async (values) => {
            //     await sendInviteCode({
            //       email: values.email,
            //       libraryIds: [values.libraryId],
            //       roles: [values.role],
            //     });
            //     // actionRef.current?.reload();
            //     message.success('邀请邮件发送成功');
            //     return Promise.resolve(true);
            //   }}
            //   initialValues={{
            //     libraryId: props.libraryId,
            //     role: 'LIBRARY_ADMIN',
            //   }}
            //   title={'邀请成为图书管理员'}
            //   trigger={
            //     <Button key="button" icon={<PlusOutlined />} type="primary">
            //       邀请注册
            //     </Button>
            //   }
            // >
            //   <InviteRegister />
            // </ModalForm>,
          ]}
        />
      </PageContainer>
    );
  });
ReaderList.displayName = '读者管理';

export default ReaderList;
