import { hotBorrowedLibraries } from '@/services/statistics';
import { getRangeDateOnUnitOfTime } from '@/utils/date';
import { useModel, useRequest } from '@@/exports';
import { useAccess } from '@umijs/max';
import dayjs, { Dayjs } from 'dayjs';
import React, { memo, useEffect, useRef } from 'react';

type props = {
  dateRange?: [Dayjs, Dayjs];
  dateTrunc?: string;
};
export type HotLibrariesProps = props;
export const HotLibraries: React.FC<
  React.PropsWithChildren<HotLibrariesProps>
> = memo((props) => {
  const ref = useRef<HTMLDivElement>();
  const { dateRange, dateTrunc = 'day' } = props;
  const access = useAccess();

  const { selectedLibrary } = useModel('currentLibrary');
  const chartRef = useRef<echarts.ECharts>();
  useEffect(() => {
    chartRef.current = window.echarts.init(ref.current!);
    return () => {
      chartRef.current?.dispose();
    };
  }, [dateRange, dateTrunc]);
  useRequest(
    () =>
      hotBorrowedLibraries({
        libraryId: access.canLibraryAdminOnly ? selectedLibrary?.id : undefined,
        ...(getRangeDateOnUnitOfTime({
          startTime: dateRange?.[0],
          endTime: dateRange?.[1],
        }) as any),
        dateTrunc,
      }),
    {
      refreshDeps: [
        dateRange,
        dateTrunc,
        access.canLibraryAdminOnly,
        selectedLibrary?.id,
      ],
      onSuccess: async (res) => {
        // const libraries = libraryAllReq.data
        //     ? libraryAllReq.data
        //     : await libraryAllReq.run();
        // console.log(libraries)
        const map = res.reduce((map, item) => {
          return {
            ...map,
            [item.dateRange]: map[item.dateRange]
              ? { ...map[item.dateRange], [item.id]: item }
              : { [item.id]: item },
          };
        }, {} as any);
        console.log(map, 'map');
        // Step 1: 提取所有日期并进行去重和排序
        const dates = [
          ...new Set(res.map((item) => item.dateRange.split('T')[0])),
        ].sort();

        // Step 2: 使用reduce方法来组织数据
        const librariesData = res.reduce((acc, { name, count, dateRange }) => {
          const date = dateRange.split('T')[0];
          if (!acc[name]) acc[name] = {};
          acc[name][date] = count;
          return acc;
        }, {} as Record<string, Record<string, number>>);
        // Step 3: 构建series数据
        const seriesData = Object.entries(librariesData).map(
          ([name, dateCounts]) => {
            const data = dates.map((date) => dateCounts[date] || 0);
            return {
              name,
              type: 'line',
              data,
            };
          },
        );
        console.log(librariesData, dates, seriesData, 'librariesData');
        // let myChart = window.echarts.init(ref.current!);
        const option = {
          legend: {
            data: Object.keys(librariesData),
          },
          xAxis: {
            type: 'category',
            data: dates.map((item) => dayjs(item).format('YYYY-MM-DD')),
            // data: res.map((item) => dayjs(item.dateRange).format('YYYY-MM-DD')),
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
            splitNumber: 5, // 适当设置分割段数，避免小数点
            minInterval: 1, // 设置最小间隔为1，确保不会出现小数点
            name: '借阅（次）',
            nameTextStyle: {
              fontSize: 12,
              lineHeight: 14,
              color: '#666666',
              align: 'center',
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
          series: seriesData,
        };
        // 使用刚指定的配置项和数据显示图表
        chartRef.current.setOption(option);
      },
    },
  );
  return <div ref={ref} style={{ width: '100%', height: '100%' }}></div>;
});
HotLibraries.displayName = '热门图书馆';
