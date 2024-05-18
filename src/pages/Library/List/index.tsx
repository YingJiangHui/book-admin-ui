import { getLibraries } from '@/services/library';
import { EllipsisOutlined, PlusOutlined } from '@ant-design/icons';
import { ActionType, ProTable } from '@ant-design/pro-components';
import { Link, history } from '@umijs/max';
import { Button, Dropdown } from 'antd';
import { useRef } from 'react';

export default () => {
  const actionRef = useRef<ActionType>();
  return (
    <ProTable<any>
      bordered
      columns={[
        { dataIndex: 'id', valueType: 'indexBorder', title: '编号' },
        {
          dataIndex: 'name',
          title: '图书馆',
          render: (dom, record) => {
            return <Link to={`/library/detail/${record.id}`}>{dom}</Link>;
          },
        },
        {
          dataIndex: 'coords',
          title: '坐标',
          render: (_, record) => `${record.longitude},${record.latitude}`,
        },
        { dataIndex: 'circumference', title: '范围（半径/米）' },
        { dataIndex: 'libraryAdmins', title: '管理员' },
      ]}
      // actionRef={actionRef}
      cardBordered
      request={async (params, sort, filter) => {
        const a = await getLibraries()
          .then((res) => {
            console.log(res);
            return res;
          })
          .then((res) => ({
            data: res.data,
            total: res.data.length,
          }));
        console.log(a, 'a');
        return a;
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
              created_at: [values.startTime, values.endTime],
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
      headerTitle="高级表格"
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
        <Dropdown
          key="menu"
          menu={{
            items: [
              {
                label: '1st item',
                key: '1',
              },
              {
                label: '2nd item',
                key: '1',
              },
              {
                label: '3rd item',
                key: '1',
              },
            ],
          }}
        >
          <Button>
            <EllipsisOutlined />
          </Button>
        </Dropdown>,
      ]}
    />
  );
};
