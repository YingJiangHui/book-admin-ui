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

export const getLibrary = (params: { id: number }) =>
  request<API.Common.Result<API.Library.Instance>>(
    `/api/library/${params.id}`,
    {
      method: 'GET',
    },
  );
