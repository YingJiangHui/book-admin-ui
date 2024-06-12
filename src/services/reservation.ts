import { request } from '@@/exports';

export const getReservations = (params: {}) => {
  return request<API.Common.Result<API.Reservation.Instance[]>>(
    '/api/books/reservation',
    {
      method: 'GET',
      params: params,
    },
  );
};

export const cancelReservations = (params: { ids: (number | string)[] }) => {
  return request('/api/books/reservation/cancel', {
    method: 'POST',
    data: params.ids,
  });
};
