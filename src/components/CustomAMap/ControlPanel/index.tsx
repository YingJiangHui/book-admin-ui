import { searchPoi } from '@/utils/AMap';
import {
  ProForm,
  ProFormDigit,
  ProFormSelect,
  ProFormText,
} from '@ant-design/pro-components';
import { FormInstance } from 'antd/lib';
import React, { memo } from 'react';

export type AMapControlValueType = {
  coordsDisplay: string;
  name: string;
  coords: string;
  circumference: number;
};

type props = {
  onChange?: (
    changedValue: Partial<AMapControlValueType>,
    values: AMapControlValueType,
  ) => void;
  form: FormInstance<AMapControlValueType>;
  onFinish: (values: AMapControlValueType) => Promise<void>;
};
export type ControlPanelProps = props;
export const ControlPanel: React.FC<
  React.PropsWithChildren<ControlPanelProps>
> = memo((props) => {
  const { onFinish, onChange, form } = props;
  return (
    <>
      <ProForm
        form={form}
        // submitter={{
        //   render: (_, dom) => <Space style={{ textAlign: 'end' }}>{dom}</Space>,
        // }}
        onValuesChange={(changedValues, values) => {
          onChange?.(changedValues, values);
        }}
        onFinish={onFinish}
      >
        <ProFormSelect
          showSearch
          debounceTime={500}
          request={(values) => {
            if (!values.keyWords) return Promise.reject();
            return searchPoi(values.keyWords).then((poiList) =>
              poiList.pois.map((item) => ({
                label: item.name,
                value: `${item.location.lng},${item.location.lat}`,
              })),
            );
          }}
          name={'coords'}
          label={'地点搜索'}
        />
        <ProFormText
          rules={[{ required: true }]}
          name={'name'}
          label={'图书馆名称'}
        />
        <ProFormText
          rules={[{ required: true }]}
          name={'coordsDisplay'}
          label={'经纬度'}
        />
        <ProFormDigit
          rules={[{ required: true }]}
          name={'circumference'}
          initialValue={100}
          label={'范围（半径）'}
        />
      </ProForm>
    </>
  );
});
ControlPanel.displayName = '地图控制面板';
