export const organizationStatuses = ['ACTIVE', 'SUSPENDED', 'ARCHIVED'] as const;

export type OrganizationStatus = (typeof organizationStatuses)[number];

export interface Organization {
  id: string;
  code: string;
  name: string;
  status: OrganizationStatus;
  timezone: string;
  locale: string;
  settings?: Record<string, unknown> | null;
  createdAt: string;
  updatedAt: string;
}

export type CurrentOrganizationResponse = Organization;
