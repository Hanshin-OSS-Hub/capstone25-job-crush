import { useEffect, useRef, useState } from 'react';

import type {
  AudioAnalysisMetrics,
  FaceAnalysisMetrics,
  RealtimeAnalysisPayload,
} from '../types/analysis.types';

type UseRealtimeAnalysisOptions = {
  sessionId?: string;
  questionId?: string;
  faceMetrics?: FaceAnalysisMetrics | null;
  audioMetrics?: AudioAnalysisMetrics | null;
  throttleMs?: number;
  onEmit?: (payload: RealtimeAnalysisPayload) => void;
};

export const useRealtimeAnalysis = ({
  sessionId,
  questionId,
  faceMetrics,
  audioMetrics,
  throttleMs = 1000,
  onEmit,
}: UseRealtimeAnalysisOptions) => {
  const [latestPayload, setLatestPayload] = useState<RealtimeAnalysisPayload | null>(null);
  const lastEmitRef = useRef(0);

  useEffect(() => {
    if (!sessionId) return;
    if (!faceMetrics && !audioMetrics) return;

    const now = Date.now();
    if (now - lastEmitRef.current < throttleMs) return;

    const payload: RealtimeAnalysisPayload = {
      sessionId,
      questionId,
      timestamp: now,
      face: faceMetrics ?? undefined,
      audio: audioMetrics ?? undefined,
    };

    setLatestPayload(payload);
    lastEmitRef.current = now;
    onEmit?.(payload);
  }, [audioMetrics, faceMetrics, onEmit, questionId, sessionId, throttleMs]);

  return { latestPayload };
};

