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
  /** GET /interviews/sessions/:id 응답에 포함 */
  questions?: InterviewQuestion[];
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

export interface InterviewHeartRate {
  bpm: number | null;
  confidence: number;
}

export interface InterviewTimelineItem {
  id: string;
  question: string;
  score: number;
  feedback: string;
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
  heartRate?: InterviewHeartRate | null;
  timeline?: InterviewTimelineItem[];
  createdAt: string;
}

/** GET /interviews/sessions/:id/evaluation 응답 (결과 페이지 폴링) */
export interface InterviewEvaluationResponse {
  status: string; // PENDING | IN_PROGRESS | PROCESSING | COMPLETED | FAILED
  evaluation: InterviewEvaluation | null;
}

/** 다음 질문(서버 턴 처리) */
export interface NextInterviewQuestion {
  id: string;
  order: number;
  text: string;
  type: InterviewQuestionType;
}

/** POST /interviews/sessions/:id/answer 응답 */
export interface SubmitAnswerResponse {
  transcript: string;
  nextQuestion: NextInterviewQuestion | null;
}

export interface CreateInterviewSessionPayload {
  jobId?: string;
  companyName: string;
  jobTitle: string;
  resumeId?: string;
  notes?: string;
}

