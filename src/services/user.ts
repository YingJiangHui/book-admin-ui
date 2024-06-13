import { request } from '@@/exports';

export const getUsers = (
  params: API.Common.ParamsWithPagination<
    Partial<{
      libraryIds: number;
      roleNames: API.Role.RoleType;
    }>
  >,
) =>
  request<API.Common.ResultWithPagination<API.User.Instance>>('/api/users', {
    params,
  });

export const getUserInfo = (config?: { skipErrorHandler: boolean }) =>
  request<API.Common.Result<API.User.Current>>('/api/users/current', {
    ...config,
  });

export const updateUserInfo = (params: {
  id: number;
  roles?: API.Role.RoleType[];
  libraryIds?: number[];
  isBlacklist?: boolean;
}) => {
  const { id, ...rest } = params;
  return request<API.Common.Result<API.User.Current>>(
    `/api/users/${params.id}`,
    {
      method: 'PATCH',
      data: rest,
    },
  );
};
