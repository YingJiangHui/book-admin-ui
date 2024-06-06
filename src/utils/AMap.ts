/// <reference types="@types/amap-js-api" />

export function searchPoi(keywords: string) {
  return new Promise<AMapTypes.POI.Paging<AMapTypes.POI.SearchResult>>(
    (resolve, reject) => {
      AMap.plugin('AMap.PlaceSearch', function () {
        const autoOptions = {
          // city: '北京',
        };
        // @ts-ignore
        const placeSearch = new AMap.PlaceSearch(autoOptions);
        console.log(placeSearch, 'result');

        placeSearch.search(
          keywords,
          function (
            status: 'error' | 'complete',
            result: {
              info: string;
              poiList: AMapTypes.POI.Paging<AMapTypes.POI.SearchResult>;
            },
          ) {
            console.log(result, 'result');
            if (status === 'complete') {
              resolve(result.poiList);
            } else {
              reject(result);
            }
          },
        );
      });
    },
  );
}

export const getAddressByLngLat = (lngLat: AMap.LngLat) => {
  return new Promise<string>((resolve, reject) => {
    // @ts-ignore
    const geocoder = new AMap.Geocoder({});
    // @ts-ignore
    geocoder.getAddress(lngLat, (status, result) => {
      if (status === 'complete' && result.info === 'OK') {
        console.log('asd位置', result.regeocode.formattedAddress, result);
        resolve(result.regeocode.formattedAddress as string);
      } else {
        reject(result);
      }
    });
  });
};
