import { useLoading } from '@/hooks/useLoading';
import { LoginReq, postLogin } from '@/services/auth';
import { history, useSearchParams } from '@@/exports';
import { BookTwoTone, LockOutlined, MailOutlined } from '@ant-design/icons';
import {
  LoginForm,
  ProConfigProvider,
  ProFormText,
  setAlpha,
} from '@ant-design/pro-components';
import { Link, useModel } from '@umijs/max';
import { message, theme } from 'antd';
import { CSSProperties, useState } from 'react';

type LoginType = 'phone' | 'account';

export default () => {
  const { token } = theme.useToken();
  const [loginType, setLoginType] = useState<LoginType>('phone');
  const [searchParams] = useSearchParams();
  const userModel = useModel('user');
  const iconStyles: CSSProperties = {
    marginInlineStart: '16px',
    color: setAlpha(token.colorTextBase, 0.2),
    fontSize: '24px',
    verticalAlign: 'middle',
    cursor: 'pointer',
  };
  const [onFinish, loading] = useLoading(async (values: LoginReq) => {
    console.log(values);
    const res = await postLogin(values);
    message.success('登录成功');
    userModel.setToken(res.data);
    const redirectTo = searchParams.get('redirectTo');
    history.replace({ pathname: redirectTo ? redirectTo : '/' });
  });
  return (
    <ProConfigProvider hashed={false}>
      <div
        style={{ backgroundColor: token.colorBgContainer, paddingTop: '10%' }}
      >
        <LoginForm
          onFinish={onFinish}
          logo={
            <BookTwoTone style={{ fontSize: 44, lineHeight: 44 }} size={36} />
          }
          title="图书馆管理后台登录"
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
            <ProFormText.Password
              name="password"
              fieldProps={{
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
          </>

          <div
            style={{
              // marginBlockEnd: 24,
              textAlign: 'end',
              marginBottom: 24,
            }}
          >
            {/*<ProFormCheckbox noStyle name="autoLogin"></ProFormCheckbox>*/}

            <Link
              replace
              to={'/forget-password'}
            >
              忘记密码
            </Link>
          </div>
        </LoginForm>
      </div>
    </ProConfigProvider>
  );
};
