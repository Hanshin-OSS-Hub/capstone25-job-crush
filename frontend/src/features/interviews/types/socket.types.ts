import type { InterviewQuestion } from './interview.types';
import type { RealtimeAnalysisPayload } from './analysis.types';

export interface InterviewStartedEvent {
  sessionId: string;
  question: InterviewQuestion;
}

export interface InterviewQuestionEvent {
  sessionId: string;
  question: InterviewQuestion;
}

export interface InterviewFeedbackEvent {
  sessionId: string;
  metric: 'confidence' | 'delivery' | 'content' | 'engagement';
  score: number;
  message: string;
  timestamp: number;
}

export interface InterviewCompletedEvent {
  sessionId: string;
  evaluationId?: string;
}

export interface InterviewErrorEvent {
  code: string;
  message: string;
}

export interface AudioStreamChunk {
  sessionId: string;
  chunk: ArrayBuffer;
  timestamp: number;
  durationMs: number;
}

export interface ClientToServerEvents {
  'interview:join': (payload: { sessionId: string }) => void;
  'interview:leave': (payload: { sessionId: string }) => void;
  'interview:audio': (payload: AudioStreamChunk) => void;
  'interview:analysis': (payload: RealtimeAnalysisPayload) => void;
  'interview:answer_complete': (payload: { sessionId: string; questionId: string }) => void;
  'interview:end': (payload: { sessionId: string }) => void;
}

export interface ServerToClientEvents {
  'interview:started': (payload: InterviewStartedEvent) => void;
  'interview:question': (payload: InterviewQuestionEvent) => void;
  'interview:feedback': (payload: InterviewFeedbackEvent) => void;
  'interview:completed': (payload: InterviewCompletedEvent) => void;
  'interview:error': (payload: InterviewErrorEvent) => void;
}

