// POST /interviews/from-analysis, GET /interviews/sessions/:id
// 분석 결과(회원 소유)를 기준으로 면접 세션·질문을 생성·조회합니다.
import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../database/prisma.service';
import { AnalysisService } from '../analysis/analysis.service';

/** 프론트 Session + 질문 목록에 맞춘 조회 응답 (스네이크 미사용, ISO 문자열) */
export type InterviewSessionDetail = {
  id: string;
  userId: string;
  companyName: string;
  jobTitle: string;
  status: 'pending' | 'in_progress' | 'paused' | 'completed' | 'cancelled';
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
  constructor(
    private readonly prisma: PrismaService,
    private readonly analysisService: AnalysisService,
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

    return {
      id: String(row.id),
      userId: String(userId),
      companyName: company.companyName,
      jobTitle,
      status,
      createdAt,
      updatedAt: createdAt,
      questions: row.interviewQuestions.map((q, index) => ({
        id: String(q.id),
        sessionId: String(row.id),
        order: index + 1,
        text: q.questionText,
        type:
          index === 0
            ? ('initial' as const)
            : index < row.interviewQuestions.length - 1
              ? ('behavioral' as const)
              : ('follow_up' as const),
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
        data: questions.map((questionText) => ({
          interviewId: interview.id,
          questionText,
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
}
