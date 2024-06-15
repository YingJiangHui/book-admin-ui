import { hotBorrowedCategories } from '@/services/statistics';
import { getRangeDateOnUnitOfTime } from '@/utils/date';
import { useRequest } from '@@/exports';
import { Dayjs } from 'dayjs';
import React, { memo, useRef } from 'react';

type props = {
  dateRange?: [Dayjs, Dayjs];
};
export type HotCategoriesProps = props;
export const HotCategories: React.FC<
  React.PropsWithChildren<HotCategoriesProps>
> = memo((props) => {
  const ref = useRef<HTMLDivElement>();
  const { dateRange } = props;

  useRequest(
    () =>
      hotBorrowedCategories(
        getRangeDateOnUnitOfTime({
          startTime: dateRange?.[0],
          endTime: dateRange?.[1],
        }) as any,
      ),
    {
      onSuccess: (res) => {
        let myChart = window.echarts.init(ref.current!);

        const option = {
          title: {
            // text: 'Referer of a Website',
            // subtext: 'Fake Data',
            left: 'center',
          },
          tooltip: {
            trigger: 'item',
          },
          legend: {
            orient: 'vertical',
            left: 'left',
          },
          series: [
            {
              // name: 'Access From',
              type: 'pie',
              radius: '50%',
              data: res.map((item) => ({
                value: item.count,
                name: item.name,
              })),
              emphasis: {
                itemStyle: {
                  shadowBlur: 10,
                  shadowOffsetX: 0,
                  shadowColor: 'rgba(0, 0, 0, 0.5)',
                },
              },
            },
          ],
        };
        // 使用刚指定的配置项和数据显示图表
        myChart.setOption(option);
      },
    },
  );
  return <div ref={ref} style={{ width: '100%', height: '100%' }}></div>;
});
HotCategories.displayName = '热门分类';
