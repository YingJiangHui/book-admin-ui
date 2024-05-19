import { request } from '@umijs/max';

export type LoginReq = {
  email: string;
  password: string;
};
export const postLogin = (params: LoginReq) =>
  request<API.Common.Result<string>>('/api/auth/login', {
    data: params,
    method: 'POST',
  });

export type RegisterReq = {
  email: string;
  password: string;
  passwordConfirmation: string;
  verificationCode: string;
};
export const postRegister = (params: RegisterReq) =>
  request('/api/auth/register', {
    data: params,
    method: 'POST',
  });

export type resetPasswordReq = {
  email: string;
  password: string;
  passwordConfirmation: string;
  verificationCode: string;
};
export const resetPassword = (params: resetPasswordReq) =>
  request('/api/auth/reset-password', {
    data: params,
    method: 'POST',
  });

export type inviteRegisterReq = {
  email: string;
  libraryIds: number[];
  roles: API.Role.RoleType[];
};
export const sendInviteCode = (params: inviteRegisterReq) =>
  request('/api/auth/invitation-code', {
    data: params,
    method: 'POST',
  });
