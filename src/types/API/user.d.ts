namespace API {
  namespace User {
    type Role = API.Role.RoleType;
    type Current = {
      id: number;
      email: string;
      roles: Role[];
      createdAt: string;
    };
    type Instance = {
      id: number;
      email: string;
      roles: API.Role.Instance[];
      libraryIds: number[];
    };
  }
}
