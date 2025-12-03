export type InterviewSessionStatus =
  | 'pending'
  | 'in_progress'
  | 'paused'
  | 'completed'
  | 'cancelled';

export type InterviewQuestionType = 'initial' | 'follow_up' | 'behavioral' | 'technical';

export interface InterviewSession {
  id: string;
  userId?: string;
  jobId?: string;
  companyName: string;
  jobTitle: string;
  status: InterviewSessionStatus;
  startedAt?: string;
  completedAt?: string;
  createdAt: string;
  updatedAt: string;
}

export interface InterviewQuestion {
  id: string;
  sessionId: string;
  order: number;
  text: string;
  type: InterviewQuestionType;
  createdAt: string;
}

export interface InterviewAnswer {
  id: string;
  sessionId: string;
  questionId: string;
  transcript: string;
  audioUrl?: string;
  durationMs?: number;
  createdAt: string;
}

export interface InterviewEvaluationMetric {
  name: string;
  score: number; // 0~100
  comment?: string;
}

export interface InterviewEvaluation {
  sessionId: string;
  overallScore: number;
  contentScore: number;
  deliveryScore: number;
  confidenceScore: number;
  strengths: string[];
  weaknesses: string[];
  suggestions: string[];
  metrics: InterviewEvaluationMetric[];
  createdAt: string;
}

export interface CreateInterviewSessionPayload {
  jobId?: string;
  companyName: string;
  jobTitle: string;
  resumeId?: string;
  notes?: string;
}

