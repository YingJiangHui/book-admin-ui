import { useLoading } from '@/hooks/useLoading';
import { postRegister, RegisterReq } from '@/services/auth';
import { history, Link, useSearchParams } from '@@/exports';
import { BookTwoTone, LockOutlined, MailOutlined } from '@ant-design/icons';
import {
  LoginForm,
  ProConfigProvider,
  ProFormText,
} from '@ant-design/pro-components';
import { Button, message, theme } from 'antd';
import { useEffect, useState } from 'react';

export default () => {
  const [URLSearchParams] = useSearchParams();
  useEffect(() => {
    window.document.title = '注册';
  }, []);
  const { token } = theme.useToken();

  const [onFinish, loading] = useLoading(async (values: RegisterReq) => {
    await postRegister(values);
    message.success('注册成功');
    history.replace({ pathname: '/login' });
  });
  const [passwordVisibilityToggle, setPasswordVisibilityToggle] =
    useState(false);
  return (
    <ProConfigProvider hashed={false}>
      <div
        style={{ backgroundColor: token.colorBgContainer, paddingTop: '10%' }}
      >
        <LoginForm
          submitter={{
            render: (p, dom) => (
              <>
                <Button
                  size={'large'}
                  htmlType={'submit'}
                  block
                  type={'primary'}
                >
                  注册
                </Button>
              </>
            ),
          }}
          onFinish={onFinish}
          logo={
            <BookTwoTone style={{ fontSize: 44, lineHeight: 44 }} size={36} />
          }
          title="图书管理系统邀请注册"
          subTitle="图书馆管理后台"
        >
          <>
            <ProFormText
              initialValue={URLSearchParams.get('email')}
              name="email"
              fieldProps={{
                size: 'large',
                prefix: <MailOutlined className={'prefixIcon'} />,
              }}
              placeholder={'输入电子邮箱'}
              rules={[
                {
                  required: true,
                  message: '请输入电子邮箱!',
                },
              ]}
            />
            <ProFormText
              initialValue={URLSearchParams.get('inviteCode')}
              name="validationCode"
              fieldProps={{
                size: 'large',
                prefix: <LockOutlined className={'prefixIcon'} />,
              }}
              placeholder={'输入邀请码'}
              rules={[
                {
                  required: true,
                  message: '请输入邀请码!',
                },
              ]}
            />
            <ProFormText.Password
              name="password"
              fieldProps={{
                visibilityToggle: {
                  visible: passwordVisibilityToggle,
                  onVisibleChange: setPasswordVisibilityToggle,
                },
                size: 'large',
                prefix: <LockOutlined className={'prefixIcon'} />,
                strengthText:
                  '密码由数字、字母和特殊字符组成，长度至少为8个字符。',
                statusRender: (value) => {
                  const getStatus = () => {
                    if (value && value.length > 12) {
                      return 'ok';
                    }
                    if (value && value.length > 6) {
                      return 'pass';
                    }
                    return 'poor';
                  };
                  const status = getStatus();
                  if (status === 'pass') {
                    return (
                      <div style={{ color: token.colorWarning }}>强度：中</div>
                    );
                  }
                  if (status === 'ok') {
                    return (
                      <div style={{ color: token.colorSuccess }}>强度：强</div>
                    );
                  }
                  return (
                    <div style={{ color: token.colorError }}>强度：弱</div>
                  );
                },
              }}
              placeholder={'输入账号密码'}
              rules={[
                {
                  required: true,
                  message: '请输入账号密码！',
                },
              ]}
            />
            <ProFormText.Password
              name="passwordConfirmation"
              fieldProps={{
                visibilityToggle: {
                  visible: passwordVisibilityToggle,
                  onVisibleChange: setPasswordVisibilityToggle,
                },
                size: 'large',
                prefix: <LockOutlined className={'prefixIcon'} />,
              }}
              placeholder={'输入确认密码'}
              rules={[
                {
                  required: true,
                  message: '请输入确认密码！',
                },
              ]}
            />
          </>

          <div
            style={{
              // marginBlockEnd: 24,
              textAlign: 'end',
              marginBottom: 24,
            }}
          >
            {/*<ProFormCheckbox noStyle name="autoLogin"></ProFormCheckbox>*/}

            <Link replace to={'/login'}>
              已有账号？去登录
            </Link>
          </div>
        </LoginForm>
      </div>
    </ProConfigProvider>
  );
};
