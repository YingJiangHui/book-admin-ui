import { searchPoi } from '@/utils/AMap';
import {
  ProForm,
  ProFormDigit,
  ProFormProps,
  ProFormSelect,
  ProFormText,
  ProFormTextArea,
} from '@ant-design/pro-components';
import { Space } from 'antd';
import React, { memo } from 'react';

export type AMapControlValueType = {
  searchCoords: string;
  name: string;
  coords: string;
  circumference: number;
  address: string;
};

type props = {} & ProFormProps<AMapControlValueType>;
export type ControlPanelProps = props;
export const ControlPanel: React.FC<
  React.PropsWithChildren<ControlPanelProps>
> = memo((props) => {
  const { onChange, initialValues, form, ...rest } = props;
  console.log(initialValues, 'initialValues');
  return (
    <>
      <ProForm<AMapControlValueType>
        {...rest}
        submitter={{
          render: (props, dom) => {
            const submitUI = dom[1];
            return (
              <Space>
                {dom[0]}
                {React.isValidElement(submitUI)
                  ? React.cloneElement(submitUI, {
                      // @ts-ignore
                      ...submitUI.props,
                      children: initialValues ? '修 改' : '提 交',
                    })
                  : submitUI}
              </Space>
            );
          },
        }}
        initialValues={{
          ...initialValues,
          coords:
            initialValues?.longitude && initialValues?.longitude
              ? `${initialValues?.longitude},${initialValues?.latitude}`
              : undefined,
        }}
        form={form}
        // submitter={{
        //   render: (_, dom) => <Space style={{ textAlign: 'end' }}>{dom}</Space>,
        // }}
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
          name={'searchCoords'}
          label={'地点搜索'}
        />
        <ProFormText
          rules={[{ required: true }]}
          name={'name'}
          label={'图书馆名称'}
        />
        <ProFormTextArea
          rules={[{ required: true }]}
          name={'address'}
          label={'详细地址'}
        />
        <ProFormText
          rules={[{ required: true }]}
          name={'coords'}
          label={'经纬度'}
        />
        <ProFormDigit
          rules={[{ required: true }]}
          name={'circumference'}
          initialValue={100}
          label={'范围（半径m）'}
        />
      </ProForm>
    </>
  );
});
ControlPanel.displayName = '地图控制面板';
