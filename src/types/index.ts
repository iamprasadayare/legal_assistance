/**
 * @file index.ts
 * @description Centralized strict TypeScript interfaces for AOR-Briefing Assistant.
 */

export interface TimelineEvent {
  date: string;
  title: string;
  details: string;
  keyParties: string;
  evidenceRef?: string;
}

export interface MissingFact {
  category: string;
  question: string;
  rationale: string;
  importance: "High" | "Medium" | "Low";
}

export interface NextStep {
  stepNumber: number;
  action: string;
  category: string;
  urgency: "Immediate (Critical)" | "High Priority" | "Standard Prep";
  rationale: string;
}

export interface EmbeddingMetrics {
  vectorDimensions: number;
  semanticComplexityScore: number;
  googleModelUsed: string;
}

export interface LegalBriefData {
  caseSummary: string;
  legalCategory: string;
  timeline: TimelineEvent[];
  missingFacts: MissingFact[];
  nextSteps: NextStep[];
  legalRiskFactors: string[];
  embeddingData?: EmbeddingMetrics;
}

export interface SampleCase {
  id: string;
  title: string;
  category: string;
  narrative: string;
}

export interface GenerateBriefRequest {
  narrative: string;
  caseCategory?: string;
  jurisdiction?: string;
}

export interface GenerateBriefResponse {
  success?: boolean;
  brief?: LegalBriefData;
  error?: string;
  cached?: boolean;
}
