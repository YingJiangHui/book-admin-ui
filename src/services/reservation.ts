import { request } from '@@/exports';

export const getReservations = (
  params: API.Common.ParamsWithPagination<{
    status?: API.Reservation.Instance['status'][];
    libraryId: number;
  }>,
) =>
  request<API.Common.ResultWithPagination<API.Reservation.Instance>>(
    '/api/books/reservation/all',
    {
      method: 'GET',
      params,
    },
  );

export const cancelReservations = (params: { ids: (number | string)[] }) => {
  return request('/api/books/reservation/cancel', {
    method: 'POST',
    data: params.ids,
  });
};
