namespace API {
  namespace Reservation {
    type Instance = {
      id: number;
      userId: number;
      bookId: number;
      status:
        | 'CANCELLED'
        | 'FULFILLED'
        | 'EXPIRED'
        | 'BORROWABLE'
        | 'NOT_BORROWABLE';
      createdAt: string;
      borrowedAt: string;
      returnedAt: string;
      book: API.Book.Instance;
      user: API.User.Instance;
      borrowingId: number;
      deleted: boolean;
    };
  }
}
