namespace API {
  namespace ReservationApplication {
    type Instance = {
      id: number;
      userId: number;
      bookId: number;
      status: 'PENDING' | 'CANCELLED' | 'FULFILLED' | 'NOTIFIED';
      createdAt: string;
      book: API.Book.Instance;
      user: API.User.Instance;
    };
  }
}
