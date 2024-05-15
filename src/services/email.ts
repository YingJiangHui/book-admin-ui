import { request } from "@umijs/max";

export type emailDto = {
  email: string;
};

export const sendValidationCodeEmail = (params: emailDto) =>
  request("/api/email/validation-code", {
    data: params,
    method: "POST",
  });
