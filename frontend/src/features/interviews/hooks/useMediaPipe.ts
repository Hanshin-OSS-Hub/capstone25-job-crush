import { useEffect, useRef, useState } from 'react';
import { FaceMesh, Results } from '@mediapipe/face_mesh';

import type { FaceAnalysisMetrics, FaceExpression } from '../types/analysis.types';

const locateFile = (file: string) => `https://cdn.jsdelivr.net/npm/@mediapipe/face_mesh/${file}`;

const createFaceMesh = () => {
  const faceMesh = new FaceMesh({ locateFile });
  faceMesh.setOptions({
    maxNumFaces: 1,
    refineLandmarks: true,
    minDetectionConfidence: 0.5,
    minTrackingConfidence: 0.5,
  });
  return faceMesh;
};

const computeExpression = (results: Results): { label: FaceExpression; confidence: number } => {
  const landmarks = results.multiFaceLandmarks?.[0];
  if (!landmarks) {
    return { label: 'neutral', confidence: 0 };
  }

  const mouthTop = landmarks[13];
  const mouthBottom = landmarks[14];
  const mouthHeight = Math.abs(mouthBottom.y - mouthTop.y);
  const smileLeft = landmarks[61];
  const smileRight = landmarks[291];
  const smileCurve = smileRight.y - smileLeft.y;

  if (mouthHeight > 0.07) {
    return { label: 'surprised', confidence: Math.min(1, mouthHeight * 8) };
  }

  if (smileCurve < -0.005) {
    return { label: 'happy', confidence: Math.min(1, Math.abs(smileCurve) * 50) };
  }

  return { label: 'neutral', confidence: 0.6 };
};

export const useMediaPipe = (params: { stream: MediaStream | null; sessionId: string; questionId?: string }) => {
  const { stream, sessionId, questionId } = params;
  const [metrics, setMetrics] = useState<FaceAnalysisMetrics | null>(null);
  const animationRef = useRef<number>();

  useEffect(() => {
    if (!stream) {
      setMetrics(null);
      return undefined;
    }

    const videoElement = document.createElement('video');
    videoElement.srcObject = stream;
    videoElement.muted = true;
    videoElement.playsInline = true;

    let isMounted = true;
    const faceMesh = createFaceMesh();

    faceMesh.onResults((results) => {
      if (!isMounted) return;
      if (!results.multiFaceLandmarks?.length) {
        setMetrics(null);
        return;
      }

      const landmarks = results.multiFaceLandmarks[0];
      const leftEye = landmarks[133];
      const rightEye = landmarks[362];
      const gazeX = ((leftEye.x + rightEye.x) / 2 - 0.5) * 2;
      const gazeY = ((leftEye.y + rightEye.y) / 2 - 0.5) * 2;
      const gazeDistance = Math.sqrt(gazeX ** 2 + gazeY ** 2);
      const eyeContactScore = Math.max(0, 1 - gazeDistance);

      const headPose = {
        pitch: Number(((landmarks[10].z - landmarks[152].z) * 90).toFixed(2)),
        yaw: Number(((landmarks[234].x - landmarks[454].x) * 90).toFixed(2)),
        roll: Number(((landmarks[67].y - landmarks[297].y) * 90).toFixed(2)),
      };

      setMetrics({
        sessionId,
        questionId,
        timestamp: Date.now(),
        gaze: {
          x: Number(gazeX.toFixed(3)),
          y: Number(gazeY.toFixed(3)),
          z: Number(((landmarks[1]?.z ?? 0) - 0.5).toFixed(3)),
          confidence: results.multiFaceLandmarks.length > 0 ? 1 : 0,
        },
        eyeContactScore: Number(eyeContactScore.toFixed(3)),
        expression: computeExpression(results),
        headPose,
      });
    });

    const analyze = async () => {
      if (!isMounted) return;
      try {
        await faceMesh.send({ image: videoElement });
      } catch {
        // Ignore occasional MediaPipe errors
      }
      animationRef.current = requestAnimationFrame(analyze);
    };

    const start = async () => {
      try {
        await videoElement.play();
        analyze();
      } catch {
        // autoplay might be blocked; ignore
      }
    };

    start();

    return () => {
      isMounted = false;
      if (animationRef.current) cancelAnimationFrame(animationRef.current);
      faceMesh.close();
      videoElement.pause();
      videoElement.srcObject = null;
    };
  }, [questionId, sessionId, stream]);

  return { metrics };
};

