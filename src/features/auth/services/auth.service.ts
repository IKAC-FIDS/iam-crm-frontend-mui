// ============================================================
// مسیر: src/features/auth/services/auth.service.ts
// ============================================================

import axiosInstance from '@/lib/axios';
import { unwrapApiResponse, type ApiWrappedResponse } from '@/lib/apiResponse';
import type {
  AuthenticationResponseJSON,
  PublicKeyCredentialRequestOptionsJSON,
} from '@simplewebauthn/browser';

export interface LoginRequest {
  email: string;
  password: string;
}

export interface LoginResponse {
  accessToken: string;
  user: {
    id: string;
    fullName: string;
    email: string;
    role: string;
    team: string | null;
    permissions: string[];
    organizationId?: string | null;
  };
}

export interface PasskeyAuthenticationOptionsResponse {
  challengeId: string;
  options: PublicKeyCredentialRequestOptionsJSON;
}

export interface PasskeyAuthenticationVerifyRequest {
  challengeId: string;
  response: AuthenticationResponseJSON;
}

export const authService = {
  login: async (data: LoginRequest): Promise<LoginResponse> => {
    const response = await axiosInstance.post<ApiWrappedResponse<LoginResponse>>('/auth/login', data);
    return unwrapApiResponse<LoginResponse>(response.data);
  },
  logout: async (): Promise<void> => {
    await axiosInstance.post('/auth/logout');
  },
  getPasskeyAuthenticationOptions: async (): Promise<PasskeyAuthenticationOptionsResponse> => {
    const response = await axiosInstance.post<ApiWrappedResponse<PasskeyAuthenticationOptionsResponse>>(
      '/auth/passkeys/authentication/options',
      {}
    );
    return unwrapApiResponse<PasskeyAuthenticationOptionsResponse>(response.data);
  },
  verifyPasskeyAuthentication: async (
    data: PasskeyAuthenticationVerifyRequest
  ): Promise<LoginResponse> => {
    const response = await axiosInstance.post<ApiWrappedResponse<LoginResponse>>(
      '/auth/passkeys/authentication/verify',
      data
    );
    return unwrapApiResponse<LoginResponse>(response.data);
  },
};
