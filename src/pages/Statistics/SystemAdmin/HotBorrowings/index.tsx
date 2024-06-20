import { Constants } from '@/constants';
import { hotBorrowedBooks } from '@/services/statistics';
import { getRangeDateOnUnitOfTime } from '@/utils/date';
import { getRandomIndex } from '@/utils/randomIndex';
import { useAccess, useModel, useRequest } from '@@/exports';
import { Dayjs } from 'dayjs';
import React, { memo, useRef } from 'react';

type props = {
  dateRange?: [Dayjs, Dayjs];
};
export type HotBorrowingsProps = props;
export const HotBorrowings: React.FC<
  React.PropsWithChildren<HotBorrowingsProps>
> = memo((props) => {
  const { dateRange } = props;

  const ref = useRef<HTMLDivElement>();
  const access = useAccess();

  const { selectedLibrary } = useModel('currentLibrary');
  useRequest(
    () =>
      hotBorrowedBooks({
        ...(getRangeDateOnUnitOfTime({
          startTime: dateRange?.[0],
          endTime: dateRange?.[1],
        }) as any),
        libraryId: access.canLibraryAdminOnly ? selectedLibrary?.id : undefined,
      }),
    {
      refreshDeps: [dateRange, selectedLibrary?.id, access.canLibraryAdminOnly],
      onSuccess: (res) => {
        let myChart = window.echarts.init(ref.current!);
        console.log(res, 'res');
        // 定义数据

        // 将res中相同name的值的count相加
        let map = new Map();
        res.forEach((item) => {
          if (map.has(item.name)) {
            map.set(item.name, map.get(item.name) + item.count);
          } else {
            map.set(item.name, item.count);
          }
        });
        let data = Array.from(map, ([name, count]) => ({ name, count })).map(
          (item) => ({
            value: item.count,
            name: item.name,
            symbolSize: Math.min(Math.max(35, item.count * 5), 150),
            itemStyle: {
              color:
                Constants.Common.Colors[
                  getRandomIndex(Constants.Common.Colors.length)
                ], // 使用随机颜色
            },
          }),
        );
        console.log(data);
        // 按值大小排序
        data.sort(function (a, b) {
          return b.value - a.value;
        });

        // 生成力导向图的数据
        let graphData = data.map(function (item, index) {
          return {
            name: item.name,
            value: item.value,
            symbolSize: item.symbolSize,
            itemStyle: item.itemStyle,
            label: {
              show: true,
              formatter: item.name,
              position: 'inside',
              fontSize: 10,
              color: '#fff',
            },
          };
        });

        // 指定图表的配置项和数据
        let option = {
          title: {
            // text: '气泡图示例',
          },
          tooltip: {},
          series: [
            {
              type: 'graph',
              layout: 'force',
              roam: true,
              label: {
                show: true,
              },
              data: graphData,
              force: {
                repulsion: 300, // 增大斥力，减少气泡密度
                gravity: 0.1,
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
HotBorrowings.displayName = '热门借阅';
