export const CATALOG_DEFINITIONS = {
  industries: { label: 'صنایع', endpoint: '/industries' },
  leadSources: { label: 'منابع جذب', endpoint: '/lead-sources' },
  painPoints: { label: 'نقاط درد', endpoint: '/pain-points' },
  useCases: { label: 'کاربردها', endpoint: '/use-cases' },
  personas: { label: 'پرسوناها', endpoint: '/personas' },
  lookupOptions: { label: 'گزینه‌های پایه', endpoint: '/lookup-options' },
} as const;

export type CatalogKind = keyof typeof CATALOG_DEFINITIONS;

export interface CatalogItem {
  id: string;
  name?: string | null;
  title?: string | null;
  label?: string | null;
  value?: string | null;
  description?: string | null;
  category?: string | null;
  type?: string | null;
  isActive?: boolean;
  active?: boolean;
  createdAt?: string;
  updatedAt?: string;
}

export interface CatalogPayload {
  name?: string;
  label?: string;
  value?: string;
  description?: string;
  category?: string;
  isActive?: boolean;
}

export function isCatalogItemActive(item: CatalogItem): boolean {
  if (typeof item.isActive === 'boolean') return item.isActive;
  if (typeof item.active === 'boolean') return item.active;
  return true;
}

export function getCatalogItemLabel(item: CatalogItem): string {
  return item.name || item.label || item.title || item.value || '—';
}
