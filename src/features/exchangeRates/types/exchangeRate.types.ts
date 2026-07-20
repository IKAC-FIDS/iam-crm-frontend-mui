import type { PaginatedResult } from '@/lib/apiResponse';
export interface ExchangeRate { id: string; baseCurrency: 'USD'; quoteCurrency: 'IRR'; rate: number | string; validFrom: string; validTo?: string | null; note?: string | null; status: 'ACTIVE' | 'HISTORICAL'; createdAt: string; updatedAt: string; createdBy?: { id: string; fullName: string; email?: string | null } }
export interface CreateExchangeRatePayload { rate: string; effectiveFrom?: string; note?: string }
export interface CreateExchangeRateResponse { rate: ExchangeRate; recalculatedProductCount: number }
export type ExchangeRatePage = PaginatedResult<ExchangeRate>;
