namespace API {
  namespace User {
    type Role = API.Role.RoleType;
    type Instance = {
      id: number;
      email: string;
      roles: API.Role.Instance[];
      libraryIds: number[];
    };
  }
}
