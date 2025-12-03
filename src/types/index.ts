export type UserRole = "user" | "admin";

export interface User {
  id: string;
  email: string;
  name: string;
  role: UserRole;
  createdAt: Date;
  updatedAt: Date;
}

export interface Opportunity {
  id: string;
  samId?: string | null;
  title: string;
  agency: string;
  department?: string | null;
  solicitationNumber: string;
  noticeType: string;
  naicsCodes: string[];
  pscCodes: string[];
  setAside: string;
  placeOfPerformance?: string | null;
  estimatedValueMin?: number | null;
  estimatedValueMax?: number | null;
  responseDeadline: string;
  postedDate: string;
  url: string;
  description: string;
  rawText: string;
  status: string;
  createdAt?: string;
  updatedAt?: string;
  attachments?: Attachment[];
}

export interface Attachment {
  id: string;
  opportunityId: string;
  fileName: string;
  fileType: string;
  fileSize: number;
  url: string;
}

export interface SavedOpportunity {
  id: string;
  userId: string;
  opportunityId: string;
  status: "Evaluating" | "Pursuing" | "Submitted" | "Won" | "Lost";
  notes?: string;
  priority: "low" | "medium" | "high";
  opportunity?: Opportunity;
  createdAt?: string;
  updatedAt?: string;
}

export interface SavedSearch {
  id: string;
  userId: string;
  name: string;
  query: string;
  filters: Record<string, unknown>;
  frequency: "daily" | "weekly";
  lastRunAt?: string | null;
  createdAt?: string;
  updatedAt?: string;
}

export interface AlertSubscription {
  id: string;
  userId: string;
  savedSearchId: string;
  deliveryChannel: "email";
  isActive: boolean;
  createdAt?: string;
  updatedAt?: string;
}

export interface ProposalSection {
  heading: string;
  content: string;
}

export interface ProposalDraft {
  id: string;
  userId: string;
  opportunityId: string;
  title: string;
  sections: ProposalSection[];
  status: "Draft" | "Finalized" | "Archived";
  createdAt?: string;
  updatedAt?: string;
}
