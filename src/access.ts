import { Constants } from '@/constants';

export default (initialState: System.InitialState) => {
  console.log(initialState, 'inital');
  // 在这里按照初始化数据定义项目中的权限，统一管理
  // 参考文档 https://umijs.org/docs/max/access

  const canSystemAdmin = initialState.user?.roles.includes(
    Constants.Role.RoleEnum.SYSTEM_ADMIN,
  );
  const canLibraryAdmin = initialState.user?.roles.includes(
    Constants.Role.RoleEnum.LIBRARY_ADMIN,
  );
  return {
    canAuth: !!initialState.user,
    canSystemAdmin: canSystemAdmin,
    canLibraryAdmin: canLibraryAdmin,
    canLibraryAdminOnly:
      canLibraryAdmin &&
      !canSystemAdmin &&
      initialState.user?.managedLibraries.filter((lib) => !lib.closed)
        .length !== 0,
  };
};
