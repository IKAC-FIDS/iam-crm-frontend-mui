import type { CompanyOption } from '../types/company.types';

export function getCompanyLabel(company?: CompanyOption | null): string {
  if (!company) return '';
  const legalName = company.legalName?.trim() ?? '';
  const brandName = company.brandName?.trim() ?? '';
  if (brandName && legalName && brandName !== legalName) return `${brandName} — ${legalName}`;
  return brandName || legalName;
}
