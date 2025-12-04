import { useMemo } from 'react';
import { useParams } from 'react-router-dom';

import EvaluationChart from '@/features/interviews/components/EvaluationChart';
import StrengthsWeaknesses from '@/features/interviews/components/StrengthsWeaknesses';
import TimelineView from '@/features/interviews/components/TimelineView';

const mockEvaluation = {
  overallScore: 82,
  contentScore: 78,
  deliveryScore: 85,
  confidenceScore: 80,
  summary: '직무 이해도는 좋으나, 시선 처리와 말하기 속도를 조금 더 안정적으로 유지하면 좋겠습니다.',
  strengths: ['구체적인 성과 언급으로 신뢰감을 줌', '목표 의식이 명확함'],
  weaknesses: ['시선이 자주 화면을 벗어남', '답변 속도가 일정하지 않음'],
  suggestions: ['카메라 렌즈를 주시하며 답변하기', '키 메시지를 정리한 뒤 말하기'],
  metrics: [
    { name: '논리 구성', score: 80 },
    { name: '표정/시선', score: 70 },
    { name: '목소리 안정성', score: 85 },
  ],
};

const mockTimeline = [
  {
    id: '1',
    question: '자기소개와 지원 동기를 말씀해주세요.',
    score: 80,
    feedback: '핵심 메시지는 명확하지만 속도가 빠르게 느껴집니다.',
  },
  {
    id: '2',
    question: '최근 해결한 어려운 문제를 설명해주세요.',
    score: 85,
    feedback: '구체적 수치가 인상적이었으며 구조적인 답변이었습니다.',
  },
  {
    id: '3',
    question: '우리 회사에서 이루고 싶은 목표는 무엇인가요?',
    score: 78,
    feedback: '기업 가치와 연결된 키워드가 조금 더 들어가면 좋겠습니다.',
  },
];

const InterviewResultPage = () => {
  const { sessionId } = useParams<{ sessionId: string }>();
  const title = useMemo(() => sessionId ?? 'session', [sessionId]);

  return (
    <div className="mx-auto flex max-w-5xl flex-col gap-6 pb-16">
      <header className="text-center">
        <p className="text-xs font-semibold uppercase tracking-wide text-primary">Session #{title}</p>
        <h1 className="mt-2 text-3xl font-bold text-black dark:text-white">AI 면접 평가 리포트</h1>
        <p className="mt-3 text-sm text-gray-500 dark:text-gray-400">
          면접 진행 동안 수집된 시선, 표정, 음성 데이터를 기반으로 분석한 결과입니다.
        </p>
      </header>

      <EvaluationChart evaluation={mockEvaluation} />

      <StrengthsWeaknesses
        strengths={mockEvaluation.strengths}
        weaknesses={mockEvaluation.weaknesses}
        suggestions={mockEvaluation.suggestions}
      />

      <TimelineView items={mockTimeline} />
    </div>
  );
};

export default InterviewResultPage;

