namespace API {
  namespace Library {
    type Instance = {
      id: number;

      name: string;

      latitude: number;

      longitude: number;

      circumference: number;

      address: string;

      closed: boolean;

      disableBorrow: boolean;

      disableReserve: boolean;

      disableReserveApplication: boolean;
    };
  }
}
