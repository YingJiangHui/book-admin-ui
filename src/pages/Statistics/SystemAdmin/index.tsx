import { ProFormSelect } from '@ant-design/pro-components';
import React, { memo } from 'react';

type props = {};
export type SystemAdminStatisticsProps = props;
export const SystemAdminStatistics: React.FC<
  React.PropsWithChildren<SystemAdminStatisticsProps>
> = memo((props) => {
  return (
    <>
      <ProFormSelect />
    </>
  );
});
SystemAdminStatistics.displayName = '数据统计界面';

export default SystemAdminStatistics;
