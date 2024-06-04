import { request } from '@@/exports';

export const getSystemSettings = async () => {
  return request<API.Common.Result<API.SystemSetting.Instance[]>>(
    `/api/system-settings`,
  );
};

export const saveSystemSettings = async (
  params: API.SystemSetting.Instance[],
) => {
  return request(`/api/system-settings`, { method: 'POST', data: params });
};

export const updateSystemSettings = async (
  params: Pick<API.SystemSetting.Instance, 'name' | 'value'>[],
) => {
  return request(`/api/system-settings`, { method: 'PATCH', data: params });
};
