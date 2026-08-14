/**
 * AUTO-GENERATED FILE.
 * DO NOT EDIT MANUALLY.
 * Source: contracts/backend/openapi.json.
 */
import type { DiscoveryQuestionDto } from './discoveryQuestionDto';
import type { ObjectionDto } from './objectionDto';

export interface UpsertCallCardDto {
  callGoal?: string;
  discoveryQs?: DiscoveryQuestionDto[];
  disqualificationCriteria?: string;
  entryAngle?: string;
  firstEmail?: string;
  followUpInterestAt?: string;
  followUpNoResponseAt?: string;
  linkedinMsg?: string;
  meetingAsk?: string;
  objections?: ObjectionDto[];
  openingLine?: string;
  painPoint?: string;
  primaryContactId?: string;
  qualificationCriteria?: string;
  secondaryContactId?: string;
  useCase?: string;
}
