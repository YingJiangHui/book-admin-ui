namespace API {
  namespace Common {
    type ParamsWithPagination<T extends object = {}> = {
      current?: number;
      pageSize?: number;
    } & T;
    type ResultWithPagination<T> = Result<{
      data: T[];
      total: number;
    }>;
    type Result<T> = {
      code: number;
      message: string;
      data: T;
      success: boolean;
    };
  }
}
