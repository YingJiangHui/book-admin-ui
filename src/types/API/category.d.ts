namespace API {
  namespace Category {
    interface Instance {
      id: number;
      categoryName: string;
      description: string;
    }
    interface CreationParams {
      name: string;
      description: string;
    }
  }
}
