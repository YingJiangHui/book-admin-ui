import { getAllCategories } from '@/services/categroy';
import { getLibrariesAll } from '@/services/library';
import {
  CaptFieldRef,
  ModalForm,
  ProForm,
  ProFormCheckbox,
  ProFormDependency,
  ProFormSelect,
  ProFormText,
  ProFormTextArea,
  ProFormUploadButton,
} from '@ant-design/pro-components';
import { Button, Col, Row } from 'antd';
import React, { memo, useRef } from 'react';
import useForm = ProForm.useForm;

type props = {};
export type BookFormTemplateProps = props;
export const BookFormTemplate: React.FC<
  React.PropsWithChildren<BookFormTemplateProps>
> = memo((props) => {
  useForm<API.Book.CreateParams>();
  const selectCategoryRef = useRef<CaptFieldRef>();
  return (
    <>
      <ProFormDependency name={[]}>
        {(_, form) => (
          <ModalForm
            title={'快速填写'}
            onFinish={async (values) => {
              if (values.fastInput) {
                form.setFieldsValue(JSON.parse(values.fastInput));
              }
              return Promise.resolve(true);
            }}
            trigger={
              <Button type={'link'} style={{ padding: 0 }}>
                快速填写（演示）
              </Button>
            }
          >
            <ProFormTextArea
              fieldProps={{ rows: 10 }}
              required
              name={'fastInput'}
            />
          </ModalForm>
        )}
      </ProFormDependency>
      <ProFormSelect
        rules={[{ required: true }]}
        disabled
        fieldProps={{
          fieldNames: { label: 'name', value: 'id' },
        }}
        request={() => getLibrariesAll().then((res) => res.data)}
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
        fieldRef={selectCategoryRef}
        request={() => getAllCategories().then((res) => res.data)}
        label={'类型'}
        name={'categoryId'}
      />
      <ProFormTextArea label={'描述'} name={'description'}></ProFormTextArea>
      <Row gutter={24}>
        <Col>
          <ProFormCheckbox label={'作为首页推荐图书'} name={'isRecommend'} />
        </Col>
        <Col>
          <ProFormCheckbox label={'作为首页轮播'} name={'isBanner'} />
        </Col>
      </Row>
    </>
  );
});
BookFormTemplate.displayName = '图书表单';
