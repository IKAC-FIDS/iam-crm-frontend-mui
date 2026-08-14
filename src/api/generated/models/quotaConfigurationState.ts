/**
 * AUTO-GENERATED FILE.
 * DO NOT EDIT MANUALLY.
 * Source: contracts/backend/openapi.json.
 */

export type QuotaConfigurationState = typeof QuotaConfigurationState[keyof typeof QuotaConfigurationState];


export const QuotaConfigurationState = {
  ENFORCED: 'ENFORCED',
  UNLIMITED: 'UNLIMITED',
  DISABLED: 'DISABLED',
  UNCONFIGURED: 'UNCONFIGURED',
  LEGACY_COMPATIBILITY: 'LEGACY_COMPATIBILITY',
  INACTIVE_ORGANIZATION: 'INACTIVE_ORGANIZATION',
  INACTIVE_SUBSCRIPTION: 'INACTIVE_SUBSCRIPTION',
} as const;
