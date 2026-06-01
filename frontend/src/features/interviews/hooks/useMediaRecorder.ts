import { useCallback, useRef, useState } from 'react';

/** 지원되는 mimeType 중 사용 가능한 첫 번째를 고른다(브라우저별 차이 흡수). */
const pickMimeType = (candidates: string[]): string | undefined => {
  if (typeof MediaRecorder === 'undefined') return undefined;
  return candidates.find((type) => MediaRecorder.isTypeSupported(type));
};

const SESSION_VIDEO_TYPES = [
  'video/webm;codecs=vp9,opus',
  'video/webm;codecs=vp8,opus',
  'video/webm',
];
const ANSWER_AUDIO_TYPES = [
  'audio/webm;codecs=opus',
  'audio/webm',
  'audio/ogg;codecs=opus',
];

/**
 * 면접 녹화 훅.
 * - 세션 전체 영상: 면접 시작~종료까지 연속 녹화(종료 후 무거운 멀티모달 분석용)
 * - 답변별 오디오: "답변 완료" 단위로 잘라 STT/꼬리질문 처리용 Blob 반환
 * 분석은 서버에서 수행하므로, 여기서는 수집(녹화)만 담당한다.
 */
export const useMediaRecorder = (stream: MediaStream | null) => {
  const supported = typeof MediaRecorder !== 'undefined';

  const sessionRecorderRef = useRef<MediaRecorder | null>(null);
  const sessionChunksRef = useRef<Blob[]>([]);
  const answerRecorderRef = useRef<MediaRecorder | null>(null);
  const answerChunksRef = useRef<Blob[]>([]);
  const answerStreamRef = useRef<MediaStream | null>(null);

  const [isSessionRecording, setIsSessionRecording] = useState(false);
  const [isAnswerRecording, setIsAnswerRecording] = useState(false);

  const startSession = useCallback(() => {
    if (!supported || !stream || sessionRecorderRef.current) return;
    const mimeType = pickMimeType(SESSION_VIDEO_TYPES);
    const recorder = new MediaRecorder(
      stream,
      mimeType ? { mimeType } : undefined,
    );
    sessionChunksRef.current = [];
    recorder.ondataavailable = (event) => {
      if (event.data.size > 0) sessionChunksRef.current.push(event.data);
    };
    recorder.start(1000); // 1초 단위로 청크 수집
    sessionRecorderRef.current = recorder;
    setIsSessionRecording(true);
  }, [stream, supported]);

  const stopSession = useCallback((): Promise<Blob | null> => {
    return new Promise((resolve) => {
      const recorder = sessionRecorderRef.current;
      if (!recorder) {
        resolve(null);
        return;
      }
      recorder.onstop = () => {
        const type = recorder.mimeType || 'video/webm';
        const blob = sessionChunksRef.current.length
          ? new Blob(sessionChunksRef.current, { type })
          : null;
        sessionRecorderRef.current = null;
        sessionChunksRef.current = [];
        setIsSessionRecording(false);
        resolve(blob);
      };
      recorder.stop();
    });
  }, []);

  const startAnswer = useCallback(() => {
    if (!supported || !stream || answerRecorderRef.current) return;
    const audioTracks = stream.getAudioTracks();
    if (audioTracks.length === 0) return;
    // 답변 구간은 오디오만 별도 스트림으로 녹음(STT 업로드 경량화)
    const audioStream = new MediaStream(audioTracks);
    const mimeType = pickMimeType(ANSWER_AUDIO_TYPES);
    const recorder = new MediaRecorder(
      audioStream,
      mimeType ? { mimeType } : undefined,
    );
    answerChunksRef.current = [];
    recorder.ondataavailable = (event) => {
      if (event.data.size > 0) answerChunksRef.current.push(event.data);
    };
    recorder.start();
    answerRecorderRef.current = recorder;
    answerStreamRef.current = audioStream;
    setIsAnswerRecording(true);
  }, [stream, supported]);

  const stopAnswer = useCallback((): Promise<Blob | null> => {
    return new Promise((resolve) => {
      const recorder = answerRecorderRef.current;
      if (!recorder) {
        resolve(null);
        return;
      }
      recorder.onstop = () => {
        const type = recorder.mimeType || 'audio/webm';
        const blob = answerChunksRef.current.length
          ? new Blob(answerChunksRef.current, { type })
          : null;
        answerRecorderRef.current = null;
        answerChunksRef.current = [];
        answerStreamRef.current = null;
        setIsAnswerRecording(false);
        resolve(blob);
      };
      recorder.stop();
    });
  }, []);

  return {
    supported,
    isSessionRecording,
    isAnswerRecording,
    startSession,
    stopSession,
    startAnswer,
    stopAnswer,
  };
};
