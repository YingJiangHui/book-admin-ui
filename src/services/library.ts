import { request } from '@@/exports';
export const postCreateLibrary = (params: Partial<API.Library.Instance>) =>
  request<API.Common.Result<API.Library.Instance>>('/api/library', {
    data: params,
    method: 'POST',
  });

export const postUpdateLibrary = (params: Partial<API.Library.Instance>) =>
  request<API.Common.Result<string>>('/api/library', {
    data: params,
    method: 'PATCH',
  });

export const getLibraries = (
  params?: API.Common.ParamsWithPagination<API.Library.Instance>,
) =>
  request<API.Common.ResultWithPagination<API.Library.Instance>>(
    '/api/library',
    {
      // data: params,
      method: 'GET',
      params,
    },
  );

export const getLibrariesAll = () =>
  request<API.Common.Result<API.Library.Instance[]>>('/api/library/all', {
    // data: params,
    method: 'GET',
  });

export const getLibrary = (params: { id: number | string }) =>
  request<API.Common.Result<API.Library.Instance>>(
    `/api/library/${params.id}`,
    {
      method: 'GET',
    },
  );

export const getBooksInLibrary = (
  params: API.Common.ParamsWithPagination<{ libraryId?: number }>,
) => {
  const { libraryId, ...rest } = params;
  return request<API.Common.Result<API.Library.Instance>>(
    `/api/library/${libraryId}/books`,
    {
      params: rest,
      method: 'GET',
    },
  );
};
