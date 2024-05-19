import {
  AMapControlValueType,
  ControlPanel,
} from '@/components/CustomAMap/ControlPanel';
import { postCreateLibrary } from '@/services/library';
import { Form, message } from 'antd';
import React, { memo, useEffect, useRef } from 'react';
/// <reference types="@types/amap-js-api" />
type props = {};
export type CustomAMapProps = props;
const markerInstance = new AMap.Marker({
  icon: 'https://webapi.amap.com/theme/v1.3/markers/n/mark_b.png',
  anchor: 'bottom-center',
});

const circleInstance = new AMap.Circle({
  // center: new AMap.LngLat("116.403322", "39.920255"), // 圆心位置
  strokeColor: '#1677ff', //线颜色
  strokeOpacity: 1, //线透明度
  strokeWeight: 3, //线粗细度
  fillColor: '#1677ff', //填充颜色
  fillOpacity: 0.35, //填充透明度
  // draggable: true
});

export const CustomAMap: React.FC<React.PropsWithChildren<CustomAMapProps>> =
  memo((props) => {
    const [form] = Form.useForm<AMapControlValueType>();
    const mapContainerRef = useRef<HTMLDivElement>(null);
    const MapRef = useRef<AMap.Map>();
    useEffect(() => {
      const { AMap } = window;
      if (AMap && mapContainerRef.current) {
        MapRef.current = new AMap.Map(mapContainerRef.current, {
          // center: [116.397428, 39.90923], // 中心点坐标
          zoom: 11, // 缩放级别
        });

        // // 添加标记
        // const marker = new AMap.Marker({
        //   position: [116.397428, 39.90923],
        // });
        // MapRef.current.add(marker);

        // 添加点击事件
        MapRef.current.on('click', (e) => {
          const { lnglat } = e;
          circleInstance.setCenter(lnglat);
          markerInstance.setPosition(lnglat);
          MapRef.current?.add(circleInstance);
          MapRef.current?.add(markerInstance);
          form.setFieldsValue({
            coordsDisplay: `${lnglat.lng},${lnglat.lat}`,
          });
          // new AMap.Marker({
          //   position: lnglat,
          //   map: map,
          // });
        });
      } else {
        console.error('AMap not loaded');
      }
    }, []);

    return (
      <div style={{ position: 'relative' }}>
        <div
          ref={mapContainerRef}
          style={{ width: '100%', height: window.innerHeight - 72 - 100 }}
        />
        <div
          style={{
            position: 'absolute',
            zIndex: 100,
            top: 16,
            right: 16,
            background: '#fff',
            padding: 12,
            borderRadius: 5,
            width: 300,
          }}
        >
          <ControlPanel
            onFinish={async (values) => {
              const [longitude, latitude] = values.coordsDisplay
                ?.split(',')
                .map(Number);
              await postCreateLibrary({
                name: values.name,
                latitude: latitude,
                longitude: longitude,
                circumference: values.circumference,
              });
              message.success('添加成功');
              history.back();
            }}
            form={form}
            onChange={(changedValue, values) => {
              if (!values?.coords || values?.coords.indexOf(',') === -1) {
                return;
              }
              const center = new AMap.LngLat(
                ...(values?.coords.split(',').map(Number) as [number, number]),
              );
              markerInstance.setPosition(center);
              circleInstance.setCenter(center);
              circleInstance.setRadius(values.circumference);
              MapRef.current?.add(markerInstance);
              MapRef.current?.add(circleInstance);
              MapRef.current?.setCenter(markerInstance.getPosition()!);
              // MapRef.current?.zoomIn();
              MapRef.current?.setZoom(18);
              // form.setFieldsValue({
              //   coordsDisplay: values.coords,
              // });
            }}
          />
        </div>
      </div>
    );
  });
CustomAMap.displayName = '自定义高德地图';
