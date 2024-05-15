import { request } from "@@/exports";

export const getUsers = () =>
  request("/api/users", {
    params: { id: 1 },
  });

export const getUserInfo = () =>
  request<API.Common.Result<any>>("/api/currentUser");
