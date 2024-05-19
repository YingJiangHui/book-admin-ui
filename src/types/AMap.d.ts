namespace AMapTypes {
  namespace POI {
    type Paging<T> = {
      count: number;
      pageIndex: number;
      pageSize: number;
      pois: T[];
    };
    type SearchResult = {
      address: string;
      distance: number;
      id: string;
      location: { lng: number; lat: number };
      name: string;
      shopinfo: string;
      tel: string;
      type: string;
    };
  }
}
