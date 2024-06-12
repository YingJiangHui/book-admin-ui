import { request } from '@@/exports';

export const borrowBookFormReservations = (params: {
  reservationIds: number[];
}) =>
  request<API.Common.Result<API.Book.Instance>>(
    `/api/books/borrowing/reservations`,
    {
      method: 'POST',
      data: params.reservationIds,
    },
  );

export const getBorrowings = (
  params: API.Common.ParamsWithPagination<{
    status?: API.Borrowing.Instance['status'][];
    libraryId: number;
  }>,
) =>
  request<API.Common.ResultWithPagination<API.Borrowing.Instance>>(
    '/api/books/borrowing/all',
    {
      method: 'GET',
      params,
    },
  );

export const returnBook = (params: { borrowingIds: number }) => {
  return request<API.Common.Result<API.Book.Instance>>(
    `/api/books/borrowing/return`,
    {
      method: 'POST',
      data: params.borrowingIds,
    },
  );
};

export const renewBook = (params: {
  borrowingIds: number[];
  expectedReturnAt: string;
}) => {
  return request<API.Common.Result<API.Book.Instance>>(
    `/api/books/borrowing/renew`,
    {
      method: 'POST',
      data: params,
    },
  );
};
