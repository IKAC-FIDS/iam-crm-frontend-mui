export interface Passkey {
  id: string;
  deviceName?: string | null;
  createdAt?: string | null;
  lastUsedAt?: string | null;
  transports?: string[] | null;
  backedUp?: boolean | null;
  credentialDeviceType?: string | null;
}
