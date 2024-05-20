import { request } from '@@/exports';
export const postCreateLibrary = (params: Omit<API.Library.Instance, 'id'>) =>
  request<API.Common.Result<string>>('/api/library', {
    data: params,
    method: 'POST',
  });

export const getLibraries = () =>
  request<API.Common.Result<API.Library.Instance[]>>('/api/library', {
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
