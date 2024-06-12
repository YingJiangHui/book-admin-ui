namespace API {
  namespace Borrowing {
    type Instance = {
      id: number;
      userId: number;
      bookId: number;
      status:
        | 'OVERDUE_RETURNED'
        | 'RETURNED'
        | 'OVERDUE_NOT_RETURNED'
        | 'NOT_RETURNED';
      createdAt: string;
      borrowedAt: string;
      returnedAt: string;
      expectedReturnAt: string;
      book: API.Book.Instance;
      user: API.User.Instance;
    };
  }
}
