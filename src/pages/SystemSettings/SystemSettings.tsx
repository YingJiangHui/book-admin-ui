import {
  getSystemSettings,
  updateSystemSettings,
} from '@/services/systemSettings';
import { useRequest } from '@@/exports';
import {
  PageContainer,
  ProCard,
  ProForm,
  ProFormText,
} from '@ant-design/pro-components';
import { message } from 'antd';
import React, { memo } from 'react';

type props = {};
export type SystemSettingsProps = props;
export const SystemSettings: React.FC<
  React.PropsWithChildren<SystemSettingsProps>
> = memo((props) => {
  const [form] = ProForm.useForm();
  const SystemSettingsReq = useRequest(getSystemSettings);
  return (
    <PageContainer ghost header={{ title: '系统设置' }}>
      <ProCard>
        <ProForm
          onFinish={async (values) => {
            const list = Object.keys(values).map((key) => ({
              name: key,
              value: values[key],
            }));
            await updateSystemSettings(list);
            message.success('保存成功');
          }}
          // request={async () => {
          //   return getSystemSettings().then((res) => res.data);
          // }}
          form={form}
        >
          {SystemSettingsReq.data?.map((item) => (
            <ProFormText
              key={item.name}
              rules={[{ required: true }]}
              label={item.description}
              initialValue={item.value}
              name={item.name}
            />
          ))}
        </ProForm>
      </ProCard>
    </PageContainer>
  );
});
SystemSettings.displayName = '系统设置';

export default SystemSettings;
