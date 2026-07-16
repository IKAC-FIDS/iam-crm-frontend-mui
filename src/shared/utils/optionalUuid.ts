const UUID_PATTERN = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

export function optionalUuid(value?: string | null): string | undefined {
  const normalized = value?.trim();
  return normalized && UUID_PATTERN.test(normalized) ? normalized : undefined;
}

export function isUuid(value?: string | null): value is string {
  return optionalUuid(value) !== undefined;
}
