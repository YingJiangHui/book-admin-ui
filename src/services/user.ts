import { request } from '@@/exports';

export const getUsers = (
  params: API.Common.ParamsWithPagination<{
    libraryIds: number;
    roleNames: API.Role.RoleType;
  }>,
) =>
  request<API.Common.ResultWithPagination<API.User.Instance>>('/api/users', {
    params,
  });

export const getUserInfo = () =>
  request<API.Common.Result<API.User.Current>>('/api/users/current');
