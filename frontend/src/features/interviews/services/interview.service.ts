import { apiClient } from '@/api/client';
import { API_ENDPOINTS } from '@/constants/api';

import type {
  CreateInterviewSessionPayload,
  InterviewEvaluationResponse,
  InterviewSession,
  SubmitAnswerResponse,
} from '../types/interview.types';

export const interviewService = {
  async createSession(payload: CreateInterviewSessionPayload): Promise<InterviewSession> {
    const response = await apiClient.post<InterviewSession>(API_ENDPOINTS.INTERVIEWS.SESSIONS, payload);
    return response.data;
  },

  /** 백엔드 GET /interviews/sessions/:id — 세션 메타 + questions[] */
  async getSession(sessionId: string): Promise<InterviewSession> {
    const response = await apiClient.get<InterviewSession>(
      API_ENDPOINTS.INTERVIEWS.SESSION_BY_ID(sessionId),
    );
    return response.data;
  },

  /** 턴 처리: 답변 오디오 업로드 → STT 결과 + 다음 질문 */
  async submitAnswer(
    sessionId: string,
    questionId: string,
    audio: Blob,
  ): Promise<SubmitAnswerResponse> {
    const form = new FormData();
    form.append('audio', audio, 'answer.webm');
    form.append('questionId', questionId);
    const response = await apiClient.post<SubmitAnswerResponse>(
      API_ENDPOINTS.INTERVIEWS.SESSION_ANSWER(sessionId),
      form,
      { timeout: 120000 }, // STT(로컬 Whisper) + 꼬리질문 생성이 길어질 수 있어 전역 10초 대신 120초 허용
    );
    return response.data;
  },

  /** 세션 종료: 전체 영상 업로드 → 비동기 종합 분석 시작 */
  async completeSession(sessionId: string, video: Blob): Promise<{ status: string }> {
    const form = new FormData();
    form.append('video', video, 'session.webm');
    const response = await apiClient.post<{ status: string }>(
      API_ENDPOINTS.INTERVIEWS.SESSION_COMPLETE(sessionId),
      form,
      { timeout: 120000 },
    );
    return response.data;
  },

  async getEvaluation(sessionId: string): Promise<InterviewEvaluationResponse> {
    const response = await apiClient.get<InterviewEvaluationResponse>(
      API_ENDPOINTS.INTERVIEWS.SESSION_EVALUATION(sessionId),
    );
    return response.data;
  },
};
