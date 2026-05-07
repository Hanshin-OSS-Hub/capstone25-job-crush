import { useMemo, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';

import QuestionDisplay from '@/features/interviews/components/QuestionDisplay';
import SessionControls from '@/features/interviews/components/SessionControls';
import VideoCapture from '@/features/interviews/components/VideoCapture';
import { useMediaStream } from '@/features/interviews/hooks/useMediaStream';
import { useMediaPipe } from '@/features/interviews/hooks/useMediaPipe';
import { useAudioAnalysis } from '@/features/interviews/hooks/useAudioAnalysis';
import { useRealtimeAnalysis } from '@/features/interviews/hooks/useRealtimeAnalysis';
import RealtimeFeedback from '@/features/interviews/components/RealtimeFeedback';
import { useInterviewSocket } from '@/features/interviews/hooks/useInterviewSocket';
import {
  isFetchableInterviewSessionId,
  useInterviewSession,
} from '@/features/interviews/hooks/useInterviewSession';

const InterviewSessionPage = () => {
  const navigate = useNavigate();
  const { sessionId } = useParams<{ sessionId: string }>();
  const fetchable = isFetchableInterviewSessionId(sessionId);
  const { stream, error } = useMediaStream();
  const { session, isLoading, error: sessionError } = useInterviewSession(sessionId);
  const {
    currentQuestion: liveQuestion,
    latestFeedback,
    isConnected,
    error: socketError,
    sendRealtimeAnalysis,
  } = useInterviewSocket({ sessionId });
  const [status, setStatus] = useState<'idle' | 'running' | 'paused'>('idle');

  const displaySessionId = useMemo(() => sessionId ?? session?.id ?? 'preview', [session?.id, sessionId]);
  const fallbackQuestion = useMemo(
    () => ({
      id: 'mock-question-1',
      order: 1,
      text: '최근에 해결한 가장 어려운 문제와 이를 해결하기 위해 취한 접근 방식을 설명해주세요.',
      type: 'initial' as const,
    }),
    [],
  );

  const firstApiQuestion = session?.questions?.[0];
  const activeQuestion =
    liveQuestion ?? firstApiQuestion ?? (!fetchable ? fallbackQuestion : undefined);

  const totalQuestions = session?.questions?.length ?? 0;
  const currentOrder = firstApiQuestion?.order ?? activeQuestion?.order ?? 1;

  const questionIdForHooks = activeQuestion?.id ?? (fetchable && isLoading ? 'loading' : 'pending');

  const { metrics: faceMetrics } = useMediaPipe({
    stream,
    sessionId: displaySessionId,
    questionId: questionIdForHooks,
  });

  const { metrics: audioMetrics } = useAudioAnalysis({
    stream,
    sessionId: displaySessionId,
    questionId: questionIdForHooks,
  });

  useRealtimeAnalysis({
    sessionId: displaySessionId,
    questionId: questionIdForHooks,
    faceMetrics,
    audioMetrics,
    onEmit: sendRealtimeAnalysis,
  });

  const handleStart = () => setStatus('running');
  const handlePause = () => setStatus('paused');
  const handleEnd = () => {
    setStatus('idle');
    navigate('/interviews/setup');
  };

  const centerQuestionText =
    liveQuestion?.text ?? firstApiQuestion?.text ?? (!fetchable ? fallbackQuestion.text : null);

  const showLoadedEmpty = fetchable && !isLoading && !sessionError && session && totalQuestions === 0;

  return (
    <div className="flex flex-col gap-6 pb-10">
      {/* 세션 질문: API 연동 시 로딩 / 오류 / 첫 질문 강조 */}
      <section
        className="flex min-h-[200px] flex-col items-center justify-center rounded-2xl border border-stroke bg-white px-6 py-10 text-center shadow-sm dark:border-strokedark dark:bg-boxdark"
        aria-live="polite"
      >
        {fetchable && isLoading && (
          <div className="flex flex-col items-center gap-4">
            <div
              className="h-10 w-10 animate-spin rounded-full border-4 border-primary border-t-transparent"
              role="status"
              aria-label="로딩 중"
            />
            <p className="text-sm text-gray-600 dark:text-gray-300">면접 세션과 질문을 불러오는 중입니다…</p>
          </div>
        )}
        {fetchable && !isLoading && sessionError && (
          <p className="max-w-lg text-sm text-danger">{sessionError}</p>
        )}
        {showLoadedEmpty && (
          <p className="text-sm text-gray-600 dark:text-gray-300">이 세션에 등록된 질문이 없습니다.</p>
        )}
        {!isLoading && !sessionError && centerQuestionText && (
          <>
            {session?.companyName && (
              <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-primary">
                {session.companyName}
                {session.jobTitle ? ` · ${session.jobTitle}` : ''}
              </p>
            )}
            <p className="max-w-3xl text-lg font-semibold leading-relaxed text-black dark:text-white md:text-xl">
              {centerQuestionText}
            </p>
            {fetchable && totalQuestions > 0 && (
              <p className="mt-4 text-xs text-gray-500 dark:text-gray-400">
                현재 질문 {currentOrder} / {totalQuestions}
              </p>
            )}
          </>
        )}
      </section>

      <div className="flex flex-col gap-6 lg:flex-row">
        <section className="flex-1 rounded-2xl border border-stroke bg-black/90 p-4 shadow-lg dark:border-strokedark">
          <div className="mb-4 flex items-center justify-between text-white/80">
            <div>
              <p className="text-xs uppercase tracking-wide text-primary">Session</p>
              <h2 className="text-xl font-semibold">세션 #{displaySessionId}</h2>
            </div>
            <button
              type="button"
              onClick={() => navigate('/interviews/setup')}
              className="text-sm text-white/70 underline-offset-4 hover:underline"
            >
              종료
            </button>
          </div>
          <VideoCapture
            stream={stream}
            placeholder={
              <div className="p-4 text-center text-sm text-white/60">
                {error ?? '카메라에 연결하는 중입니다.'}
              </div>
            }
          />
        </section>

        <section className="flex w-full max-w-md flex-col gap-4 rounded-2xl border border-stroke bg-white p-6 shadow-sm dark:border-strokedark dark:bg-boxdark">
          <header>
            <p className="text-xs font-semibold uppercase tracking-wide text-primary">실시간 진행</p>
            <h2 className="text-xl font-bold text-black dark:text-white">AI 면접 컨트롤</h2>
          </header>

          <QuestionDisplay question={activeQuestion} />

          <div className="grid gap-3 md:grid-cols-2">
            <div className="rounded-lg border border-stroke p-4 text-center dark:border-strokedark">
              <p className="text-xs text-gray-500">타이머</p>
              <p className="text-2xl font-bold text-black dark:text-white">00:00</p>
            </div>
            <div className="rounded-lg border border-stroke p-4 text-center dark:border-strokedark">
              <p className="text-xs text-gray-500">질문 번호</p>
              <p className="text-2xl font-bold text-black dark:text-white">
                {totalQuestions > 0 ? `${currentOrder} / ${totalQuestions}` : '—'}
              </p>
            </div>
          </div>

          <RealtimeFeedback faceMetrics={faceMetrics} audioMetrics={audioMetrics} />

          <div className="rounded-xl border border-stroke p-4 text-sm dark:border-strokedark">
            <div className="flex items-center justify-between">
              <span className="font-semibold text-gray-600 dark:text-gray-300">연결 상태</span>
              <span className={isConnected ? 'text-success' : 'text-gray-400'}>
                {isConnected ? '실시간 연결됨' : '대기 중'}
              </span>
            </div>
            {socketError && <p className="mt-2 text-xs text-danger">{socketError}</p>}
            {latestFeedback && (
              <div className="mt-3 rounded-lg bg-primary/5 p-3 text-xs text-gray-600 dark:text-gray-300">
                <p className="font-semibold text-primary">AI 피드백</p>
                <p className="mt-1 text-sm text-black dark:text-white">{latestFeedback.message}</p>
              </div>
            )}
          </div>

          <SessionControls status={status} onStart={handleStart} onPause={handlePause} onEnd={handleEnd} />
        </section>
      </div>
    </div>
  );
};

export default InterviewSessionPage;

