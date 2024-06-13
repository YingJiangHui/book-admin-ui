import { HotBorrowings } from '@/pages/Statistics/SystemAdmin/HotBorrowings';
import { HotCategories } from '@/pages/Statistics/SystemAdmin/HotCategories';
import { HotLibraries } from '@/pages/Statistics/SystemAdmin/HotLibraries';
import { HotSearch } from '@/pages/Statistics/SystemAdmin/HotSearch';
import { LibrariesMap } from '@/pages/Statistics/SystemAdmin/LibrariesMap';
import { ProCard } from '@ant-design/pro-components';
import React, { memo, useState } from 'react';

type props = {};
export type SystemAdminStatisticsProps = props;
export const SystemAdminStatistics: React.FC<
  React.PropsWithChildren<SystemAdminStatisticsProps>
> = memo((props) => {
  const [responsive, setResponsive] = useState(false);

  return (
    // <PageContainer title={'数据统计'}>
    <ProCard
      title="数据统计"
      extra="2019年9月28日"
      bordered
      headerBordered
      split={responsive ? 'horizontal' : 'vertical'}
    >
      <ProCard split="horizontal">
        <ProCard split="vertical">
          <ProCard title="地理位置">
            <LibrariesMap />
          </ProCard>
          <ProCard split="vertical">
            <ProCard title="图书馆排名">
              <HotLibraries />
            </ProCard>
            <ProCard title="借阅分类占比">
              <HotCategories />
            </ProCard>
          </ProCard>
        </ProCard>
        <ProCard split="vertical">
          <ProCard split="vertical">
            <ProCard title="借阅完成率"></ProCard>

            <ProCard title="热门书籍">
              <HotBorrowings />
            </ProCard>
          </ProCard>
          <ProCard title="热词气泡">
            <HotSearch />
          </ProCard>
        </ProCard>
      </ProCard>
    </ProCard>
    // </PageContainer>
  );
});
SystemAdminStatistics.displayName = '数据统计界面';

export default SystemAdminStatistics;
