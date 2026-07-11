import type { AttachmentEntityType } from '../types/attachment.types';

export const MAX_ATTACHMENT_SIZE_BYTES = 25 * 1024 * 1024;
export const ALLOWED_ATTACHMENT_MIME_HINT = 'PDF، JPG، PNG، WebP، TXT، CSV';

export function formatFileSize(sizeBytes?: number | null): string {
  const size = typeof sizeBytes === 'number' && Number.isFinite(sizeBytes) ? sizeBytes : 0;
  const units = ['B', 'KB', 'MB', 'GB'];
  let value = size;
  let unitIndex = 0;

  while (value >= 1024 && unitIndex < units.length - 1) {
    value /= 1024;
    unitIndex += 1;
  }

  return `${new Intl.NumberFormat('fa-IR', { maximumFractionDigits: unitIndex === 0 ? 0 : 1 }).format(value)} ${units[unitIndex]}`;
}

export function getMimeTypeLabel(mimeType?: string | null): string {
  if (!mimeType) return '—';
  const labels: Record<string, string> = {
    'application/pdf': 'PDF',
    'image/jpeg': 'JPEG',
    'image/png': 'PNG',
    'image/webp': 'WebP',
    'text/plain': 'Text',
    'text/csv': 'CSV',
  };
  return labels[mimeType] ?? mimeType;
}

export function isPreviewableImage(mimeType?: string | null): boolean {
  return Boolean(mimeType?.startsWith('image/'));
}

export function getAttachmentEntityLabel(entityType: AttachmentEntityType): string {
  if (entityType === 'OPPORTUNITY') return 'فرصت';
  if (entityType === 'COMMERCIAL_DOCUMENT') return 'سند تجاری';
  return 'پرداخت';
}

export function getSafeFileName(name?: string | null): string {
  const cleaned = Array.from(name || 'attachment')
    .map((char) => (/[<>:"/\\|?*]/.test(char) || char.charCodeAt(0) < 32 ? '_' : char))
    .join('')
    .trim();
  return cleaned || 'attachment';
}

export function filenameFromContentDisposition(value?: string): string | null {
  if (!value) return null;
  const utfMatch = /filename\*=UTF-8''([^;]+)/i.exec(value);
  if (utfMatch?.[1]) return getSafeFileName(decodeURIComponent(utfMatch[1]));
  const plainMatch = /filename="?([^";]+)"?/i.exec(value);
  return plainMatch?.[1] ? getSafeFileName(plainMatch[1]) : null;
}
