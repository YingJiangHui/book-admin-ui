import { CategoryTemplate } from '@/components/FormTemplate/CategoryTemplate';
import {
  createCategory,
  deleteCategory,
  getCategories,
} from '@/services/categroy';
import { PlusOutlined, QuestionCircleOutlined } from '@ant-design/icons';
import {
  ActionType,
  ModalForm,
  PageContainer,
  ProTable,
} from '@ant-design/pro-components';
import { Button, Popconfirm, message } from 'antd';
import React, { memo, useRef } from 'react';

type props = {};
export type CategoryListPageProps = props;
export const CategoryListPage: React.FC<
  React.PropsWithChildren<CategoryListPageProps>
> = memo((props) => {
  const actionRef = useRef<ActionType>();

  return (
    <PageContainer ghost header={{ title: '图书分类' }}>
      <ProTable<API.Category.Instance>
        bordered
        columns={[
          { dataIndex: 'id', title: '编号' },
          {
            dataIndex: 'categoryName',
            title: '名称',
            // render: (dom, record) => {
            //   return <Link to={`/library/detail/${record.id}`}>{dom}</Link>;
            // },
          },
          {
            dataIndex: 'description',
            title: '描述',
          },
          {
            dataIndex: 'createdAt',
            title: '创建日期',
            valueType: 'date',
            search: false,
          },
          {
            dataIndex: 'actions',
            title: '操作',
            render: (_, record) => (
              <>
                <Popconfirm
                  title="删除操作"
                  description="确认是否进行删除操作"
                  icon={<QuestionCircleOutlined style={{ color: 'red' }} />}
                  onConfirm={() => {
                    deleteCategory(record.id).then(() => {
                      message.success('操作成功');
                      actionRef.current?.reload();
                    });
                  }}
                >
                  <Button style={{ padding: '0 4px 0 0' }} type={'link'}>
                    删除
                  </Button>
                </Popconfirm>
              </>
            ),
          },
        ]}
        actionRef={actionRef}
        cardBordered
        // params={{ libraryId: libraryId }}
        request={async (params, sort, filter) => {
          console.log(params, 'p');
          const res = await getCategories(params);
          return res.data;
        }}
        editable={{
          type: 'multiple',
        }}
        columnsState={{
          persistenceKey: 'pro-table-singe-demos',
          persistenceType: 'localStorage',
          defaultValue: {
            option: { fixed: 'right', disable: true },
          },
          onChange(value) {
            console.log('value: ', value);
          },
        }}
        rowKey="id"
        search={false}
        options={{
          setting: {
            listsHeight: 400,
          },
        }}
        form={{
          // 由于配置了 transform，提交的参与与定义的不同这里需要转化一下
          syncToUrl: (values, type) => {
            if (type === 'get') {
              return {
                ...values,
                // created_at: [values.startTime, values.endTime],
              };
            }
            return values;
          },
        }}
        pagination={{
          // pageSize: 5,
          // onChange: (page) => console.log(page),
          showSizeChanger: true,
        }}
        dateFormatter="string"
        toolBarRender={() => [
          <ModalForm<API.Category.CreationParams>
            modalProps={{ destroyOnClose: true }}
            key={'book-form'}
            onFinish={async (values) => {
              await createCategory(values);
              actionRef.current?.reload();
              message.success('分类新增成功');
              return Promise.resolve(true);
            }}
            title={'图书分类'}
            trigger={
              <Button key="button" icon={<PlusOutlined />} type="primary">
                创建图书分类
              </Button>
            }
          >
            <CategoryTemplate />
          </ModalForm>,
        ]}
      />
    </PageContainer>
  );
});
CategoryListPage.displayName = '图书分类界面';

export default CategoryListPage;
