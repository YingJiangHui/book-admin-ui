import { useLoading } from '@/hooks/useLoading';
import { LoginReq, postLogin } from '@/services/auth';
import { waitTimePromise } from '@/utils/helpers';
import { storage } from '@/utils/store';
import { useNavigate, useSearchParams } from '@@/exports';
import { LockOutlined, MailOutlined } from '@ant-design/icons';
import {
  LoginForm,
  ProConfigProvider,
  ProFormText,
  setAlpha,
} from '@ant-design/pro-components';
import { Link, useModel } from '@umijs/max';
import { message, theme } from 'antd';
import { CSSProperties, useEffect } from 'react';

type LoginType = 'phone' | 'account';

const Login: React.FC = () => {
  const { token } = theme.useToken();
  useEffect(() => {
    window.document.title = '登录';
  }, []);
  const [searchParams] = useSearchParams();
  const initialState = useModel('@@initialState');
  const iconStyles: CSSProperties = {
    marginInlineStart: '16px',
    color: setAlpha(token.colorTextBase, 0.2),
    fontSize: '24px',
    verticalAlign: 'middle',
    cursor: 'pointer',
  };
  const navigate = useNavigate();
  const [onFinish, loading] = useLoading(async (values: LoginReq) => {
    console.log(values);
    const res = await postLogin(values);
    message.success('登录成功');
    storage.set('token', res.data);
    await initialState.refresh();
    const redirectTo = searchParams.get('redirectTo');
    // history.replace({ pathname: redirectTo ? redirectTo : '/' });
    await waitTimePromise(500);
    navigate(redirectTo ? redirectTo : '/', { replace: true });
  });
  return (
    <ProConfigProvider hashed={false}>
      <div
        style={{ backgroundColor: token.colorBgContainer, paddingTop: '10%' }}
      >
        <LoginForm
          onFinish={onFinish}
          logo={
            <img src={'/book.svg'} />
            // <BookTwoTone style={{ fontSize: 44, lineHeight: 44 }} size={36} />
          }
          title="图书管理系统登录"
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

            <Link replace to={'/forget-password'}>
              忘记密码
            </Link>
          </div>
        </LoginForm>
      </div>
    </ProConfigProvider>
  );
};

Login.displayName = '登录';
export default Login;
