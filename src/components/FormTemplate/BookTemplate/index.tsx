import { getAllCategories } from '@/services/categroy';
import { getLibraries } from '@/services/library';
import {
  ProForm,
  ProFormSelect,
  ProFormText,
  ProFormTextArea,
  ProFormUploadButton,
} from '@ant-design/pro-components';
import React, { memo } from 'react';
import useForm = ProForm.useForm;

type props = {};
export type BookFormTemplateProps = props;
export const BookFormTemplate: React.FC<
  React.PropsWithChildren<BookFormTemplateProps>
> = memo((props) => {
  useForm<API.Book.CreateParams>();
  return (
    <>
      <ProFormSelect
        rules={[{ required: true }]}
        disabled
        fieldProps={{
          fieldNames: { label: 'name', value: 'id' },
        }}
        request={() => getLibraries().then((res) => res.data)}
        label={'图书馆'}
        name={'libraryId'}
      />
      <ProFormUploadButton
        fieldProps={{ beforeUpload: () => false }}
        listType={'picture-card'}
        rules={[{ required: true }]}
        label={'图书封面'}
        name={'file'}
      />

      <ProFormText rules={[{ required: true }]} label={'书名'} name={'title'} />
      <ProFormText label={'ISBN'} name={'isbn'}></ProFormText>
      <ProFormText
        rules={[{ required: true }]}
        label={'作者'}
        name={'author'}
      />
      <ProFormText
        rules={[{ required: true }]}
        label={'出版社'}
        name={'publisher'}
      />
      <ProFormText
        rules={[{ required: true }]}
        label={'出版年'}
        name={'publishedYear'}
      />
      <ProFormSelect
        rules={[{ required: true }]}
        fieldProps={{
          fieldNames: { label: 'categoryName', value: 'id' },
        }}
        request={() => getAllCategories().then((res) => res.data)}
        label={'类型'}
        name={'categoryId'}
      />
      <ProFormTextArea label={'描述'} name={'description'}></ProFormTextArea>
    </>
  );
});
BookFormTemplate.displayName = '图书表单';
