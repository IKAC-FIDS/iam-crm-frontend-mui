// ============================================================
// مسیر: src/features/auth/services/auth.service.ts
// ============================================================

import axiosInstance from '@/lib/axios';
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
    const response = await axiosInstance.post<LoginResponse>('/auth/login', data);
    return response.data;
  },
  getPasskeyAuthenticationOptions: async (): Promise<PasskeyAuthenticationOptionsResponse> => {
    const response = await axiosInstance.post<PasskeyAuthenticationOptionsResponse>(
      '/auth/passkeys/authentication/options',
      {}
    );
    return response.data;
  },
  verifyPasskeyAuthentication: async (
    data: PasskeyAuthenticationVerifyRequest
  ): Promise<LoginResponse> => {
    const response = await axiosInstance.post<LoginResponse>(
      '/auth/passkeys/authentication/verify',
      data
    );
    return response.data;
  },
};
