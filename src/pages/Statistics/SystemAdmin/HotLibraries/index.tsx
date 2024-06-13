import { hotBorrowedLibraries } from '@/services/statistics';
import { useRequest } from '@@/exports';
import React, { memo, useRef } from 'react';

type props = {};
export type HotLibrariesProps = props;
export const HotLibraries: React.FC<
  React.PropsWithChildren<HotLibrariesProps>
> = memo((props) => {
  const ref = useRef<HTMLDivElement>();

  useRequest(hotBorrowedLibraries, {
    onSuccess: (res) => {
      let myChart = window.echarts.init(ref.current!);
      const option = {
        xAxis: {
          type: 'category',
          data: res
            .map((item) => ({
              value: item.count,
              name: item.name,
            }))
            .sort((a, b) => (a.value > b.value ? 1 : -1))
            .map((item) => item.name),
          axisLabel: {
            show: true,
            color: '#666666',
          },
          axisLine: {
            show: true,
            onZero: true,
            lineStyle: {
              color: '#EAEDF6',
            },
          },
          axisTick: {
            alignWithLabel: true,
          },
        },
        yAxis: {
          name: '借阅次数',
          nameTextStyle: {
            fontSize: 12,
            lineHeight: 14,
            color: '#666666',
            align: 'right',
          },
          nameGap: 8,
          axisLabel: {
            show: true,
            color: '#666666',
          },
          axisLine: {
            show: true,
            onZero: true,
            lineStyle: {
              color: '#EAEDF6',
            },
          },
          splitLine: {
            lineStyle: {
              type: 'dashed',
              dashOffset: 4,
            },
          },
        },
        tooltip: {
          trigger: 'axis',
        },
        series: [
          {
            data: res.map((item) => item.count),
            type: 'bar',
            // barMaxWidth:
            //     searchArrivalService.data?.data.length && searchArrivalService.data?.data.length > 15 ? "100%" : "100%",
            itemStyle: {
              color: '#1890ff',
            },
            areaStyle: {
              color: {
                type: 'linear',
                x: 0,
                y: 0,
                x2: 0,
                y2: 1,
                colorStops: [
                  {
                    offset: 0,
                    color: '#1890FF', // 0% 处的颜色
                  },
                  {
                    offset: 1,
                    color: '#fff', // 100% 处的颜色
                  },
                ],
                global: false, // 缺省为 false
              },
            },
          },
        ],
      };
      // 使用刚指定的配置项和数据显示图表
      myChart.setOption(option);
    },
  });
  return <div ref={ref} style={{ width: '100%', height: '100%' }}></div>;
});
HotLibraries.displayName = '热门图书馆';
