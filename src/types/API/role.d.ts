namespace API {
  namespace Role {
    type RoleType = 'READER' | 'SYSTEM_ADMIN' | 'LIBRARY_ADMIN';
    type Instance = {
      id: number;
      roleName: RoleType;
      description: string;
    };
  }
}
