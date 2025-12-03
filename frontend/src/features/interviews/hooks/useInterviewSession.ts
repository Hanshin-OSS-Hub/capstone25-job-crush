import { useCallback, useEffect, useState } from 'react';

import { interviewService } from '../services/interview.service';
import type { CreateInterviewSessionPayload, InterviewSession } from '../types/interview.types';

export const useInterviewSession = (sessionId?: string) => {
  const [session, setSession] = useState<InterviewSession | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchSession = useCallback(async () => {
    if (!sessionId) return;
    setIsLoading(true);
    setError(null);
    try {
      const response = await interviewService.getSession(sessionId);
      setSession(response);
    } catch (err) {
      setError(err instanceof Error ? err.message : '세션 정보를 불러오지 못했습니다.');
    } finally {
      setIsLoading(false);
    }
  }, [sessionId]);

  const createSession = useCallback(async (payload: CreateInterviewSessionPayload) => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await interviewService.createSession(payload);
      setSession(response);
      return response;
    } catch (err) {
      setError(err instanceof Error ? err.message : '세션 생성에 실패했습니다.');
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchSession();
  }, [fetchSession]);

  return {
    session,
    isLoading,
    error,
    refetch: fetchSession,
    createSession,
    setSession,
  };
};

