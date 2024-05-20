namespace API {
  namespace Category {
    interface Instance {
      id: number;
      name: string;
      description: string;
    }
    interface CreationParams {
      name: string;
      description: string;
    }
  }
}
