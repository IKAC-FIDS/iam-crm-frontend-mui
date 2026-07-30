import { describe, expect, it } from 'vitest';
import { getActivityTitle, getActivityTypeLabel, getStageTransitionDisplay } from './activityDisplay';

describe('activity display localization', () => {
  it('maps known types and hides unknown raw enums', () => {
    expect(getActivityTypeLabel('CALL')).toBe('تماس تلفنی');
    expect(getActivityTypeLabel('UNKNOWN_TECHNICAL_VALUE')).toBe('فعالیت');
    expect(getActivityTitle('UNKNOWN_TECHNICAL_VALUE', 'UNKNOWN_TECHNICAL_VALUE')).toBe('فعالیت');
  });

  it('localizes both sides of a stage transition', () => {
    expect(getStageTransitionDisplay('INTERESTED -> QUALIFIED')).toEqual({ from: 'علاقه‌مند', to: 'واجد شرایط' });
  });
});
