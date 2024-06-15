import { Constants } from '@/constants';
import { hotSearchText } from '@/services/statistics';
import { getRangeDateOnUnitOfTime } from '@/utils/date';
import { getRandomIndex } from '@/utils/randomIndex';
import { useRequest } from '@@/exports';
import { Dayjs } from 'dayjs';
import React, { memo, useRef } from 'react';

type props = {
  dateRange?: [Dayjs, Dayjs];
};
export type HotSearchProps = props;
export const HotSearch: React.FC<React.PropsWithChildren<HotSearchProps>> =
  memo((props) => {
    const { dateRange } = props;
    const ref = useRef<HTMLDivElement>();
    useRequest(
      () =>
        hotSearchText(
          getRangeDateOnUnitOfTime({
            startTime: dateRange?.[0],
            endTime: dateRange?.[1],
          }) as any,
        ),
      {
        refreshDeps: [dateRange],
        onSuccess: (res) => {
          let myChart = window.echarts.init(ref.current!);

          // 定义数据
          let data = res.map((item) => ({
            value: item.count,
            name: item.name,
            symbolSize: Math.min(Math.max(35, item.count * 10), 150),
            itemStyle: {
              color:
                Constants.Common.Colors[
                  getRandomIndex(Constants.Common.Colors.length)
                ], // 使用随机颜色
            },
          }));
          // for (let i = 0; i < 50; i++) {
          //   let value = Math.round(Math.random() * 1000);
          //   data.push({
          //     name: '气泡' + i,
          //     value: value,
          //     symbolSize: Math.max(20, value / 10), // 确保最小气泡大小能够展示四个字符
          //     itemStyle: {
          //       color: getRandomColor(), // 使用随机颜色
          //     },
          //   });
          // }

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
HotSearch.displayName = '热词搜索';
