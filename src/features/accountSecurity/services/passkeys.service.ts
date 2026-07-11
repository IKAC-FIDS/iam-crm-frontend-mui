import type {
  PublicKeyCredentialCreationOptionsJSON,
  RegistrationResponseJSON,
} from '@simplewebauthn/browser';

import axiosInstance from '@/lib/axios';
import { unwrapApiResponse } from '@/lib/apiResponse';
import type { Passkey } from '../types/passkey.types';

function normalizePasskey(item: unknown): Passkey {
  const row = item as Record<string, unknown>;
  const transports = Array.isArray(row.transports)
    ? row.transports.map(String)
    : null;

  return {
    id: String(row.id),
    deviceName: row.deviceName == null ? null : String(row.deviceName),
    createdAt: row.createdAt == null ? null : String(row.createdAt),
    lastUsedAt: row.lastUsedAt == null ? null : String(row.lastUsedAt),
    transports,
    backedUp: row.backedUp == null ? null : Boolean(row.backedUp),
    credentialDeviceType:
      row.credentialDeviceType == null ? null : String(row.credentialDeviceType),
  };
}

function normalizePasskeys(payload: unknown): Passkey[] {
  const value = unwrapApiResponse<unknown>(payload);
  const data = Array.isArray(value)
    ? value
    : value && typeof value === 'object' && 'items' in value && Array.isArray((value as { items?: unknown }).items)
      ? (value as { items: unknown[] }).items
      : [];

  return data.map(normalizePasskey);
}

export const passkeysService = {
  list: async (): Promise<Passkey[]> => {
    const response = await axiosInstance.get<unknown>('/me/passkeys');
    return normalizePasskeys(response.data);
  },
  getRegistrationOptions: async (
    deviceName: string
  ): Promise<PublicKeyCredentialCreationOptionsJSON> => {
    const response = await axiosInstance.post<PublicKeyCredentialCreationOptionsJSON>(
      '/me/passkeys/registration/options',
      { deviceName }
    );
    return unwrapApiResponse<PublicKeyCredentialCreationOptionsJSON>(response.data);
  },
  verifyRegistration: async (data: {
    deviceName: string;
    response: RegistrationResponseJSON;
  }): Promise<void> => {
    await axiosInstance.post('/me/passkeys/registration/verify', data);
  },
  delete: async (id: string): Promise<void> => {
    await axiosInstance.delete(`/me/passkeys/${id}`);
  },
};
