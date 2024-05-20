import { ProFormText, ProFormTextArea } from '@ant-design/pro-components';
import React, { memo } from 'react';

type props = {};
export type CategoryTemplateProps = props;
export const CategoryTemplate: React.FC<
  React.PropsWithChildren<CategoryTemplateProps>
> = memo((props) => {
  return (
    <>
      <ProFormText
        rules={[{ required: true }]}
        label={'分类名称'}
        name={'name'}
      />
      <ProFormTextArea label={'描述'} name={'description'}></ProFormTextArea>
    </>
  );
});
CategoryTemplate.displayName = '分类表单';
