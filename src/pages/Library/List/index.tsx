import { getLibraries } from '@/services/library';
import { PlusOutlined } from '@ant-design/icons';
import {
  ActionType,
  PageContainer,
  ProTable,
} from '@ant-design/pro-components';
import { Link, history } from '@umijs/max';
import { Button } from 'antd';
import { useRef } from 'react';

export default () => {
  const actionRef = useRef<ActionType>();
  return (
    <PageContainer ghost header={{ title: '图书馆列表' }}>
      <ProTable<any, API.Library.Instance>
        bordered
        columns={[
          { dataIndex: 'id', title: '编号' },
          {
            dataIndex: 'name',
            title: '图书馆',
            render: (dom, record) => {
              return <Link to={`/library/detail/${record.id}`}>{dom}</Link>;
            },
          },
          {
            dataIndex: 'address',
            title: '地址',
            ellipsis: true,
          },
          {
            dataIndex: 'coords',
            title: '坐标',
            render: (_, record) => `${record.longitude},${record.latitude}`,
            search: false,
          },
          {
            dataIndex: 'circumference',
            title: '范围（半径/米）',
            search: false,
          },
        ]}
        // actionRef={actionRef}
        cardBordered
        request={async (params, sort, filter) => {
          return await getLibraries(params)
            .then((res) => {
              return res;
            })
            .then((res) => ({
              data: res.data.data,
              total: res.data.total,
            }));
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
        search={{
          labelWidth: 'auto',
        }}
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
              };
            }
            return values;
          },
        }}
        pagination={{
          pageSize: 5,
          onChange: (page) => console.log(page),
        }}
        dateFormatter="string"
        toolBarRender={() => [
          <Button
            key="button"
            icon={<PlusOutlined />}
            onClick={() => {
              history.push('/library/create');
            }}
            type="primary"
          >
            创建图书馆
          </Button>,
        ]}
      />
    </PageContainer>
  );
};
