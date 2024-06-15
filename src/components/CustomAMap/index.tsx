import {
  AMapControlValueType,
  ControlPanel,
} from '@/components/CustomAMap/ControlPanel';
import { getAddressByLngLat } from '@/utils/AMap';
import { ProFormProps } from '@ant-design/pro-components';
import { Form } from 'antd';
import React, { memo, useEffect, useRef } from 'react';
/// <reference types="@types/amap-js-api" />
type props = {};
export type CustomAMapProps = props &
  ProFormProps<Partial<API.Library.Instance>>;
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

const setPoint =
  (aMap: AMap.Map, circleInstance: AMap.Circle, markerInstance: AMap.Marker) =>
  (params: { lnglat: AMap.LngLat; radius: number }) => {
    const { lnglat, radius } = params;
    markerInstance.setPosition(lnglat);
    circleInstance.setCenter(lnglat);
    circleInstance.setRadius(radius);
    aMap?.add(markerInstance);
    aMap?.add(circleInstance);
  };

export const CustomAMap: React.FC<React.PropsWithChildren<CustomAMapProps>> =
  memo((props) => {
    const { onFinish, initialValues } = props;
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

        // 添加点击事件
        MapRef.current.on('click', (e) => {
          const { lnglat } = e;
          console.log(e, 'e');
          setPoint(
            MapRef.current!,
            circleInstance,
            markerInstance,
          )({ radius: form.getFieldValue('circumference'), lnglat: lnglat });

          MapRef.current?.setCenter(markerInstance.getPosition()!);
          MapRef.current?.setZoom(18);
          form.setFieldsValue({
            coords: `${lnglat.lng},${lnglat.lat}`,
          });

          getAddressByLngLat(lnglat).then((res) => {
            form.setFieldsValue({
              address: res,
            });
          });
        });
      } else {
        console.error('AMap not loaded');
      }
    }, []);
    useEffect(() => {
      if (
        initialValues?.longitude &&
        initialValues.latitude &&
        initialValues?.circumference
      ) {
        const center = new AMap.LngLat(
          initialValues.longitude,
          initialValues.latitude,
        );
        setPoint(
          MapRef.current!,
          circleInstance,
          markerInstance,
        )({ radius: initialValues.circumference, lnglat: center });

        MapRef.current?.setCenter(markerInstance.getPosition()!);
        MapRef.current?.setZoom(12);
      }
    }, [
      initialValues?.latitude,
      initialValues?.longitude,
      initialValues?.circumference,
    ]);
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
            maxHeight: 'calc(100% - 32px)',
            overflow: 'auto',
          }}
        >
          <ControlPanel
            initialValues={initialValues}
            onFinish={async (values) => {
              const [longitude, latitude] = values.coords
                ?.split(',')
                .map(Number);
              return onFinish?.({
                name: values.name,
                latitude: latitude,
                longitude: longitude,
                circumference: values.circumference,
                address: values.address,
                disableBorrow: values.disableBorrow,
                disableReserve: values.disableReserve,
                closed: values.closed,
              });
            }}
            form={form}
            onValuesChange={(changedValue, values) => {
              if (
                changedValue.searchCoords ||
                (changedValue?.coords &&
                  changedValue?.coords?.indexOf(',') !== -1)
              ) {
                const coords = changedValue.searchCoords || values?.coords;
                const center = new AMap.LngLat(
                  ...(coords.split(',').map(Number) as [number, number]),
                );
                setPoint(
                  MapRef.current!,
                  circleInstance,
                  markerInstance,
                )({ radius: values.circumference, lnglat: center });
                getAddressByLngLat(center).then((res) => {
                  form.setFieldValue('address', res);
                });
                MapRef.current?.setCenter(markerInstance.getPosition()!);
                MapRef.current?.setZoom(18);
                form.setFieldValue('coords', coords);
              }

              if (changedValue.circumference) {
                circleInstance.setRadius(changedValue.circumference);
              }
            }}
          />
        </div>
      </div>
    );
  });
CustomAMap.displayName = '自定义高德地图';
