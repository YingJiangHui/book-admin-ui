import { Constants } from '@/constants';

export default (initialState: System.InitialState) => {
  console.log(initialState, 'inital');
  // 在这里按照初始化数据定义项目中的权限，统一管理
  // 参考文档 https://umijs.org/docs/max/access
  const canSeeAdmin = !!(
    initialState && initialState.name !== 'dontHaveAccess'
  );
  return {
    canSeeAdmin,
    canAuth: !!initialState.user,
    canSystemAdmin: initialState.user?.roles.includes(
      Constants.Role.RoleEnum.SYSTEM_ADMIN,
    ),
    canLibraryAdmin: initialState.user?.roles.includes(
      Constants.Role.RoleEnum.LIBRARY_ADMIN,
    ),
  };
};
