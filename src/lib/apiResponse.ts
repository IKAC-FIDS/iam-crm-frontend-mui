import axios from 'axios';

export interface ApiSuccessResponse<T> {
  success: true;
  data: T;
  meta?: PaginatedMeta;
  requestId?: string;
  timestamp?: string;
}

export interface ApiErrorBody {
  code?: string;
  message?: string;
  details?: unknown;
}

export interface ApiErrorResponse {
  success?: false;
  error?: ApiErrorBody;
  message?: string;
  requestId?: string;
  timestamp?: string;
  path?: string;
  method?: string;
  statusCode?: number;
}

export type ApiWrappedResponse<T> = T | ApiSuccessResponse<T> | { data: T };

export interface PaginatedMeta {
  total: number;
  page: number;
  limit: number;
  totalPages: number;
  hasNext?: boolean;
  hasPrevious?: boolean;
}

export interface PaginatedResult<T> {
  data: T[];
  meta: PaginatedMeta;
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null;
}

function hasSuccessFlag(value: unknown): value is { success: boolean } {
  return isRecord(value) && typeof value.success === 'boolean';
}

export function unwrapApiResponse<T>(value: ApiWrappedResponse<T> | unknown): T {
  if (hasSuccessFlag(value) && value.success === true && 'data' in value) {
    return value.data as T;
  }

  if (isRecord(value) && 'data' in value && !('success' in value)) {
    return value.data as T;
  }

  return value as T;
}

export function unwrapPaginatedApiResponse<T>(
  value: unknown
): PaginatedResult<T> {
  if (Array.isArray(value)) {
    return {
      data: value as T[],
      meta: {
        total: value.length,
        page: 1,
        limit: value.length,
        totalPages: 1,
      },
    };
  }

  if (hasSuccessFlag(value) && value.success === true) {
    const record = value as Record<string, unknown>;
    const dataValue = record.data;
    const data = Array.isArray(dataValue)
      ? (dataValue as T[])
      : [];
    const meta = normalizeMeta(record.meta, data.length);
    return { data, meta };
  }

  if (isRecord(value)) {
    const data = Array.isArray(value.data)
      ? (value.data as T[])
      : Array.isArray(value.items)
        ? (value.items as T[])
        : [];

    const meta = normalizeMeta(value.meta, data.length, value);
    return { data, meta };
  }

  return {
    data: [],
    meta: {
      total: 0,
      page: 1,
      limit: 0,
      totalPages: 1,
    },
  };
}

function normalizeMeta(
  value: unknown,
  fallbackTotal: number,
  fallbackSource?: Record<string, unknown>
): PaginatedMeta {
  const meta = isRecord(value) ? value : {};
  const page = numberFrom(meta.page ?? fallbackSource?.page, 1);
  const limit = numberFrom(meta.limit ?? fallbackSource?.limit, fallbackTotal);
  const total = numberFrom(meta.total ?? fallbackSource?.total, fallbackTotal);
  const totalPages = numberFrom(
    meta.totalPages ?? fallbackSource?.totalPages,
    limit > 0 ? Math.max(1, Math.ceil(total / limit)) : 1
  );

  return {
    total,
    page,
    limit,
    totalPages,
    hasNext: booleanFrom(meta.hasNext, page < totalPages),
    hasPrevious: booleanFrom(meta.hasPrevious, page > 1),
  };
}

function numberFrom(value: unknown, fallback: number): number {
  return typeof value === 'number' && Number.isFinite(value) ? value : fallback;
}

function booleanFrom(value: unknown, fallback: boolean): boolean {
  return typeof value === 'boolean' ? value : fallback;
}

export function getApiErrorMessage(
  error: unknown,
  fallbackMessage: string
): string {
  if (axios.isAxiosError<unknown>(error)) {
    const body = error.response?.data;

    if (isRecord(body)) {
      const standardError = body.error;

      if (isRecord(standardError)) {
        const message = standardError.message;
        if (typeof message === 'string' && message.trim()) return message;

        const details = standardError.details;
        if (typeof details === 'string' && details.trim()) return details;
        if (Array.isArray(details)) {
          const messages = details.filter((item): item is string => typeof item === 'string' && Boolean(item.trim()));
          if (messages.length) return messages.join('، ');
        }
      }

      const legacyMessage = body.message;
      if (typeof legacyMessage === 'string' && legacyMessage.trim()) {
        return legacyMessage;
      }

      const legacyDetails = body.details;
      if (typeof legacyDetails === 'string' && legacyDetails.trim()) return legacyDetails;
      if (Array.isArray(legacyDetails)) {
        const messages = legacyDetails.filter((item): item is string => typeof item === 'string' && Boolean(item.trim()));
        if (messages.length) return messages.join('، ');
      }
    }

    if (error.message) return error.message;
  }

  if (error instanceof Error && error.message) return error.message;

  return fallbackMessage;
}

export function getApiErrorCode(error: unknown): string | undefined {
  if (!axios.isAxiosError<unknown>(error)) return undefined;

  const body = error.response?.data;
  if (!isRecord(body) || !isRecord(body.error)) return undefined;

  const code = body.error.code;
  return typeof code === 'string' && code.trim() ? code : undefined;
}

export function isForbiddenError(error: unknown): boolean {
  return axios.isAxiosError(error) && error.response?.status === 403;
}
