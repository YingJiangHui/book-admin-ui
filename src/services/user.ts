import { request } from '@@/exports';

export const getUsers = (
  params: API.Common.ParamsWithPagination<{
    libraryId: number;
    roleName: API.Role.RoleType;
  }>,
) =>
  request<API.Common.ResultWithPagination<API.User.Instance>>('/api/users', {
    params,
  });

export const getUserInfo = () =>
  request<API.Common.Result<any>>('/api/user/current');
