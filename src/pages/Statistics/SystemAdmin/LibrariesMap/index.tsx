import { getLibrariesAll } from '@/services/library';
import { useAccess, useModel, useRequest } from '@@/exports';
import { EChartOption, EChartsResponsiveOption } from 'echarts';
import React, { memo, useRef } from 'react';
type props = {};
export type LibrariesMapProps = props;
export const LibrariesMap: React.FC<
  React.PropsWithChildren<LibrariesMapProps>
> = memo((props) => {
  const ref = useRef<HTMLDivElement>();

  const access = useAccess();

  const { selectedLibrary } = useModel('currentLibrary');
  useRequest(
    () =>
      access.canLibraryAdminOnly
        ? Promise.resolve({ data: selectedLibrary ? [selectedLibrary] : [] })
        : getLibrariesAll(),
    {
      refreshDeps: [access.canLibraryAdminOnly, selectedLibrary],
      onSuccess: (res) => {
        let myChart = window.echarts.init(ref.current!);

        // 指定图表的配置项和数据
        let option: EChartOption<{ name: string }> | EChartsResponsiveOption = {
          title: {
            // text: 'ECharts 地图示例',
            // subtext: '显示标记点和信息',
            left: 'center',
          },
          tooltip: {
            trigger: 'item',
          },
          geo: {
            map: 'china',
            roam: true, // 允许缩放和平移
            label: {
              emphasis: {
                show: false,
              },
            },
            itemStyle: {
              normal: {
                areaColor: '#323c48',
                borderColor: '#404a59',
              },
              emphasis: {
                areaColor: '#2a333d',
              },
            },
          },
          series: [
            {
              name: '地点',
              type: 'scatter',
              coordinateSystem: 'geo',
              data: res.map((item) => ({
                name: item.name,
                address: item.address,
                value: [item.longitude, item.latitude],
              })),
              symbolSize: 12,
              label: {
                normal: {
                  formatter: '{b}',
                  position: 'right',
                  show: true,
                },
                emphasis: {
                  show: true,
                },
              },
              itemStyle: {
                normal: {
                  color: '#ddb926',
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
  return (
    <div ref={ref} id="map" style={{ width: '100%', height: '100%' }}></div>
  );
});
LibrariesMap.displayName = 'LibrariesMap';
