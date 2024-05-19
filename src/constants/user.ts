export const UserRoleMapToText: Record<API.User.Role, string> = {
  READER: '读者',
  SYSTEM_ADMIN: '系统管理员',
  LIBRARY_ADMIN: '图书馆管理员',
};

export const UserRoleOption: { value: API.User.Role; label: string }[] = [
  { value: 'READER', label: '读者' },
  { value: 'SYSTEM_ADMIN', label: '系统管理员' },
  { value: 'LIBRARY_ADMIN', label: '图书馆管理员' },
];

export const User = {
  UserRoleMapToText,
  UserRoleOption,
};
