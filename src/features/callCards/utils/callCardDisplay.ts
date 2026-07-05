import type { CallCard, CallCardSuggestion, UpsertCallCardPayload } from '../types/callCard.types';

export function displayCallCardValue(value?: string | null): string {
  return value?.trim() || '—';
}

export function mergeCallCardSuggestion(
  callCard: CallCard | null | undefined,
  suggestion: CallCardSuggestion,
): Partial<CallCard> {
  const result: Partial<CallCard> = { ...(callCard ?? {}) };
  const fields: (keyof UpsertCallCardPayload)[] = [
    'primaryContactId', 'secondaryContactId', 'entryAngle', 'painPoint', 'useCase',
    'openingLine', 'firstEmail', 'linkedinMsg', 'discoveryQs', 'objections',
    'meetingAsk', 'callGoal', 'qualificationCriteria', 'disqualificationCriteria',
    'followUpNoResponseAt', 'followUpInterestAt',
  ];

  fields.forEach((field) => {
    const value = suggestion[field];
    const meaningful = Array.isArray(value)
      ? value.length > 0
      : typeof value === 'string'
        ? Boolean(value.trim())
        : value !== undefined && value !== null;
    if (meaningful) Object.assign(result, { [field]: value });
  });
  return result;
}
