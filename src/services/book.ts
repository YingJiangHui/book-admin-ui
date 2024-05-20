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
