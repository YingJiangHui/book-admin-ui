export const RoleEnum: Record<API.Role.RoleType, API.Role.RoleType> = {
  READER: 'READER',
  SYSTEM_ADMIN: 'SYSTEM_ADMIN',
  LIBRARY_ADMIN: 'LIBRARY_ADMIN',
} as const;

export const Role = {
  RoleEnum,
};
