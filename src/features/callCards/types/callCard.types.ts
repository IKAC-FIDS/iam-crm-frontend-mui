export interface DiscoveryQuestion {
  question: string;
}

export interface CallCardObjection {
  objection: string;
  response: string;
}

export interface CallCardPerson {
  id: string;
  fullName: string;
  title?: string | null;
  jobTitle?: string | null;
  department?: string | null;
  personaTag?: string | null;
  personaRole?: string | null;
  seniorityLevel?: string | null;
}

export interface CallCard {
  id?: string;
  companyId?: string;
  primaryContactId?: string | null;
  secondaryContactId?: string | null;
  primaryContact?: CallCardPerson | null;
  secondaryContact?: CallCardPerson | null;
  entryAngle?: string | null;
  painPoint?: string | null;
  useCase?: string | null;
  openingLine?: string | null;
  firstEmail?: string | null;
  linkedinMsg?: string | null;
  discoveryQs?: DiscoveryQuestion[];
  objections?: CallCardObjection[];
  meetingAsk?: string | null;
  callGoal?: string | null;
  qualificationCriteria?: string | null;
  disqualificationCriteria?: string | null;
  followUpNoResponseAt?: string | null;
  followUpInterestAt?: string | null;
  createdAt?: string;
  updatedAt?: string;
}

export interface UpsertCallCardPayload {
  primaryContactId?: string | null;
  secondaryContactId?: string | null;
  entryAngle?: string;
  painPoint?: string;
  useCase?: string;
  openingLine?: string;
  firstEmail?: string;
  linkedinMsg?: string;
  discoveryQs?: DiscoveryQuestion[];
  objections?: CallCardObjection[];
  meetingAsk?: string;
  callGoal?: string;
  qualificationCriteria?: string;
  disqualificationCriteria?: string;
  followUpNoResponseAt?: string;
  followUpInterestAt?: string;
}

export type CallCardSuggestion = Partial<UpsertCallCardPayload> & {
  suggestedPainPoints?: string[];
  suggestedUseCases?: string[];
  matchedPersonas?: unknown[];
  matchedIndustry?: unknown;
};
