export const LOOKUP_GROUPS = ['teams', 'departments', 'job-titles', 'seniority-levels', 'persona-roles', 'opportunity-sources', 'contact-types', 'person-social-platforms', 'company-sources'] as const;
export type LookupGroup = (typeof LOOKUP_GROUPS)[number];
export const LOOKUP_GROUP_LABELS: Record<LookupGroup, string> = { teams: 'تیم‌ها', departments: 'دپارتمان‌ها', 'job-titles': 'سمت‌ها', 'seniority-levels': 'سطح ارشدیت', 'persona-roles': 'نقش‌های فروش', 'opportunity-sources': 'منابع ایجاد فرصت', 'contact-types': 'انواع تماس', 'person-social-platforms': 'شبکه‌های اجتماعی اشخاص', 'company-sources': 'منابع شرکت' };

export const CATALOG_DEFINITIONS = {
  industries: { label: 'صنایع', endpoint: '/industries' },
  leadSources: { label: 'منابع جذب', endpoint: '/lead-sources' },
  painPoints: { label: 'نقاط درد', endpoint: '/pain-points' },
  useCases: { label: 'کاربردها', endpoint: '/use-cases' },
  personas: { label: 'پرسوناها', endpoint: '/persona-library' },
  lookupOptions: { label: 'گزینه‌های پایه', endpoint: '/lookups' },
  universities: { label: 'دانشگاه‌ها', endpoint: '/universities' },
} as const;
export type CatalogKind = keyof typeof CATALOG_DEFINITIONS;

export interface CatalogItem {
  id: string; label: string; value: string; description?: string | null; isActive: boolean;
  code?: string | null; category?: string | null; sortOrder?: number | null; createdAt?: string; updatedAt?: string;
  name?: string | null; title?: string | null; titlePattern?: string | null; defaultPainPoint?: string | null; defaultUseCase?: string | null; notes?: string | null;
}
export interface CatalogPayload {
  name?: string; code?: string; title?: string; label?: string; description?: string; category?: string; isActive?: boolean; sortOrder?: number;
  titlePattern?: string; defaultPainPoint?: string; defaultUseCase?: string; notes?: string;
}
export interface CatalogQueryOptions { group?: LookupGroup; includeInactive?: boolean }
export function isCatalogItemActive(item: CatalogItem): boolean { return item.isActive; }
export function getCatalogItemLabel(item: CatalogItem): string { return item.label || '—'; }
