import { request } from '@umijs/max';

export const getAllCategories = () => {
  return request<API.Common.Result<API.Category.Instance[]>>(
    '/api/categories/all',
  );
};

export const getCategories = (params?: API.Common.ParamsWithPagination) => {
  return request<API.Common.ResultWithPagination<API.Category.Instance>>(
    '/api/categories',
    {
      params,
    },
  );
};

export const createCategory = (params: API.Category.CreationParams) => {
  return request<API.Common.Result<API.Category.Instance>>('/api/categories', {
    data: params,
    method: 'POST',
  });
};
