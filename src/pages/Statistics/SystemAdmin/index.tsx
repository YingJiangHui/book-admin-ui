import { HotBorrowings } from '@/pages/Statistics/SystemAdmin/HotBorrowings';
import { HotCategories } from '@/pages/Statistics/SystemAdmin/HotCategories';
import { HotLibraries } from '@/pages/Statistics/SystemAdmin/HotLibraries';
import { HotSearch } from '@/pages/Statistics/SystemAdmin/HotSearch';
import { LibrariesMap } from '@/pages/Statistics/SystemAdmin/LibrariesMap';
import {
  PageContainer,
  ProCard,
  ProForm,
  ProFormDateRangePicker,
  ProFormSelect,
} from '@ant-design/pro-components';
import React, { memo } from 'react';

const items = [
  {
    label: '天',
    value: 'day',
  },
  {
    label: '周',
    value: 'week',
  },
  {
    label: '月',
    value: 'month',
  },
  {
    label: '季度',
    value: 'quarter',
  },
  {
    label: '年',
    value: 'year',
  },
];

type props = {};
export type SystemAdminStatisticsProps = props;
export const SystemAdminStatistics: React.FC<
  React.PropsWithChildren<SystemAdminStatisticsProps>
> = memo((props) => {
  const [form] = ProForm.useForm();
  const dateRange = ProForm.useWatch('dateRange', form);
  const dateTrunc = ProForm.useWatch('dateTrunc', form);

  return (
    <ProForm form={form} submitter={false} layout={'horizontal'}>
      <PageContainer
        title={'数据统计'}
        extra={
          // <ProForm form={form} submitter={false} layout={'horizontal'}>
          <>
            时间区间：
            <ProFormDateRangePicker
              label={'时间区间'}
              name={'dateRange'}
              style={{ padding: 0, margin: 0 }}
              noStyle
            />
          </>
        }
      >
        <ProCard
          bordered
          headerBordered
          split={'horizontal'}
          style={{ height: '93vh' }}
          colStyle={{ height: '100%' }}
        >
          {/*<ProCard split="horizontal">*/}
          <ProCard
            split="horizontal"
            style={{ height: '100%' }}
            colStyle={{ height: '50%' }}
          >
            <ProCard split="vertical" style={{ height: '100%' }}>
              <ProCard title="地理位置" colSpan={10} style={{ height: '100%' }}>
                <LibrariesMap dateRange={dateRange} />
              </ProCard>
              <ProCard
                title="图书馆借阅量"
                style={{ height: '100%' }}
                extra={
                  <ProFormSelect
                    options={items}
                    name={'dateTrunc'}
                    initialValue={'day'}
                  />
                }
              >
                <HotLibraries dateRange={dateRange} dateTrunc={dateTrunc} />
              </ProCard>
            </ProCard>

            <ProCard
              split="horizontal"
              style={{ height: '100%' }}
              bodyStyle={{ height: '100%' }}
              colStyle={{ height: '100%' }}
            >
              <ProCard
                split="vertical"
                style={{ height: '100%' }}
                bodyStyle={{ height: '100%' }}
              >
                <ProCard title="借阅分类占比" style={{ height: '100%' }}>
                  <HotCategories dateRange={dateRange} />
                </ProCard>
                <ProCard title="热门书籍" style={{ height: '100%' }}>
                  {/*<HotLibraries />*/}
                  <HotBorrowings dateRange={dateRange} />
                </ProCard>
                <ProCard title="热词气泡" style={{ height: '100%' }}>
                  {/*<HotCategories />*/}
                  <HotSearch dateRange={dateRange} />
                </ProCard>
              </ProCard>
            </ProCard>
          </ProCard>
          {/*<ProCard split="vertical">*/}
          {/*  <ProCard split="vertical">*/}
          {/*    <ProCard title="借阅完成率"></ProCard>*/}

          {/*    <ProCard title="热门书籍">*/}
          {/*      <HotBorrowings />*/}
          {/*    </ProCard>*/}
          {/*  </ProCard>*/}
          {/*  <ProCard title="热词气泡">*/}
          {/*    <HotSearch />*/}
          {/*  </ProCard>*/}
          {/*</ProCard>*/}
          {/*</ProCard>*/}
        </ProCard>
      </PageContainer>
    </ProForm>
  );
});
SystemAdminStatistics.displayName = '数据统计界面';

export default SystemAdminStatistics;
