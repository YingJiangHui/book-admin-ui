import { request } from '@@/exports';

export const reservationBookApply = (params: { bookId: number | string }) => {
  return request('/api/reservation-application', {
    method: 'POST',
    data: params,
  });
};

export const getReservationBookApplication = (params: {
  libraryId?: number | string;
  status?: API.ReservationApplication.Instance['status'];
}) => {
  return request<
    API.Common.ResultWithPagination<API.ReservationApplication.Instance>
  >('/api/reservation-application', {
    method: 'GET',
    params,
  });
};

export const fulfillReservationApplication = (params: {
  id: number | string;
}) => {
  return request<API.Common.Result<API.ReservationApplication.Instance[]>>(
    `/api/reservation-application/${params.id}`,
    { method: 'POST' },
  );
};

export const cancelReservationApplication = (params: {
  id: number | string;
}) => {
  return request(`/api/reservation-application/${params.id}`, {
    method: 'DELETE',
  });
};

export const resendNotification = (params: { id: number }) => {
  return request(
    `/api/reservation-application/${params.id}/resend-notification`,
    {
      method: 'POST',
    },
  );
};
