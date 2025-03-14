import { objectToFormData } from '@/utils/FormData';
import { request } from '@umijs/max';
import { UploadFile } from 'antd/es/upload/interface';

export const getBooks = async (params: API.Book.ListParams) => {
  return request<API.Common.ResultWithPagination<API.Book.Instance>>(
    '/api/books',
    {
      params,
    },
  );
};

export const createBook = async (params: API.Book.CreateParams) => {
  const { file, ...rest } = params;
  const formData = objectToFormData(rest);
  (file as UploadFile[]).forEach((f) => {
    formData.append('file', f.originFileObj!);
  });
  return request<API.Common.Result<API.Book.Instance>>('/api/books', {
    data: formData,
    method: 'POST',
  });
};

export const updateBook = async (
  params: API.Book.CreateParams & { id: number | string; oldFileIds: number[] },
) => {
  const { id, file, oldFileIds, ...rest } = params;
  const formData = objectToFormData(rest);

  if (file.length)
    file.forEach((f) => {
      formData.append('file', f.originFileObj!);
    });
  if (oldFileIds.length)
    oldFileIds.forEach((f) => {
      formData.append('oldFileIds', f.toString());
    });

  return request<API.Common.Result<API.Book.Instance>>(`/api/books/${id}`, {
    data: formData,
    method: 'PATCH',
  });
};

export const deleteBook = async (params: { id: number }) => {
  return request<API.Common.Result<string>>(`/api/books/${params.id}`, {
    method: 'DELETE',
  });
};

export const recoverBook = async (params: { id: number }) => {
  return request<API.Common.Result<string>>(`/api/books/${params.id}`, {
    method: 'POST',
  });
};
