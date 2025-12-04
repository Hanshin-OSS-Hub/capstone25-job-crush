import { useEffect, useRef, useState } from 'react';
import { YIN } from 'pitchfinder';

import type { AudioAnalysisMetrics } from '../types/analysis.types';

export const useAudioAnalysis = (params: { stream: MediaStream | null; sessionId: string; questionId?: string }) => {
  const { stream, sessionId, questionId } = params;
  const [metrics, setMetrics] = useState<AudioAnalysisMetrics | null>(null);
  const animationRef = useRef<number>();

  useEffect(() => {
    if (!stream) {
      setMetrics(null);
      return undefined;
    }

    const audioContext = new AudioContext();
    const analyser = audioContext.createAnalyser();
    analyser.fftSize = 2048;
    const source = audioContext.createMediaStreamSource(stream);
    source.connect(analyser);

    const buffer = new Float32Array(analyser.fftSize);
    const detectPitch = YIN({ sampleRate: audioContext.sampleRate });

    let previousPitch = 0;

    const updateMetrics = () => {
      analyser.getFloatTimeDomainData(buffer);
      const pitch = detectPitch(buffer, audioContext.sampleRate) ?? 0;

      let sumSquares = 0;
      for (let i = 0; i < buffer.length; i += 1) {
        sumSquares += buffer[i] * buffer[i];
      }
      const energy = Math.sqrt(sumSquares / buffer.length);
      const jitter = previousPitch ? Math.abs(pitch - previousPitch) / Math.max(previousPitch, 1) : 0;
      const speechRateWpm = pitch > 0 ? 120 : 80;

      setMetrics({
        sessionId,
        questionId,
        timestamp: Date.now(),
        pitchHz: Number(pitch.toFixed(2)),
        energy: Number(energy.toFixed(3)),
        speechRateWpm: Number(speechRateWpm.toFixed(1)),
        jitter: Number(jitter.toFixed(3)),
      });

      previousPitch = pitch;
      animationRef.current = requestAnimationFrame(updateMetrics);
    };

    updateMetrics();

    return () => {
      if (animationRef.current) cancelAnimationFrame(animationRef.current);
      source.disconnect();
      analyser.disconnect();
      audioContext.close();
    };
  }, [questionId, sessionId, stream]);

  return { metrics };
};

