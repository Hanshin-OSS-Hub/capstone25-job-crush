import { apiClient } from '@/api/client';
import { API_ENDPOINTS } from '@/constants/api';

import type {
  CreateInterviewSessionPayload,
  InterviewEvaluation,
  InterviewSession,
} from '../types/interview.types';

export const interviewService = {
  async createSession(payload: CreateInterviewSessionPayload): Promise<InterviewSession> {
    const response = await apiClient.post<InterviewSession>(API_ENDPOINTS.INTERVIEWS.SESSIONS, payload);
    return response.data;
  },

  async getSession(sessionId: string): Promise<InterviewSession> {
    const response = await apiClient.get<InterviewSession>(
      API_ENDPOINTS.INTERVIEWS.SESSION_BY_ID(sessionId),
    );
    return response.data;
  },

  async getEvaluation(sessionId: string): Promise<InterviewEvaluation> {
    const response = await apiClient.get<InterviewEvaluation>(
      API_ENDPOINTS.INTERVIEWS.SESSION_EVALUATION(sessionId),
    );
    return response.data;
  },
};

