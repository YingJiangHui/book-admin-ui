import { Constants } from '@/constants';
import { getLibraries } from '@/services/library';
import { getRoles } from '@/services/role';
import { MailOutlined } from '@ant-design/icons';
import { ProFormSelect, ProFormText } from '@ant-design/pro-components';
import React, { memo } from 'react';

type props = {};
export type InviteRegisterProps = props;
export const InviteRegister: React.FC<
  React.PropsWithChildren<InviteRegisterProps>
> = memo((props) => {
  return (
    <>
      <ProFormText
        label={'电子邮箱'}
        name="email"
        fieldProps={{
          size: 'large',
          prefix: <MailOutlined className={'prefixIcon'} />,
        }}
        placeholder={'输入邀请用户的电子邮箱'}
        rules={[
          {
            required: true,
            message: '请输入电子邮箱!',
          },
        ]}
        help={'对方将接收到邀请链接，邀请用户注册后，将成为当前图书馆的管理员'}
      />
      {/*图书馆选择*/}
      <ProFormSelect
        disabled
        label={'图书馆'}
        name="libraryId"
        fieldProps={{
          size: 'large',
          fieldNames: { label: 'name', value: 'id' },
        }}
        placeholder={'选择图书馆'}
        rules={[
          {
            required: true,
            message: '请选择图书馆!',
          },
        ]}
        request={async () => {
          return getLibraries().then((res) => {
            return res.data;
          });
        }}
      />
      <ProFormSelect
        disabled
        label={'角色'}
        name="role"
        fieldProps={{
          size: 'large',
        }}
        placeholder={'请选择角色'}
        rules={[
          {
            required: true,
            message: '请选择角色!',
          },
        ]}
        request={async () => {
          return getRoles().then((res) => {
            return res.data.map((role) => ({
              label: Constants.User.UserRoleMapToText[role.roleName],
              value: role.roleName,
            }));
          });
        }}
      />
    </>
  );
});
InviteRegister.displayName = '邀请图书管理员注册';
