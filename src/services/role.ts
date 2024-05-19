import { request } from '@umijs/max';

export const getRoles = async () => {
  return request<API.Common.Result<API.Role.Instance[]>>('/api/roles', {
    method: 'GET',
  });
};
