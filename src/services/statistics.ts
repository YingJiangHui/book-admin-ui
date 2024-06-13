import { request } from '@@/exports';

interface StatisticsQuery {
  startTime: string;
  endTime: string;
}

interface HotRankStatisticsData {
  id: number;
  name: string;
  count: number;
}

export const hotBorrowedBooks = (params: StatisticsQuery) => {
  return request<API.Common.Result<HotRankStatisticsData[]>>(
    '/api/statistics/hot-borrowed-books',
  );
};
export const hotBorrowedCategories = (params: StatisticsQuery) => {
  return request<API.Common.Result<HotRankStatisticsData[]>>(
    '/api/statistics/hot-borrowed-categories',
  );
};
export const hotBorrowedLibraries = (params: StatisticsQuery) => {
  return request<API.Common.Result<HotRankStatisticsData[]>>(
    '/api/statistics/hot-borrowed-libraries',
  );
};
export const hotSearchText = (params: StatisticsQuery) => {
  return request<API.Common.Result<HotRankStatisticsData[]>>(
    '/api/statistics/hot-search-text',
  );
};
