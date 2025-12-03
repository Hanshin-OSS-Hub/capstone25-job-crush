import { useCallback, useEffect, useState } from 'react';

import { interviewSocketClient } from '../services/socket.service';
import type {
  AudioStreamChunk,
  InterviewFeedbackEvent,
  InterviewQuestionEvent,
  ServerToClientEvents,
} from '../types/socket.types';
import type { RealtimeAnalysisPayload } from '../types/analysis.types';

const useSocketEvent = <K extends keyof ServerToClientEvents>(
  event: K,
  handler: ServerToClientEvents[K] | undefined,
) => {
  useEffect(() => {
    if (!handler) return undefined;
    const off = interviewSocketClient.on(event, handler);
    return () => {
      off?.();
    };
  }, [event, handler]);
};

export const useInterviewSocket = (params: { sessionId?: string; autoConnect?: boolean }) => {
  const { sessionId, autoConnect = true } = params;
  const [isConnected, setIsConnected] = useState(false);
  const [currentQuestion, setCurrentQuestion] = useState<InterviewQuestionEvent['question']>();
  const [latestFeedback, setLatestFeedback] = useState<InterviewFeedbackEvent | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!sessionId || !autoConnect) return undefined;
    const socket = interviewSocketClient.connect();

    const handleConnect = () => {
      setIsConnected(true);
      interviewSocketClient.joinSession(sessionId);
    };

    const handleDisconnect = () => {
      setIsConnected(false);
    };

    socket.on('connect', handleConnect);
    socket.on('disconnect', handleDisconnect);

    return () => {
      socket.off('connect', handleConnect);
      socket.off('disconnect', handleDisconnect);
      interviewSocketClient.leaveSession(sessionId);
      interviewSocketClient.disconnect();
    };
  }, [autoConnect, sessionId]);

  useSocketEvent('interview:question', (payload) => {
    setCurrentQuestion(payload.question);
  });

  useSocketEvent('interview:feedback', (payload) => {
    setLatestFeedback(payload);
  });

  useSocketEvent('interview:error', (payload) => {
    setError(payload.message);
  });

  const sendAudioChunk = useCallback(
    (chunk: AudioStreamChunk) => {
      interviewSocketClient.sendAudioChunk(chunk);
    },
    [],
  );

  const sendRealtimeAnalysis = useCallback((payload: RealtimeAnalysisPayload) => {
    interviewSocketClient.sendRealtimeAnalysis(payload);
  }, []);

  return {
    isConnected,
    currentQuestion,
    latestFeedback,
    error,
    sendAudioChunk,
    sendRealtimeAnalysis,
  };
};

