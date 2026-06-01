// POST /interviews/from-analysis, GET /interviews/sessions/:id
// 분석 결과(회원 소유)를 기준으로 면접 세션·질문을 생성·조회합니다.
import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { PrismaService } from '../../database/prisma.service';
import { AnalysisService } from '../analysis/analysis.service';
import { MlService, VideoAnalysisResult } from '../../shared/ml/ml.service';

/** 답변 제출 응답: STT 결과 + 다음 질문(없으면 null) */
export type SubmitAnswerResult = {
  transcript: string;
  nextQuestion: {
    id: string;
    order: number;
    text: string;
    type: 'initial' | 'follow_up' | 'behavioral' | 'technical';
  } | null;
};

/** 면접 평가 조회 응답 (결과 페이지 폴링용) */
export type InterviewEvaluationResult = {
  status: string; // PENDING | IN_PROGRESS | PROCESSING | COMPLETED | FAILED
  evaluation: {
    sessionId: string;
    overallScore: number;
    contentScore: number;
    deliveryScore: number;
    confidenceScore: number;
    strengths: string[];
    weaknesses: string[];
    suggestions: string[];
    metrics: Array<{ name: string; score: number; comment?: string }>;
    heartRate?: { bpm: number | null; confidence: number } | null;
    timeline: Array<{ id: string; question: string; score: number; feedback: string }>;
    createdAt: string;
  } | null;
};

/** 프론트 Session + 질문 목록에 맞춘 조회 응답 (스네이크 미사용, ISO 문자열) */
export type InterviewSessionDetail = {
  id: string;
  userId: string;
  companyName: string;
  jobTitle: string;
  status: 'pending' | 'in_progress' | 'paused' | 'completed' | 'cancelled';
  startedAt?: string;
  completedAt?: string;
  createdAt: string;
  updatedAt: string;
  questions: Array<{
    id: string;
    sessionId: string;
    order: number;
    text: string;
    type: 'initial' | 'follow_up' | 'behavioral' | 'technical';
    createdAt: string;
  }>;
};

@Injectable()
export class InterviewsService {
  private readonly logger = new Logger(InterviewsService.name);

  constructor(
    private readonly prisma: PrismaService,
    private readonly analysisService: AnalysisService,
    private readonly mlService: MlService,
  ) {}

  /**
   * 본인 analysis에 매달린 면접만 조회 (다른 사용자 세션은 동일하게 NotFound 처리).
   */
  async getSessionByIdForUser(
    userId: number,
    interviewId: number,
  ): Promise<InterviewSessionDetail> {
    const row = await this.prisma.interview.findFirst({
      where: {
        id: interviewId,
        analysis: { userId },
      },
      include: {
        interviewQuestions: { orderBy: { id: 'asc' } },
        analysis: { include: { company: true } },
      },
    });

    if (!row) {
      throw new NotFoundException('면접 세션을 찾을 수 없습니다.');
    }

    const company = row.analysis.company;
    const jobTitle =
      company.jobDescription.split(/\r?\n/).find((l) => l.trim().length > 0)?.trim().slice(0, 200) ??
      '채용 공고';

    const statusMap: Record<
      string,
      InterviewSessionDetail['status']
    > = {
      PENDING: 'pending',
      IN_PROGRESS: 'in_progress',
      PAUSED: 'paused',
      COMPLETED: 'completed',
      CANCELLED: 'cancelled',
    };
    const normalized = row.status.toUpperCase();
    const status = statusMap[normalized] ?? 'pending';

    const createdAt = row.createdAt.toISOString();
    const startedAt = row.startedAt?.toISOString();
    const completedAt = row.completedAt?.toISOString();
    // 가짜 updatedAt 제거: 실제 진행 타임스탬프가 있으면 최신값, 없으면 생성 시각
    const updatedAt = completedAt ?? startedAt ?? createdAt;

    const allowedQuestionTypes = [
      'initial',
      'follow_up',
      'behavioral',
      'technical',
    ] as const;
    type AllowedQuestionType = (typeof allowedQuestionTypes)[number];
    const normalizeQuestionType = (value: string): AllowedQuestionType =>
      (allowedQuestionTypes as readonly string[]).includes(value)
        ? (value as AllowedQuestionType)
        : 'initial';

    return {
      id: String(row.id),
      userId: String(userId),
      companyName: company.companyName,
      jobTitle,
      status,
      startedAt,
      completedAt,
      createdAt,
      updatedAt,
      questions: row.interviewQuestions.map((q, index) => ({
        id: String(q.id),
        sessionId: String(row.id),
        order: q.orderIndex > 0 ? q.orderIndex : index + 1,
        text: q.questionText,
        type: normalizeQuestionType(q.type),
        createdAt: row.createdAt.toISOString(),
      })),
    };
  }

  async createFromAnalysis(userId: number, analysisResultId: number) {
    const ar = await this.prisma.analysisResult.findFirst({
      where: { id: analysisResultId, userId },
      include: { resume: true, company: true },
    });
    if (!ar) {
      throw new NotFoundException('분석 결과를 찾을 수 없습니다.');
    }

    const oa = ar.overallAssessment as { summary?: string } | null;
    const summary =
      typeof oa === 'object' && oa !== null && typeof oa.summary === 'string'
        ? oa.summary
        : '';

    const questions =
      await this.analysisService.generateInterviewQuestionsFromContext({
        companyName: ar.company.companyName,
        jobDescription: ar.company.jobDescription,
        resumeExcerpt: ar.resume.contentText,
        assessmentSummary: summary || '요약 없음',
      });

    return this.prisma.$transaction(async (tx) => {
      const interview = await tx.interview.create({
        data: {
          analysisId: ar.id,
          status: 'PENDING',
        },
      });
      await tx.interviewQuestion.createMany({
        data: questions.map((questionText, index) => ({
          interviewId: interview.id,
          questionText,
          orderIndex: index + 1,
          type: 'initial',
        })),
      });
      return tx.interview.findUniqueOrThrow({
        where: { id: interview.id },
        include: {
          interviewQuestions: { orderBy: { id: 'asc' } },
          analysis: {
            include: { company: true, resume: true },
          },
        },
      });
    });
  }

  /** 본인 소유 면접을 질문/분석 정보와 함께 로드 (없으면 NotFound). */
  private async getOwnedInterviewOrThrow(userId: number, interviewId: number) {
    const interview = await this.prisma.interview.findFirst({
      where: { id: interviewId, analysis: { userId } },
      include: {
        interviewQuestions: { orderBy: { id: 'asc' } },
        analysis: { include: { company: true, resume: true } },
      },
    });
    if (!interview) {
      throw new NotFoundException('면접 세션을 찾을 수 없습니다.');
    }
    return interview;
  }

  /**
   * 턴 처리: 답변 오디오 → STT → 답변 저장 → (필요 시)꼬리질문 생성 → 다음 질문 반환.
   */
  async submitAnswer(
    userId: number,
    interviewId: number,
    questionId: number,
    audio: Buffer,
    filename: string,
  ): Promise<SubmitAnswerResult> {
    const interview = await this.getOwnedInterviewOrThrow(userId, interviewId);
    const question = interview.interviewQuestions.find(
      (q) => q.id === questionId,
    );
    if (!question) {
      throw new NotFoundException('해당 질문을 찾을 수 없습니다.');
    }

    const stt = await this.mlService.transcribe(audio, filename);
    const transcript = stt.transcript ?? '';

    await this.prisma.interviewQuestion.update({
      where: { id: question.id },
      data: { answerText: transcript, transcript },
    });

    // 첫 답변이면 세션 진행 상태 기록
    if (!interview.startedAt) {
      await this.prisma.interview.update({
        where: { id: interview.id },
        data: { startedAt: new Date(), status: 'IN_PROGRESS' },
      });
    }

    const company = interview.analysis.company;

    // 꼬리질문은 질문당 1회로 제한 (이미 자식이 있으면 생성하지 않음)
    const existingFollowUps = interview.interviewQuestions.filter(
      (q) => q.parentId === question.id,
    ).length;

    if (existingFollowUps === 0) {
      const followUp = await this.analysisService.generateFollowUpQuestion({
        companyName: company.companyName,
        jobDescription: company.jobDescription,
        previousQuestion: question.questionText,
        answerTranscript: transcript,
      });
      if (followUp) {
        const maxOrder = interview.interviewQuestions.reduce(
          (max, q) => Math.max(max, q.orderIndex),
          0,
        );
        const created = await this.prisma.interviewQuestion.create({
          data: {
            interviewId: interview.id,
            parentId: question.id,
            questionText: followUp,
            orderIndex: maxOrder + 1,
            type: 'follow_up',
          },
        });
        return {
          transcript,
          nextQuestion: {
            id: String(created.id),
            order: created.orderIndex,
            text: created.questionText,
            type: 'follow_up',
          },
        };
      }
    }

    // 다음 미응답 질문(현재 질문 이후) 반환
    const next = interview.interviewQuestions
      .filter((q) => q.id !== question.id && !q.answerText)
      .sort((a, b) => a.orderIndex - b.orderIndex)
      .find((q) => q.orderIndex > question.orderIndex);

    return {
      transcript,
      nextQuestion: next
        ? {
            id: String(next.id),
            order: next.orderIndex,
            text: next.questionText,
            type: next.type === 'follow_up' ? 'follow_up' : 'initial',
          }
        : null,
    };
  }

  /**
   * 세션 종료: 전체 영상 수신 후 무거운 멀티모달 분석을 비동기로 시작.
   * 즉시 PROCESSING 상태를 반환하고, 분석 완료 시 InterviewEvaluation을 저장한다.
   */
  async completeSession(
    userId: number,
    interviewId: number,
    video: Buffer,
    filename: string,
  ): Promise<{ status: string }> {
    const interview = await this.getOwnedInterviewOrThrow(userId, interviewId);

    await this.prisma.interview.update({
      where: { id: interview.id },
      data: { status: 'PROCESSING', completedAt: new Date() },
    });

    // 큐 도입(Phase 7) 전까지는 in-process 백그라운드로 처리한다.
    void this.runHeavyAnalysis(interview.id, video, filename);

    return { status: 'PROCESSING' };
  }

  /** 세션 종료 후 영상 멀티모달 분석 + Gemini 종합 평가 + 저장 (백그라운드). */
  private async runHeavyAnalysis(
    interviewId: number,
    video: Buffer,
    filename: string,
  ): Promise<void> {
    try {
      const analysis = await this.mlService.analyzeVideo(video, filename);

      const interview = await this.prisma.interview.findUniqueOrThrow({
        where: { id: interviewId },
        include: {
          interviewQuestions: { orderBy: { orderIndex: 'asc' } },
          analysis: { include: { company: true } },
        },
      });

      const company = interview.analysis.company;
      const qa = interview.interviewQuestions.map((q) => ({
        question: q.questionText,
        answer: q.answerText ?? '',
      }));

      const evaluation = await this.analysisService.generateOverallEvaluation({
        companyName: company.companyName,
        jobDescription: company.jobDescription,
        qa,
        nonverbalSummary: this.buildNonverbalSummary(analysis),
      });

      // Prisma Json 입력 타입(InputJsonValue)은 인덱스 시그니처를 요구하므로 캐스팅한다.
      const metricsJson = evaluation.metrics as unknown as Prisma.InputJsonValue;
      const heartRateSummaryJson = {
        heartRate: analysis.heartRate,
        face: analysis.face,
        voice: analysis.voice ?? null,
      } as unknown as Prisma.InputJsonValue;

      const evaluationData = {
        overallScore: evaluation.overallScore,
        contentScore: evaluation.contentScore,
        deliveryScore: evaluation.deliveryScore,
        confidenceScore: evaluation.confidenceScore,
        strengths: evaluation.strengths as unknown as Prisma.InputJsonValue,
        weaknesses: evaluation.weaknesses as unknown as Prisma.InputJsonValue,
        suggestions: evaluation.suggestions as unknown as Prisma.InputJsonValue,
        metrics: metricsJson,
        heartRateSummary: heartRateSummaryJson,
      };

      await this.prisma.interviewEvaluation.upsert({
        where: { interviewId },
        create: { interviewId, ...evaluationData },
        update: evaluationData,
      });

      await this.prisma.interview.update({
        where: { id: interviewId },
        data: { status: 'COMPLETED' },
      });
    } catch (error) {
      this.logger.error(
        `면접 종합 분석 실패 (interview ${interviewId}): ${String(error)}`,
      );
      await this.prisma.interview
        .update({ where: { id: interviewId }, data: { status: 'FAILED' } })
        .catch(() => undefined);
    }
  }

  /** 비언어 지표를 LLM 평가용 자연어 요약으로 변환. */
  private buildNonverbalSummary(analysis: VideoAnalysisResult): string {
    const { face, voice, heartRate } = analysis;
    const lines = [
      `시선 안정성(정면 응시): ${(face.eyeContactScore * 100).toFixed(0)}점, 정면 응시 비율 ${(face.eyeContactRatio * 100).toFixed(0)}%`,
      `머리 움직임 안정성: ${(face.headStability * 100).toFixed(0)}점, 주요 표정: ${face.dominantExpression}`,
    ];
    if (voice) {
      lines.push(
        `음성 톤: 평균 피치 ${voice.pitchMeanHz.toFixed(0)}Hz, 피치 변동 ${voice.pitchStdHz.toFixed(0)}Hz, 침묵 비율 ${(voice.pauseRatio * 100).toFixed(0)}%`,
      );
    }
    if (heartRate.bpm != null) {
      lines.push(
        `추정 심박: ${heartRate.bpm.toFixed(0)}bpm (신뢰도 ${(heartRate.confidence * 100).toFixed(0)}%)`,
      );
    }
    return lines.join('\n');
  }

  /** 면접 평가 조회 (결과 페이지 폴링). 아직 분석 중이면 evaluation=null. */
  async getEvaluationForUser(
    userId: number,
    interviewId: number,
  ): Promise<InterviewEvaluationResult> {
    const interview = await this.prisma.interview.findFirst({
      where: { id: interviewId, analysis: { userId } },
      include: {
        evaluation: true,
        interviewQuestions: { orderBy: { orderIndex: 'asc' } },
      },
    });
    if (!interview) {
      throw new NotFoundException('면접 세션을 찾을 수 없습니다.');
    }

    if (!interview.evaluation) {
      return { status: interview.status, evaluation: null };
    }

    const ev = interview.evaluation;
    const asStringArray = (value: unknown): string[] =>
      Array.isArray(value)
        ? value.filter((v): v is string => typeof v === 'string')
        : [];
    const metrics = Array.isArray(ev.metrics)
      ? (ev.metrics as Array<{ name: string; score: number; comment?: string }>)
      : [];
    const heartRateSummary = ev.heartRateSummary as {
      heartRate?: { bpm: number | null; confidence: number };
    } | null;

    const timeline = interview.interviewQuestions.map((q) => ({
      id: String(q.id),
      question: q.questionText,
      score: ev.overallScore,
      feedback: q.feedback ?? (q.answerText ? '답변이 기록되었습니다.' : '무응답'),
    }));

    return {
      status: interview.status,
      evaluation: {
        sessionId: String(interview.id),
        overallScore: ev.overallScore,
        contentScore: ev.contentScore,
        deliveryScore: ev.deliveryScore,
        confidenceScore: ev.confidenceScore,
        strengths: asStringArray(ev.strengths),
        weaknesses: asStringArray(ev.weaknesses),
        suggestions: asStringArray(ev.suggestions),
        metrics,
        heartRate: heartRateSummary?.heartRate
          ? {
              bpm: heartRateSummary.heartRate.bpm,
              confidence: heartRateSummary.heartRate.confidence,
            }
          : null,
        timeline,
        createdAt: ev.createdAt.toISOString(),
      },
    };
  }
}
