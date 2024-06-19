import { useLoading } from '@/hooks/useLoading';
import { resetPassword, resetPasswordReq } from '@/services/auth';
import { sendValidationCodeEmail } from '@/services/email';
import { Link, history } from '@@/exports';
import { LockOutlined, MailOutlined, SyncOutlined } from '@ant-design/icons';
import {
  LoginForm,
  ProConfigProvider,
  ProFormCaptcha,
  ProFormText,
} from '@ant-design/pro-components';
import { Button, Form, message, theme } from 'antd';
import { useEffect, useState } from 'react';

export default () => {
  const { token } = theme.useToken();
  useEffect(() => {
    window.document.title = '忘记密码';
  }, []);
  const [form] = Form.useForm<any>();

  const onSendValidCode = async () => {
    const values = await form.validateFields(['email']);
    await sendValidationCodeEmail({
      email: values.email,
    });
    // countDown.start();
  };
  const [onFinish, loading] = useLoading(async (values: resetPasswordReq) => {
    console.log(values);
    await resetPassword(values);
    message.success('密码已重置请重新登录');
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
                  重置密码
                </Button>
              </>
            ),
          }}
          form={form}
          onFinish={onFinish}
          logo={
            <SyncOutlined style={{ fontSize: 44, lineHeight: 44 }} size={36} />
            // <BookTwoTone style={{ fontSize: 44, lineHeight: 44 }} size={36} />
          }
          title="密码重置"
          subTitle="图书馆管理后台"
        >
          <>
            <ProFormText
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
            <ProFormCaptcha
              fieldProps={{
                size: 'large',
                prefix: <LockOutlined className={'prefixIcon'} />,
              }}
              captchaProps={{
                size: 'large',
              }}
              placeholder={'请输入验证码'}
              captchaTextRender={(timing, count) => {
                if (timing) {
                  return `${count} ${'获取验证码'}`;
                }
                return '获取验证码';
              }}
              name="validationCode"
              rules={[
                {
                  required: true,
                  message: '请输入验证码！',
                },
              ]}
              onGetCaptcha={async () => {
                await onSendValidCode();
              }}
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
              账号登录
            </Link>
          </div>
        </LoginForm>
      </div>
    </ProConfigProvider>
  );
};
