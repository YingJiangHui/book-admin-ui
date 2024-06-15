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
} from '@ant-design/pro-components';
import React, { memo } from 'react';

type props = {};
export type SystemAdminStatisticsProps = props;
export const SystemAdminStatistics: React.FC<
  React.PropsWithChildren<SystemAdminStatisticsProps>
> = memo((props) => {
  const [form] = ProForm.useForm();
  const dateRange = ProForm.useWatch('dateRange', form);

  return (
    <PageContainer
      title={'数据统计'}
      extra={
        <ProForm form={form} submitter={false} layout={'horizontal'}>
          时间区间：
          <ProFormDateRangePicker
            label={'时间区间'}
            name={'dateRange'}
            style={{ padding: 0, margin: 0 }}
            noStyle
          />
        </ProForm>
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
        <ProCard split="vertical" style={{ height: '100%' }}>
          <ProCard title="地理位置" style={{ height: '100%' }}>
            <LibrariesMap />
          </ProCard>
          <ProCard
            split="horizontal"
            style={{ height: '100%' }}
            bodyStyle={{ height: '100%' }}
            colStyle={{ height: '50%' }}
          >
            <ProCard
              split="vertical"
              style={{ height: '100%' }}
              bodyStyle={{ height: '100%' }}
            >
              <ProCard title="图书馆排名" style={{ height: '100%' }}>
                <HotLibraries dateRange={dateRange} />
              </ProCard>
              <ProCard title="借阅分类占比" style={{ height: '100%' }}>
                <HotCategories dateRange={dateRange} />
              </ProCard>
            </ProCard>
            <ProCard
              split="vertical"
              style={{ height: '100%' }}
              bodyStyle={{ height: '100%' }}
            >
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
  );
});
SystemAdminStatistics.displayName = '数据统计界面';

export default SystemAdminStatistics;
