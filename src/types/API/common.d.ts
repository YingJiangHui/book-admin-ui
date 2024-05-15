namespace API {
  namespace Common {
    type Result<T> = {
      code: number;
      message: string;
      data: T;
      success: boolean;
    };
  }
}
